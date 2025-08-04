// Accessibility utilities for screen reader support and keyboard navigation

// Text-to-speech functionality
class ScreenReader {
    constructor() {
        this.speechSynthesis = window.speechSynthesis;
        this.isEnabled = true;
        this.rate = 1.0;
        this.pitch = 1.0;
        this.volume = 1.0;
        this.isSupported = "speechSynthesis" in window;
    }

    speak(text, options = {}) {
        if (!this.isEnabled || !this.speechSynthesis || !this.isSupported) {
            console.log("Screen reader not available or disabled:", text);
            return;
        }

        try {
            // Cancel any ongoing speech
            this.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = options.rate || this.rate;
            utterance.pitch = options.pitch || this.pitch;
            utterance.volume = options.volume || this.volume;
            utterance.lang = options.lang || "en-US";

            // Add error handling
            utterance.onerror = (event) => {
                console.error("Speech synthesis error:", event.error);
            };

            utterance.onend = () => {
                console.log("Speech synthesis completed");
            };

            this.speechSynthesis.speak(utterance);
            console.log("Screen reader speaking:", text);
        } catch (error) {
            console.error("Error with speech synthesis:", error);
        }
    }

    stop() {
        if (this.speechSynthesis && this.isSupported) {
            this.speechSynthesis.cancel();
        }
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        console.log("Screen reader enabled:", enabled);
    }

    setRate(rate) {
        this.rate = rate;
    }

    setPitch(pitch) {
        this.pitch = pitch;
    }

    setVolume(volume) {
        this.volume = volume;
    }
}

