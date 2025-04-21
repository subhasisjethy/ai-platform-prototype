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
import { Mic, Settings, Play, Download, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import ApiDocs from "./ApiDocs";

const TextToSpeech: React.FC = () => {
    const [text, setText] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("tts");
    const [voice, setVoice] = useState("en-US-1");
    const [speed, setSpeed] = useState(1);
    const [pitch, setPitch] = useState(1);

    const voices = [
        { id: "en-US-1", name: "English (US) - Female" },
        { id: "en-US-2", name: "English (US) - Male" },
        { id: "en-GB-1", name: "English (UK) - Female" },
        { id: "en-GB-2", name: "English (UK) - Male" },
        { id: "es-ES-1", name: "Spanish - Female" },
        { id: "fr-FR-1", name: "French - Female" },
        { id: "de-DE-1", name: "German - Female" },
    ];

    const apiEndpoints = [
        {
            method: "POST",
            path: "/api/v1/tts/generate",
            description: "Generate audio from text",
            parameters: [
                {
                    name: "text",
                    type: "string",
                    required: true,
                    description: "The text to convert to speech",
                },
                {
                    name: "voice",
                    type: "string",
                    required: true,
                    description: "Voice ID to use for synthesis",
                },
                {
                    name: "speed",
                    type: "number",
                    required: false,
                    description: "Speech rate (0.5 to 2.0, default: 1.0)",
                },
                {
                    name: "pitch",
                    type: "number",
                    required: false,
                    description: "Voice pitch (-20 to 20, default: 0)",
                },
                {
                    name: "format",
                    type: "string",
                    required: false,
                    description: "Audio format: 'mp3', 'wav', or 'ogg' (default: 'mp3')",
                },
            ],
            response: {
                type: "application/json",
                example: JSON.stringify({
                    audioUrl: "https://api.example.com/audio/123.mp3",
                    duration: 3.5,
                    format: "mp3",
                    voice: "en-US-Neural2-F",
                    characterCount: 150,
                }, null, 2),
            },
        },
        {
            method: "GET",
            path: "/api/v1/tts/voices",
            description: "Get list of available voices",
            parameters: [],
            response: {
                type: "application/json",
                example: JSON.stringify({
                    voices: [
                        {
                            id: "en-US-Neural2-F",
                            name: "Sarah",
                            language: "English (US)",
                            gender: "Female",
                        },
                        {
                            id: "en-GB-Neural2-M",
                            name: "James",
                            language: "English (UK)",
                            gender: "Male",
                        },
                    ],
                }, null, 2),
            },
        },
    ];

    const codeExamples = [
        {
            language: "curl",
            label: "cURL",
            code: `curl -X POST https://api.example.com/v1/tts/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Hello, welcome to our text-to-speech API.",
    "voice": "en-US-Neural2-F",
    "speed": 1.0,
    "pitch": 0,
    "format": "mp3"
  }'`,
        },
        {
            language: "javascript",
            label: "JavaScript",
            code: `const response = await fetch('https://api.example.com/v1/tts/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Hello, welcome to our text-to-speech API.',
    voice: 'en-US-Neural2-F',
    speed: 1.0,
    pitch: 0,
    format: 'mp3',
  }),
});

const data = await response.json();
const audio = new Audio(data.audioUrl);
audio.play();`,
        },
        {
            language: "python",
            label: "Python",
            code: `import requests

response = requests.post(
    'https://api.example.com/v1/tts/generate',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'text': 'Hello, welcome to our text-to-speech API.',
        'voice': 'en-US-Neural2-F',
        'speed': 1.0,
        'pitch': 0,
        'format': 'mp3',
    },
)

data = response.json()
audio_url = data['audioUrl']
# Download and save the audio file
audio_response = requests.get(audio_url)
with open('output.mp3', 'wb') as f:
    f.write(audio_response.content)`,
        },
    ];

    const handleGenerateAudio = async () => {
        setIsLoading(true);
        // TODO: Implement actual TTS API call
        setTimeout(() => {
            setAudioUrl("sample-audio-url.mp3");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Text to Speech</CardTitle>
                    <CardDescription>
                        Convert text to natural-sounding speech
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="tts">
                                <Mic className="mr-2 h-4 w-4" />
                                Text to Speech
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

                        <TabsContent value="tts">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Select Voice</label>
                                    <select
                                        className="w-full p-2 border rounded-md mt-1"
                                        value={voice}
                                        onChange={(e) => setVoice(e.target.value)}
                                    >
                                        {voices.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Textarea
                                    placeholder="Enter text to convert to speech..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="min-h-[150px]"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Speed</label>
                                        <Slider
                                            value={[speed]}
                                            onValueChange={([value]) => setSpeed(value)}
                                            min={0.5}
                                            max={2}
                                            step={0.1}
                                            className="mt-2"
                                        />
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {speed}x
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Pitch</label>
                                        <Slider
                                            value={[pitch]}
                                            onValueChange={([value]) => setPitch(value)}
                                            min={0.5}
                                            max={2}
                                            step={0.1}
                                            className="mt-2"
                                        />
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {pitch}x
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleGenerateAudio}
                                    disabled={isLoading || !text.trim()}
                                    className="w-full"
                                >
                                    {isLoading ? "Generating Audio..." : "Generate Audio"}
                                </Button>

                                {audioUrl && (
                                    <Card className="mt-4">
                                        <CardContent className="pt-6">
                                            <div className="space-y-4">
                                                <audio controls className="w-full">
                                                    <source src={audioUrl} type="audio/mpeg" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                                <div className="flex justify-between">
                                                    <Badge variant="outline">AI Generated</Badge>
                                                    <div className="space-x-2">
                                                        <Button variant="outline" size="sm">
                                                            <Play className="h-4 w-4 mr-2" />
                                                            Preview
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="api">
                            <ApiDocs
                                title="Text to Speech"
                                description="Access our text-to-speech API programmatically"
                                endpoints={apiEndpoints}
                                examples={codeExamples}
                            />
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>TTS Settings</CardTitle>
                                    <CardDescription>
                                        Configure your text-to-speech preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">
                                                Default Voice
                                            </label>
                                            <select className="w-full p-2 border rounded-md">
                                                {voices.map((v) => (
                                                    <option key={v.id} value={v.id}>
                                                        {v.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                Audio Format
                                            </label>
                                            <select className="w-full p-2 border rounded-md">
                                                <option value="mp3">MP3</option>
                                                <option value="wav">WAV</option>
                                                <option value="ogg">OGG</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                Sample Rate
                                            </label>
                                            <select className="w-full p-2 border rounded-md">
                                                <option value="16000">16 kHz</option>
                                                <option value="22050">22.05 kHz</option>
                                                <option value="44100">44.1 kHz</option>
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

export default TextToSpeech; 