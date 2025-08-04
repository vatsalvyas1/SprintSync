import { useEffect } from "react";
import Hero from "./Hero";
import Features from "./Features";
import Modules from "./Modules";
import CTA from "./CTA";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

function FrontPage() {
    const { speak, announce } = useAccessibility();

    useEffect(() => {
        // Announce page introduction when the page loads
        const timer = setTimeout(() => {
            announce(
                "Welcome to SprintSync homepage. SprintSync is a comprehensive sprint management platform that helps teams track deployments, manage QA testing, generate AI-powered test cases, conduct retrospectives, maintain task journals, and prevent form editing conflicts. Navigate through the page using Tab to explore all features and modules.",
                "polite"
            );

            // Debug: Test screen reader functionality
            speak(
                "Landing page loaded successfully. Press Tab to navigate through elements."
            );
        }, 1000); // Wait 1 second to let the page load

        return () => clearTimeout(timer);
    }, [announce, speak]);

    // Handle keyboard navigation announcements
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Tab") {
                // This will be handled by individual components, but we can add global context here if needed
                console.log(
                    "Tab key pressed - accessibility should be working"
                );
            }
        };

        const handleFocus = (e) => {
            // Enhanced focus announcements based on the current element
            const element = e.target;
            console.log(
                "Element focused:",
                element.tagName,
                element.textContent?.substring(0, 50)
            );

            if (element.closest("#hero")) {
                announce(
                    "Hero section - Main introduction to SprintSync",
                    "polite"
                );
            } else if (element.closest("#widgets")) {
                announce(
                    "Features section - Live examples of SprintSync modules",
                    "polite"
                );
            } else if (element.closest("#modules")) {
                announce(
                    "Modules section - Detailed overview of all 6 SprintSync modules",
                    "polite"
                );
            } else if (element.closest("#cta")) {
                announce(
                    "Call to action section - Get started with SprintSync",
                    "polite"
                );
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("focusin", handleFocus);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("focusin", handleFocus);
        };
    }, [announce]);

    return (
        <div
            className=""
            role="main"
            aria-label="SprintSync homepage - Sprint management platform"
        >
            {/* Skip link for keyboard users */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:border-2 focus:border-black focus:bg-white focus:px-4 focus:py-2 focus:text-black"
                onClick={(e) => {
                    e.preventDefault();
                    const mainContent = document.getElementById("main-content");
                    if (mainContent) {
                        mainContent.focus();
                        speak("Skipped to main content");
                    }
                }}
            >
                Skip to main content
            </a>

            {/* Screen reader only introduction */}
            <div className="sr-only">
                <h1>SprintSync - Complete Sprint Management Platform</h1>
                <p>
                    Welcome to SprintSync, your all-in-one solution for sprint
                    management. This platform includes 6 core modules:
                    Deployment Checklist, QA Testing, AI Test Generator,
                    Retrospectives, Task Journal, and Form Locker. Navigate
                    using Tab to explore features and get started.
                </p>
            </div>

            <div id="main-content" tabIndex={-1}>
                <Hero />
                <Features />
                <Modules />
                <CTA />
            </div>
        </div>
    );
}

export default FrontPage;
