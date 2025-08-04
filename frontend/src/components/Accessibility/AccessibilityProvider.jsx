import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import {
    screenReader,
    keyboardNavigation,
    focusManager,
    highContrastMode,
    fontSizeController,
    accessibilityUtils,
} from "../../utils/accessibility";

const AccessibilityContext = createContext();

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error(
            "useAccessibility must be used within an AccessibilityProvider"
        );
    }
    return context;
};

export const AccessibilityProvider = ({ children }) => {
    const [accessibilitySettings, setAccessibilitySettings] = useState({
        screenReaderEnabled: true,
        highContrastEnabled: false,
        fontSize: 100,
        keyboardNavigationEnabled: true,
        focusVisible: true,
        reducedMotion: false,
    });

    const [announcements, setAnnouncements] = useState([]);

    // Initialize accessibility features
    useEffect(() => {
        console.log("AccessibilityProvider: Initializing...");

        try {
            accessibilityUtils.initialize();

            // Load saved settings from localStorage
            const savedSettings = localStorage.getItem("accessibilitySettings");
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                setAccessibilitySettings(settings);

                // Apply saved settings
                if (settings.highContrastEnabled) {
                    highContrastMode.enable();
                }
                if (settings.fontSize !== 100) {
                    fontSizeController.currentSize = settings.fontSize;
                    fontSizeController.applyFontSize();
                }
                screenReader.setEnabled(settings.screenReaderEnabled);
            }

            console.log("AccessibilityProvider: Initialized successfully");
        } catch (error) {
            console.error(
                "AccessibilityProvider: Initialization error:",
                error
            );
        }
    }, []);

    // Save settings to localStorage when they change
    useEffect(() => {
        try {
            localStorage.setItem(
                "accessibilitySettings",
                JSON.stringify(accessibilitySettings)
            );
        } catch (error) {
            console.error("Error saving accessibility settings:", error);
        }
    }, [accessibilitySettings]);

    const toggleScreenReader = useCallback(() => {
        const newEnabled = !accessibilitySettings.screenReaderEnabled;
        setAccessibilitySettings((prev) => ({
            ...prev,
            screenReaderEnabled: newEnabled,
        }));
        screenReader.setEnabled(newEnabled);

        if (newEnabled) {
            screenReader.speak("Screen reader enabled");
        }
    }, [accessibilitySettings.screenReaderEnabled]);

    const toggleHighContrast = useCallback(() => {
        const newEnabled = !accessibilitySettings.highContrastEnabled;
        setAccessibilitySettings((prev) => ({
            ...prev,
            highContrastEnabled: newEnabled,
        }));

        if (newEnabled) {
            highContrastMode.enable();
            screenReader.speak("High contrast mode enabled");
        } else {
            highContrastMode.disable();
            screenReader.speak("High contrast mode disabled");
        }
    }, [accessibilitySettings.highContrastEnabled]);

    const changeFontSize = useCallback((newSize) => {
        setAccessibilitySettings((prev) => ({ ...prev, fontSize: newSize }));
        fontSizeController.currentSize = newSize;
        fontSizeController.applyFontSize();
        screenReader.speak(`Font size set to ${newSize}%`);
    }, []);

    const increaseFontSize = useCallback(() => {
        const newSize = Math.min(accessibilitySettings.fontSize + 10, 200);
        changeFontSize(newSize);
    }, [accessibilitySettings.fontSize, changeFontSize]);

    const decreaseFontSize = useCallback(() => {
        const newSize = Math.max(accessibilitySettings.fontSize - 10, 50);
        changeFontSize(newSize);
    }, [accessibilitySettings.fontSize, changeFontSize]);

    const resetFontSize = useCallback(() => {
        changeFontSize(100);
    }, [changeFontSize]);

    const toggleReducedMotion = useCallback(() => {
        const newEnabled = !accessibilitySettings.reducedMotion;
        setAccessibilitySettings((prev) => ({
            ...prev,
            reducedMotion: newEnabled,
        }));

        if (newEnabled) {
            document.documentElement.style.setProperty(
                "--reduced-motion",
                "reduce"
            );
            screenReader.speak("Reduced motion enabled");
        } else {
            document.documentElement.style.removeProperty("--reduced-motion");
            screenReader.speak("Reduced motion disabled");
        }
    }, [accessibilitySettings.reducedMotion]);

    const announce = useCallback((message, priority = "polite") => {
        const id = Date.now();
        const announcement = { id, message, priority };

        setAnnouncements((prev) => [...prev, announcement]);
        keyboardNavigation.announceToScreenReader(message, priority);

        // Remove announcement after 5 seconds
        setTimeout(() => {
            setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        }, 5000);
    }, []);

    const speak = useCallback((text, options = {}) => {
        screenReader.speak(text, options);
    }, []);

    const focusElement = useCallback((element) => {
        focusManager.focusElement(element);
    }, []);

    const trapFocus = useCallback((container) => {
        keyboardNavigation.trapFocus(container);
    }, []);

    const value = {
        accessibilitySettings,
        announcements,
        toggleScreenReader,
        toggleHighContrast,
        changeFontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleReducedMotion,
        announce,
        speak,
        focusElement,
        trapFocus,
        screenReader,
        keyboardNavigation,
        focusManager,
        highContrastMode,
        fontSizeController,
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};
