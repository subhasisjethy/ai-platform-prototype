import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatUIConfig {
    theme: "light" | "dark" | "system";
    bubbleStyle: "modern" | "classic" | "minimal";
    showTimestamp: boolean;
    showAvatar: boolean;
    customCSS: string;
}

const CustomChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [config, setConfig] = useState<ChatUIConfig>({
        theme: "system",
        bubbleStyle: "modern",
        showTimestamp: true,
        showAvatar: true,
        customCSS: "",
    });

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const newMessage: Message = {
                role: "user",
                content: inputMessage,
                timestamp: new Date(),
            };
            setMessages([...messages, newMessage]);
            setInputMessage("");

            // Simulate AI response
            setTimeout(() => {
                const aiResponse: Message = {
                    role: "assistant",
                    content: "This is a sample AI response. Configure the chat UI to match your needs!",
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, aiResponse]);
            }, 1000);
        }
    };

    const getBubbleStyle = () => {
        switch (config.bubbleStyle) {
            case "modern":
                return "rounded-2xl px-4 py-2";
            case "classic":
                return "rounded-lg px-3 py-2";
            case "minimal":
                return "rounded px-2 py-1";
            default:
                return "rounded-2xl px-4 py-2";
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Custom Chat UI</CardTitle>
                <CardDescription>
                    Customize and preview your chat interface
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="preview">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="customize">Customize</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="space-y-4">
                        <div className="h-[400px] border rounded-lg p-4 space-y-4 overflow-y-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`${getBubbleStyle()} ${message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                            } max-w-[80%]`}
                                    >
                                        <p>{message.content}</p>
                                        {config.showTimestamp && (
                                            <p className="text-xs opacity-70 mt-1">
                                                {message.timestamp.toLocaleTimeString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <Button onClick={handleSendMessage}>Send</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="customize" className="space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <Select
                                    value={config.theme}
                                    onValueChange={(value: "light" | "dark" | "system") =>
                                        setConfig({ ...config, theme: value })
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

                            <div className="space-y-2">
                                <Label>Message Bubble Style</Label>
                                <Select
                                    value={config.bubbleStyle}
                                    onValueChange={(value: "modern" | "classic" | "minimal") =>
                                        setConfig({ ...config, bubbleStyle: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="modern">Modern</SelectItem>
                                        <SelectItem value="classic">Classic</SelectItem>
                                        <SelectItem value="minimal">Minimal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Show Timestamps</Label>
                                <Switch
                                    checked={config.showTimestamp}
                                    onCheckedChange={(checked) =>
                                        setConfig({ ...config, showTimestamp: checked })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Show Avatars</Label>
                                <Switch
                                    checked={config.showAvatar}
                                    onCheckedChange={(checked) =>
                                        setConfig({ ...config, showAvatar: checked })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Custom CSS</Label>
                                <Textarea
                                    value={config.customCSS}
                                    onChange={(e) =>
                                        setConfig({ ...config, customCSS: e.target.value })
                                    }
                                    placeholder=".chat-message { /* your custom styles */ }"
                                    className="font-mono"
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    // Handle saving configuration
                                    console.log("Saved configuration:", config);
                                }}
                            >
                                Save Configuration
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default CustomChat; 