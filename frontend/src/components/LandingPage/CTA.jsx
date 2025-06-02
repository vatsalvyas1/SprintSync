import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function CTA() {
    const ctaRef = useRef(null);
    const navigate = useNavigate();

    const handleStartNowClick = () => {
        navigate("/login");
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

    return (
        <div ref={ctaRef}>
            <section
                id="cta"
                className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50"
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Main CTA Content */}
                    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 sm:p-12">
                        {/* Headline */}
                        <h2 className="font-sans text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Let SprintSync Track What Matters.
                        </h2>

                        {/* Subheadline */}
                        <p className="font-sans text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            No distractions. Just your work — organized and
                            visible.
                        </p>

                        {/* CTA Button */}
                        <div className="mb-6">
                            <button
                                onClick={handleStartNowClick}
                                className="font-inter cursor-pointer inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                            >
                                Start Now
                                <svg
                                    className="ml-2 w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
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
                        <p className="font-sans text-sm text-gray-500 max-w-lg mx-auto">
                            Use SprintSync to make retros, QA, and deployment
                            smoother for your team.
                        </p>

                        {/* Quick Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
                            <div className="text-center">
                                <div className="font-sans text-2xl font-bold text-indigo-600 mb-1">
                                    6
                                </div>
                                <div className="font-sans text-sm text-gray-600">
                                    Integrated Modules
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-sans text-2xl font-bold text-indigo-600 mb-1">
                                    Real-time
                                </div>
                                <div className="font-sans text-sm text-gray-600">
                                    Sprint Tracking
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-sans text-2xl font-bold text-indigo-600 mb-1">
                                    Zero
                                </div>
                                <div className="font-sans text-sm text-gray-600">
                                    Setup Required
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CTA;
