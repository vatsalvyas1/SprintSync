import React, { useEffect } from "react";
import { useAccessibility } from "./AccessibilityProvider";

const AccessibilityTest = () => {
    const { speak, announce, accessibilitySettings } = useAccessibility();

    useEffect(() => {
        // Test screen reader functionality
        console.log("AccessibilityTest: Testing screen reader...");
        speak("Accessibility test component loaded. Screen reader is working.");

        // Test announcement functionality
        announce(
            "Accessibility test: Announcement system is working",
            "polite"
        );

        // Log current settings
        console.log("Current accessibility settings:", accessibilitySettings);
    }, [speak, announce, accessibilitySettings]);

    const handleTestClick = () => {
        console.log("Test button clicked");
        speak(
            "Test button clicked successfully. Accessibility features are working."
        );
    };

    const handleTestFocus = () => {
        console.log("Test button focused");
        speak("Test button focused. Keyboard navigation is working.");
    };

    const handleTestKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            console.log("Test button activated via keyboard");
            speak(
                "Test button activated via keyboard. Keyboard accessibility is working."
            );
        }
    };

    return (
        <div className="m-4 rounded-lg bg-gray-100 p-4">
            <h2 className="mb-4 text-lg font-bold">
                Accessibility Test Component
            </h2>
            <p className="mb-4">
                This component tests the accessibility features.
            </p>

            <button
                onClick={handleTestClick}
                onFocus={handleTestFocus}
                onKeyDown={handleTestKeyDown}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                aria-label="Test accessibility features"
                tabIndex={0}
            >
                Test Accessibility
            </button>

            <div className="mt-4 text-sm">
                <p>
                    Screen Reader Enabled:{" "}
                    {accessibilitySettings.screenReaderEnabled ? "Yes" : "No"}
                </p>
                <p>
                    High Contrast Enabled:{" "}
                    {accessibilitySettings.highContrastEnabled ? "Yes" : "No"}
                </p>
                <p>Font Size: {accessibilitySettings.fontSize}%</p>
            </div>
        </div>
    );
};

export default AccessibilityTest;
