import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ClipboardCopy, Play, Code, Settings, RefreshCw } from "lucide-react";

interface ApiResponse {
  status: "success" | "error";
  data?: any;
  error?: string;
  latency?: number;
}

const ApiSandbox = () => {
  const [selectedService, setSelectedService] = useState<string>("rag");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [requestParams, setRequestParams] = useState({
    rag: {
      query: "What are the key features of the UAE education system?",
      maxTokens: 500,
      temperature: 0.7,
      useMetadata: true,
      filters: "subject:education",
    },
    summarization: {
      text: "The UAE education system has undergone significant transformation in recent years. The Ministry of Education has implemented various initiatives to enhance the quality of education and align it with international standards. Schools in the UAE follow different curricula including British, American, IB, and the national curriculum. Higher education institutions in the UAE have partnerships with renowned universities worldwide, offering diverse programs across various disciplines.",
      maxLength: 100,
      format: "paragraph",
      audience: "general",
    },
    translation: {
      text: "Welcome to our AI Platform. We provide state-of-the-art services for education and enterprise applications.",
      sourceLanguage: "en",
      targetLanguage: "ar",
      preserveFormatting: true,
    },
    tts: {
      text: "Welcome to our AI Platform. How can I assist you today?",
      voice: "female",
      speed: 1.0,
      pitch: 1.0,
      format: "mp3",
    },
  });

  const handleParamChange = (service: string, param: string, value: any) => {
    setRequestParams({
      ...requestParams,
      [service]: {
        ...requestParams[service as keyof typeof requestParams],
        [param]: value,
      },
    });
  };

  const executeRequest = () => {
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      const mockResponses = {
        rag: {
          status: "success",
          data: {
            answer:
              "The UAE education system features a blend of public and private institutions offering various curricula including British, American, IB, and the UAE national curriculum. Key features include strong digital infrastructure, emphasis on STEM education, Arabic language instruction, Islamic studies, and a focus on innovation and future skills. The system is regulated by the Ministry of Education and various educational zones, with significant investment in teacher training and educational technology.",
            sources: [
              { title: "UAE Education Overview", relevance: 0.92 },
              {
                title: "Ministry of Education Strategic Plan",
                relevance: 0.85,
              },
            ],
            metadata: { tokens_used: 187, processing_time: "0.8s" },
          },
          latency: 820,
        },
        summarization: {
          status: "success",
          data: {
            summary:
              "The UAE education system has transformed to meet international standards, offering British, American, IB, and national curricula. Higher education institutions partner with global universities to provide diverse programs.",
            metadata: {
              original_length: 384,
              summary_length: 172,
              compression_ratio: "55%",
            },
          },
          latency: 450,
        },
        translation: {
          status: "success",
          data: {
            translated_text:
              "مرحبًا بكم في منصة الذكاء الاصطناعي لدينا. نحن نقدم خدمات متطورة لتطبيقات التعليم والمؤسسات.",
            metadata: {
              characters: 98,
              detected_language: "en",
              confidence: 0.98,
            },
          },
          latency: 320,
        },
        tts: {
          status: "success",
          data: {
            audio_url: "https://example.com/audio/sample.mp3",
            metadata: { duration: "3.5s", file_size: "56KB", format: "mp3" },
          },
          latency: 650,
        },
      };

      setResponse(
        mockResponses[
          selectedService as keyof typeof mockResponses
        ] as ApiResponse,
      );
      setIsLoading(false);
    }, 1500);
  };

  const copyCode = () => {
    const codeSnippets = {
      rag: `fetch('https://api.aiplatform.example/v1/rag', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(requestParams.rag, null, 2)})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
      summarization: `fetch('https://api.aiplatform.example/v1/summarize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(requestParams.summarization, null, 2)})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
      translation: `fetch('https://api.aiplatform.example/v1/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(requestParams.translation, null, 2)})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
      tts: `fetch('https://api.aiplatform.example/v1/text-to-speech', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(requestParams.tts, null, 2)})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
    };

    navigator.clipboard.writeText(
      codeSnippets[selectedService as keyof typeof codeSnippets],
    );
  };

  const renderServiceParams = () => {
    switch (selectedService) {
      case "rag":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="query">Query</Label>
              <Textarea
                id="query"
                value={requestParams.rag.query}
                onChange={(e) =>
                  handleParamChange("rag", "query", e.target.value)
                }
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="maxTokens">
                Max Tokens: {requestParams.rag.maxTokens}
              </Label>
              <Slider
                id="maxTokens"
                value={[requestParams.rag.maxTokens]}
                onValueChange={(value) =>
                  handleParamChange("rag", "maxTokens", value[0])
                }
                max={1000}
                step={10}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="temperature">
                Temperature: {requestParams.rag.temperature}
              </Label>
              <Slider
                id="temperature"
                value={[requestParams.rag.temperature * 100]}
                onValueChange={(value) =>
                  handleParamChange("rag", "temperature", value[0] / 100)
                }
                max={100}
                step={1}
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="useMetadata"
                checked={requestParams.rag.useMetadata}
                onCheckedChange={(checked) =>
                  handleParamChange("rag", "useMetadata", checked)
                }
              />
              <Label htmlFor="useMetadata">Use Metadata</Label>
            </div>
            <div>
              <Label htmlFor="filters">Metadata Filters</Label>
              <Input
                id="filters"
                value={requestParams.rag.filters}
                onChange={(e) =>
                  handleParamChange("rag", "filters", e.target.value)
                }
                className="mt-1"
                placeholder="subject:education, grade:10-12"
              />
            </div>
          </div>
        );
      case "summarization":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text to Summarize</Label>
              <Textarea
                id="text"
                value={requestParams.summarization.text}
                onChange={(e) =>
                  handleParamChange("summarization", "text", e.target.value)
                }
                className="mt-1"
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="maxLength">
                Max Length: {requestParams.summarization.maxLength} characters
              </Label>
              <Slider
                id="maxLength"
                value={[requestParams.summarization.maxLength]}
                onValueChange={(value) =>
                  handleParamChange("summarization", "maxLength", value[0])
                }
                max={500}
                step={10}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="format">Format</Label>
              <Select
                value={requestParams.summarization.format}
                onValueChange={(value) =>
                  handleParamChange("summarization", "format", value)
                }
              >
                <SelectTrigger id="format" className="mt-1">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="bullet">Bullet Points</SelectItem>
                  <SelectItem value="headline">Headline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Select
                value={requestParams.summarization.audience}
                onValueChange={(value) =>
                  handleParamChange("summarization", "audience", value)
                }
              >
                <SelectTrigger id="audience" className="mt-1">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "translation":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text to Translate</Label>
              <Textarea
                id="text"
                value={requestParams.translation.text}
                onChange={(e) =>
                  handleParamChange("translation", "text", e.target.value)
                }
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sourceLanguage">Source Language</Label>
                <Select
                  value={requestParams.translation.sourceLanguage}
                  onValueChange={(value) =>
                    handleParamChange("translation", "sourceLanguage", value)
                  }
                >
                  <SelectTrigger id="sourceLanguage" className="mt-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetLanguage">Target Language</Label>
                <Select
                  value={requestParams.translation.targetLanguage}
                  onValueChange={(value) =>
                    handleParamChange("translation", "targetLanguage", value)
                  }
                >
                  <SelectTrigger id="targetLanguage" className="mt-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="preserveFormatting"
                checked={requestParams.translation.preserveFormatting}
                onCheckedChange={(checked) =>
                  handleParamChange(
                    "translation",
                    "preserveFormatting",
                    checked,
                  )
                }
              />
              <Label htmlFor="preserveFormatting">Preserve Formatting</Label>
            </div>
          </div>
        );
      case "tts":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text to Convert</Label>
              <Textarea
                id="text"
                value={requestParams.tts.text}
                onChange={(e) =>
                  handleParamChange("tts", "text", e.target.value)
                }
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="voice">Voice</Label>
              <Select
                value={requestParams.tts.voice}
                onValueChange={(value) =>
                  handleParamChange("tts", "voice", value)
                }
              >
                <SelectTrigger id="voice" className="mt-1">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="elder">Elder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="speed">Speed: {requestParams.tts.speed}x</Label>
              <Slider
                id="speed"
                value={[requestParams.tts.speed * 10]}
                onValueChange={(value) =>
                  handleParamChange("tts", "speed", value[0] / 10)
                }
                min={5}
                max={20}
                step={1}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pitch">Pitch: {requestParams.tts.pitch}x</Label>
              <Slider
                id="pitch"
                value={[requestParams.tts.pitch * 10]}
                onValueChange={(value) =>
                  handleParamChange("tts", "pitch", value[0] / 10)
                }
                min={5}
                max={20}
                step={1}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="format">Audio Format</Label>
              <Select
                value={requestParams.tts.format}
                onValueChange={(value) =>
                  handleParamChange("tts", "format", value)
                }
              >
                <SelectTrigger id="format" className="mt-1">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp3">MP3</SelectItem>
                  <SelectItem value="wav">WAV</SelectItem>
                  <SelectItem value="ogg">OGG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                response.status === "success" ? "default" : "destructive"
              }
            >
              {response.status === "success" ? "Success" : "Error"}
            </Badge>
            {response.latency && (
              <Badge variant="outline">{response.latency}ms</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setResponse(null)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {response.status === "success" && (
          <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        )}

        {response.status === "error" && (
          <div className="bg-destructive/10 p-4 rounded-md">
            <p className="text-destructive">{response.error}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-background p-6 rounded-lg w-full max-w-6xl mx-auto">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold">API Sandbox</h1>
          <p className="text-muted-foreground">
            Test our AI services and generate code for your applications
          </p>
        </div>

        <Tabs
          defaultValue="rag"
          value={selectedService}
          onValueChange={setSelectedService}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="rag">RAG</TabsTrigger>
            <TabsTrigger value="summarization">Summarization</TabsTrigger>
            <TabsTrigger value="translation">Translation</TabsTrigger>
            <TabsTrigger value="tts">Text-to-Speech</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Request Parameters
                </CardTitle>
                <CardDescription>
                  Configure the parameters for your API request
                </CardDescription>
              </CardHeader>
              <CardContent>{renderServiceParams()}</CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={copyCode}>
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
                <Button onClick={executeRequest} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Request
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Response
                </CardTitle>
                <CardDescription>
                  View the API response and metadata
                </CardDescription>
              </CardHeader>
              <CardContent>
                {response ? (
                  renderResponse()
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <div className="text-muted-foreground mb-4">
                      Configure your parameters and click "Execute Request" to
                      see the response
                    </div>
                    <Button
                      variant="outline"
                      onClick={executeRequest}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Execute Request
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>

        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Code Sample</h3>
          <pre className="text-xs overflow-auto p-2 bg-background rounded border">
            {selectedService === "rag" &&
              `fetch('https://api.aiplatform.example/v1/rag', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(requestParams.rag, null, 2)})
})`}
            {selectedService === "summarization" &&
              `fetch('https://api.aiplatform.example/v1/summarize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(requestParams.summarization, null, 2)})
})`}
            {selectedService === "translation" &&
              `fetch('https://api.aiplatform.example/v1/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(requestParams.translation, null, 2)})
})`}
            {selectedService === "tts" &&
              `fetch('https://api.aiplatform.example/v1/text-to-speech', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(requestParams.tts, null, 2)})
})`}
          </pre>
          <div className="flex justify-end mt-2">
            <Button variant="ghost" size="sm" onClick={copyCode}>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSandbox;