// Keyboard navigation utilities
class KeyboardNavigation {
    constructor() {
        this.focusableSelectors = [
            "a[href]",
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]',
            '[role="button"]',
            '[role="link"]',
            '[role="menuitem"]',
            '[role="tab"]',
            '[role="option"]',
        ];
    }

    getFocusableElements(container = document) {
        return Array.from(
            container.querySelectorAll(this.focusableSelectors.join(", "))
        );
    }

    trapFocus(container) {
        const focusableElements = this.getFocusableElements(container);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        container.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    focusFirstElement(container) {
        const focusableElements = this.getFocusableElements(container);
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    announceToScreenReader(message, priority = "polite") {
        // Create a live region for announcements
        let liveRegion = document.getElementById("accessibility-live-region");
        if (!liveRegion) {
            liveRegion = document.createElement("div");
            liveRegion.id = "accessibility-live-region";
            liveRegion.setAttribute("aria-live", priority);
            liveRegion.setAttribute("aria-atomic", "true");
            liveRegion.className = "sr-only";
            document.body.appendChild(liveRegion);
        }

        // Clear previous content and add new message
        liveRegion.textContent = "";
        setTimeout(() => {
            liveRegion.textContent = message;
            console.log("Announcement:", message);
        }, 100);
    }
}

// ARIA utilities
class AriaUtils {
    static setLabel(element, label) {
        element.setAttribute("aria-label", label);
    }

    static setDescribedBy(element, descriptionId) {
        element.setAttribute("aria-describedby", descriptionId);
    }

    static setExpanded(element, expanded) {
        element.setAttribute("aria-expanded", expanded.toString());
    }

    static setPressed(element, pressed) {
        element.setAttribute("aria-pressed", pressed.toString());
    }

    static setSelected(element, selected) {
        element.setAttribute("aria-selected", selected.toString());
    }

    static setCurrent(element, current) {
        element.setAttribute("aria-current", current.toString());
    }

    static setRole(element, role) {
        element.setAttribute("role", role);
    }

    static setHidden(element, hidden) {
        element.setAttribute("aria-hidden", hidden.toString());
    }

    static setLive(element, live) {
        element.setAttribute("aria-live", live);
    }

    static setAtomic(element, atomic) {
        element.setAttribute("aria-atomic", atomic.toString());
    }
}

// Focus management
class FocusManager {
    constructor() {
        this.focusHistory = [];
        this.maxHistorySize = 10;
    }

    saveFocus() {
        const currentFocus = document.activeElement;
        if (currentFocus && currentFocus !== document.body) {
            this.focusHistory.unshift(currentFocus);
            if (this.focusHistory.length > this.maxHistorySize) {
                this.focusHistory.pop();
            }
        }
    }

    restoreFocus() {
        if (this.focusHistory.length > 0) {
            const previousFocus = this.focusHistory.shift();
            if (previousFocus && document.contains(previousFocus)) {
                previousFocus.focus();
            }
        }
    }

    focusElement(element) {
        if (element && document.contains(element)) {
            element.focus();
        }
    }

    focusFirstFocusable(container) {
        const focusableElements = this.getFocusableElements(container);
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    getFocusableElements(container = document) {
        const focusableSelectors = [
            "a[href]",
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]',
            '[role="button"]',
            '[role="link"]',
            '[role="menuitem"]',
            '[role="tab"]',
            '[role="option"]',
        ];
        return Array.from(
            container.querySelectorAll(focusableSelectors.join(", "))
        );
    }
}

// High contrast mode
class HighContrastMode {
    constructor() {
        this.isEnabled = false;
        this.styleElement = null;
    }

    enable() {
        this.isEnabled = true;
        this.applyHighContrast();
    }

    disable() {
        this.isEnabled = false;
        this.removeHighContrast();
    }

    applyHighContrast() {
        if (this.styleElement) {
            this.styleElement.remove();
        }

        this.styleElement = document.createElement("style");
        this.styleElement.textContent = `
            * {
                background-color: #000000 !important;
                color: #ffffff !important;
                border-color: #ffffff !important;
            }
            *:hover {
                background-color: #333333 !important;
            }
            *:focus {
                outline: 3px solid #ffff00 !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(this.styleElement);
    }

    removeHighContrast() {
        if (this.styleElement) {
            this.styleElement.remove();
            this.styleElement = null;
        }
    }
}

// Font size controls
class FontSizeController {
    constructor() {
        this.currentSize = 100;
        this.minSize = 50;
        this.maxSize = 200;
        this.step = 10;
    }

    increase() {
        this.currentSize = Math.min(this.currentSize + this.step, this.maxSize);
        this.applyFontSize();
    }

    decrease() {
        this.currentSize = Math.max(this.currentSize - this.step, this.minSize);
        this.applyFontSize();
    }

    reset() {
        this.currentSize = 100;
        this.applyFontSize();
    }

    applyFontSize() {
        document.documentElement.style.fontSize = `${this.currentSize}%`;
    }
}

// Create global instances
export const screenReader = new ScreenReader();
export const keyboardNavigation = new KeyboardNavigation();
export const focusManager = new FocusManager();
export const highContrastMode = new HighContrastMode();
export const fontSizeController = new FontSizeController();

// Utility functions
export const accessibilityUtils = {
    // Announce page changes
    announcePageChange(pageTitle) {
        screenReader.speak(`Navigated to ${pageTitle}`);
        keyboardNavigation.announceToScreenReader(`Page loaded: ${pageTitle}`);
    },

    // Handle tab navigation with screen reader
    handleTabNavigation(element, description) {
        element.addEventListener("focus", () => {
            screenReader.speak(description);
        });
    },

    // Make element focusable
    makeFocusable(element, tabIndex = 0) {
        element.setAttribute("tabindex", tabIndex);
    },

    // Add skip link
    addSkipLink(targetId, text = "Skip to main content") {
        const skipLink = document.createElement("a");
        skipLink.href = `#${targetId}`;
        skipLink.className =
            "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:border-2 focus:border-black";
        skipLink.textContent = text;
        document.body.insertBefore(skipLink, document.body.firstChild);
    },

    // Initialize accessibility features
    initialize() {
        console.log("Initializing accessibility features...");

        // Add skip link
        this.addSkipLink("main-content");

        // Set up keyboard shortcuts
        document.addEventListener("keydown", (e) => {
            // Alt + H for high contrast toggle
            if (e.altKey && e.key === "h") {
                e.preventDefault();
                if (highContrastMode.isEnabled) {
                    highContrastMode.disable();
                    screenReader.speak("High contrast mode disabled");
                } else {
                    highContrastMode.enable();
                    screenReader.speak("High contrast mode enabled");
                }
            }

            // Alt + Plus/Minus for font size
            if (e.altKey && e.key === "=") {
                e.preventDefault();
                fontSizeController.increase();
                screenReader.speak(
                    `Font size increased to ${fontSizeController.currentSize}%`
                );
            }

            if (e.altKey && e.key === "-") {
                e.preventDefault();
                fontSizeController.decrease();
                screenReader.speak(
                    `Font size decreased to ${fontSizeController.currentSize}%`
                );
            }

            // Alt + R to reset font size
            if (e.altKey && e.key === "r") {
                e.preventDefault();
                fontSizeController.reset();
                screenReader.speak("Font size reset to normal");
            }
        });

        console.log("Accessibility features initialized");
    },
};

export default {
    screenReader,
    keyboardNavigation,
    focusManager,
    highContrastMode,
    fontSizeController,
    accessibilityUtils,
};
