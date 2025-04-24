import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import RagEngine from "@/components/rag/RagEngine";
import ExperienceBuilder from "@/components/ai/ExperienceBuilder";
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
  LayoutDashboard,
  Wand2,
  Database,
  MessageSquare,
  BookOpen,
  Key,
  BarChart3,
  Settings,
  ChevronLeft,
  Mic,
  Send,
  TrendingUp,
  Users,
  Star,
  Cpu,
  DollarSign,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AIExperienceConfig, defaultAIConfig, savedConfigs } from '@/types/ai-platform';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

// Mock data for deployed experience stats
const mockExperienceStats = [
  {
    id: 'exp-1',
    name: 'Grade 5 Fractions Video Tutor',
    interactions: 1250,
    avgSatisfaction: 4.5,
    keyCapability: 'AI Tutor'
  },
  {
    id: 'exp-2',
    name: 'Literature Book Summarizer (G9)',
    interactions: 820,
    avgSatisfaction: 4.2,
    keyCapability: 'Summarizer'
  },
  {
    id: 'exp-3',
    name: 'Science Assessment RAG (G7)',
    interactions: 1530,
    avgSatisfaction: 4.7,
    keyCapability: 'RAG'
  },
];

// Mock data for cost usage
const mockCostData = [
  { name: 'G5 Fractions Tutor', cost: 45.50 },
  { name: 'G9 Lit Summarizer', cost: 22.80 },
  { name: 'G7 Science RAG', cost: 65.20 },
  { name: 'Translate Service', cost: 15.00 }, // Example generic service
  { name: 'Custom Chatbot', cost: 30.75 },
];

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
  const [chatPreviewConfig, setChatPreviewConfig] = useState<AIExperienceConfig>(defaultAIConfig);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        role: "user",
        content: inputMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");

      setTimeout(() => {
        let responseContent = "How can I help?";
        if (chatPreviewConfig.capabilities.rag.enabled) {
          responseContent = `Using knowledge bases (${chatPreviewConfig.capabilities.rag.knowledgeBaseIds.join(', ')}), I can assist...`;
        } else if (chatPreviewConfig.capabilities.aiTutor.enabled) {
          responseContent = `As your ${chatPreviewConfig.capabilities.aiTutor.persona} tutor, let's explore...`;
        }
        const aiResponse: Message = {
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const loadConfigForChat = (configId: string) => {
    const loaded = savedConfigs.find(c => c.configId === configId);
    if (loaded) {
      setChatPreviewConfig(loaded);
      setMessages([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBackButton title="Dashboard" />
      <div className="container mx-auto p-4">
        <div className="flex h-screen bg-background">
          <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-background border-r border-border transition-all duration-300 ease-in-out p-4`}>
            <div className="flex items-center justify-between mb-4">
              {isSidebarOpen && <span className="font-semibold text-lg">AI Platform</span>}
              <button onClick={toggleSidebar} className="p-1 rounded hover:bg-muted">
                <ChevronLeft className={`h-5 w-5 transition-transform ${!isSidebarOpen && 'rotate-180'}`} />
              </button>
            </div>

            <nav className="space-y-1">
              <NavButton icon={LayoutDashboard} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} sidebarOpen={isSidebarOpen} />
              <NavButton icon={Wand2} label="Experience Builder" active={activeTab === "builder"} onClick={() => setActiveTab("builder")} sidebarOpen={isSidebarOpen} />
              <NavButton icon={Database} label="RAG Engine" active={activeTab === "rag"} onClick={() => setActiveTab("rag")} sidebarOpen={isSidebarOpen} />
              <NavButton icon={MessageSquare} label="Chat Preview" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} sidebarOpen={isSidebarOpen} />
              <Separator className="my-2" />
              <NavButton icon={BookOpen} label="Documentation" active={activeTab === "documentation"} onClick={() => setActiveTab("documentation")} sidebarOpen={isSidebarOpen} />
              <NavButton icon={Key} label="Credentials" active={activeTab === "apikeys"} onClick={() => setActiveTab("apikeys")} sidebarOpen={isSidebarOpen} />
              <NavButton icon={BarChart3} label="Analytics" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} sidebarOpen={isSidebarOpen} />
              <NavButton icon={Settings} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} sidebarOpen={isSidebarOpen} />
            </nav>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="overview" className="space-y-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold">Welcome back, {username}!</h1>
                  <p className="text-muted-foreground">Platform overview and quick actions.</p>
                </div>
                <Card>
                  <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Button className="w-full justify-start" onClick={() => setActiveTab("builder")}><Wand2 className="mr-2 h-4 w-4" />Create New Experience</Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("rag")}><Database className="mr-2 h-4 w-4" />Manage Knowledge Bases</Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("documentation")}><BookOpen className="mr-2 h-4 w-4" />View Documentation</Button>
                  </CardContent>
                </Card>

                {/* --- NEW: Deployed Experience Analytics Card --- */}
                <Card>
                  <CardHeader>
                    <CardTitle>Deployed Experience Analytics</CardTitle>
                    <CardDescription>Usage statistics for your active AI experiences.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockExperienceStats.map(stat => (
                      <Card key={stat.id} className="bg-muted/40">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base font-medium">{stat.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center"><Users className="h-4 w-4 mr-2 text-primary/80" /> Interactions</span>
                            <span className="font-medium text-foreground">{stat.interactions.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center"><Star className="h-4 w-4 mr-2 text-yellow-500" /> Avg. Satisfaction</span>
                            <span className="font-medium text-foreground">{stat.avgSatisfaction.toFixed(1)} / 5</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center"><Cpu className="h-4 w-4 mr-2 text-purple-500" /> Key Capability</span>
                            <Badge variant="outline" style={{ borderColor: colors.lightLavender, color: colors.textDark }}>{stat.keyCapability}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* --- NEW: Cost Usage Chart Card --- */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Estimated Cost Usage (Last 30 Days)
                    </CardTitle>
                    <CardDescription>Estimated costs associated with deployed experiences and services.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart
                          data={mockCostData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                          barSize={20}
                        >
                          <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} tick={{ fontSize: 10 }} />
                          <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 10 }} />
                          <Tooltip
                            cursor={{ fill: 'transparent' }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border + '80'} />
                          <Bar dataKey="cost" fill={colors.primary} background={{ fill: colors.lightLavender + '40' }} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="builder">
                <ExperienceBuilder onExperienceSaved={() => setActiveTab("overview")} />
              </TabsContent>

              <TabsContent value="rag">
                <RagEngine />
              </TabsContent>

              <TabsContent value="chat">
                <Card className="w-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Chat Preview</CardTitle>
                        <CardDescription>
                          Test an AI Experience configuration.
                        </CardDescription>
                      </div>
                      <div className="w-64">
                        <Select onValueChange={loadConfigForChat} defaultValue={chatPreviewConfig.configId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Load Config to Preview..." />
                          </SelectTrigger>
                          <SelectContent>
                            {savedConfigs.map(sc => (
                              <SelectItem key={sc.configId} value={sc.configId!}>{sc.configName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col h-[600px]">
                      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 border rounded-lg bg-muted/30">
                        {messages.map((message, index) => (
                          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1 text-right">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        ))}
                        {messages.length === 0 && (
                          <div className="text-center text-muted-foreground pt-10">Load a configuration and start chatting...</div>
                        )}
                      </div>
                      <div className="flex gap-2 p-4 border-t">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder={`Ask something (using ${chatPreviewConfig.configName})...`}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                          <Send className="h-4 w-4 mr-2" />Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentation">
                <Card><CardHeader><CardTitle>Documentation</CardTitle></CardHeader><CardContent><p>Platform documentation and API guides will be here.</p></CardContent></Card>
              </TabsContent>

              <TabsContent value="apikeys">
                <Card>
                  <CardHeader>
                    <CardTitle>Experience Credentials</CardTitle>
                    <CardDescription>View endpoint details and credentials for your deployed AI experiences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockExperienceStats.length > 0 ? (
                        mockExperienceStats.map((exp) => (
                          <div key={exp.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                            <span className="font-medium text-sm">{exp.name}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast({ title: "View Details", description: `Details for ${exp.name} requested.` })}
                            >
                              View Details
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No deployed experiences found.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card><CardHeader><CardTitle>Analytics</CardTitle></CardHeader><CardContent><p>Usage and performance analytics will be displayed here.</p></CardContent></Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card><CardHeader><CardTitle>Settings</CardTitle></CardHeader><CardContent><p>Account and platform settings will be configurable here.</p></CardContent></Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  sidebarOpen: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, active, onClick, sidebarOpen }) => {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} h-10`}
      onClick={onClick}
      title={label}
    >
      <Icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
      {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </Button>
  );
}

// Need to add colors definition if not already present globally
const colors = {
  primary: '#5680E9',
  lightBlue: '#84CEEB',
  mediumBlue: '#5AB9EA',
  lightLavender: '#C1C8E4',
  purple: '#8860D0',
  textLight: '#FFFFFF',
  textDark: '#2D3748',
  border: '#E2E8F0',
};

export default Dashboard;
