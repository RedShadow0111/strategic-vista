-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  user_type TEXT CHECK (user_type IN ('client', 'contractor', 'admin')) DEFAULT 'client',
  company_name TEXT,
  skills TEXT[],
  rating DECIMAL(3,2) DEFAULT 0.00,
  completed_jobs INTEGER DEFAULT 0,
  bio TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job postings table
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  job_type TEXT CHECK (job_type IN ('fixed', 'hourly')) NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  hourly_rate DECIMAL(10,2),
  duration TEXT,
  skills_required TEXT[],
  experience_level TEXT CHECK (experience_level IN ('entry', 'intermediate', 'expert')) NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contractor bids table
CREATE TABLE public.contractor_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposal TEXT NOT NULL,
  bid_amount DECIMAL(10,2) NOT NULL,
  timeline TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, contractor_id)
);

-- Create job assignments table
CREATE TABLE public.job_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bid_id UUID NOT NULL REFERENCES public.contractor_bids(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  final_amount DECIMAL(10,2),
  client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
  contractor_rating INTEGER CHECK (contractor_rating >= 1 AND contractor_rating <= 5),
  client_feedback TEXT,
  contractor_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for job_postings
CREATE POLICY "Anyone can view open jobs" 
ON public.job_postings FOR SELECT 
USING (status = 'open' OR client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Clients can create job postings" 
ON public.job_postings FOR INSERT 
WITH CHECK (client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Clients can update their own job postings" 
ON public.job_postings FOR UPDATE 
USING (client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Create RLS policies for contractor_bids
CREATE POLICY "Users can view bids for their jobs or their own bids" 
ON public.contractor_bids FOR SELECT 
USING (
  contractor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  job_id IN (SELECT id FROM public.job_postings WHERE client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);

CREATE POLICY "Contractors can create bids" 
ON public.contractor_bids FOR INSERT 
WITH CHECK (contractor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Contractors can update their own bids" 
ON public.contractor_bids FOR UPDATE 
USING (contractor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Create RLS policies for job_assignments
CREATE POLICY "Users can view their own assignments" 
ON public.job_assignments FOR SELECT 
USING (
  contractor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  job_id IN (SELECT id FROM public.job_postings WHERE client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);

CREATE POLICY "Clients can create assignments" 
ON public.job_assignments FOR INSERT 
WITH CHECK (job_id IN (SELECT id FROM public.job_postings WHERE client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())));

CREATE POLICY "Users can update their own assignments" 
ON public.job_assignments FOR UPDATE 
USING (
  contractor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  job_id IN (SELECT id FROM public.job_postings WHERE client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contractor_bids_updated_at
  BEFORE UPDATE ON public.contractor_bids
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_assignments_updated_at
  BEFORE UPDATE ON public.job_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();