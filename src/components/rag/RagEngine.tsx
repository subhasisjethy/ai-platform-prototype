import React, { useState } from "react";
import { useRag } from "@/hooks/useRag";
import BookUpload from "./BookUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Search, Settings, Trash2, Upload, Code } from "lucide-react";

interface RagEngineProps {
  onGenerateEmbedCode?: (apiKey: string, settings: any) => void;
}

const RagEngine: React.FC<RagEngineProps> = ({
  onGenerateEmbedCode = () => {},
}) => {
  const {
    isLoading,
    error,
    books,
    lastResponse,
    uploadBook,
    query,
    deleteBook,
  } = useRag();

  const [activeTab, setActiveTab] = useState("upload");
  const [queryText, setQueryText] = useState("");
  const [apiKey, setApiKey] = useState("alef_sk_test_123456789");
  const [embedSettings, setEmbedSettings] = useState({
    theme: "light",
    width: "100%",
    height: "500px",
    placeholder: "Ask a question about your documents...",
  });

  const handleBookUpload = async (file: File, metadata: any) => {
    try {
      await uploadBook(file, metadata);
      setActiveTab("manage");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleQuery = async () => {
    if (!queryText.trim()) return;

    try {
      await query({
        query: queryText,
        maxResults: 3,
        temperature: 0.7,
      });
    } catch (err) {
      console.error("Query failed:", err);
    }
  };

  const handleGenerateEmbedCode = () => {
    onGenerateEmbedCode(apiKey, embedSettings);
  };

  return (
    <div className="container mx-auto p-4 bg-background">
      <h1 className="text-2xl font-bold mb-6">RAG Engine Management</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Books
          </TabsTrigger>
          <TabsTrigger value="manage">
            <BookOpen className="mr-2 h-4 w-4" />
            Manage Books
          </TabsTrigger>
          <TabsTrigger value="query">
            <Search className="mr-2 h-4 w-4" />
            Test Queries
          </TabsTrigger>
          <TabsTrigger value="embed">
            <Code className="mr-2 h-4 w-4" />
            Embed Code
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <BookUpload onUploadComplete={handleBookUpload} />
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Uploaded Books
              </CardTitle>
              <CardDescription>
                Manage your uploaded books for the RAG engine
              </CardDescription>
            </CardHeader>
            <CardContent>
              {books.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No books uploaded yet. Go to the Upload tab to add books.
                </div>
              ) : (
                <div className="space-y-4">
                  {books.map((book) => (
                    <Card key={book.id} className="bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              {book.metadata.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              by {book.metadata.author}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {book.metadata.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteBook(book.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between text-sm">
                          <span>
                            Uploaded: {book.uploadDate.toLocaleDateString()}
                          </span>
                          <Badge
                            variant={
                              book.status === "ready"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {book.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Test RAG Queries
              </CardTitle>
              <CardDescription>
                Test how your RAG system responds to different queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Enter your query here..."
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={handleQuery}
                  disabled={isLoading || !queryText.trim()}
                  className="w-full"
                >
                  {isLoading ? "Processing..." : "Submit Query"}
                </Button>

                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                    {error}
                  </div>
                )}

                {lastResponse && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-medium mb-2">Response:</h3>
                      <p>{lastResponse.answer}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Sources:</h3>
                      <div className="space-y-2">
                        {lastResponse.sources.map((source, index) => (
                          <div key={index} className="p-3 border rounded-md">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{source.title}</h4>
                              <Badge variant="outline">
                                {Math.round(source.relevance * 100)}% match
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              by {source.author}
                            </p>
                            <p className="mt-2 text-sm">{source.excerpt}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground text-right">
                      Processing time: {lastResponse.processingTime.toFixed(2)}s
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generate Embed Code
              </CardTitle>
              <CardDescription>
                Create embeddable chat widget code for your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Theme</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={embedSettings.theme}
                      onChange={(e) =>
                        setEmbedSettings({
                          ...embedSettings,
                          theme: e.target.value,
                        })
                      }
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Placeholder Text
                    </label>
                    <Input
                      value={embedSettings.placeholder}
                      onChange={(e) =>
                        setEmbedSettings({
                          ...embedSettings,
                          placeholder: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Width</label>
                    <Input
                      value={embedSettings.width}
                      onChange={(e) =>
                        setEmbedSettings({
                          ...embedSettings,
                          width: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Height</label>
                    <Input
                      value={embedSettings.height}
                      onChange={(e) =>
                        setEmbedSettings({
                          ...embedSettings,
                          height: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleGenerateEmbedCode} className="w-full">
                  Generate Embed Code
                </Button>

                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Preview:</h3>
                  <div
                    className="border rounded-md p-4"
                    style={{
                      width: embedSettings.width,
                      height: "300px",
                      background:
                        embedSettings.theme === "dark" ? "#1a1a1a" : "#ffffff",
                      color:
                        embedSettings.theme === "dark" ? "#ffffff" : "#000000",
                    }}
                  >
                    <div className="h-full flex flex-col">
                      <div className="flex-1 overflow-auto p-2 border-b">
                        <div className="mb-4 text-right">
                          <div className="inline-block bg-primary/10 rounded-lg p-2 px-3 text-sm">
                            How can I help you today?
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Input placeholder={embedSettings.placeholder} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                RAG Engine Settings
              </CardTitle>
              <CardDescription>
                Configure your RAG engine parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Default Temperature
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Tokens</label>
                  <Input
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    defaultValue="1000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Default Results Limit
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    step="1"
                    defaultValue="3"
                  />
                </div>
                <Button className="w-full">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RagEngine;
