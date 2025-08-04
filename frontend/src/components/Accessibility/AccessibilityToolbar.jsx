import React, { useState } from "react";
import { useAccessibility } from "./AccessibilityProvider";
import {
    Volume2,
    VolumeX,
    Contrast,
    Type,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Eye,
    EyeOff,
    Settings,
    X,
} from "lucide-react";

const AccessibilityToolbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        accessibilitySettings,
        toggleScreenReader,
        toggleHighContrast,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleReducedMotion,
        speak,
    } = useAccessibility();

    const handleToggleToolbar = () => {
        setIsOpen(!isOpen);
        speak(
            isOpen
                ? "Accessibility toolbar closed"
                : "Accessibility toolbar opened"
        );
    };

    const handleScreenReaderToggle = () => {
        toggleScreenReader();
    };

    const handleHighContrastToggle = () => {
        toggleHighContrast();
    };

    const handleFontSizeIncrease = () => {
        increaseFontSize();
    };

    const handleFontSizeDecrease = () => {
        decreaseFontSize();
    };

    const handleFontSizeReset = () => {
        resetFontSize();
    };

    const handleReducedMotionToggle = () => {
        toggleReducedMotion();
    };

    return (
        <>
            {/* Floating toolbar button */}
            <button
                onClick={handleToggleToolbar}
                className="fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all duration-200 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                aria-label={
                    isOpen
                        ? "Close accessibility toolbar"
                        : "Open accessibility toolbar"
                }
                aria-expanded={isOpen}
                aria-controls="accessibility-toolbar"
            >
                <Settings size={24} />
            </button>

            {/* Toolbar panel */}
            {isOpen && (
                <div
                    id="accessibility-toolbar"
                    className="ring-opacity-5 fixed right-4 bottom-20 z-50 w-80 rounded-lg bg-white p-4 shadow-xl ring-1 ring-black"
                    role="dialog"
                    aria-label="Accessibility controls"
                >
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Accessibility
                        </h2>
                        <button
                            onClick={handleToggleToolbar}
                            className="rounded p-1 text-gray-400 transition-colors hover:text-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            aria-label="Close accessibility toolbar"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                        {/* Screen Reader Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {accessibilitySettings.screenReaderEnabled ? (
                                    <Volume2
                                        size={20}
                                        className="text-green-600"
                                    />
                                ) : (
                                    <VolumeX
                                        size={20}
                                        className="text-gray-400"
                                    />
                                )}
                                <span className="text-sm font-medium text-gray-700">
                                    Screen Reader
                                </span>
                            </div>
                            <button
                                onClick={handleScreenReaderToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none ${
                                    accessibilitySettings.screenReaderEnabled
                                        ? "bg-purple-600"
                                        : "bg-gray-200"
                                }`}
                                role="switch"
                                aria-checked={
                                    accessibilitySettings.screenReaderEnabled
                                }
                                aria-label="Toggle screen reader"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        accessibilitySettings.screenReaderEnabled
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* High Contrast Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Contrast
                                    size={20}
                                    className={
                                        accessibilitySettings.highContrastEnabled
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    High Contrast
                                </span>
                            </div>
                            <button
                                onClick={handleHighContrastToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none ${
                                    accessibilitySettings.highContrastEnabled
                                        ? "bg-purple-600"
                                        : "bg-gray-200"
                                }`}
                                role="switch"
                                aria-checked={
                                    accessibilitySettings.highContrastEnabled
                                }
                                aria-label="Toggle high contrast mode"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        accessibilitySettings.highContrastEnabled
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Font Size Controls */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <Type size={20} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                    Font Size
                                </span>
                                <span className="text-xs text-gray-500">
                                    ({accessibilitySettings.fontSize}%)
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleFontSizeDecrease}
                                    className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    aria-label="Decrease font size"
                                    disabled={
                                        accessibilitySettings.fontSize <= 50
                                    }
                                >
                                    <ZoomOut size={16} />
                                </button>
                                <button
                                    onClick={handleFontSizeReset}
                                    className="flex-1 rounded border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    aria-label="Reset font size to normal"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleFontSizeIncrease}
                                    className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    aria-label="Increase font size"
                                    disabled={
                                        accessibilitySettings.fontSize >= 200
                                    }
                                >
                                    <ZoomIn size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Reduced Motion Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {accessibilitySettings.reducedMotion ? (
                                    <EyeOff
                                        size={20}
                                        className="text-green-600"
                                    />
                                ) : (
                                    <Eye size={20} className="text-gray-400" />
                                )}
                                <span className="text-sm font-medium text-gray-700">
                                    Reduced Motion
                                </span>
                            </div>
                            <button
                                onClick={handleReducedMotionToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none ${
                                    accessibilitySettings.reducedMotion
                                        ? "bg-purple-600"
                                        : "bg-gray-200"
                                }`}
                                role="switch"
                                aria-checked={
                                    accessibilitySettings.reducedMotion
                                }
                                aria-label="Toggle reduced motion"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        accessibilitySettings.reducedMotion
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Keyboard Shortcuts Info */}
                        <div className="rounded-lg bg-gray-50 p-3">
                            <h3 className="mb-2 text-sm font-medium text-gray-900">
                                Keyboard Shortcuts
                            </h3>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div>Alt + H: Toggle high contrast</div>
                                <div>Alt + +: Increase font size</div>
                                <div>Alt + -: Decrease font size</div>
                                <div>Alt + R: Reset font size</div>
                                <div>Tab: Navigate elements</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccessibilityToolbar;
