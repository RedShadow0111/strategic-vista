import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Folder, 
  File, 
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCode,
  Plus,
  Search,
  Upload,
  History,
  Download,
  Eye,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Star,
  Clock
} from "lucide-react";

interface ProjectDocumentsProps {
  project: any;
}

export function ProjectDocuments({ project }: ProjectDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root", "planning", "design"]));

  const documents = [
    {
      id: 1,
      name: "Project Charter.pdf",
      type: "pdf",
      path: "root",
      size: "2.4 MB",
      lastModified: "2024-02-15T10:30:00Z",
      modifiedBy: "Sarah Chen",
      modifierInitials: "SC",
      version: "1.0",
      versions: [
        { version: "1.0", date: "2024-02-15T10:30:00Z", author: "Sarah Chen" }
      ],
      starred: true
    },
    {
      id: 2,
      name: "Requirements Specification.docx",
      type: "document",
      path: "planning",
      size: "1.8 MB", 
      lastModified: "2024-03-20T14:15:00Z",
      modifiedBy: "Mike Johnson",
      modifierInitials: "MJ",
      version: "2.1",
      versions: [
        { version: "2.1", date: "2024-03-20T14:15:00Z", author: "Mike Johnson" },
        { version: "2.0", date: "2024-03-15T09:20:00Z", author: "Mike Johnson" },
        { version: "1.0", date: "2024-02-28T16:45:00Z", author: "Sarah Chen" }
      ],
      starred: false
    },
    {
      id: 3,
      name: "System Architecture.drawio",
      type: "code",
      path: "design/architecture",
      size: "456 KB",
      lastModified: "2024-04-10T11:22:00Z", 
      modifiedBy: "Alex Rodriguez",
      modifierInitials: "AR",
      version: "1.5",
      versions: [
        { version: "1.5", date: "2024-04-10T11:22:00Z", author: "Alex Rodriguez" },
        { version: "1.0", date: "2024-03-25T13:30:00Z", author: "Alex Rodriguez" }
      ],
      starred: true
    },
    {
      id: 4,
      name: "UI Mockups.fig",
      type: "image",
      path: "design/ui",
      size: "12.3 MB",
      lastModified: "2024-04-18T16:45:00Z",
      modifiedBy: "Emma Davis",
      modifierInitials: "ED",
      version: "3.2",
      versions: [
        { version: "3.2", date: "2024-04-18T16:45:00Z", author: "Emma Davis" },
        { version: "3.1", date: "2024-04-15T14:20:00Z", author: "Emma Davis" },
        { version: "3.0", date: "2024-04-10T10:15:00Z", author: "Emma Davis" }
      ],
      starred: false
    },
    {
      id: 5,
      name: "Budget Analysis.xlsx",
      type: "spreadsheet",
      path: "planning/financial",
      size: "890 KB",
      lastModified: "2024-07-15T09:30:00Z",
      modifiedBy: "Sarah Chen", 
      modifierInitials: "SC",
      version: "1.3",
      versions: [
        { version: "1.3", date: "2024-07-15T09:30:00Z", author: "Sarah Chen" },
        { version: "1.2", date: "2024-06-30T15:45:00Z", author: "Sarah Chen" }
      ],
      starred: true
    },
    {
      id: 6,
      name: "API Documentation.md",
      type: "code",
      path: "development/docs",
      size: "234 KB",
      lastModified: "2024-07-20T13:15:00Z",
      modifiedBy: "Alex Rodriguez",
      modifierInitials: "AR",
      version: "2.0",
      versions: [
        { version: "2.0", date: "2024-07-20T13:15:00Z", author: "Alex Rodriguez" },
        { version: "1.5", date: "2024-06-15T11:30:00Z", author: "Alex Rodriguez" }
      ],
      starred: false
    }
  ];

  const folderStructure = [
    {
      name: "Корневая папка",
      path: "root",
      level: 0,
      hasChildren: true,
      children: [
        {
          name: "Планирование",
          path: "planning", 
          level: 1,
          hasChildren: true,
          children: [
            { name: "Финансы", path: "planning/financial", level: 2, hasChildren: false }
          ]
        },
        {
          name: "Дизайн",
          path: "design",
          level: 1, 
          hasChildren: true,
          children: [
            { name: "Архитектура", path: "design/architecture", level: 2, hasChildren: false },
            { name: "UI/UX", path: "design/ui", level: 2, hasChildren: false }
          ]
        },
        {
          name: "Разработка",
          path: "development",
          level: 1,
          hasChildren: true,
          children: [
            { name: "Документация", path: "development/docs", level: 2, hasChildren: false }
          ]
        }
      ]
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
      case "pdf":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "image":
        return <FileImage className="w-4 h-4 text-green-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      case "code":
        return <FileCode className="w-4 h-4 text-purple-500" />;
      default:
        return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: any) => {
    const isExpanded = expandedFolders.has(folder.path);
    const documentsInFolder = documents.filter(doc => doc.path === folder.path);
    
    return (
      <div key={folder.path}>
        <div 
          className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
          style={{ paddingLeft: `${folder.level * 12 + 8}px` }}
          onClick={() => toggleFolder(folder.path)}
        >
          {folder.hasChildren && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
          <Folder className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium">{folder.name}</span>
          <Badge variant="outline" className="text-xs">
            {documentsInFolder.length}
          </Badge>
        </div>
        
        {isExpanded && (
          <>
            {documentsInFolder.map(doc => (
              <div 
                key={doc.id}
                className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded cursor-pointer group"
                style={{ paddingLeft: `${(folder.level + 1) * 12 + 8}px` }}
              >
                {getFileIcon(doc.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate">{doc.name}</span>
                    {doc.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    <Badge variant="outline" className="text-xs">v{doc.version}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{doc.size}</span>
                    <span>Изменен {new Date(doc.lastModified).toLocaleDateString('ru-RU')}</span>
                    <span>by {doc.modifiedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <History className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {folder.children && folder.children.map(child => renderFolder(child))}
          </>
        )}
      </div>
    );
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentDocuments = documents
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 5);

  const starredDocuments = documents.filter(doc => doc.starred);

  return (
    <div className="space-y-6 h-full">
      {/* Documents Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Документы проекта</h3>
          <p className="text-sm text-muted-foreground">
            Управление файлами и версиями документов
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Загрузить
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Создать папку
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Поиск документов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Folder Tree */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5" />
              Структура файлов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {folderStructure.map(folder => renderFolder(folder))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="space-y-4">
          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4" />
                Недавние
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDocuments.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded cursor-pointer">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(doc.lastModified).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Starred Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="w-4 h-4" />
                Избранное
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {starredDocuments.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded cursor-pointer">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      v{doc.version}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Storage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Хранилище</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Использовано</span>
                  <span>2.1 GB / 10 GB</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "21%" }} />
                </div>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-blue-500" />
                    Документы
                  </span>
                  <span>950 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <FileImage className="w-3 h-3 text-green-500" />
                    Изображения
                  </span>
                  <span>1.2 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <FileCode className="w-3 h-3 text-purple-500" />
                    Код
                  </span>
                  <span>45 MB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}