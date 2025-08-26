import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Eye, EyeOff, Building2, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("signin");

  // Form states
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    companyName: "",
    userType: "client",
    skills: [] as string[]
  });

  const [skillInput, setSkillInput] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      const returnTo = searchParams.get('returnTo') || '/';
      navigate(returnTo);
    }
  }, [user, loading, navigate, searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError("Неверный email или пароль");
        } else if (error.message.includes('Email not confirmed')) {
          setError("Подтвердите email адрес, проверив почту");
        } else {
          setError(error.message);
        }
      } else {
        toast.success("Вход выполнен успешно!");
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        display_name: signUpData.displayName,
        company_name: signUpData.companyName,
        user_type: signUpData.userType,
        skills: signUpData.skills
      };

      const { error } = await signUp(signUpData.email, signUpData.password, userData);
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setError("Пользователь с таким email уже зарегистрирован");
        } else if (error.message.includes('Password should be at least 6 characters')) {
          setError("Пароль должен содержать минимум 6 символов");
        } else {
          setError(error.message);
        }
      } else {
        toast.success("Регистрация успешна! Проверьте email для подтверждения.");
        setActiveTab("signin");
      }
    } catch (err) {
      setError("Произошла ошибка при регистрации");
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !signUpData.skills.includes(skillInput.trim())) {
      setSignUpData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSignUpData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-sf font-bold text-foreground mb-2">
            Добро пожаловать
          </h1>
          <p className="text-muted-foreground">
            Управление проектами и внешними исполнителями
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Аутентификация</CardTitle>
            <CardDescription className="text-center">
              Войдите в систему или создайте новый аккаунт
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Вход</TabsTrigger>
                <TabsTrigger value="signup">Регистрация</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signInData.password}
                        onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Вход..." : "Войти"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Имя *</Label>
                      <Input
                        id="display-name"
                        placeholder="Иван Петров"
                        value={signUpData.displayName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, displayName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Пароль *</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Подтвердить пароль *</Label>
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-type">Тип аккаунта *</Label>
                    <Select value={signUpData.userType} onValueChange={(value) => setSignUpData(prev => ({ ...prev, userType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span>Заказчик</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="contractor">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Исполнитель</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-name">Название компании</Label>
                    <Input
                      id="company-name"
                      placeholder="ООО 'Стройка'"
                      value={signUpData.companyName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  </div>

                  {signUpData.userType === 'contractor' && (
                    <div className="space-y-2">
                      <Label htmlFor="skills">Навыки</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          placeholder="Введите навык"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                        <Button type="button" onClick={addSkill}>
                          Добавить
                        </Button>
                      </div>
                      {signUpData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {signUpData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <button 
                                type="button"
                                className="ml-1 text-xs hover:text-destructive"
                                onClick={() => removeSkill(skill)}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground"
          >
            ← Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
}