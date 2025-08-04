import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

function CTA() {
    const ctaRef = useRef(null);
    const navigate = useNavigate();
    const { speak, announce } = useAccessibility();

    const handleStartNowClick = () => {
        console.log(
            "CTA button clicked - accessibility should announce navigation"
        );
        speak("Navigating to login page to get started with SprintSync");
        navigate("/login");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            console.log(
                "CTA button activated via keyboard - accessibility should work"
            );
            handleStartNowClick();
        }
    };

    const handleButtonFocus = () => {
        console.log("CTA button focused - should announce");
        speak("Start Now button - Get started with SprintSync now");
    };

    const handleSectionHeaderFocus = () => {
        speak(
            "Call to action section: Let SprintSync Track What Matters. No distractions. Just your work — organized and visible."
        );
    };

    const handleHeadlineFocus = () => {
        speak("Headline: Let SprintSync Track What Matters.");
    };

    const handleSubheadlineFocus = () => {
        speak(
            "Subheadline: No distractions. Just your work — organized and visible."
        );
    };

    const handleSubtextFocus = () => {
        speak(
            "Additional information: Use SprintSync to make retros, QA, and deployment smoother for your team."
        );
    };

    const handleBenefitsFocus = () => {
        speak("Benefits section: Quick overview of SprintSync advantages");
    };

    const handleBenefitFocus = (benefit) => {
        speak(`${benefit.value} - ${benefit.label}`);
    };

    useEffect(() => {
        const ctaButton = ctaRef.current?.querySelector("#cta-button");

        if (ctaButton) {
            const handleMouseEnter = function () {
                this.style.boxShadow = "0 0 30px rgba(139, 92, 246, 0.5)";
                this.style.background =
                    "linear-gradient(135deg, #8b5cf6, #6366f1)";
            };

            const handleMouseLeave = function () {
                this.style.boxShadow = "";
                this.style.background = "";
            };

            const handleClick = function () {
                this.style.transform = "scale(0.95)";
                setTimeout(() => {
                    this.style.transform = "";
                }, 150);
            };

            ctaButton.addEventListener("mouseenter", handleMouseEnter);
            ctaButton.addEventListener("mouseleave", handleMouseLeave);
            ctaButton.addEventListener("click", handleClick);

            // Cleanup function
            return () => {
                ctaButton.removeEventListener("mouseenter", handleMouseEnter);
                ctaButton.removeEventListener("mouseleave", handleMouseLeave);
                ctaButton.removeEventListener("click", handleClick);
            };
        }
    }, []);

    useEffect(() => {
        // Intersection observer for fade-in animation
        const ctaObserverOptions = {
            threshold: 0.3,
            rootMargin: "0px 0px -50px 0px",
        };

        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, ctaObserverOptions);

        // Initialize CTA section with fade-in effect
        const ctaSection = ctaRef.current?.querySelector(".bg-white");

        if (ctaSection) {
            // Set initial state
            ctaSection.style.opacity = "0";
            ctaSection.style.transform = "translateY(30px)";
            ctaSection.style.transition = "all 0.8s ease";

            // Observe for intersection
            ctaObserver.observe(ctaSection);
        }

        // Cleanup observer
        return () => {
            ctaObserver.disconnect();
        };
    }, []);

    const benefits = [
        { value: "6", label: "Integrated Modules" },
        { value: "Real-time", label: "Sprint Tracking" },
        { value: "Zero", label: "Setup Required" },
    ];

    return (
        <div ref={ctaRef}>
            <section
                id="cta"
                className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16"
                role="region"
                aria-label="Call to action - Get started with SprintSync"
                tabIndex={0}
                onFocus={handleSectionHeaderFocus}
            >
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    {/* Main CTA Content */}
                    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg sm:p-12">
                        {/* Headline */}
                        <h2
                            className="mb-4 font-sans text-3xl font-bold text-gray-900 sm:text-4xl"
                            tabIndex={0}
                            onFocus={handleHeadlineFocus}
                            role="heading"
                            aria-level="2"
                        >
                            Let SprintSync Track What Matters.
                        </h2>

                        {/* Subheadline */}
                        <p
                            className="mx-auto mb-8 max-w-2xl font-sans text-lg text-gray-600 sm:text-xl"
                            tabIndex={0}
                            onFocus={handleSubheadlineFocus}
                            role="text"
                        >
                            No distractions. Just your work — organized and
                            visible.
                        </p>

                        {/* CTA Button */}
                        <div className="mb-6">
                            <button
                                id="cta-button"
                                onClick={handleStartNowClick}
                                onKeyDown={handleKeyDown}
                                onFocus={handleButtonFocus}
                                className="font-inter inline-flex transform cursor-pointer items-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl focus:ring-4 focus:ring-indigo-300 focus:outline-none"
                                aria-label="Get started with SprintSync now - Navigate to login page"
                                role="button"
                                tabIndex={0}
                            >
                                Start Now
                                <svg
                                    className="ml-2 h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Optional Subtext */}
                        <p
                            className="mx-auto max-w-lg font-sans text-sm text-gray-500"
                            tabIndex={0}
                            onFocus={handleSubtextFocus}
                            role="text"
                        >
                            Use SprintSync to make retros, QA, and deployment
                            smoother for your team.
                        </p>

                        {/* Quick Benefits */}
                        <div
                            className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-100 pt-8 sm:grid-cols-3"
                            tabIndex={0}
                            onFocus={handleBenefitsFocus}
                            role="list"
                            aria-label="SprintSync benefits"
                        >
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="text-center"
                                    tabIndex={0}
                                    onFocus={() => handleBenefitFocus(benefit)}
                                    role="listitem"
                                    aria-label={`Benefit: ${benefit.value} ${benefit.label}`}
                                >
                                    <div className="mb-1 font-sans text-2xl font-bold text-indigo-600">
                                        {benefit.value}
                                    </div>
                                    <div className="font-sans text-sm text-gray-600">
                                        {benefit.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CTA;
