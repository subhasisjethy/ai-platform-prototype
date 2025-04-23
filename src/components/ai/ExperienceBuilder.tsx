import React, { useState, useMemo } from 'react';
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
import {
    AIExperienceConfig,
    defaultAIConfig as baseDefaultAIConfig,
    mockCCLContent,
    mockKnowledgeBases,
    ContentType,
    ContentSource,
    TeachingStyle,
    LanguageStyle,
    ExampleType,
    savedConfigs
} from '@/types/ai-platform';
import { Code, Copy, Search, Save, Video, BookText, ClipboardCheck, Bot, Volume2, WrapText, Languages, Sparkles, ListChecks, GraduationCap, Mic, MessageSquare, Edit, FileQuestion, CheckSquare, UserCheck, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";

// --- Color Palette ---
const colors = {
    primary: '#5680E9',
    lightBlue: '#84CEEB',
    mediumBlue: '#5AB9EA',
    lightLavender: '#C1C8E4',
    purple: '#8860D0',
    textLight: '#FFFFFF', // For dark backgrounds
    textDark: '#2D3748', // For light backgrounds
    border: '#E2E8F0', // Light border
};

// --- Helper Function to get Icon --- (Keep as is)
const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
        case 'video': return <Video className="h-8 w-8" style={{ color: colors.mediumBlue }} />;
        case 'book': return <BookText className="h-8 w-8" style={{ color: colors.mediumBlue }} />;
        case 'assessment': return <ClipboardCheck className="h-8 w-8" style={{ color: colors.mediumBlue }} />;
        default: return null;
    }
}

const STEPS = [
    { id: 1, name: 'Context', description: 'Provide context about the AI experience.' },
    { id: 2, name: 'Capabilities', description: 'Choose and configure AI capabilities.' },
    { id: 3, name: 'Knowledge Base', description: 'Configure RAG and connect knowledge sources.' },
    { id: 4, name: 'Behavior', description: 'Define guardrails and AI personality.' },
    { id: 5, name: 'Review & Save', description: 'Preview integration code and save.' },
];

// Add default values for new fields
const defaultAIConfig: AIExperienceConfig = {
    ...baseDefaultAIConfig,
    productLine: '',
    productName: '',
    integrationContext: '',
    targetUser: '',
    capabilities: {
        ...baseDefaultAIConfig.capabilities,
        aiTutor: baseDefaultAIConfig.capabilities.aiTutor || { enabled: false, persona: 'guide', proactiveEngagement: false },
        personalizedRecommendation: baseDefaultAIConfig.capabilities.personalizedRecommendation || { enabled: false },
        learningAnalytics: baseDefaultAIConfig.capabilities.learningAnalytics || { enabled: false },
        feedbackGenerator: baseDefaultAIConfig.capabilities.feedbackGenerator || { enabled: false },
        questionGenerator: baseDefaultAIConfig.capabilities.questionGenerator || { enabled: false },
        simplifier: baseDefaultAIConfig.capabilities.simplifier || { enabled: false },
        translator: baseDefaultAIConfig.capabilities.translator || { enabled: false, targetLanguages: [] },
        summarizer: baseDefaultAIConfig.capabilities.summarizer || { enabled: false },
        autograder: baseDefaultAIConfig.capabilities.autograder || { enabled: false },
        teacherAssistant: baseDefaultAIConfig.capabilities.teacherAssistant || { enabled: false },
        rag: baseDefaultAIConfig.capabilities.rag || { enabled: false, knowledgeBaseIds: [] },
        chat: baseDefaultAIConfig.capabilities.chat || { enabled: false, mode: 'contextual', features: [] },
    }
};

// Props interface for ExperienceBuilder
interface ExperienceBuilderProps {
    onExperienceSaved?: () => void; // Added prop for navigation callback
}

