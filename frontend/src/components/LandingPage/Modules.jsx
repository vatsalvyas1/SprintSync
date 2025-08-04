import { useEffect, useRef } from "react";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

const modulesData = [
    {
        title: "Deployment Checklist",
        description:
            "Track deployment steps and ownership across sprints with automated progress monitoring.",
        stats: [
            { label: "Current Sprint", value: "Sprint 21" },
            { label: "Completion Rate", value: "90%", color: "text-green-600" },
        ],
    },
    {
        title: "QA Testing",
        description:
            "Manage test cases, track validation progress, and export results for stakeholder reviews.",
        stats: [
            { label: "Active Forms", value: "3" },
            { label: "Pass Rate", value: "75%", color: "text-yellow-600" },
        ],
    },
    {
        title: "AI Test Generator",
        description:
            "Generate comprehensive test cases from specifications using AI-powered analysis and edge case detection.",
        stats: [
            { label: "Tests Generated", value: "127" },
            { label: "Success Rate", value: "94%", color: "text-blue-600" },
        ],
    },
    {
        title: "Retrospectives",
        description:
            "Collect team feedback, track improvement actions, and maintain sprint retrospective history.",
        stats: [
            { label: "Feedback Items", value: "24" },
            {
                label: "Action Items",
                value: "8 Resolved",
                color: "text-green-600",
            },
        ],
    },
    {
        title: "Task Journal",
        description:
            "Track daily work logs outside Jira with time tracking and blocker identification.",
        stats: [
            { label: "Today's Entries", value: "3" },
            { label: "Active Blockers", value: "0", color: "text-green-600" },
        ],
    },
    {
        title: "Form Locker",
        description:
            "Prevent concurrent editing conflicts with real-time form locking and user notifications.",
        stats: [
            { label: "Active Locks", value: "2" },
            {
                label: "Avg Lock Time",
                value: "12 mins",
                color: "text-blue-600",
            },
        ],
    },
];

function Modules() {
    const cardsRef = useRef([]);
    const { speak, announce } = useAccessibility();

    const handleModuleKeyDown = (e, module) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            console.log(`Module activated via keyboard: ${module.title}`);
            speak(`${module.title} module. ${module.description}`);
        }
    };

    const handleModuleFocus = (module) => {
        console.log(`Module focused: ${module.title}`);
        announce(`Module: ${module.title}`, "polite");
    };

    const handleModuleClick = (module) => {
        console.log(`Module clicked: ${module.title}`);
        speak(`${module.title} module clicked. ${module.description}`);
    };

    const handleSectionHeaderFocus = () => {
        speak(
            "Modules section: 6 Modules. 1 Purpose — Sync Your Sprint. Each module designed for real EXL workflows. No complexity, just productivity."
        );
    };

    const handleSectionTitleFocus = () => {
        speak("Section title: 6 Modules. 1 Purpose — Sync Your Sprint.");
    };

    const handleSectionDescriptionFocus = () => {
        speak(
            "Section description: Each module designed for real EXL workflows. No complexity, just productivity."
        );
    };

    const handleModuleTitleFocus = (title) => {
        speak(`Module title: ${title}`);
    };

    const handleModuleDescriptionFocus = (description) => {
        speak(`Module description: ${description}`);
    };

    const handleModuleStatsFocus = (stats) => {
        const statsText = stats
            .map((stat) => `${stat.label}: ${stat.value}`)
            .join(", ");
        speak(`Module statistics: ${statsText}`);
    };

    const handleIndividualStatFocus = (stat) => {
        speak(`${stat.label}: ${stat.value}`);
    };

    useEffect(() => {
        const options = {
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
        }, options);

        cardsRef.current.forEach((card, index) => {
            if (card) {
                card.style.opacity = "0";
                card.style.transform = "translateY(30px)";
                card.style.transition = "all 0.6s ease";
                card.style.transitionDelay = `${index * 0.15}s`;

                observer.observe(card);

                // Click interaction
                card.addEventListener("click", () => {
                    card.style.transform = "scale(0.98) translateY(0)";
                    setTimeout(() => {
                        card.style.transform = "translateY(0)";
                    }, 150);
                });

                // Hover interaction
                card.addEventListener("mouseenter", () => {
                    card.style.transform = "translateY(-4px)";
                    card.style.boxShadow =
                        "0 10px 25px rgba(139, 92, 246, 0.15)";
                });

                card.addEventListener("mouseleave", () => {
                    card.style.transform = "translateY(0)";
                    card.style.boxShadow = "";
                });
            }
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="modules"
            className="bg-white py-16"
            role="region"
            aria-label="SprintSync modules overview"
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
                        6 Modules. 1 Purpose — Sync Your Sprint.
                    </h2>
                    <p
                        className="font-inter mx-auto max-w-2xl text-lg text-gray-600"
                        tabIndex={0}
                        onFocus={handleSectionDescriptionFocus}
                        role="text"
                    >
                        Each module designed for real EXL workflows. No
                        complexity, just productivity.
                    </p>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {modulesData.map((module, index) => (
                        <div
                            key={index}
                            ref={(el) => (cardsRef.current[index] = el)}
                            className="module-card cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:border-purple-300 hover:bg-purple-50"
                            role="article"
                            tabIndex={0}
                            aria-label={`Module: ${module.title}`}
                            onKeyDown={(e) => handleModuleKeyDown(e, module)}
                            onFocus={() => handleModuleFocus(module)}
                            onClick={() => handleModuleClick(module)}
                        >
                            <h3
                                className="font-inter mb-3 text-xl font-semibold text-gray-900"
                                tabIndex={0}
                                onFocus={() =>
                                    handleModuleTitleFocus(module.title)
                                }
                                role="heading"
                                aria-level="3"
                            >
                                {module.title}
                            </h3>
                            <p
                                className="font-inter mb-4 text-gray-600"
                                tabIndex={0}
                                onFocus={() =>
                                    handleModuleDescriptionFocus(
                                        module.description
                                    )
                                }
                                role="text"
                            >
                                {module.description}
                            </p>
                            <div
                                className="space-y-2"
                                tabIndex={0}
                                onFocus={() =>
                                    handleModuleStatsFocus(module.stats)
                                }
                                role="list"
                                aria-label={`${module.title} statistics`}
                            >
                                {module.stats.map((stat, statIndex) => (
                                    <div
                                        key={statIndex}
                                        className="flex justify-between text-sm"
                                        tabIndex={0}
                                        onFocus={() =>
                                            handleIndividualStatFocus(stat)
                                        }
                                        role="listitem"
                                        aria-label={`${stat.label}: ${stat.value}`}
                                    >
                                        <span className="font-inter text-gray-500">
                                            {stat.label}
                                        </span>
                                        <span
                                            className={`font-inter font-medium ${stat.color || "text-gray-700"}`}
                                        >
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Modules;
