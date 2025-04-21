import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiEndpoint {
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    description: string;
    parameters: {
        name: string;
        type: string;
        required: boolean;
        description: string;
    }[];
    response: {
        type: string;
        example: string;
    };
}

interface CodeExample {
    language: string;
    label: string;
    code: string;
}

interface ApiDocsProps {
    title: string;
    description: string;
    endpoints: ApiEndpoint[];
    examples: CodeExample[];
}

const ApiDocs: React.FC<ApiDocsProps> = ({
    title,
    description,
    endpoints,
    examples,
}) => {
    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title} API</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="endpoints" className="w-full">
                    <TabsList>
                        <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                        <TabsTrigger value="examples">Code Examples</TabsTrigger>
                    </TabsList>

                    <TabsContent value="endpoints">
                        <div className="space-y-6">
                            {endpoints.map((endpoint, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge
                                            variant={
                                                endpoint.method === "GET"
                                                    ? "default"
                                                    : endpoint.method === "POST"
                                                        ? "outline"
                                                        : "secondary"
                                            }
                                        >
                                            {endpoint.method}
                                        </Badge>
                                        <code className="text-sm bg-muted px-2 py-1 rounded">
                                            {endpoint.path}
                                        </code>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {endpoint.description}
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Parameters</h4>
                                            <div className="border rounded-md">
                                                <div className="grid grid-cols-4 gap-4 p-2 border-b bg-muted text-sm font-medium">
                                                    <div>Name</div>
                                                    <div>Type</div>
                                                    <div>Required</div>
                                                    <div>Description</div>
                                                </div>
                                                {endpoint.parameters.map((param, pIndex) => (
                                                    <div
                                                        key={pIndex}
                                                        className="grid grid-cols-4 gap-4 p-2 border-b last:border-0 text-sm"
                                                    >
                                                        <div>{param.name}</div>
                                                        <div>
                                                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                                                {param.type}
                                                            </code>
                                                        </div>
                                                        <div>
                                                            {param.required ? (
                                                                <Badge variant="default">Required</Badge>
                                                            ) : (
                                                                <Badge variant="outline">Optional</Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            {param.description}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Response</h4>
                                            <div className="bg-muted rounded-md p-4">
                                                <div className="mb-2">
                                                    <code className="text-sm">{endpoint.response.type}</code>
                                                </div>
                                                <pre className="text-sm bg-background p-2 rounded">
                                                    {endpoint.response.example}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="examples">
                        <div className="space-y-4">
                            {examples.map((example, index) => (
                                <div key={index} className="relative">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-medium">{example.label}</h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopyCode(example.code)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                        <code className="text-sm">{example.code}</code>
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default ApiDocs; 