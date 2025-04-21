import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";

interface NavbarProps {
    showBackButton?: boolean;
    title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ showBackButton = false, title }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        navigate(-1);
    };

    // Don't show back button on home page
    const shouldShowBackButton = showBackButton && location.pathname !== "/";

    return (
        <nav className="border-b border-border bg-background">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {shouldShowBackButton && (
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="text-xl font-bold">
                            {title || "Alef AI Platform"}
                        </Link>
                    </div>
                    {title && (
                        <>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-medium">{title}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" asChild>
                        <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link to="/api-sandbox">API Sandbox</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link to="/documentation">Documentation</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 