import React, { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAccessibility } from "./AccessibilityProvider";

const AccessibleLink = forwardRef(
    (
        {
            children,
            to,
            href,
            onClick,
            onFocus,
            onBlur,
            className = "",
            disabled = false,
            ariaLabel,
            ariaDescribedBy,
            external = false,
            variant = "default", // default, button, ghost
            size = "medium", // small, medium, large
            icon,
            iconPosition = "left", // left, right
            ...props
        },
        ref
    ) => {
        const { speak } = useAccessibility();

        const handleClick = (e) => {
            if (disabled) return;

            // Announce link action to screen reader
            if (ariaLabel) {
                speak(ariaLabel);
            } else if (typeof children === "string") {
                speak(children);
            }

            onClick?.(e);
        };

        const handleFocus = (e) => {
            // Announce link description on focus
            let description = ariaLabel || children;
            if (external) {
                description += " (opens in new window)";
            }
            speak(description);
            onFocus?.(e);
        };

        const handleKeyDown = (e) => {
            if (disabled) return;

            // Handle Enter key press
            if (e.key === "Enter") {
                e.preventDefault();
                handleClick(e);
            }
        };

        // Base classes
        const baseClasses = [
            "inline-flex items-center font-medium transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        ];

        // Variant classes
        const variantClasses = {
            default:
                "text-purple-600 hover:text-purple-700 focus:ring-purple-500",
            button: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 rounded-md",
            ghost: "text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 rounded-md",
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

        const linkClasses = [
            ...baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            className,
        ].join(" ");

        const iconClasses = iconSizeClasses[size];

        // Common props for both internal and external links
        const commonProps = {
            ref,
            className: linkClasses,
            onClick: handleClick,
            onFocus: handleFocus,
            onBlur: onBlur,
            onKeyDown: handleKeyDown,
            tabIndex: disabled ? -1 : 0,
            "aria-label": ariaLabel,
            "aria-describedby": ariaDescribedBy,
            ...props,
        };

        // External link (using anchor tag)
        if (external || href) {
            return (
                <a
                    href={href || to}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...commonProps}
                >
                    {icon && iconPosition === "left" && (
                        <span className={`mr-2 ${iconClasses}`}>{icon}</span>
                    )}

                    {children}

                    {icon && iconPosition === "right" && (
                        <span className={`ml-2 ${iconClasses}`}>{icon}</span>
                    )}

                    {external && (
                        <span className="ml-1 text-xs" aria-hidden="true">
                            ↗
                        </span>
                    )}
                </a>
            );
        }

        // Internal link (using React Router)
        return (
            <RouterLink to={to} {...commonProps}>
                {icon && iconPosition === "left" && (
                    <span className={`mr-2 ${iconClasses}`}>{icon}</span>
                )}

                {children}

                {icon && iconPosition === "right" && (
                    <span className={`ml-2 ${iconClasses}`}>{icon}</span>
                )}
            </RouterLink>
        );
    }
);

AccessibleLink.displayName = "AccessibleLink";

export default AccessibleLink;
