import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Code,
  BookOpen,
  Zap,
  MessageSquare,
  Headphones,
  LayoutDashboard,
  Key,
  BarChart3,
  Terminal,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";

const Home = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, this would toggle a class on the body or use a context
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className={`min-h-screen bg-background ${darkMode ? "dark" : ""}`}>
      {/* Navigation Bar */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="https://www.alefeducation.com/_next/image?url=https%3A%2F%2Fcms-backend-prod.alefeducation.com%2Fwp-content%2Fuploads%2F2024%2F09%2Flogo_main-alef-education.webp&w=384&q=75"
              alt="Alef Education Logo"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold">Alef AI Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              <Moon className="h-4 w-4" />
            </div>
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful AI APIs, Simplified
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Access advanced AI capabilities through a unified, easy-to-use
            platform. Build intelligent applications without the complexity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/documentation">View Documentation</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leverage our suite of AI services to enhance your applications with
            advanced capabilities.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* RAG Service */}
          <motion.div variants={fadeIn} transition={{ duration: 0.3 }}>
            <Card className="h-full bg-background">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>RAG Engine</CardTitle>
                <CardDescription>
                  Retrieval-Augmented Generation for accurate, contextual AI
                  responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Combine the power of retrieval systems with generative AI to
                  provide accurate, contextually relevant responses based on
                  your data.
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/documentation/rag">Learn More</Link>
                </Button>
                <Button variant="default" size="sm" className="flex-1" asChild>
                  <Link to="/rag">Try Now</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Summarization Service */}
          <motion.div variants={fadeIn} transition={{ duration: 0.3 }}>
            <Card className="h-full bg-background">
              <CardHeader>
                <Code className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Summarization</CardTitle>
                <CardDescription>
                  Condense lengthy content into concise, meaningful summaries.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Transform long documents, articles, or conversations into
                  brief summaries that capture the essential information.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/documentation/summarization">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Translation Service */}
          <motion.div variants={fadeIn} transition={{ duration: 0.3 }}>
            <Card className="h-full bg-background">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Translation</CardTitle>
                <CardDescription>
                  Break language barriers with accurate, culturally-sensitive
                  translations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Translate content between multiple languages while preserving
                  meaning and cultural context for global communication.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/documentation/translation">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* TTS Service */}
          <motion.div variants={fadeIn} transition={{ duration: 0.3 }}>
            <Card className="h-full bg-background">
              <CardHeader>
                <Headphones className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Text-to-Speech</CardTitle>
                <CardDescription>
                  Convert text into natural-sounding speech in multiple
                  languages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Transform written content into lifelike audio with support for
                  various voices, accents, and speaking styles.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/documentation/tts">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Cards Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Developer Tools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage and monitor your AI integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link to="/dashboard" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <LayoutDashboard className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>View your account overview</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/api-key-manager" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <Key className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Manage Keys
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/analytics-dashboard" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/api-sandbox" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <Terminal className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>API Sandbox</CardTitle>
                <CardDescription>Test API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Open Sandbox
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Create an account today and start building with our powerful AI
            APIs.
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">Sign Up for Free</Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img
                src="https://www.alefeducation.com/_next/image?url=https%3A%2F%2Fcms-backend-prod.alefeducation.com%2Fwp-content%2Fuploads%2F2024%2F09%2Flogo_main-alef-education.webp&w=384&q=75"
                alt="Alef Education Logo"
                className="h-6 w-auto"
              />
              <span className="font-semibold">Alef AI Platform</span>
            </div>
            <div className="flex space-x-6">
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link
                to="/documentation"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Documentation
              </Link>
              <Link
                to="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Alef AI Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
