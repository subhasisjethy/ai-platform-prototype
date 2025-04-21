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
import { Languages, Settings, ArrowRight, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ApiDocs from "./ApiDocs";

const Translation: React.FC = () => {
    const [sourceText, setSourceText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLang, setTargetLang] = useState("es");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("translate");

    const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "it", name: "Italian" },
        { code: "pt", name: "Portuguese" },
        { code: "ru", name: "Russian" },
        { code: "zh", name: "Chinese" },
        { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" },
    ];

    const apiEndpoints = [
        {
            method: "POST",
            path: "/api/v1/translate",
            description: "Translate text between languages",
            parameters: [
                {
                    name: "text",
                    type: "string",
                    required: true,
                    description: "The text to translate",
                },
                {
                    name: "sourceLang",
                    type: "string",
                    required: true,
                    description: "Source language code (e.g., 'en', 'es', 'fr')",
                },
                {
                    name: "targetLang",
                    type: "string",
                    required: true,
                    description: "Target language code (e.g., 'en', 'es', 'fr')",
                },
                {
                    name: "model",
                    type: "string",
                    required: false,
                    description: "Translation model to use: 'standard', 'advanced', or 'professional'",
                },
            ],
            response: {
                type: "application/json",
                example: JSON.stringify({
                    translatedText: "Translated text in target language",
                    sourceLang: "en",
                    targetLang: "es",
                    model: "standard",
                    confidence: 0.95,
                    processingTime: 0.3,
                }, null, 2),
            },
        },
        {
            method: "GET",
            path: "/api/v1/languages",
            description: "Get list of supported languages",
            parameters: [],
            response: {
                type: "application/json",
                example: JSON.stringify({
                    languages: [
                        { code: "en", name: "English" },
                        { code: "es", name: "Spanish" },
                        { code: "fr", name: "French" },
                    ],
                }, null, 2),
            },
        },
    ];

    const codeExamples = [
        {
            language: "curl",
            label: "cURL",
            code: `curl -X POST https://api.example.com/v1/translate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Hello, world!",
    "sourceLang": "en",
    "targetLang": "es",
    "model": "standard"
  }'`,
        },
        {
            language: "javascript",
            label: "JavaScript",
            code: `const response = await fetch('https://api.example.com/v1/translate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Hello, world!',
    sourceLang: 'en',
    targetLang: 'es',
    model: 'standard',
  }),
});

const data = await response.json();
console.log(data.translatedText);`,
        },
        {
            language: "python",
            label: "Python",
            code: `import requests

response = requests.post(
    'https://api.example.com/v1/translate',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'text': 'Hello, world!',
        'sourceLang': 'en',
        'targetLang': 'es',
        'model': 'standard',
    },
)

data = response.json()
print(data['translatedText'])`,
        },
    ];

    const handleTranslate = async () => {
        setIsLoading(true);
        // TODO: Implement actual translation API call
        setTimeout(() => {
            setTranslatedText("This is a sample translation of the provided text.");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Language Translation</CardTitle>
                    <CardDescription>
                        Translate text between multiple languages
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="translate">
                                <Languages className="mr-2 h-4 w-4" />
                                Translate
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

                        <TabsContent value="translate">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <select
                                        className="p-2 border rounded-md flex-1"
                                        value={sourceLang}
                                        onChange={(e) => setSourceLang(e.target.value)}
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ArrowRight className="h-4 w-4" />
                                    <select
                                        className="p-2 border rounded-md flex-1"
                                        value={targetLang}
                                        onChange={(e) => setTargetLang(e.target.value)}
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Textarea
                                            placeholder="Enter text to translate..."
                                            value={sourceText}
                                            onChange={(e) => setSourceText(e.target.value)}
                                            className="min-h-[200px]"
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            placeholder="Translation will appear here..."
                                            value={translatedText}
                                            readOnly
                                            className="min-h-[200px] bg-muted"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleTranslate}
                                    disabled={isLoading || !sourceText.trim()}
                                    className="w-full"
                                >
                                    {isLoading ? "Translating..." : "Translate"}
                                </Button>

                                {translatedText && (
                                    <div className="flex justify-between items-center mt-4">
                                        <Badge variant="outline">AI Translated</Badge>
                                        <Button variant="outline" size="sm">
                                            Copy Translation
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="api">
                            <ApiDocs
                                title="Translation"
                                description="Access our language translation API programmatically"
                                endpoints={apiEndpoints}
                                examples={codeExamples}
                            />
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Translation Settings</CardTitle>
                                    <CardDescription>
                                        Configure your translation preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">
                                                Default Source Language
                                            </label>
                                            <select className="w-full p-2 border rounded-md">
                                                {languages.map((lang) => (
                                                    <option key={lang.code} value={lang.code}>
                                                        {lang.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                Default Target Language
                                            </label>
                                            <select className="w-full p-2 border rounded-md">
                                                {languages.map((lang) => (
                                                    <option key={lang.code} value={lang.code}>
                                                        {lang.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                Translation Model
                                            </label>
                                            <select className="w-full p-2 border rounded-md">
                                                <option value="standard">Standard</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="professional">Professional</option>
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

export default Translation; 