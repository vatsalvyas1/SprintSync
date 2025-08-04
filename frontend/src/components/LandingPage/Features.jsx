import { useEffect, useRef } from "react";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

function Features() {
    const cardsRef = useRef([]);
    const { speak, announce } = useAccessibility();

    const handleCardKeyDown = (e, widget) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            console.log(`Feature card activated via keyboard: ${widget.title}`);
            speak(
                `${widget.title}: ${widget.status}. ${widget.description[0]}`
            );
        }
    };

    const handleCardFocus = (widget) => {
        console.log(`Feature card focused: ${widget.title}`);
        announce(`Feature card: ${widget.title}`, "polite");
    };

    const handleCardClick = (widget) => {
        console.log(`Feature card clicked: ${widget.title}`);
        speak(`${widget.title} card clicked. ${widget.description.join(". ")}`);
    };

    const handleSectionHeaderFocus = () => {
        speak(
            "Features section: Real SprintSync modules in action. See how your team's work flows seamlessly."
        );
    };

    const handleSectionTitleFocus = () => {
        speak("Section title: Features");
    };

    const handleSectionDescriptionFocus = () => {
        speak(
            "Section description: Real SprintSync modules in action. See how your team's work flows seamlessly."
        );
    };

    const handleFeatureTitleFocus = (title) => {
        speak(`Feature title: ${title}`);
    };

    const handleFeatureStatusFocus = (status) => {
        speak(`Status: ${status}`);
    };

    const handleFeatureDescriptionFocus = (description) => {
        speak(`Description: ${description.join(". ")}`);
    };

    const handleProgressFocus = (progress) => {
        speak(`Progress: ${progress} completed`);
    };

    const handleTagsFocus = (tags) => {
        speak(`Tags: ${tags.join(", ")}`);
    };

    const handleIndicatorsFocus = (indicators) => {
        const statuses = indicators.map((indicator, index) => {
            if (indicator.includes("green")) return "completed";
            if (indicator.includes("yellow")) return "pending";
            if (indicator.includes("red")) return "blocked";
            return "unknown";
        });
        speak(`Status indicators: ${statuses.join(", ")}`);
    };

    const handleLogsFocus = (logs) => {
        speak(`Activity logs: ${logs.join(". ")}`);
    };

    const handleLockedFocus = () => {
        speak("Currently being edited by another user");
    };

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, observerOptions);

        cardsRef.current.forEach((card, index) => {
            if (card) {
                card.style.opacity = "0";
                card.style.transform = "translateY(20px)";
                card.style.transition =
                    "opacity 0.6s ease, transform 0.6s ease";
                card.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(card);

                card.addEventListener("click", () => {
                    card.style.transform = "scale(0.98)";
                    setTimeout(() => {
                        card.style.transform = "translateY(0)";
                    }, 150);
                });

                card.addEventListener("mouseenter", () => {
                    card.style.boxShadow =
                        "0 10px 25px rgba(99, 102, 241, 0.15)";
                });

                card.addEventListener("mouseleave", () => {
                    card.style.boxShadow = "";
                });
            }
        });

        return () => observer.disconnect();
    }, []);

    const widgetData = [
        {
            title: "Deployment Checklist",
            status: "✔ Done",
            badgeClass: "bg-green-100 text-green-800",
            description: ["Sprint 21: 9/10 steps done", "Owner: Dev 1"],
            progress: "90%",
            progressColor: "bg-green-500",
        },
        {
            title: "QA Testing",
            status: "⚠ Pending",
            badgeClass: "bg-yellow-100 text-yellow-800",
            description: ["Form X: 6/8 checks passed", "Export Ready"],
            progress: "75%",
            progressColor: "bg-yellow-500",
        },
        {
            title: "AI Test Generator",
            status: "🤖 Active",
            badgeClass: "bg-blue-100 text-blue-800",
            description: [
                `"Generated 5 test cases from spec input"`,
                "Last run: 2 mins ago",
            ],
            tags: ["Edge Cases", "API Tests"],
        },
        {
            title: "Retrospectives",
            status: "✔ Done",
            badgeClass: "bg-green-100 text-green-800",
            description: ["Sprint 20: 4 feedback logs", "View Summary"],
            indicators: [
                "bg-green-400",
                "bg-green-400",
                "bg-yellow-400",
                "bg-red-400",
            ],
        },
        {
            title: "Task Journal",
            status: "✔ Updated",
            badgeClass: "bg-green-100 text-green-800",
            description: ["Today: 3 entries logged", "Blocker: None"],
            logs: [
                "• 9:30 AM - Started API integration",
                "• 11:15 AM - Code review completed",
                "• 2:45 PM - Testing phase initiated",
            ],
        },
        {
            title: "Form Locker",
            status: "🔒 Locked",
            badgeClass: "bg-red-100 text-red-800",
            description: ["Form 127", "Locked by: Ravi", "Since 2:35 PM"],
            locked: true,
        },
    ];

    return (
        <section
            id="widgets"
            className="bg-gray-50 py-16"
            role="main"
            aria-label="Features section showing SprintSync modules"
            tabIndex={0}
            onFocus={handleSectionHeaderFocus}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <h2
                        className="font-inter mb-4 text-3xl font-bold text-gray-900 sm:text-4xl"
                        tabIndex={0}
                        onFocus={handleSectionTitleFocus}
                        role="heading"
                        aria-level="2"
                    >
                        Features
                    </h2>
                    <p
                        className="font-inter mx-auto max-w-2xl text-lg text-gray-600"
                        tabIndex={0}
                        onFocus={handleSectionDescriptionFocus}
                        role="text"
                    >
                        Real SprintSync modules in action. See how your team's
                        work flows seamlessly.
                    </p>
                </div>

                {/* Widget Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {widgetData.map((widget, i) => (
                        <div
                            key={i}
                            ref={(el) => (cardsRef.current[i] = el)}
                            className="widget-card cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg"
                            role="article"
                            tabIndex={0}
                            aria-label={`Feature card: ${widget.title} - ${widget.status}`}
                            onKeyDown={(e) => handleCardKeyDown(e, widget)}
                            onFocus={() => handleCardFocus(widget)}
                            onClick={() => handleCardClick(widget)}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3
                                    className="font-inter text-lg font-semibold text-gray-900"
                                    tabIndex={0}
                                    onFocus={() =>
                                        handleFeatureTitleFocus(widget.title)
                                    }
                                    role="heading"
                                    aria-level="3"
                                >
                                    {widget.title}
                                </h3>
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${widget.badgeClass}`}
                                    aria-label={`Status: ${widget.status}`}
                                    tabIndex={0}
                                    onFocus={() =>
                                        handleFeatureStatusFocus(widget.status)
                                    }
                                    role="status"
                                >
                                    {widget.status}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {widget.description.map((desc, idx) => (
                                    <p
                                        key={idx}
                                        className={`font-inter text-sm ${
                                            idx === 0
                                                ? "text-gray-600"
                                                : "text-gray-500"
                                        }`}
                                        tabIndex={0}
                                        onFocus={() =>
                                            handleFeatureDescriptionFocus(
                                                widget.description
                                            )
                                        }
                                        role="text"
                                    >
                                        {desc}
                                    </p>
                                ))}

                                {widget.progress && (
                                    <div
                                        className="h-2 w-full rounded-full bg-gray-200"
                                        role="progressbar"
                                        aria-valuenow={parseInt(
                                            widget.progress
                                        )}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        tabIndex={0}
                                        onFocus={() =>
                                            handleProgressFocus(widget.progress)
                                        }
                                        aria-label={`Progress: ${widget.progress}`}
                                    >
                                        <div
                                            className={`h-2 rounded-full ${widget.progressColor}`}
                                            style={{ width: widget.progress }}
                                        ></div>
                                    </div>
                                )}

                                {widget.tags && (
                                    <div
                                        className="flex space-x-2"
                                        tabIndex={0}
                                        onFocus={() =>
                                            handleTagsFocus(widget.tags)
                                        }
                                        role="list"
                                        aria-label="Tags"
                                    >
                                        {widget.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700"
                                                role="listitem"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {widget.indicators && (
                                    <div
                                        className="flex space-x-1"
                                        aria-label="Status indicators"
                                        tabIndex={0}
                                        onFocus={() =>
                                            handleIndicatorsFocus(
                                                widget.indicators
                                            )
                                        }
                                        role="list"
                                    >
                                        {widget.indicators.map((clr, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-2 w-2 ${clr} rounded-full`}
                                                role="listitem"
                                            />
                                        ))}
                                    </div>
                                )}

                                {widget.logs && (
                                    <div
                                        className="space-y-1 text-xs text-gray-400"
                                        tabIndex={0}
                                        onFocus={() =>
                                            handleLogsFocus(widget.logs)
                                        }
                                        role="list"
                                        aria-label="Activity logs"
                                    >
                                        {widget.logs.map((log, idx) => (
                                            <p key={idx} role="listitem">
                                                {log}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {widget.locked && (
                                    <div
                                        className="flex items-center space-x-2"
                                        tabIndex={0}
                                        onFocus={handleLockedFocus}
                                        role="status"
                                        aria-label="Currently being edited"
                                    >
                                        <div
                                            className="h-2 w-2 animate-pulse rounded-full bg-red-500"
                                            aria-hidden="true"
                                        ></div>
                                        <span className="text-xs text-red-600">
                                            Currently editing
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