const ExperienceBuilder: React.FC<ExperienceBuilderProps> = ({ onExperienceSaved }) => {
    const [config, setConfig] = useState<AIExperienceConfig>(defaultAIConfig);
    const [currentStep, setCurrentStep] = useState(1);
    const [configName, setConfigName] = useState(config.configName || 'New Experience');
    const [isTutorConfigOpen, setIsTutorConfigOpen] = useState(false);
    const [dialogOpenState, setDialogOpenState] = useState<Record<string, boolean>>({});

    // --- Memoize selected content for preview --- (Keep as is)
    const selectedContent = useMemo(() => {
        if (config.content.source === 'CCL') {
            return mockCCLContent.find(item => item.id === config.content.id);
        }
        return null;
    }, [config.content.source, config.content.id]);

    // --- Config Change Handler --- (Keep as is)
    const handleConfigChange = (path: string, value: any) => {
        setConfig(prevConfig => {
            const keys = path.split('.');
            let current: any = { ...prevConfig };
            let ref = current;
            for (let i = 0; i < keys.length - 1; i++) {
                if (ref[keys[i]] === undefined || ref[keys[i]] === null) ref[keys[i]] = {};
                ref = ref[keys[i]];
            }
            ref[keys[keys.length - 1]] = value;
            return current;
        });
    };

    // --- Generate Code --- (Keep as is)
    const generateCode = () => {
        const { configId, configName, ...exportConfig } = config;
        return `
import { ContentAIWidget } from '@alef/ai-platform';

<ContentAIWidget
  config={${JSON.stringify(exportConfig, null, 2)}}
  theme="alef-portal" // Or your custom theme
/>`;
    };

    // --- Save Config --- (Keep as is, triggered on final step)
    const handleSaveConfig = () => {
        const nameToSave = config.configName || `Experience-${Date.now()}`;
        const newConfig = { ...config, configName: nameToSave, configId: config.configId || `config-${Date.now()}` };
        setConfig(newConfig);
        console.log("Saving Config:", newConfig);
        toast({
            title: "Configuration Saved",
            description: `Experience "${newConfig.configName}" saved.`,
            action: <CheckCircle className="h-5 w-5" style={{ color: colors.mediumBlue }} />,
        });
        const existingIndex = savedConfigs.findIndex(c => c.configId === newConfig.configId);
        if (existingIndex > -1) {
            savedConfigs[existingIndex] = newConfig;
        } else {
            savedConfigs.push(newConfig);
        }

        // --- NEW: Call the navigation callback --- 
        if (onExperienceSaved) {
            onExperienceSaved();
        }
        // --- End NEW --- 
    };

    // --- Load Config --- (Keep as is, used outside stepper for now)
    const loadConfig = (configId: string) => {
        const loaded = savedConfigs.find(c => c.configId === configId);
        if (loaded) {
            setConfig(loaded);
            setConfigName(loaded.configName || 'Loaded Experience');
            setCurrentStep(1); // Reset to first step when loading
            toast({ title: "Configuration Loaded", description: `Loaded "${loaded.configName}". Start customizing.` });
        }
    }

    // --- Step Navigation --- 
    const handleNextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const currentStepInfo = STEPS.find(step => step.id === currentStep);

    // Placeholder handler for AI Generate button
    const handleGenerateIntegrationContext = () => {
        console.log("AI Generate Integration Context clicked. Current context:", config.integrationContext);
        // TODO: Implement actual AI call to expand the context
        // Example: callAIService(config.integrationContext).then(expanded => handleConfigChange('integrationContext', expanded));
        toast({
            title: "AI Generation (Placeholder)",
            description: "This would expand the integration context using AI.",
        });
    };

    const handleDialogOpenChange = (dialog: string, open: boolean) => {
        setDialogOpenState(prev => ({ ...prev, [dialog]: open }));
    };

    return (
        <Card className="w-full h-full min-h-screen shadow-lg" style={{ background: `linear-gradient(to bottom, ${colors.lightLavender} 0%, ${colors.lightBlue} 100%)` }}>
            <CardHeader className="border-b sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/80" style={{ borderColor: colors.lightLavender }}>
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1 min-w-0">
                        {/* Stepper Progress Indicator - Ensure no overflow and wrapping */}
                        <ol className="flex items-center w-full text-sm font-medium text-center pb-2 flex-wrap" style={{ color: colors.textDark + 'aa' }}>
                            {STEPS.map((step) => (
                                <li key={step.id}
                                    className={`flex items-center mb-2 mr-4 md:mr-0 ${
                                        // Use flex-basis for better wrapping control on smaller screens if needed
                                        // Removed complex after: logic for simplicity, relying on flex-wrap
                                        step.id < STEPS.length ? `sm:after:content-[''] sm:after:w-full sm:after:h-1 sm:after:border-b sm:after:mx-4` : ""
                                        }`}
                                    style={{ borderColor: step.id < currentStep ? colors.primary : colors.lightLavender }}
                                >
                                    {/* Span has no whitespace-nowrap */}
                                    <span
                                        className={`flex items-center transition-colors ${step.id < currentStep ? 'cursor-pointer' : ''
                                            }`}
                                        style={{
                                            color: step.id <= currentStep ? colors.primary : colors.textDark + 'aa',
                                        }}
                                        onMouseEnter={(e) => { if (step.id < currentStep) e.currentTarget.style.color = colors.primary + 'cc'; }}
                                        onMouseLeave={(e) => { if (step.id < currentStep) e.currentTarget.style.color = colors.primary; }}
                                        onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                                    >
                                        {step.id < currentStep ? (
                                            <CheckCircle className="w-5 h-5 mr-2 shrink-0" style={{ color: colors.primary }} />
                                        ) : (
                                            <span
                                                className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 shrink-0 transition-all border-2`}
                                                style={{
                                                    borderColor: step.id === currentStep ? colors.primary : colors.lightLavender,
                                                    backgroundColor: step.id === currentStep ? colors.primary + '1a' : 'transparent',
                                                    color: step.id === currentStep ? colors.primary : colors.textDark + 'aa'
                                                }}
                                            >
                                                {step.id}
                                            </span>
                                        )}
                                        <span className="md:inline font-medium ml-1">{step.name}</span> {/* Adjusted spacing */}
                                    </span>
                                </li>
                            ))}
                        </ol>
                        {/* Title and Description */}
                        <div className="mt-1">
                            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: colors.primary }}>{currentStepInfo?.name}</h2>
                            <p className="text-sm" style={{ color: colors.textDark + 'cc' }}>{currentStepInfo?.description}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="min-h-[600px] space-y-6">
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 gap-6 h-full">
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow border" style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                <CardHeader>
                                    <CardTitle style={{ color: colors.textDark }}>Contextual Information</CardTitle>
                                    <CardDescription style={{ color: colors.textDark + 'aa' }}>Describe the AI experience and its intended audience.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <SelectConfig
                                                label="Product Line"
                                                path="productLine"
                                                config={config}
                                                onChange={handleConfigChange}
                                                options={[
                                                    { value: 'core', label: 'Core Platform' },
                                                    { value: 'pathways', label: 'Pathways' },
                                                    { value: 'assessments', label: 'Assessments' },
                                                    { value: 'abjadiyat', label: 'Abjadiyat' },
                                                    { value: 'miqiyas', label: 'Miqiyas AL Dhad' }
                                                ]}
                                                placeholder="Select Product Line..."
                                            />
                                            <InputConfig
                                                label="Product Name"
                                                path="productName"
                                                config={config}
                                                onChange={handleConfigChange}
                                                placeholder="Enter Product Name..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <Label htmlFor="integrationContext" style={{ color: colors.textDark + 'dd' }}>Details</Label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleGenerateIntegrationContext}
                                                    style={{ color: colors.purple, padding: '0.25rem 0.5rem' }}
                                                    className="text-xs h-auto"
                                                >
                                                    <Sparkles className="h-3 w-3 mr-1" />
                                                    AI Generate
                                                </Button>
                                            </div>
                                            <Textarea
                                                id="integrationContext"
                                                value={config.integrationContext}
                                                onChange={(e) => handleConfigChange('integrationContext', e.target.value)}
                                                placeholder="Briefly describe where and how this AI experience will be integrated..."
                                                className="w-full transition-colors min-h-[80px]"
                                                style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="targetUser" style={{ color: colors.textDark + 'dd' }}>Target User</Label>
                                            <Input
                                                id="targetUser"
                                                value={config.targetUser}
                                                onChange={(e) => handleConfigChange('targetUser', e.target.value)}
                                                placeholder="e.g., Grade 5 students, Teachers preparing lessons, Parents checking progress..."
                                                className="w-full transition-colors"
                                                style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <ScrollArea className="h-[700px] w-full pr-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <CapabilityCard title="AI Tutor" icon={<MessageSquare className="w-5 h-5" />}>
                                    <SwitchConfig label="Enable AI Tutor" path="capabilities.aiTutor.enabled" config={config} onChange={handleConfigChange} />
                                    {config.capabilities.aiTutor?.enabled && (
                                        <Dialog open={dialogOpenState['aiTutor'] ?? false} onOpenChange={(open) => handleDialogOpenChange('aiTutor', open)}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-full mt-2" style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}>
                                                    Configure
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                                <DialogHeader>
                                                    <DialogTitle style={{ color: colors.textDark }}>AI Tutor Configuration</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                    <SelectConfig label="Tutor Persona" path="capabilities.aiTutor.persona" config={config} onChange={handleConfigChange} options={[{ value: 'guide', label: 'Guide' }, { value: 'mentor', label: 'Mentor' }, { value: 'expert', label: 'Expert' }]} />
                                                    <SwitchConfig label="Proactive Engagement" path="capabilities.aiTutor.proactiveEngagement" config={config} onChange={handleConfigChange} />
                                                    <div className="space-y-2">
                                                        <Label htmlFor="aiTutorPrompt" style={{ color: colors.textDark + 'dd' }}>Prompt</Label>
                                                        <Textarea
                                                            id="aiTutorPrompt"
                                                            value={config.capabilities.aiTutor?.prompt || ''}
                                                            onChange={(e) => handleConfigChange('capabilities.aiTutor.prompt', e.target.value)}
                                                            placeholder="Enter custom prompt or use default..."
                                                            className="w-full transition-colors min-h-[100px]"
                                                            style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild><Button type="button" variant="outline" style={{ backgroundColor: colors.lightLavender + '80', borderColor: colors.lightLavender, color: colors.textDark }}>Close</Button></DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </CapabilityCard>
                                <CapabilityCard title="Question Generator" icon={<FileQuestion className="w-5 h-5" />}>
                                    <SwitchConfig label="Enable Question Gen." path="capabilities.questionGenerator.enabled" config={config} onChange={handleConfigChange} />
                                    {config.capabilities.questionGenerator?.enabled && (
                                        <Dialog open={dialogOpenState['questionGenerator'] ?? false} onOpenChange={(open) => handleDialogOpenChange('questionGenerator', open)}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-full mt-2" style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}>
                                                    Configure
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                                <DialogHeader><DialogTitle style={{ color: colors.textDark }}>Question Generator Configuration</DialogTitle></DialogHeader>
                                                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                    <div className="text-sm text-muted-foreground italic">No specific options currently available.</div>
                                                    <div className="space-y-2 pt-4 border-t" style={{ borderColor: colors.lightLavender + '80' }}>
                                                        <Label htmlFor="qgPrompt" style={{ color: colors.textDark + 'dd' }}>Prompt</Label>
                                                        <Textarea
                                                            id="qgPrompt"
                                                            value={config.capabilities.questionGenerator?.prompt || ''}
                                                            onChange={(e) => handleConfigChange('capabilities.questionGenerator.prompt', e.target.value)}
                                                            placeholder="Enter custom prompt or use default..."
                                                            className="w-full transition-colors min-h-[100px]"
                                                            style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild><Button type="button" variant="outline" style={{ backgroundColor: colors.lightLavender + '80', borderColor: colors.lightLavender, color: colors.textDark }}>Close</Button></DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </CapabilityCard>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-3 pl-1" style={{ color: colors.textDark }}>Helpers</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <CapabilityCard title="Simplification" icon={<Sparkles className="w-5 h-5" />}>
                                        <SwitchConfig label="Enable Simplifier" path="capabilities.simplifier.enabled" config={config} onChange={handleConfigChange} />
                                        {config.capabilities.simplifier?.enabled && (
                                            <Dialog open={dialogOpenState['simplifier'] ?? false} onOpenChange={(open) => handleDialogOpenChange('simplifier', open)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full mt-2" style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}>Configure</Button>
                                                </DialogTrigger>
                                                <DialogContent style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                                    <DialogHeader><DialogTitle style={{ color: colors.textDark }}>Simplification Configuration</DialogTitle></DialogHeader>
                                                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                        <InputConfig label="Target Grade Level" path="capabilities.simplifier.targetGradeLevel" type="number" config={config} onChange={handleConfigChange} />
                                                        <div className="space-y-2 pt-4 border-t" style={{ borderColor: colors.lightLavender + '80' }}>
                                                            <Label htmlFor="simplifierPrompt" style={{ color: colors.textDark + 'dd' }}>Prompt</Label>
                                                            <Textarea
                                                                id="simplifierPrompt"
                                                                value={config.capabilities.simplifier?.prompt || ''}
                                                                onChange={(e) => handleConfigChange('capabilities.simplifier.prompt', e.target.value)}
                                                                placeholder="Enter custom prompt or use default..."
                                                                className="w-full transition-colors min-h-[100px]"
                                                                style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter><DialogClose asChild><Button type="button" variant="outline" style={{ backgroundColor: colors.lightLavender + '80', borderColor: colors.lightLavender, color: colors.textDark }}>Close</Button></DialogClose></DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </CapabilityCard>
                                    <CapabilityCard title="Translate" icon={<Languages className="w-5 h-5" />}>
                                        <SwitchConfig label="Enable Translator" path="capabilities.translator.enabled" config={config} onChange={handleConfigChange} />
                                        {config.capabilities.translator?.enabled && (
                                            <Dialog open={dialogOpenState['translator'] ?? false} onOpenChange={(open) => handleDialogOpenChange('translator', open)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full mt-2" style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}>Configure</Button>
                                                </DialogTrigger>
                                                <DialogContent style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                                    <DialogHeader><DialogTitle style={{ color: colors.textDark }}>Translate Configuration</DialogTitle></DialogHeader>
                                                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                        <SelectConfig label="Target Language" path="capabilities.translator.targetLanguages.0" config={config} onChange={(p, v) => handleConfigChange('capabilities.translator.targetLanguages', [v])} options={[{ value: 'ar', label: 'Arabic' }, { value: 'en', label: 'English' }]} />
                                                        <div className="space-y-2 pt-4 border-t" style={{ borderColor: colors.lightLavender + '80' }}>
                                                            <Label htmlFor="translatorPrompt" style={{ color: colors.textDark + 'dd' }}>Prompt</Label>
                                                            <Textarea
                                                                id="translatorPrompt"
                                                                value={config.capabilities.translator?.prompt || ''}
                                                                onChange={(e) => handleConfigChange('capabilities.translator.prompt', e.target.value)}
                                                                placeholder="Enter custom prompt or use default..."
                                                                className="w-full transition-colors min-h-[100px]"
                                                                style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter><DialogClose asChild><Button type="button" variant="outline" style={{ backgroundColor: colors.lightLavender + '80', borderColor: colors.lightLavender, color: colors.textDark }}>Close</Button></DialogClose></DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </CapabilityCard>
                                    <CapabilityCard title="Summarization" icon={<WrapText className="w-5 h-5" />}>
                                        <SwitchConfig label="Enable Summarizer" path="capabilities.summarizer.enabled" config={config} onChange={handleConfigChange} />
                                        {config.capabilities.summarizer?.enabled && (
                                            <Dialog open={dialogOpenState['summarizer'] ?? false} onOpenChange={(open) => handleDialogOpenChange('summarizer', open)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full mt-2" style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}>Configure</Button>
                                                </DialogTrigger>
                                                <DialogContent style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                                    <DialogHeader><DialogTitle style={{ color: colors.textDark }}>Summarization Configuration</DialogTitle></DialogHeader>
                                                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                        <SelectConfig label="Format" path="capabilities.summarizer.format" config={config} onChange={handleConfigChange} options={[{ value: 'paragraph', label: 'Paragraph' }, { value: 'bullet_points', label: 'Bullet Points' }]} />
                                                        <div className="space-y-2 pt-4 border-t" style={{ borderColor: colors.lightLavender + '80' }}>
                                                            <Label htmlFor="summarizerPrompt" style={{ color: colors.textDark + 'dd' }}>Prompt</Label>
                                                            <Textarea
                                                                id="summarizerPrompt"
                                                                value={config.capabilities.summarizer?.prompt || ''}
                                                                onChange={(e) => handleConfigChange('capabilities.summarizer.prompt', e.target.value)}
                                                                placeholder="Enter custom prompt or use default..."
                                                                className="w-full transition-colors min-h-[100px]"
                                                                style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter><DialogClose asChild><Button type="button" variant="outline" style={{ backgroundColor: colors.lightLavender + '80', borderColor: colors.lightLavender, color: colors.textDark }}>Close</Button></DialogClose></DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </CapabilityCard>
                                </div>
                            </div>

                            <div className="opacity-50 pointer-events-none">
                                <h3 className="text-lg font-medium mb-3 pl-1" style={{ color: colors.textDark }}>Coming Soon</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <CapabilityCard title="Auto Grading" icon={<CheckSquare className="w-5 h-5" />}>
                                        <SwitchConfig label="Enable Autograder" path="capabilities.autograder.enabled" config={config} onChange={handleConfigChange} disabled={true} />
                                        <CardDescription className="text-xs mt-1" style={{ color: colors.textDark + 'aa' }}>Supports closed-form (MCQ, T/F) and open-form questions.</CardDescription>
                                        {config.capabilities.autograder.enabled && (
                                            <div className="mt-4 pt-3 border-t" style={{ borderColor: colors.lightLavender + '80' }}>
                                                <SwitchConfig
                                                    label="Generate Feedback"
                                                    path="capabilities.feedbackGenerator.enabled"
                                                    config={config}
                                                    onChange={handleConfigChange}
                                                    disabled={true}
                                                />
                                            </div>
                                        )}
                                    </CapabilityCard>
                                    <CapabilityCard title="Teacher Assistant" icon={<UserCheck className="w-5 h-5" />}>
                                        <SwitchConfig label="Enable Teacher Asst." path="capabilities.teacherAssistant.enabled" config={config} onChange={handleConfigChange} disabled={true} />
                                    </CapabilityCard>
                                    <CapabilityCard title="Personalized Recommendation" icon={<GraduationCap className="w-5 h-5" />}>
                                        <SwitchConfig label="Enable Recommendations" path="capabilities.personalizedRecommendation.enabled" config={config} onChange={handleConfigChange} disabled={true} />
                                    </CapabilityCard>
                                    <CapabilityCard title="Learning Analytics" icon={<ListChecks className="w-5 h-5" />}>
                                        <SwitchConfig label="Enable Analytics" path="capabilities.learningAnalytics.enabled" config={config} onChange={handleConfigChange} disabled={true} />
                                    </CapabilityCard>
                                </div>
                            </div>
                        </ScrollArea>
                    )}

                    {currentStep === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow border" style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                <CardHeader>
                                    <CardTitle style={{ color: colors.textDark }}>RAG Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <SwitchConfig label="Enable RAG" path="capabilities.rag.enabled" config={config} onChange={handleConfigChange} />
                                    {config.capabilities.rag.enabled && (
                                        <>
                                            <div className="space-y-2">
                                                <Label style={{ color: colors.textDark + 'dd' }}>Alef Knowledge Bases</Label>
                                                <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border p-2" style={{ borderColor: colors.lightLavender }}>
                                                    {mockKnowledgeBases.map(kb => (
                                                        <div key={kb.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`kb-${kb.id}`}
                                                                checked={config.capabilities.rag.knowledgeBaseIds.includes(kb.id)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentIds = config.capabilities.rag.knowledgeBaseIds;
                                                                    const newIds = checked ? [...currentIds, kb.id] : currentIds.filter(id => id !== kb.id);
                                                                    handleConfigChange('capabilities.rag.knowledgeBaseIds', newIds);
                                                                }}
                                                                style={{ '--checkbox-color': colors.primary } as React.CSSProperties}
                                                            />
                                                            <label htmlFor={`kb-${kb.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" style={{ color: colors.textDark }}>
                                                                {kb.name} ({kb.source})
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <SelectConfig label="Retrieval Strategy" path="capabilities.rag.retrievalStrategy" config={config} onChange={handleConfigChange} options={[{ value: 'semantic', label: 'Semantic' }, { value: 'keyword', label: 'Keyword' }]} />
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow border" style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                <CardHeader>
                                    <CardTitle style={{ color: colors.textDark }}>Custom Knowledge Bases</CardTitle>
                                    <CardDescription style={{ color: colors.textDark + 'aa' }}>Connect your own knowledge sources.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between space-x-4 py-1 border-b" style={{ borderColor: colors.lightLavender + '80' }}>
                                        <Label className="text-sm flex-1" style={{ color: colors.textDark + 'dd' }}>Shared Drive</Label>
                                        <Button variant="outline" size="sm" style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender }}>Connect</Button>
                                    </div>
                                    <div className="flex items-center justify-between space-x-4 py-1 border-b" style={{ borderColor: colors.lightLavender + '80' }}>
                                        <Label className="text-sm flex-1" style={{ color: colors.textDark + 'dd' }}>Upload PDFs</Label>
                                        <Button variant="outline" size="sm" style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender }}>Upload</Button>
                                    </div>
                                    <div className="flex items-center justify-between space-x-4 py-1">
                                        <Label className="text-sm flex-1" style={{ color: colors.textDark + 'dd' }}>Website URL</Label>
                                        <Input placeholder="Enter URL..." className="max-w-[150px] h-8" style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender }} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow border" style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                <CardHeader><CardTitle style={{ color: colors.textDark }}>Pedagogical Guardrails</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <SelectConfig label="Teaching Style" path="behavior.pedagogical.style" config={config} onChange={handleConfigChange} options={[{ value: 'direct', label: 'Direct' }, { value: 'socratic', label: 'Socratic' }, { value: 'interactive', label: 'Interactive' }]} />
                                    <InputConfig label="Complexity (e.g., Grade Level)" path="behavior.pedagogical.complexity" type="number" config={config} onChange={handleConfigChange} />
                                    <SelectConfig label="Pacing" path="behavior.pedagogical.pacing" config={config} onChange={handleConfigChange} options={[{ value: 'adaptive', label: 'Adaptive' }, { value: 'fixed', label: 'Fixed' }]} />
                                    <InputConfig label="Feedback Style" path="behavior.pedagogical.feedbackStyle" config={config} onChange={handleConfigChange} placeholder="e.g., encouraging, critical" />
                                </CardContent>
                            </Card>
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow border" style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                <CardHeader><CardTitle style={{ color: colors.textDark }}>Cultural Guardrails</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <InputConfig label="Region" path="behavior.cultural.region" config={config} onChange={handleConfigChange} placeholder="e.g., UAE, Global" />
                                    <SelectConfig label="Language Style" path="behavior.cultural.languageStyle" config={config} onChange={handleConfigChange} options={[{ value: 'formal', label: 'Formal' }, { value: 'casual', label: 'Casual' }]} />
                                    <SelectConfig label="Example Type" path="behavior.cultural.examples" config={config} onChange={handleConfigChange} options={[{ value: 'localized', label: 'Localized' }, { value: 'global', label: 'Global' }]} />
                                </CardContent>
                            </Card>
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow border" style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                                <CardHeader><CardTitle style={{ color: colors.textDark }}>Language Guardrails</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <SelectConfig label="Primary Language" path="behavior.language.primary" config={config} onChange={handleConfigChange} options={[{ value: 'en', label: 'English' }, { value: 'ar', label: 'Arabic' }]} />
                                    <SwitchConfig label="Enable Translation Feature" path="behavior.language.translation" config={config} onChange={handleConfigChange} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <Card className="h-full shadow-md hover:shadow-lg transition-shadow border" style={{ backgroundColor: colors.textLight, borderColor: colors.border }}>
                            <CardHeader><CardTitle style={{ color: colors.textDark }}>Review Configuration & Get Code</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <pre className="p-4 rounded-lg overflow-x-auto max-h-[400px]" style={{ backgroundColor: colors.lightLavender + '40' }}>
                                            <code style={{ color: colors.textDark }}>{generateCode()}</code>
                                        </pre>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7 transition-colors"
                                            style={{ backgroundColor: colors.lightLavender + '80', borderColor: colors.lightLavender, color: colors.purple }}
                                            onClick={() => { navigator.clipboard.writeText(generateCode()); toast({ title: "Code Copied!" }); }}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-medium" style={{ color: colors.textDark }}>Integration Steps:</h3>
                                        <ol className="list-decimal list-inside space-y-1 text-sm" style={{ color: colors.textDark + 'aa' }}>
                                            <li>Install the AI Platform package: `npm install @alef/ai-platform`</li>
                                            <li>Import the `ContentAIWidget` component in your application.</li>
                                            <li>Copy the configuration object generated above.</li>
                                            <li>Pass the configuration object to the `config` prop of the widget.</li>
                                            <li>Optionally, provide a theme name via the `theme` prop.</li>
                                        </ol>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="flex justify-between items-center pt-6 mt-6 border-t" style={{ borderColor: colors.lightLavender }}>
                    <Button
                        variant="outline"
                        onClick={handlePreviousStep}
                        disabled={currentStep === 1}
                        className="w-[100px] transition-colors disabled:opacity-50"
                        style={{
                            backgroundColor: colors.lightLavender + '80',
                            borderColor: colors.lightLavender,
                            color: colors.textDark
                        }}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    {currentStep < STEPS.length ? (
                        <Button
                            onClick={handleNextStep}
                            className="w-[100px] text-white shadow-lg hover:shadow-xl transition-all"
                            style={{ backgroundColor: colors.primary, '--hover-bg': colors.primary + 'dd' } as React.CSSProperties}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = e.currentTarget.style.getPropertyValue('--hover-bg')}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSaveConfig}
                            className="w-[140px] text-white shadow-lg hover:shadow-xl transition-all"
                            style={{ backgroundColor: colors.purple, '--hover-bg': colors.purple + 'dd' } as React.CSSProperties}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = e.currentTarget.style.getPropertyValue('--hover-bg')}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.purple}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Experience
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

