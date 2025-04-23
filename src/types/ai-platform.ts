// Content Types
export type ContentType = 'video' | 'book' | 'assessment';
export type ContentSource = 'CCL' | 'external';
export type TeachingStyle = 'direct' | 'socratic' | 'interactive';
export type LanguageStyle = 'formal' | 'casual';
export type ExampleType = 'localized' | 'global';

// Chat Configuration
export interface ChatConfig {
    enabled: boolean;
    mode: 'contextual' | 'pageAware';
    features: string[];
    prompt?: string;
}

// Voice Configuration
export interface VoiceConfig {
    enabled: boolean;
    languages: string[];
    accent?: string;
    speechRecognition: boolean;
    textToSpeech: boolean;
}

// Context Configuration
export interface ContextConfig {
    enabled: boolean;
    types?: string[];
}

// Navigation Configuration
export interface NavConfig {
    enabled: boolean;
    features: string[];
}

// Pedagogical Configuration
export interface PedagogicalConfig {
    style: TeachingStyle;
    complexity: number;
    pacing: 'adaptive' | 'fixed';
    feedbackStyle: string;
}

// Cultural Configuration
export interface CulturalConfig {
    region: string;
    languageStyle: LanguageStyle;
    examples: ExampleType;
}

// Language Configuration
export interface LanguageConfig {
    primary: string;
    supported: string[];
    translation: boolean;
}

// Helper Capabilities Configuration
export interface SummarizerConfig {
    enabled: boolean;
    minLength?: number;
    maxLength?: number;
    format?: 'paragraph' | 'bullet_points';
    prompt?: string;
}

export interface TranslatorConfig {
    enabled: boolean;
    targetLanguages: string[]; // e.g., ['ar']
    prompt?: string;
}

export interface SimplifierConfig {
    enabled: boolean;
    targetGradeLevel?: number;
    prompt?: string;
}

export interface ScaffolderConfig {
    enabled: boolean;
    hintLevel?: 'low' | 'medium' | 'high';
}

// New Capability Interfaces from Diagram
export interface AutograderConfig {
    enabled: boolean;
    rubricId?: string; // Link to CCL Rubric
    feedbackLevel?: 'basic' | 'detailed';
    prompt?: string;
}

export interface FeedbackGeneratorConfig {
    enabled: boolean;
    focusAreas?: string[]; // e.g., ['clarity', 'grammar']
    prompt?: string;
}

export interface QuestionGeneratorConfig {
    enabled: boolean;
    questionTypes?: ('mcq' | 'short_answer' | 'true_false')[];
    difficulty?: 'easy' | 'medium' | 'hard';
    prompt?: string;
}

export interface TeacherAssistantConfig {
    enabled: boolean;
    tasks?: ('lesson_plan' | 'grading_suggestions' | 'resource_finding')[];
    prompt?: string;
}

// RAG Configuration
export interface RagConfig {
    enabled: boolean;
    knowledgeBaseIds: string[]; // Link to CCL or Custom Data
    retrievalStrategy?: 'semantic' | 'keyword';
    prompt?: string;
}

// AI Tutor Configuration (could be part of chat or separate)
export interface AITutorConfig {
    enabled: boolean;
    persona?: 'guide' | 'mentor' | 'expert';
    proactiveEngagement?: boolean;
    prompt?: string;
}

// NEW: Personalized Recommendation Config
export interface PersonalizedRecommendationConfig {
    enabled: boolean;
    prompt?: string;
}

// NEW: Learning Analytics Config
export interface LearningAnalyticsConfig {
    enabled: boolean;
}

// Main Configuration Interface
export interface AIExperienceConfig {
    // Metadata for the configuration itself
    configId?: string; // Optional ID for saved configurations
    configName?: string; // Optional name for saved configurations
    productLine?: string;
    productName?: string;
    integrationContext?: string;
    targetUser?: string;

