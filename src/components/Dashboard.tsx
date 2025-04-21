import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import RagEngine from "@/components/rag/RagEngine";
import Summarization from "@/components/ai/Summarization";
import Translation from "@/components/ai/Translation";
import TextToSpeech from "@/components/ai/TextToSpeech";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  BookOpen,
  Key,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Terminal,
  FileText,
  Languages,
  Mic,
  ChevronLeft,
  MessageSquare,
  Wand2,
  Database,
  Code,
  Paintbrush,
  Copy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface DashboardProps {
  username?: string;
  apiUsage?: {
    total: number;
    limit: number;
    services: {
      name: string;
      calls: number;
      percentage: number;
    }[];
  };
  recentActivity?: {
    id: string;
    service: string;
    timestamp: string;
    status: "success" | "error";
    endpoint: string;
  }[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatConfig {
  theme: "light" | "dark" | "system";
  ragEnabled: boolean;
  selectedKnowledge: string;
  customStyles: string;
  apiKey: string;
}

const Dashboard = ({
  username = "Developer",
  apiUsage = {
    total: 1250,
    limit: 5000,
    services: [
      { name: "RAG", calls: 750, percentage: 60 },
      { name: "Summarization", calls: 250, percentage: 20 },
      { name: "Translation", calls: 150, percentage: 12 },
      { name: "TTS", calls: 100, percentage: 8 },
    ],
  },
  recentActivity = [
    {
      id: "1",
      service: "RAG",
      timestamp: "2023-06-15 14:32:45",
      status: "success",
      endpoint: "/api/rag/query",
    },
    {
      id: "2",
      service: "Summarization",
      timestamp: "2023-06-15 13:45:22",
      status: "success",
      endpoint: "/api/summarize",
    },
    {
      id: "3",
      service: "Translation",
      timestamp: "2023-06-15 12:30:18",
      status: "error",
      endpoint: "/api/translate",
    },
    {
      id: "4",
      service: "TTS",
      timestamp: "2023-06-15 11:15:05",
      status: "success",
      endpoint: "/api/tts/generate",
    },
  ],
}: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatConfig, setChatConfig] = useState<ChatConfig>({
    theme: "system",
    ragEnabled: false,
    selectedKnowledge: "",
    customStyles: "",
    apiKey: "",
  });
  const [knowledgeBases, setKnowledgeBases] = useState([
    { id: "kb1", name: "Product Documentation" },
    { id: "kb2", name: "Technical Specs" },
    { id: "kb3", name: "User Guides" },
  ]);
  const [activeSection, setActiveSection] = useState<"chat" | "customize" | "embed">("chat");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        role: "user",
        content: inputMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");

      // Simulate AI response with RAG integration
      setTimeout(() => {
        const aiResponse: Message = {
          role: "assistant",
          content: chatConfig.ragEnabled
            ? "Based on the knowledge base, I can help you with that..."
            : "I'm here to help! How can I assist you today?",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const generateEmbedCode = () => {
    const code = `
// Install via npm
npm install @alef/chat-widget

// Import and use in your React application
import { AlefChat } from '@alef/chat-widget';

// Add this to your component
<AlefChat
  apiKey="${chatConfig.apiKey}"
  theme="${chatConfig.theme}"
  ragEnabled={${chatConfig.ragEnabled}}
  knowledgeBase="${chatConfig.selectedKnowledge}"
  customStyles={\`${chatConfig.customStyles}\`}
/>
`;
    return code;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBackButton title="Dashboard" />
      <div className="container mx-auto p-4">
        <div className="flex h-screen bg-background">
          {/* Sidebar */}
          <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-background border-r border-border transition-all duration-300 ease-in-out`}>
            {/* Sidebar Header */}
            <div className="p-4 flex items-center justify-between">
              <div className={`flex items-center space-x-2 ${!isSidebarOpen && 'justify-center w-full'}`}>
                <img
                  src="https://www.alefeducation.com/_next/image?url=https%3A%2F%2Fcms-backend-prod.alefeducation.com%2Fwp-content%2Fuploads%2F2024%2F09%2Flogo_main-alef-education.webp&w=384&q=75"
                  alt="Alef Education Logo"
                  className="h-6 w-auto"
                />
                {isSidebarOpen && <span className="font-semibold">Alef AI Platform</span>}
              </div>
              {isSidebarOpen && (
                <button onClick={toggleSidebar}>
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
            </div>

            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("rag")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                RAG Engine
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("summarization")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Summarization
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("translation")}
              >
                <Languages className="mr-2 h-4 w-4" />
                Translation
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("tts")}
              >
                <Mic className="mr-2 h-4 w-4" />
                Text to Speech
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("documentation")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Documentation
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("apikeys")}
              >
                <Key className="mr-2 h-4 w-4" />
                API Keys
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("sandbox")}
              >
                <Terminal className="mr-2 h-4 w-4" />
                Sandbox
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveSection("chat")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
              <Link to="/" className="w-full block mt-4">
                <Button variant="outline" className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Welcome back, {username}!</h1>
              <p className="text-muted-foreground">
                Here's an overview of your API usage and recent activity.
              </p>
            </div>

            <Tabs
              defaultValue="overview"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rag">RAG Engine</TabsTrigger>
                <TabsTrigger value="summarization">Summarization</TabsTrigger>
                <TabsTrigger value="translation">Translation</TabsTrigger>
                <TabsTrigger value="tts">Text to Speech</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="apikeys">API Keys</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* API Usage Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>API Usage Summary</CardTitle>
                    <CardDescription>
                      You've used {apiUsage.total} out of {apiUsage.limit} API calls
                      this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Progress
                        value={(apiUsage.total / apiUsage.limit) * 100}
                        className="h-2"
                      />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {Math.round((apiUsage.total / apiUsage.limit) * 100)}% of
                        monthly quota used
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Usage by Service</h4>
                      {apiUsage.services.map((service) => (
                        <div
                          key={service.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{service.name}</Badge>
                            <span className="text-sm">{service.calls} calls</span>
                          </div>
                          <div className="w-1/2">
                            <Progress
                              value={service.percentage}
                              className="h-1.5"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest API calls and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between border-b pb-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  activity.status === "success"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {activity.service}
                              </Badge>
                              <span className="text-sm font-medium">
                                {activity.endpoint}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {activity.timestamp}
                            </p>
                          </div>
                          <Badge
                            variant={
                              activity.status === "success"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Button
                        className="w-full justify-start"
                        onClick={() => setActiveTab("apikeys")}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Generate API Key
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => setActiveTab("documentation")}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Documentation
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => setActiveTab("sandbox")}
                      >
                        <Terminal className="mr-2 h-4 w-4" />
                        Try Sandbox
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => setActiveTab("analytics")}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Getting Started */}
                <Card>
                  <CardHeader>
                    <CardTitle>Getting Started</CardTitle>
                    <CardDescription>
                      Quick guide to using our AI Platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted p-4">
                        <h3 className="mb-2 font-medium">1. Generate an API Key</h3>
                        <p className="text-sm text-muted-foreground">
                          Create an API key to authenticate your requests to our
                          services.
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <h3 className="mb-2 font-medium">
                          2. Explore the Documentation
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Learn how to use our APIs with comprehensive guides and
                          examples.
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <h3 className="mb-2 font-medium">3. Test in the Sandbox</h3>
                        <p className="text-sm text-muted-foreground">
                          Try out API calls in our interactive sandbox before
                          implementing them in your code.
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <h3 className="mb-2 font-medium">4. Monitor Your Usage</h3>
                        <p className="text-sm text-muted-foreground">
                          Keep track of your API usage and performance in the
                          Analytics dashboard.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rag">
                <RagEngine />
              </TabsContent>

              <TabsContent value="summarization">
                <Summarization />
              </TabsContent>

              <TabsContent value="translation">
                <Translation />
              </TabsContent>

              <TabsContent value="tts">
                <TextToSpeech />
              </TabsContent>

              <TabsContent value="documentation">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>
                      Comprehensive guides for all our AI services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Select a service to view its documentation:
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Card className="cursor-pointer hover:bg-accent/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">RAG</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Retrieval-Augmented Generation API documentation
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:bg-accent/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Summarization</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Text summarization API documentation
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:bg-accent/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Translation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Language translation API documentation
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:bg-accent/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">TTS</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Text-to-Speech API documentation
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="apikeys">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Manage your API keys and access tokens
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/api-key-manager" className="w-full block">
                      <Button className="w-full">
                        <Key className="mr-2 h-4 w-4" />
                        Go to API Key Manager
                      </Button>
                    </Link>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Generate New API Key
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                    <CardDescription>
                      Monitor your API usage and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/analytics-dashboard" className="w-full block">
                      <Button className="w-full">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Go to Analytics Dashboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sandbox">
                <Card>
                  <CardHeader>
                    <CardTitle>API Sandbox</CardTitle>
                    <CardDescription>
                      Test our APIs in an interactive environment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/api-sandbox" className="w-full block">
                      <Button className="w-full">
                        <Terminal className="mr-2 h-4 w-4" />
                        Go to API Sandbox
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Profile Information</h3>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium">Name</label>
                            <p className="text-sm text-muted-foreground">
                              {username}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <p className="text-sm text-muted-foreground">
                              developer@example.com
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium">Preferences</h3>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                              Email Notifications
                            </label>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                              API Usage Alerts
                            </label>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium">Billing</h3>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                              Current Plan
                            </label>
                            <Badge>Developer</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                              Billing Cycle
                            </label>
                            <p className="text-sm text-muted-foreground">Monthly</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <Card className="w-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Chat</CardTitle>
                        <CardDescription>
                          Interact with our AI assistant
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={activeSection === "chat" ? "default" : "outline"}
                          onClick={() => setActiveSection("chat")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button
                          variant={activeSection === "customize" ? "default" : "outline"}
                          onClick={() => setActiveSection("customize")}
                        >
                          <Paintbrush className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                        <Button
                          variant={activeSection === "embed" ? "default" : "outline"}
                          onClick={() => setActiveSection("embed")}
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Embed
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeSection === "chat" && (
                      <div className="flex flex-col h-[600px]">
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 border rounded-lg">
                          {messages.map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                  }`}
                              >
                                <p>{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 p-4 border-t">
                          <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={handleSendMessage}>
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeSection === "customize" && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Theme</Label>
                          <Select
                            value={chatConfig.theme}
                            onValueChange={(value: "light" | "dark" | "system") =>
                              setChatConfig({ ...chatConfig, theme: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Enable RAG Integration</Label>
                          <Switch
                            checked={chatConfig.ragEnabled}
                            onCheckedChange={(checked) =>
                              setChatConfig({ ...chatConfig, ragEnabled: checked })
                            }
                          />
                        </div>

                        {chatConfig.ragEnabled && (
                          <div className="space-y-2">
                            <Label>Select Knowledge Base</Label>
                            <Select
                              value={chatConfig.selectedKnowledge}
                              onValueChange={(value) =>
                                setChatConfig({ ...chatConfig, selectedKnowledge: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select knowledge base" />
                              </SelectTrigger>
                              <SelectContent>
                                {knowledgeBases.map((kb) => (
                                  <SelectItem key={kb.id} value={kb.id}>
                                    {kb.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Custom CSS</Label>
                          <Textarea
                            value={chatConfig.customStyles}
                            onChange={(e) =>
                              setChatConfig({ ...chatConfig, customStyles: e.target.value })
                            }
                            placeholder=".chat-widget { /* your custom styles */ }"
                            className="font-mono"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>API Key</Label>
                          <Input
                            type="password"
                            value={chatConfig.apiKey}
                            onChange={(e) =>
                              setChatConfig({ ...chatConfig, apiKey: e.target.value })
                            }
                            placeholder="Enter your API key"
                          />
                        </div>
                      </div>
                    )}

                    {activeSection === "embed" && (
                      <div className="space-y-4">
                        <div className="relative">
                          <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
                            <code>{generateEmbedCode()}</code>
                          </pre>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              navigator.clipboard.writeText(generateEmbedCode());
                              toast({
                                title: "Copied!",
                                description: "Code copied to clipboard",
                              });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Integration Steps:</h3>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>Install the chat widget package using npm or yarn</li>
                            <li>Import the AlefChat component into your application</li>
                            <li>Add your API key and desired configuration</li>
                            <li>Place the component wherever you want the chat widget to appear</li>
                          </ol>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