interface CapabilityCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}
const CapabilityCard: React.FC<CapabilityCardProps> = ({ title, icon, children }) => (
    <Card className="h-full shadow-md hover:shadow-lg transition-all border" style={{ background: `linear-gradient(to bottom right, ${colors.textLight}, ${colors.lightLavender + '40'})`, borderColor: colors.border }}>
        <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ color: colors.textDark }}>
                <span style={{ color: colors.primary }}>{icon}</span> {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {children}
        </CardContent>
    </Card>
);

interface ConfigControlProps {
    label: string;
    path: string; // e.g., 'capabilities.chat.enabled'
    config: AIExperienceConfig;
    onChange: (path: string, value: any) => void;
}

interface SwitchConfigProps extends ConfigControlProps {
    disabled?: boolean;
}
const SwitchConfig: React.FC<SwitchConfigProps> = ({ label, path, config, onChange, disabled = false }) => {
    const value = path.split('.').reduce((o, k) => o?.[k], config) ?? false;
    return (
        <div className={`flex items-center justify-between space-x-4 py-1 group ${disabled ? 'opacity-70' : ''}`}>
            <Label htmlFor={path} className={`text-sm flex-1 transition-colors ${disabled ? 'cursor-not-allowed' : ''}`} style={{ color: colors.textDark + 'dd', '--hover-color': colors.textDark } as React.CSSProperties}
                onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.color = e.currentTarget.style.getPropertyValue('--hover-color'); }}
                onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.color = colors.textDark + 'dd'; }}
            >{label}</Label>
            <Switch
                id={path}
                checked={Boolean(value)}
                onCheckedChange={(checked) => onChange(path, checked)}
                style={{
                    '--switch-bg-checked': colors.primary,
                    '--switch-bg-unchecked': colors.lightLavender
                } as React.CSSProperties}
                disabled={disabled}
            />
        </div>
    );
};

