import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Settings, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ApiDocs from "./ApiDocs";

const Summarization: React.FC = () => {
    const [text, setText] = useState("");
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("summarize");

    const handleSummarize = async () => {
        setIsLoading(true);
        // TODO: Implement actual summarization API call
        setTimeout(() => {
            setSummary("This is a sample summary of the provided text.");
            setIsLoading(false);
        }, 1000);
    };

    const apiEndpoints = [
        {
            method: "POST",
            path: "/api/v1/summarize",
            description: "Generate a summary of the provided text",
            parameters: [
                {
                    name: "text",
                    type: "string",
                    required: true,
                    description: "The text to summarize",
                },
                {
                    name: "length",
                    type: "number",
                    required: false,
                    description: "Target length of the summary in words (default: 100)",
                },
                {
                    name: "style",
                    type: "string",
                    required: false,
                    description: "Summary style: 'concise', 'detailed', or 'bullet' (default: 'concise')",
                },
            ],
            response: {
                type: "application/json",
                example: JSON.stringify({
                    summary: "Generated summary text",
                    originalLength: 500,
                    summaryLength: 100,
                    processingTime: 0.8,
                }, null, 2),
            },
        },
    ];

    const codeExamples = [
        {
            language: "curl",
            label: "cURL",
            code: `curl -X POST https://api.example.com/v1/summarize \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Your long text here...",
    "length": 100,
    "style": "concise"
  }'`,
        },
        {
            language: "javascript",
            label: "JavaScript",
            code: `const response = await fetch('https://api.example.com/v1/summarize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Your long text here...',
    length: 100,
    style: 'concise',
  }),
});

const data = await response.json();
console.log(data.summary);`,
        },
        {
            language: "python",
            label: "Python",
            code: `import requests

response = requests.post(
    'https://api.example.com/v1/summarize',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'text': 'Your long text here...',
        'length': 100,
        'style': 'concise',
    },
)

data = response.json()
print(data['summary'])`,
        },
    ];

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Text Summarization</CardTitle>
                    <CardDescription>
                        Generate concise summaries of your text content
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="summarize">
                                <FileText className="mr-2 h-4 w-4" />
                                Summarize
                            </TabsTrigger>
                            <TabsTrigger value="api">
                                <Code className="mr-2 h-4 w-4" />
                                API
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="summarize">
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Enter the text you want to summarize..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="min-h-[200px]"
                                />
                                <Button
                                    onClick={handleSummarize}
                                    disabled={isLoading || !text.trim()}
                                    className="w-full"
                                >
                                    {isLoading ? "Generating Summary..." : "Generate Summary"}
                                </Button>

                                {summary && (
                                    <div className="mt-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Summary</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p>{summary}</p>
                                                <div className="mt-4 flex justify-between items-center">
                                                    <Badge variant="outline">AI Generated</Badge>
                                                    <Button variant="outline" size="sm">
                                                        Copy Summary
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="api">
                            <ApiDocs
                                title="Summarization"
                                description="Access our text summarization API programmatically"
                                endpoints={apiEndpoints}
                                examples={codeExamples}
                            />
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Summarization Settings</CardTitle>
                                    <CardDescription>
                                        Configure your summarization parameters
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">
                                                Summary Length (words)
                                            </label>
                                            <Input type="number" defaultValue="100" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Style</label>
                                            <select className="w-full p-2 border rounded-md">
                                                <option value="concise">Concise</option>
                                                <option value="detailed">Detailed</option>
                                                <option value="bullet">Bullet Points</option>
                                            </select>
                                        </div>
                                        <Button className="w-full">Save Settings</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Summarization; 