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
import { cn } from "@/lib/utils";

// --- Removed Color Palette ---

// --- Removed Helper Function to get Icon ---

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
        aiTutor: baseDefaultAIConfig.capabilities.aiTutor || { enabled: false, persona: 'mentor', proactiveEngagement: false, isSpecialized: false, specializedSubject: null },
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

// Helper function to safely get nested values
const getNestedValue = (obj: any, path: string, defaultValue: any = undefined) => {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : defaultValue), obj);
};

const ExperienceBuilder: React.FC<ExperienceBuilderProps> = ({ onExperienceSaved }) => {
    const [config, setConfig] = useState<AIExperienceConfig>(defaultAIConfig);
    const [currentStep, setCurrentStep] = useState(1);
    const [configName, setConfigName] = useState(config.configName || 'New Experience');
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
                // Ensure intermediate objects exist
                if (ref[keys[i]] === undefined || ref[keys[i]] === null || typeof ref[keys[i]] !== 'object') {
                     ref[keys[i]] = {};
                 }
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
            action: <CheckCircle className="h-5 w-5 text-foreground" />,
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

    // --- Refactored Stepper Component (Inline for simplicity) ---
    const Stepper = () => (
        <ol className="flex items-center w-full text-sm font-medium text-center text-muted-foreground pb-2 flex-wrap">
            {STEPS.map((step, index) => (
                <li
                    key={step.id}
                    className={cn(
                        "flex items-center mb-2",
                        step.id < STEPS.length ? "sm:after:content-[''] sm:after:w-full sm:after:h-px sm:after:bg-border sm:after:mx-4 flex-1" : ""
                    )}
                >
                    <span
                        className={cn(
                            "flex items-center transition-colors",
                            step.id < currentStep ? "cursor-pointer text-foreground hover:text-foreground/80" : "",
                            step.id === currentStep ? "text-foreground" : ""
                        )}
                        onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    >
                        {step.id < currentStep ? (
                            <CheckCircle className="w-5 h-5 mr-2 shrink-0 text-foreground" />
                        ) : (
                            <span
                                className={cn(
                                    "w-6 h-6 flex items-center justify-center rounded-full mr-2 shrink-0 border-2",
                                    step.id === currentStep ? "border-foreground bg-accent text-accent-foreground" : "border-border"
                                )}
                            >
                                {step.id}
                            </span>
                        )}
                        <span className="md:inline font-medium ml-1">{step.name}</span>
                    </span>
                </li>
            ))}
        </ol>
    );

    return (
        <Card className="w-full h-full min-h-screen shadow-lg border-none bg-background">
            <CardHeader className="border-b sticky top-0 z-10 backdrop-blur bg-background/80">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <Stepper />
                        {/* Title and Description */}
                        <div className="mt-1">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{currentStepInfo?.name}</h2>
                            <p className="text-sm text-muted-foreground">{currentStepInfo?.description}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="min-h-[600px] space-y-6">
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 gap-6 h-full">
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>Contextual Information</CardTitle>
                                    <CardDescription>Describe the AI experience and its intended audience.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="productLine">Product Line</Label>
                                                <Select value={config.productLine} onValueChange={(val) => handleConfigChange('productLine', val)}>
                                                    <SelectTrigger id="productLine" className="w-full">
                                                        <SelectValue placeholder="Select Product Line..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[
                                                            { value: 'core', label: 'Core Platform' },
                                                            { value: 'pathways', label: 'Pathways' },
                                                            { value: 'assessments', label: 'Assessments' },
                                                            { value: 'abjadiyat', label: 'Abjadiyat' },
                                                            { value: 'miqiyas', label: 'Miqiyas AL Dhad' },
                                                            { value: 'senegal_adhoc', label: 'Senegal Adhoc' }
                                                        ].map(opt => (
                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="productName">Product Name</Label>
                                                <Input
                                                    id="productName"
                                                    value={config.productName}
                                                    onChange={(e) => handleConfigChange('productName', e.target.value)}
                                                    placeholder="Enter Product Name..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <Label htmlFor="integrationContext">Details</Label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleGenerateIntegrationContext}
                                                    className="text-foreground hover:text-foreground/80 text-xs h-auto px-2 py-1"
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
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="targetUser">Target User</Label>
                                            <Input
                                                id="targetUser"
                                                value={config.targetUser}
                                                onChange={(e) => handleConfigChange('targetUser', e.target.value)}
                                                placeholder="e.g., Grade 5 students, Teachers preparing lessons, Parents checking progress..."
                                                className="w-full transition-colors"
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
                                <Card className="h-full shadow-md hover:shadow-lg transition-all">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <span className="text-foreground"><MessageSquare className="w-5 h-5" /></span> AI Tutor
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between space-x-4 py-1">
                                            <Label htmlFor="capabilities.aiTutor.enabled" className="text-sm flex-1">Enable AI Tutor</Label>
                                            <Switch
                                                id="capabilities.aiTutor.enabled"
                                                checked={getNestedValue(config, 'capabilities.aiTutor.enabled', false)}
                                                onCheckedChange={(checked) => handleConfigChange('capabilities.aiTutor.enabled', checked)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground pt-1">Provides interactive guidance and answers student questions.</p>
                                        {getNestedValue(config, 'capabilities.aiTutor.enabled') && (
                                            <Dialog open={dialogOpenState['aiTutor'] ?? false} onOpenChange={(open) => handleDialogOpenChange('aiTutor', open)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full mt-2">
                                                        Configure
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>AI Tutor Configuration</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="capabilities.aiTutor.persona">Tutor Persona</Label>
                                                            <Select value={getNestedValue(config, 'capabilities.aiTutor.persona')} onValueChange={(val) => handleConfigChange('capabilities.aiTutor.persona', val)}>
                                                                <SelectTrigger id="capabilities.aiTutor.persona" className="w-full">
                                                                    <SelectValue placeholder="Select Persona..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {[
                                                                        { value: 'mentor', label: 'Mentor' },
                                                                        { value: 'teacher', label: 'Teacher' },
                                                                        { value: 'peer', label: 'Peer' },
                                                                        { value: 'smart', label: 'Smart (dynamic)' }
                                                                    ].map(opt => (
                                                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="flex items-center justify-between space-x-4 py-1">
                                                            <Label htmlFor="capabilities.aiTutor.proactiveEngagement" className="text-sm flex-1">Proactive Engagement</Label>
                                                            <Switch
                                                                id="capabilities.aiTutor.proactiveEngagement"
                                                                checked={getNestedValue(config, 'capabilities.aiTutor.proactiveEngagement', false)}
                                                                onCheckedChange={(checked) => handleConfigChange('capabilities.aiTutor.proactiveEngagement', checked)}
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between space-x-4 py-1">
                                                            <Label htmlFor="capabilities.aiTutor.isSpecialized" className="text-sm flex-1">Specialized Tutor</Label>
                                                            <Switch
                                                                id="capabilities.aiTutor.isSpecialized"
                                                                checked={getNestedValue(config, 'capabilities.aiTutor.isSpecialized', false)}
                                                                onCheckedChange={(checked) => {
                                                                    handleConfigChange('capabilities.aiTutor.isSpecialized', checked);
                                                                    if (!checked) {
                                                                        handleConfigChange('capabilities.aiTutor.specializedSubject', null);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        {getNestedValue(config, 'capabilities.aiTutor.isSpecialized') && (
                                                            <div className="space-y-2 pt-2 pl-4 border-l-2">
                                                                <Label htmlFor="capabilities.aiTutor.specializedSubject">Subject</Label>
                                                                <Select value={getNestedValue(config, 'capabilities.aiTutor.specializedSubject')} onValueChange={(val) => handleConfigChange('capabilities.aiTutor.specializedSubject', val)}>
                                                                    <SelectTrigger id="capabilities.aiTutor.specializedSubject" className="w-full">
                                                                        <SelectValue placeholder="Select Subject..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {[
                                                                            { value: 'math_en', label: 'Math (English)' },
                                                                            { value: 'math_ar', label: 'Math (Arabic)' },
                                                                            { value: 'en', label: 'English' },
                                                                            { value: 'sci', label: 'Science' },
                                                                            { value: 'ar', label: 'Arabic' },
                                                                        ].map(opt => (
                                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        )}
                                                        <div className="space-y-2 pt-4 border-t">
                                                            <Label htmlFor="aiTutorPrompt">What is my Role?</Label>
                                                            <Textarea
                                                                id="aiTutorPrompt"
                                                                value={getNestedValue(config, 'capabilities.aiTutor.prompt', '')}
                                                                onChange={(e) => handleConfigChange('capabilities.aiTutor.prompt', e.target.value)}
                                                                placeholder="Give a detailed explanation of the AI Tutor's role and what is it supposed to help the user with! e.g: help students undertand specific concept or questiions they are struggeling with."
                                                                className="w-full transition-colors min-h-[100px]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </CardContent>
                                </Card>
                                <Card className="h-full shadow-md hover:shadow-lg transition-all">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <span className="text-foreground"><FileQuestion className="w-5 h-5" /></span> Question Generator
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between space-x-4 py-1">
                                            <Label htmlFor="capabilities.questionGenerator.enabled" className="text-sm flex-1">Enable Question Gen.</Label>
                                            <Switch
                                                id="capabilities.questionGenerator.enabled"
                                                checked={getNestedValue(config, 'capabilities.questionGenerator.enabled', false)}
                                                onCheckedChange={(checked) => handleConfigChange('capabilities.questionGenerator.enabled', checked)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground pt-1">Automatically creates questions based on the content context.</p>
                                        {getNestedValue(config, 'capabilities.questionGenerator.enabled') && (
                                            <Dialog open={dialogOpenState['questionGenerator'] ?? false} onOpenChange={(open) => handleDialogOpenChange('questionGenerator', open)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full mt-2">Configure</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader><DialogTitle>Question Generator Configuration</DialogTitle></DialogHeader>
                                                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                        <div className="text-sm text-muted-foreground italic">No specific options currently available.</div>
                                                        <div className="space-y-2 pt-4 border-t">
                                                            <Label htmlFor="qgPrompt">Prompt</Label>
                                                            <Textarea
                                                                id="qgPrompt"
                                                                value={getNestedValue(config, 'capabilities.questionGenerator.prompt', '')}
                                                                onChange={(e) => handleConfigChange('capabilities.questionGenerator.prompt', e.target.value)}
                                                                placeholder="Enter custom prompt or use default..."
                                                                className="w-full transition-colors min-h-[100px]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-3 pl-1">Helpers</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <Card className="h-full shadow-md hover:shadow-lg transition-all">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                <span className="text-foreground"><Sparkles className="w-5 h-5" /></span> Simplification
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between space-x-4 py-1">
                                                <Label htmlFor="capabilities.simplifier.enabled" className="text-sm flex-1">Enable Simplifier</Label>
                                                <Switch
                                                    id="capabilities.simplifier.enabled"
                                                    checked={getNestedValue(config, 'capabilities.simplifier.enabled', false)}
                                                    onCheckedChange={(checked) => handleConfigChange('capabilities.simplifier.enabled', checked)}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground pt-1">Rewrites text to be easier to understand (e.g., for different grade levels).</p>
                                            {getNestedValue(config, 'capabilities.simplifier.enabled') && (
                                                <Dialog open={dialogOpenState['simplifier'] ?? false} onOpenChange={(open) => handleDialogOpenChange('simplifier', open)}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="w-full mt-2">Configure</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Simplification Configuration</DialogTitle></DialogHeader>
                                                        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                            <div className="space-y-2 pt-4 border-t">
                                                                <Label htmlFor="simplifierPrompt">What's my Role</Label>
                                                                <Textarea
                                                                    id="simplifierPrompt"
                                                                    value={getNestedValue(config, 'capabilities.simplifier.prompt', '')}
                                                                    onChange={(e) => handleConfigChange('capabilities.simplifier.prompt', e.target.value)}
                                                                    placeholder="Tell me in details how do you want me to simplify the text in question"
                                                                    className="w-full transition-colors min-h-[100px]"
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="h-full shadow-md hover:shadow-lg transition-all">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-foreground flex items-center gap-2">
                                                <span className="text-foreground"><Languages className="w-5 h-5" /></span> Translate
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between space-x-4 py-1">
                                                <Label htmlFor="capabilities.translator.enabled" className="text-sm flex-1">Enable Translator</Label>
                                                <Switch
                                                    id="capabilities.translator.enabled"
                                                    checked={getNestedValue(config, 'capabilities.translator.enabled', false)}
                                                    onCheckedChange={(checked) => handleConfigChange('capabilities.translator.enabled', checked)}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground pt-1">Translates content between supported languages.</p>
                                            {getNestedValue(config, 'capabilities.translator.enabled') && (
                                                <Dialog open={dialogOpenState['translator'] ?? false} onOpenChange={(open) => handleDialogOpenChange('translator', open)}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="w-full mt-2">Configure</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Translate Configuration</DialogTitle></DialogHeader>
                                                        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="capabilities.translator.targetLanguages">Target Language</Label>
                                                                <Select value={getNestedValue(config, 'capabilities.translator.targetLanguages.0')} onValueChange={(val) => handleConfigChange('capabilities.translator.targetLanguages', [val])}>
                                                                    <SelectTrigger id="capabilities.translator.targetLanguages" className="w-full">
                                                                        <SelectValue placeholder="Select Language..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {[{ value: 'ar', label: 'Arabic' }, { value: 'en', label: 'English' }].map(opt => (
                                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2 pt-4 border-t">
                                                                <Label htmlFor="translatorPrompt">Prompt</Label>
                                                                <Textarea
                                                                    id="translatorPrompt"
                                                                    value={getNestedValue(config, 'capabilities.translator.prompt', '')}
                                                                    onChange={(e) => handleConfigChange('capabilities.translator.prompt', e.target.value)}
                                                                    placeholder="Enter custom prompt or use default..."
                                                                    className="w-full transition-colors min-h-[100px]"
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="h-full shadow-md hover:shadow-lg transition-all">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-foreground flex items-center gap-2">
                                                <span className="text-foreground"><WrapText className="w-5 h-5" /></span> Summarization
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between space-x-4 py-1">
                                                <Label htmlFor="capabilities.summarizer.enabled" className="text-sm flex-1">Enable Summarizer</Label>
                                                <Switch
                                                    id="capabilities.summarizer.enabled"
                                                    checked={getNestedValue(config, 'capabilities.summarizer.enabled', false)}
                                                    onCheckedChange={(checked) => handleConfigChange('capabilities.summarizer.enabled', checked)}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground pt-1">Creates concise summaries of the provided content.</p>
                                            {getNestedValue(config, 'capabilities.summarizer.enabled') && (
                                                <Dialog open={dialogOpenState['summarizer'] ?? false} onOpenChange={(open) => handleDialogOpenChange('summarizer', open)}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="w-full mt-2">Configure</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Summarization Configuration</DialogTitle></DialogHeader>
                                                        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="capabilities.summarizer.format">Format</Label>
                                                                <Select value={getNestedValue(config, 'capabilities.summarizer.format')} onValueChange={(val) => handleConfigChange('capabilities.summarizer.format', val)}>
                                                                    <SelectTrigger id="capabilities.summarizer.format" className="w-full">
                                                                        <SelectValue placeholder="Select Format..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {[{ value: 'paragraph', label: 'Paragraph' }, { value: 'bullet_points', label: 'Bullet Points' }].map(opt => (
                                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2 pt-4 border-t">
                                                                <Label htmlFor="summarizerPrompt">Prompt</Label>
                                                                <Textarea
                                                                    id="summarizerPrompt"
                                                                    value={getNestedValue(config, 'capabilities.summarizer.prompt', '')}
                                                                    onChange={(e) => handleConfigChange('capabilities.summarizer.prompt', e.target.value)}
                                                                    placeholder="Enter custom prompt or use default..."
                                                                    className="w-full transition-colors min-h-[100px]"
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <div className="opacity-50 pointer-events-none">
                                <h3 className="text-lg font-medium mb-3 pl-1">Coming Soon</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <Card className="h-full shadow-md">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-foreground flex items-center gap-2">
                                                <span className="text-foreground"><CheckSquare className="w-5 h-5" /></span> Auto Grading
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between space-x-4 py-1">
                                                <Label htmlFor="capabilities.autograder.enabled" className="text-sm flex-1 cursor-not-allowed">Enable Autograder</Label>
                                                <Switch
                                                    id="capabilities.autograder.enabled"
                                                    checked={getNestedValue(config, 'capabilities.autograder.enabled', false)}
                                                    disabled={true}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground pt-1">Automatically grades student responses (MCQ, T/F, open-form).</p>
                                            {getNestedValue(config, 'capabilities.autograder.enabled') && (
                                                <div className="mt-4 pt-3 border-t">
                                                    <div className="flex items-center justify-between space-x-4 py-1">
                                                        <Label htmlFor="capabilities.feedbackGenerator.enabled" className="text-sm flex-1 cursor-not-allowed">Generate Feedback</Label>
                                                        <Switch
                                                            id="capabilities.feedbackGenerator.enabled"
                                                            checked={getNestedValue(config, 'capabilities.feedbackGenerator.enabled', false)}
                                                            disabled={true}
                                                         />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground pt-1">Helps teachers with tasks like lesson planning or finding resources.</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className="h-full shadow-md">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-foreground flex items-center gap-2">
                                                <span className="text-foreground"><UserCheck className="w-5 h-5" /></span> Teacher Assistant
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between space-x-4 py-1">
                                                <Label htmlFor="capabilities.teacherAssistant.enabled" className="text-sm flex-1 cursor-not-allowed">Enable Teacher Asst.</Label>
                                                <Switch
                                                    id="capabilities.teacherAssistant.enabled"
                                                    checked={getNestedValue(config, 'capabilities.teacherAssistant.enabled', false)}
                                                    disabled={true}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground pt-1">Suggests relevant content or activities based on user interaction.</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="h-full shadow-md">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-foreground flex items-center gap-2">
                                                <span className="text-foreground"><GraduationCap className="w-5 h-5" /></span> Personalized Recommendation
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between space-x-4 py-1">
                                                <Label htmlFor="capabilities.personalizedRecommendation.enabled" className="text-sm flex-1 cursor-not-allowed">Enable Recommendations</Label>
                                                <Switch
                                                    id="capabilities.personalizedRecommendation.enabled"
                                                    checked={getNestedValue(config, 'capabilities.personalizedRecommendation.enabled', false)}
                                                    disabled={true}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground pt-1">Suggests relevant content or activities based on user interaction.</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="h-full shadow-md">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-foreground flex items-center gap-2">
                                                <span className="text-foreground"><ListChecks className="w-5 h-5" /></span> Learning Analytics
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between space-x-4 py-1">
                                                <Label htmlFor="capabilities.learningAnalytics.enabled" className="text-sm flex-1 cursor-not-allowed">Enable Analytics</Label>
                                                <Switch
                                                    id="capabilities.learningAnalytics.enabled"
                                                    checked={getNestedValue(config, 'capabilities.learningAnalytics.enabled', false)}
                                                    disabled={true}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground pt-1">Tracks and reports on student progress and interaction patterns.</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </ScrollArea>
                    )}

                    {currentStep === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>RAG Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between space-x-4 py-1">
                                        <Label htmlFor="capabilities.rag.enabled" className="text-sm flex-1">Enable RAG</Label>
                                        <Switch
                                            id="capabilities.rag.enabled"
                                            checked={getNestedValue(config, 'capabilities.rag.enabled', false)}
                                            onCheckedChange={(checked) => handleConfigChange('capabilities.rag.enabled', checked)}
                                        />
                                    </div>
                                    {getNestedValue(config, 'capabilities.rag.enabled') && (
                                        <>
                                            <div className="space-y-2">
                                                <Label>Alef Knowledge Bases</Label>
                                                <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border p-2">
                                                    {mockKnowledgeBases.map(kb => (
                                                        <div key={kb.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`kb-${kb.id}`}
                                                                checked={getNestedValue(config, 'capabilities.rag.knowledgeBaseIds', []).includes(kb.id)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentIds = getNestedValue(config, 'capabilities.rag.knowledgeBaseIds', []);
                                                                    const newIds = checked ? [...currentIds, kb.id] : currentIds.filter((id: string) => id !== kb.id);
                                                                    handleConfigChange('capabilities.rag.knowledgeBaseIds', newIds);
                                                                }}
                                                            />
                                                            <label htmlFor={`kb-${kb.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                {kb.name} ({kb.source})
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="capabilities.rag.retrievalStrategy">Retrieval Strategy</Label>
                                                <Select value={getNestedValue(config, 'capabilities.rag.retrievalStrategy')} onValueChange={(val) => handleConfigChange('capabilities.rag.retrievalStrategy', val)}>
                                                    <SelectTrigger id="capabilities.rag.retrievalStrategy" className="w-full">
                                                        <SelectValue placeholder="Select Strategy..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[{ value: 'semantic', label: 'Semantic' }, { value: 'keyword', label: 'Keyword' }].map(opt => (
                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle>Custom Knowledge Bases</CardTitle>
                                    <CardDescription>Connect your own knowledge sources.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between space-x-4 py-1 border-b">
                                        <Label className="text-sm flex-1 text-muted-foreground">Shared Drive</Label>
                                        <Button variant="outline" size="sm">Connect</Button>
                                    </div>
                                    <div className="flex items-center justify-between space-x-4 py-1 border-b">
                                        <Label className="text-sm flex-1 text-muted-foreground">Upload PDFs</Label>
                                        <Button variant="outline" size="sm">Upload</Button>
                                    </div>
                                    <div className="flex items-center justify-between space-x-4 py-1">
                                        <Label className="text-sm flex-1 text-muted-foreground">Website URL</Label>
                                        <Input placeholder="Enter URL..." className="max-w-[150px] h-8" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader><CardTitle>Pedagogical Guardrails</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="behavior.pedagogical.style">Teaching Style</Label>
                                        <Select value={getNestedValue(config, 'behavior.pedagogical.style')} onValueChange={(val) => handleConfigChange('behavior.pedagogical.style', val)}>
                                            <SelectTrigger id="behavior.pedagogical.style" className="w-full">
                                                <SelectValue placeholder="Select Style..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[{ value: 'direct', label: 'Direct' }, { value: 'socratic', label: 'Socratic' }, { value: 'interactive', label: 'Interactive' }].map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="behavior.pedagogical.complexity">Complexity (e.g., Grade Level)</Label>
                                        <Input
                                            id="behavior.pedagogical.complexity"
                                            type="number"
                                            value={getNestedValue(config, 'behavior.pedagogical.complexity', '')}
                                            onChange={(e) => handleConfigChange('behavior.pedagogical.complexity', parseFloat(e.target.value) || 0)}
                                            placeholder="e.g., 5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="behavior.pedagogical.pacing">Pacing</Label>
                                        <Select value={getNestedValue(config, 'behavior.pedagogical.pacing')} onValueChange={(val) => handleConfigChange('behavior.pedagogical.pacing', val)}>
                                            <SelectTrigger id="behavior.pedagogical.pacing" className="w-full">
                                                <SelectValue placeholder="Select Pacing..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[{ value: 'adaptive', label: 'Adaptive' }, { value: 'fixed', label: 'Fixed' }].map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="behavior.pedagogical.feedbackStyle">Feedback Style</Label>
                                        <Input
                                            id="behavior.pedagogical.feedbackStyle"
                                            value={getNestedValue(config, 'behavior.pedagogical.feedbackStyle', '')}
                                            onChange={(e) => handleConfigChange('behavior.pedagogical.feedbackStyle', e.target.value)}
                                            placeholder="e.g., encouraging, critical"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader><CardTitle>Cultural Guardrails</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="behavior.cultural.region">Region</Label>
                                        <Input
                                            id="behavior.cultural.region"
                                            value={getNestedValue(config, 'behavior.cultural.region', '')}
                                            onChange={(e) => handleConfigChange('behavior.cultural.region', e.target.value)}
                                            placeholder="e.g., UAE, Global"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="behavior.cultural.languageStyle">Language Style</Label>
                                        <Select value={getNestedValue(config, 'behavior.cultural.languageStyle')} onValueChange={(val) => handleConfigChange('behavior.cultural.languageStyle', val)}>
                                            <SelectTrigger id="behavior.cultural.languageStyle" className="w-full">
                                                <SelectValue placeholder="Select Style..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[{ value: 'formal', label: 'Formal' }, { value: 'casual', label: 'Casual' }].map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="behavior.cultural.examples">Example Type</Label>
                                        <Select value={getNestedValue(config, 'behavior.cultural.examples')} onValueChange={(val) => handleConfigChange('behavior.cultural.examples', val)}>
                                            <SelectTrigger id="behavior.cultural.examples" className="w-full">
                                                <SelectValue placeholder="Select Type..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[{ value: 'localized', label: 'Localized' }, { value: 'global', label: 'Global' }].map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader><CardTitle>Language Guardrails</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="behavior.language.primary">Primary Language</Label>
                                        <Select value={getNestedValue(config, 'behavior.language.primary')} onValueChange={(val) => handleConfigChange('behavior.language.primary', val)}>
                                            <SelectTrigger id="behavior.language.primary" className="w-full">
                                                <SelectValue placeholder="Select Language..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[{ value: 'en', label: 'English' }, { value: 'ar', label: 'Arabic' }].map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between space-x-4 py-1">
                                        <Label htmlFor="behavior.language.translation" className="text-sm flex-1">Enable Translation Feature</Label>
                                        <Switch
                                            id="behavior.language.translation"
                                            checked={getNestedValue(config, 'behavior.language.translation', false)}
                                            onCheckedChange={(checked) => handleConfigChange('behavior.language.translation', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader><CardTitle>Review Configuration & Get Code</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <pre className="p-4 rounded-lg overflow-x-auto max-h-[400px] bg-muted">
                                            <code className="text-muted-foreground">{generateCode()}</code>
                                        </pre>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7"
                                            onClick={() => { navigator.clipboard.writeText(generateCode()); toast({ title: "Code Copied!" }); }}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-medium">Integration Steps:</h3>
                                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
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

                <div className="flex justify-between items-center pt-6 mt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={handlePreviousStep}
                        disabled={currentStep === 1}
                        className="w-[100px]"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    {currentStep < STEPS.length ? (
                        <Button
                            onClick={handleNextStep}
                            className="w-[100px]"
                        >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSaveConfig}
                            className="w-[140px] bg-foreground hover:bg-foreground/80 text-background"
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

export default ExperienceBuilder; 