interface SelectConfigProps extends ConfigControlProps {
    options: { value: string; label: string }[];
    placeholder?: string;
}
const SelectConfig: React.FC<SelectConfigProps> = ({ label, path, config, onChange, options, placeholder }) => {
    const value = path.split('.').reduce((o, k) => o?.[k], config);
    return (
        <div className="space-y-2 group">
            <Label htmlFor={path} className="text-sm transition-colors" style={{ color: colors.textDark + 'dd', '--hover-color': colors.textDark } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = e.currentTarget.style.getPropertyValue('--hover-color')}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.textDark + 'dd'}
            >{label}</Label>
            <Select value={value as string | undefined} onValueChange={(val) => onChange(path, val)}>
                <SelectTrigger
                    id={path}
                    className="w-full transition-colors"
                    style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}
                >
                    <SelectValue placeholder={placeholder || `Select ${label}...`} />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: colors.textLight, borderColor: colors.lightLavender }}>
                    {options.map(opt => (
                        <SelectItem key={opt.value} value={opt.value} style={{ color: colors.textDark }}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

interface InputConfigProps extends ConfigControlProps {
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
}
const InputConfig: React.FC<InputConfigProps> = ({ label, path, config, onChange, placeholder, type = 'text' }) => {
    const value = path.split('.').reduce((o, k) => o?.[k], config) ?? '';
    return (
        <div className="space-y-2 group">
            <Label htmlFor={path} className="text-sm transition-colors" style={{ color: colors.textDark + 'dd', '--hover-color': colors.textDark } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.color = e.currentTarget.style.getPropertyValue('--hover-color')}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.textDark + 'dd'}
            >{label}</Label>
            <Input
                id={path}
                type={type}
                value={value}
                onChange={(e) => onChange(path, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                placeholder={placeholder}
                className="w-full transition-colors"
                style={{ backgroundColor: colors.lightLavender + '40', borderColor: colors.lightLavender, color: colors.textDark }}
            />
        </div>
    );
};

export default ExperienceBuilder; 