    content: {
        type: ContentType;
        id: string; // Could be a CCL ID or external identifier
        source: ContentSource;
    };
    capabilities: {
        // Core Interactive (Removing Voice, Contextual, Navigation for now based on user request)
        chat: ChatConfig; // Keeping chat for structure, but AI Tutor UI takes precedence
        // voice: VoiceConfig; 
        // contextual: ContextConfig;
        // navigation: NavConfig;

        // Reordered/Regrouped
        aiTutor: AITutorConfig; // Now the primary interaction capability listed
        questionGenerator: QuestionGeneratorConfig;

        // Helpers
        simplifier: SimplifierConfig;
        translator: TranslatorConfig;
        summarizer: SummarizerConfig;
        // scaffolder: ScaffolderConfig; // Removed based on user request

        // Advanced / Assessment
        autograder: AutograderConfig;
        feedbackGenerator: FeedbackGeneratorConfig; // Keep type, UI moves into Autograder
        teacherAssistant: TeacherAssistantConfig;
        personalizedRecommendation: PersonalizedRecommendationConfig; // Added
        learningAnalytics: LearningAnalyticsConfig; // Added

        // RAG - Keep structure, UI is in Step 3
        rag: RagConfig;

    };
    behavior: { // These are the Guide Rails
        pedagogical: PedagogicalConfig;
        cultural: CulturalConfig;
        language: LanguageConfig;
        // Could add MOE/Gov specific guide rails here later
    };
}

// Analytics Interfaces
export interface InteractionAnalytics {
    type: string;
    timestamp: number;
    duration: number;
    userSatisfaction?: number;
}

export interface PerformanceAnalytics {
    responseTime: number;
    processingTime: number;
    errorRate: number;
}

export interface UsageAnalytics {
    activeUsers: number;
    totalInteractions: number;
    popularFeatures: string[];
}

export interface ContentAnalytics {
    interactions: InteractionAnalytics[];
    performance: PerformanceAnalytics;
    usage: UsageAnalytics;
}

export interface TechnicalIssue {
    type: string;
    frequency: number;
    impact: string;
}

export interface QualityMetrics {
    accuracy: number;
    relevance: number;
    userSatisfaction: number;
    technicalIssues: TechnicalIssue[];
}

// Mock Data
export const defaultAIConfig: AIExperienceConfig = {
    configId: 'default-config',
    configName: 'Default Video Experience',
    content: {
        type: 'video',
        id: 'ccl-video-123',
        source: 'CCL'
    },
    capabilities: {
        // Core Interactive
        chat: {
            enabled: true,
            mode: 'contextual',
            features: ['questionAnswering', 'conceptExplanation'],
            prompt: 'This is a default prompt for the chat configuration'
        },
        // voice: {
        //     enabled: true,
        //     languages: ['en', 'ar'],
        //     accent: 'gulf',
        //     speechRecognition: true,
        //     textToSpeech: true
        // },
        // contextual: { enabled: true, types: ['definitions', 'keyPoints'] },
        // navigation: { enabled: true, features: ['timeline', 'chapters'] },

        // RAG & Tutor
        rag: {
            enabled: true,
            knowledgeBaseIds: ['ccl-core-math-g5', 'ccl-pathways-science-g5'],
            retrievalStrategy: 'semantic',
            prompt: 'This is a default prompt for the RAG configuration'
        },
        aiTutor: {
            enabled: true,
            persona: 'guide',
            proactiveEngagement: false,
            prompt: 'This is a default prompt for the AI Tutor configuration'
        },

        // Helpers
        summarizer: {
            enabled: true,
            format: 'bullet_points',
            prompt: 'This is a default prompt for the summarizer configuration'
        },
        translator: {
            enabled: true,
            targetLanguages: ['ar'],
            prompt: 'This is a default prompt for the translator configuration'
        },
        simplifier: {
            enabled: false,
            prompt: 'This is a default prompt for the simplifier configuration'
        },
        // scaffolder: { enabled: true, hintLevel: 'medium' },

        // Additional
        autograder: {
            enabled: false,
            prompt: 'This is a default prompt for the autograder configuration'
        },
        feedbackGenerator: {
            enabled: false,
            prompt: 'This is a default prompt for the feedback generator configuration'
        },
        questionGenerator: {
            enabled: false,
            prompt: 'This is a default prompt for the question generator configuration'
        },
        teacherAssistant: {
            enabled: false,
            prompt: 'This is a default prompt for the teacher assistant configuration'
        },
        personalizedRecommendation: {
            enabled: false,
            prompt: 'This is a default prompt for the personalized recommendation configuration'
        },
        learningAnalytics: {
            enabled: false
        },
    },
    behavior: { // Guide Rails
        pedagogical: {
            style: 'interactive',
            complexity: 5, // Assuming Grade 5
            pacing: 'adaptive',
            feedbackStyle: 'encouraging'
        },
        cultural: {
            region: 'UAE',
            languageStyle: 'formal',
            examples: 'localized'
        },
        language: {
            primary: 'en',
            supported: ['en', 'ar'],
            translation: true // Redundant? Translator capability handles this. Keep for now.
        }
    }
};

