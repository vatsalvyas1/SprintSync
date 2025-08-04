import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

function Hero() {
    const navigate = useNavigate();
    const { speak, announce } = useAccessibility();

    const handleStartNowClick = () => {
        console.log(
            "Hero button clicked - accessibility should announce navigation"
        );
        speak("Navigating to login page");
        navigate("/login");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            console.log(
                "Hero button activated via keyboard - accessibility should work"
            );
            handleStartNowClick();
        }
    };

    const handleButtonFocus = () => {
        console.log("Hero button focused - should announce");
        speak("Start Now button - Get started with SprintSync");
    };

    const handleHeadlineFocus = () => {
        speak(
            "Main headline: Everything Your Team Needs In One Sprint Workspace"
        );
    };

    const handleSubheadlineFocus = () => {
        speak(
            "Subheadline: Track deployments, test cases, blockers, retrospectives and more in real time. Designed for productivity — not complexity."
        );
    };

    const handleStatsFocus = (stat) => {
        speak(`${stat.value} - ${stat.label}`);
    };

    useEffect(() => {
        const heroButton = document.getElementById("hero-cta");

        if (heroButton) {
            const handleMouseEnter = () => {
                heroButton.style.boxShadow = "0 0 30px rgba(99, 102, 241, 0.5)";
            };
            const handleMouseLeave = () => {
                heroButton.style.boxShadow = "";
            };
            const handleClick = () => {
                const nextSection = document.getElementById("widgets");
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: "smooth" });
                }
            };

            heroButton.addEventListener("mouseenter", handleMouseEnter);
            heroButton.addEventListener("mouseleave", handleMouseLeave);
            heroButton.addEventListener("click", handleClick);

            return () => {
                heroButton.removeEventListener("mouseenter", handleMouseEnter);
                heroButton.removeEventListener("mouseleave", handleMouseLeave);
                heroButton.removeEventListener("click", handleClick);
            };
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll(".floating-element");
            parallax.forEach((element, index) => {
                const speed = 0.5 + index * 0.1;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const stats = [
        { value: "6", label: "Core Modules" },
        { value: "Real-time", label: "Sprint Tracking" },
        { value: "Zero", label: "Setup Required" },
    ];

    return (
        <section
            id="hero"
            className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-purple-50"
            role="banner"
            aria-label="Hero section - SprintSync introduction"
        >
            {/* Background Grid Pattern */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    transform: "translateY(0px)",
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0px)",
                        backgroundSize: "20px 20px",
                        transform: "translateY(0px)",
                    }}
                ></div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Main Headline */}
                    <h1
                        className="font-inter mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl"
                        tabIndex={0}
                        onFocus={handleHeadlineFocus}
                        role="heading"
                        aria-level="1"
                    >
                        Everything Your Team Needs —<br />
                        <span className="text-indigo-600">
                            In One Sprint Workspace
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="font-inter mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl"
                        tabIndex={0}
                        onFocus={handleSubheadlineFocus}
                        role="text"
                    >
                        Track deployments, test cases, blockers, retrospectives
                        and more in real time. Designed for productivity — not
                        complexity.
                    </p>

                    {/* CTA Button */}
                    <div className="mb-16">
                        <button
                            id="hero-cta"
                            onClick={handleStartNowClick}
                            onKeyDown={handleKeyDown}
                            onFocus={handleButtonFocus}
                            className="font-inter inline-flex transform cursor-pointer items-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl focus:ring-4 focus:ring-indigo-300 focus:outline-none"
                            aria-label="Get started with SprintSync - Navigate to login page"
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

                    {/* Quick Stats */}
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center"
                                tabIndex={0}
                                onFocus={() => handleStatsFocus(stat)}
                                role="text"
                                aria-label={`Statistic: ${stat.value} ${stat.label}`}
                            >
                                <div className="font-inter mb-1 text-2xl font-bold text-indigo-600">
                                    {stat.value}
                                </div>
                                <div className="font-inter text-sm text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div
                className="floating-element absolute top-20 left-10 h-16 w-16 animate-pulse rounded-full bg-purple-200 opacity-60"
                aria-hidden="true"
            ></div>
            <div
                className="floating-element absolute right-10 bottom-20 h-12 w-12 animate-pulse rounded-full bg-indigo-200 opacity-60"
                style={{ animationDelay: "1s" }}
                aria-hidden="true"
            ></div>
            <div
                className="floating-element absolute top-1/2 left-20 h-8 w-8 animate-pulse rounded-full bg-purple-300 opacity-40"
                style={{ animationDelay: "2s" }}
                aria-hidden="true"
            ></div>
        </section>
    );
}

export default Hero;
