import React, { forwardRef } from "react";
import { useAccessibility } from "./AccessibilityProvider";

const AccessibleButton = forwardRef(
    (
        {
            children,
            onClick,
            onFocus,
            onBlur,
            className = "",
            disabled = false,
            ariaLabel,
            ariaDescribedBy,
            role = "button",
            tabIndex = 0,
            type = "button",
            variant = "primary", // primary, secondary, danger, ghost
            size = "medium", // small, medium, large
            icon,
            iconPosition = "left", // left, right
            loading = false,
            pressed = false,
            expanded = false,
            ...props
        },
        ref
    ) => {
        const { speak, accessibilityUtils } = useAccessibility();

        const handleClick = (e) => {
            if (disabled || loading) return;

            // Announce button action to screen reader
            if (ariaLabel) {
                speak(ariaLabel);
            }

            onClick?.(e);
        };

        const handleFocus = (e) => {
            // Announce button description on focus
            if (ariaLabel) {
                speak(ariaLabel);
            }
            onFocus?.(e);
        };

        const handleKeyDown = (e) => {
            if (disabled || loading) return;

            // Handle Enter and Space key presses
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(e);
            }
        };

        // Base classes
        const baseClasses = [
            "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        ];

        // Variant classes
        const variantClasses = {
            primary:
                "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
            secondary:
                "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
            danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
            ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        };

        // Size classes
        const sizeClasses = {
            small: "px-3 py-1.5 text-sm",
            medium: "px-4 py-2 text-sm",
            large: "px-6 py-3 text-base",
        };

        // Icon size classes
        const iconSizeClasses = {
            small: "w-4 h-4",
            medium: "w-5 h-5",
            large: "w-6 h-6",
        };

        const buttonClasses = [
            ...baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            className,
        ].join(" ");

        const iconClasses = iconSizeClasses[size];

        return (
            <button
                ref={ref}
                type={type}
                className={buttonClasses}
                onClick={handleClick}
                onFocus={handleFocus}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                disabled={disabled || loading}
                tabIndex={disabled ? -1 : tabIndex}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                aria-pressed={pressed}
                aria-expanded={expanded}
                role={role}
                {...props}
            >
                {loading && (
                    <div className="mr-2 animate-spin rounded-full border-2 border-current border-t-transparent">
                        <span className="sr-only">Loading...</span>
                    </div>
                )}

                {icon && iconPosition === "left" && (
                    <span className={`mr-2 ${iconClasses}`}>{icon}</span>
                )}

                {children}

                {icon && iconPosition === "right" && (
                    <span className={`ml-2 ${iconClasses}`}>{icon}</span>
                )}
            </button>
        );
    }
);

AccessibleButton.displayName = "AccessibleButton";

export default AccessibleButton;