export const bookAIConfigExample: AIExperienceConfig = {
    // ... (similar structure, different settings for a book)
    configId: 'book-config-example',
    configName: 'Interactive Book Reading',
    content: { type: 'book', id: 'ccl-book-456', source: 'CCL' },
    capabilities: {
        chat: {
            enabled: true,
            mode: 'pageAware',
            features: ['deepDive', 'summarization'],
            prompt: 'This is a default prompt for the book chat configuration'
        },
        // voice: { enabled: false, languages: ['en'], speechRecognition: false, textToSpeech: false }, // Voice might be less common for books
        // contextual: { enabled: true, types: ['definitions', 'keyPoints', 'character_analysis'] },
        // navigation: { enabled: true, features: ['page_jump', 'table_of_contents'] },
        rag: {
            enabled: true,
            knowledgeBaseIds: ['ccl-literature-guide-g9'],
            retrievalStrategy: 'semantic',
            prompt: 'This is a default prompt for the book RAG configuration'
        },
        aiTutor: {
            enabled: true,
            persona: 'socratic',
            proactiveEngagement: true,
            prompt: 'This is a default prompt for the book AI Tutor configuration'
        },
        summarizer: {
            enabled: true,
            format: 'paragraph',
            maxLength: 150,
            prompt: 'This is a default prompt for the book summarizer configuration'
        },
        translator: {
            enabled: false,
            targetLanguages: [],
            prompt: 'This is a default prompt for the book translator configuration'
        },
        simplifier: {
            enabled: true,
            targetGradeLevel: 8,
            prompt: 'This is a default prompt for the book simplifier configuration'
        },
        // scaffolder: { enabled: false },
        autograder: {
            enabled: false,
            prompt: 'This is a default prompt for the book autograder configuration'
        }, // Might apply to book exercises
        feedbackGenerator: {
            enabled: false,
            prompt: 'This is a default prompt for the book feedback generator configuration'
        },
        questionGenerator: {
            enabled: true,
            questionTypes: ['short_answer'],
            difficulty: 'medium',
            prompt: 'This is a default prompt for the book question generator configuration'
        },
        teacherAssistant: {
            enabled: false,
            prompt: 'This is a default prompt for the book teacher assistant configuration'
        },
        personalizedRecommendation: {
            enabled: false,
            prompt: 'This is a default prompt for the book personalized recommendation configuration'
        },
        learningAnalytics: {
            enabled: false
        },
    },
    behavior: {
        pedagogical: { style: 'socratic', complexity: 9, pacing: 'fixed', feedbackStyle: 'critical' },
        cultural: { region: 'Global', languageStyle: 'casual', examples: 'global' },
        language: { primary: 'en', supported: ['en'], translation: false }
    }
};

// Mock list of saved configurations
export const savedConfigs: AIExperienceConfig[] = [
    defaultAIConfig,
    bookAIConfigExample
];

// Mock CCL Content Items
export const mockCCLContent = [
    { id: 'ccl-video-123', title: 'Grade 5 Math - Fractions Explained', type: 'video' },
    { id: 'ccl-video-456', title: 'Grade 7 Science - The Solar System', type: 'video' },
    { id: 'ccl-book-456', title: 'Grade 9 Literature - Classic Short Stories', type: 'book' },
    { id: 'ccl-book-789', title: 'Grade 6 History - Ancient Civilizations', type: 'book' },
    { id: 'ccl-assessment-101', title: 'Algebra Basics Quiz', type: 'assessment' },
];

// Mock RAG Knowledge Bases (simplified)
export const mockKnowledgeBases = [
    { id: 'ccl-core-math-g5', name: 'CCL Core: Math G5', source: 'CCL' },
    { id: 'ccl-pathways-science-g5', name: 'CCL Pathways: Science G5', source: 'CCL' },
    { id: 'ccl-literature-guide-g9', name: 'CCL Custom: Literature Guide G9', source: 'CCL' },
    { id: 'external-science-articles', name: 'External Science Articles', source: 'External' },
]; 