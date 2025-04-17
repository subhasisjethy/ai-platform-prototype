import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4">
        <div className="flex items-center gap-2 mb-8">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=developer" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">AI Platform</h2>
            <p className="text-xs text-muted-foreground">Developer Portal</p>
          </div>
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
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="apikeys">API Keys</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
