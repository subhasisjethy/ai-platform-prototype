import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  LineChart,
  PieChart,
  Download,
  Calendar,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface ApiCallData {
  date: string;
  calls: number;
}

interface ErrorRateData {
  service: string;
  rate: number;
}

interface ServiceUtilizationData {
  service: string;
  usage: number;
}

interface ResponseTimeData {
  service: string;
  time: number;
}

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState<string>("7d");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  // Mock data for the dashboard
  const apiCallData: ApiCallData[] = [
    { date: "Mon", calls: 1200 },
    { date: "Tue", calls: 1800 },
    { date: "Wed", calls: 2400 },
    { date: "Thu", calls: 1600 },
    { date: "Fri", calls: 2200 },
    { date: "Sat", calls: 1400 },
    { date: "Sun", calls: 1000 },
  ];

  const errorRateData: ErrorRateData[] = [
    { service: "RAG", rate: 1.2 },
    { service: "Summarization", rate: 0.8 },
    { service: "Translation", rate: 1.5 },
    { service: "TTS", rate: 0.5 },
  ];

  const serviceUtilizationData: ServiceUtilizationData[] = [
    { service: "RAG", usage: 45 },
    { service: "Summarization", usage: 25 },
    { service: "Translation", usage: 20 },
    { service: "TTS", usage: 10 },
  ];

  const responseTimeData: ResponseTimeData[] = [
    { service: "RAG", time: 320 },
    { service: "Summarization", time: 180 },
    { service: "Translation", time: 150 },
    { service: "TTS", time: 90 },
  ];

  return (
    <div className="bg-background p-6 w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your API usage and performance metrics
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="rag">RAG</SelectItem>
                <SelectItem value="summarization">Summarization</SelectItem>
                <SelectItem value="translation">Translation</SelectItem>
                <SelectItem value="tts">TTS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total API Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">
              +18% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2%</div>
            <p className="text-xs text-muted-foreground">
              -0.3% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245ms</div>
            <p className="text-xs text-muted-foreground">
              +12ms from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from last period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="api-calls" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="api-calls" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            API Calls
          </TabsTrigger>
          <TabsTrigger value="error-rates" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Error Rates
          </TabsTrigger>
          <TabsTrigger
            value="service-utilization"
            className="flex items-center"
          >
            <PieChart className="h-4 w-4 mr-2" />
            Service Utilization
          </TabsTrigger>
          <TabsTrigger value="response-times" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Response Times
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-calls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Calls Over Time</CardTitle>
              <CardDescription>
                Number of API calls made during the selected period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="h-full w-full flex items-end justify-between space-x-2">
                {apiCallData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-primary w-16 rounded-t-md"
                      style={{ height: `${(item.calls / 2400) * 300}px` }}
                    />
                    <span className="text-xs mt-2">{item.date}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.calls}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="error-rates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Rates by Service</CardTitle>
              <CardDescription>
                Percentage of failed API calls by service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {errorRateData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.service}</span>
                      <span className="text-muted-foreground">
                        {item.rate}%
                      </span>
                    </div>
                    <Progress value={item.rate * 20} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service-utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Utilization</CardTitle>
              <CardDescription>
                Distribution of API calls across services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="relative h-64 w-64 rounded-full border-8 border-muted flex items-center justify-center">
                  {/* Mock pie chart segments */}
                  <div
                    className="absolute inset-0 h-full w-full"
                    style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 100%)" }}
                  >
                    <div className="h-full w-full bg-blue-500 opacity-80"></div>
                  </div>
                  <div
                    className="absolute inset-0 h-full w-full"
                    style={{
                      clipPath: "polygon(50% 50%, 100% 100%, 0 100%, 0 50%)",
                    }}
                  >
                    <div className="h-full w-full bg-green-500 opacity-80"></div>
                  </div>
                  <div
                    className="absolute inset-0 h-full w-full"
                    style={{ clipPath: "polygon(50% 50%, 0 50%, 0 0)" }}
                  >
                    <div className="h-full w-full bg-yellow-500 opacity-80"></div>
                  </div>
                  <div
                    className="absolute inset-0 h-full w-full"
                    style={{ clipPath: "polygon(50% 50%, 0 0, 100% 0)" }}
                  >
                    <div className="h-full w-full bg-red-500 opacity-80"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {serviceUtilizationData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className={`h-3 w-3 rounded-full bg-${index === 0 ? "blue" : index === 1 ? "green" : index === 2 ? "yellow" : "red"}-500`}
                    ></div>
                    <span>{item.service}</span>
                    <span className="text-muted-foreground ml-auto">
                      {item.usage}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response-times" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Average Response Times</CardTitle>
              <CardDescription>
                Average response time in milliseconds by service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {responseTimeData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.service}</span>
                      <span className="text-muted-foreground">
                        {item.time}ms
                      </span>
                    </div>
                    <Progress value={(item.time / 400) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        API Key: ****
                        {Math.random().toString(36).substring(2, 6)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item % 2 === 0
                          ? "RAG"
                          : item % 3 === 0
                            ? "Summarization"
                            : "Translation"}{" "}
                        API call
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {new Date().toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
