import { useEffect, useRef } from "react";

function PublicDashboard() {
    const dashboardRef = useRef(null);

    useEffect(() => {
       
        const dashboardObserverOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const dashboardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, dashboardObserverOptions);

        // Initialize dashboard cards with staggered animation
        const dashboardCards =
            dashboardRef.current?.querySelectorAll(".dashboard-card");

        dashboardCards?.forEach((card, index) => {
            // Set initial state
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            card.style.transition = "all 0.6s ease";
            card.style.transitionDelay = `${index * 0.1}s`;

            // Observe for intersection
            dashboardObserver.observe(card);
        });

        // Add hover effects for dashboard cards
        dashboardCards?.forEach((card) => {
            const handleMouseEnter = function () {
                this.style.transform = "translateY(-2px)";
                this.style.boxShadow = "0 10px 25px rgba(99, 102, 241, 0.1)";
            };

            const handleMouseLeave = function () {
                this.style.transform = "translateY(0)";
                this.style.boxShadow = "";
            };

            card.addEventListener("mouseenter", handleMouseEnter);
            card.addEventListener("mouseleave", handleMouseLeave);

            // Cleanup function
            return () => {
                card.removeEventListener("mouseenter", handleMouseEnter);
                card.removeEventListener("mouseleave", handleMouseLeave);
            };
        });

        // Animate circular progress on scroll
        const progressCircle = dashboardRef.current?.querySelector(
            'circle[stroke="#10b981"]'
        );
        if (progressCircle) {
            const animateProgress = () => {
                progressCircle.style.transition =
                    "stroke-dashoffset 2s ease-in-out";
            };

            const progressCard = progressCircle.closest(".dashboard-card");
            if (progressCard) {
                dashboardObserver.observe(progressCard);
            }
            setTimeout(animateProgress, 500);
        }

        // Cleanup observer
        return () => {
            dashboardObserver.disconnect();
        };
    }, []);


    return (
        <div ref={dashboardRef}>
            <section id="dashboard" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="font-sans text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Visualize Your Sprint Activity
                        </h2>
                        <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">
                            Real-time dashboard showing your team's progress,
                            blockers, and achievements.
                        </p>
                    </div>
                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sprint Progress Card */}
                        <div className="dashboard-card bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-sans text-lg font-semibold text-gray-900">
                                    Sprint Progress
                                </h3>
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    On Track
                                </span>
                            </div>

                            {/* Circular Progress */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative w-24 h-24">
                                    <svg
                                        className="w-24 h-24 transform -rotate-90"
                                        viewBox="0 0 100 100"
                                    >
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                            fill="none"
                                        ></circle>
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            stroke="#10b981"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray="251.2"
                                            strokeDashoffset="50.24"
                                            strokeLinecap="round"
                                            style={{
                                                transition:
                                                    "stroke-dashoffset 2s ease-in-out",
                                            }}
                                        ></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="font-sans text-xl font-bold text-gray-900">
                                            80%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-sans text-gray-500">
                                        Completed Tasks
                                    </span>
                                    <span className="font-sans text-gray-900 font-medium">
                                        24/30
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-sans text-gray-500">
                                        Days Remaining
                                    </span>
                                    <span className="font-sans text-gray-900 font-medium">
                                        3
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Items Card */}
                        <div className="dashboard-card bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-sans text-lg font-semibold text-gray-900">
                                    Recent Feedback
                                </h3>
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    4 New
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-sans text-sm text-gray-900 font-medium">
                                            API integration completed
                                        </p>
                                        <p className="font-sans text-xs text-gray-500">
                                            Dev Team • 2h ago
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-sans text-sm text-gray-900 font-medium">
                                            UI review needed
                                        </p>
                                        <p className="font-sans text-xs text-gray-500">
                                            Design Team • 4h ago
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-sans text-sm text-gray-900 font-medium">
                                            Test cases updated
                                        </p>
                                        <p className="font-sans text-xs text-gray-500">
                                            QA Team • 6h ago
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-sans text-sm text-gray-900 font-medium">
                                            Sprint planning done
                                        </p>
                                        <p className="font-sans text-xs text-gray-500">
                                            Scrum Master • 1d ago
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Locker Status Card */}
                        <div className="dashboard-card bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-sans text-lg font-semibold text-gray-900">
                                    Editing Now
                                </h3>
                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                    2 Active
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="border border-red-200 rounded-lg p-3 bg-red-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-sans text-sm font-medium text-gray-900">
                                            Form 127
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="font-sans text-xs text-red-600">
                                                Locked
                                            </span>
                                        </div>
                                    </div>
                                    <p className="font-sans text-xs text-gray-600">
                                        Ravi Kumar • Since 2:35 PM
                                    </p>
                                </div>

                                <div className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-sans text-sm font-medium text-gray-900">
                                            Test Plan v2
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                            <span className="font-sans text-xs text-yellow-600">
                                                Editing
                                            </span>
                                        </div>
                                    </div>
                                    <p className="font-sans text-xs text-gray-600">
                                        Sarah Chen • Since 3:12 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Journal Entries Card */}
                        <div className="dashboard-card bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-sans text-lg font-semibold text-gray-900">
                                    Today's Journal Entries
                                </h3>
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    3 Entries
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-sans text-sm font-medium text-gray-900">
                                            Started API integration
                                        </span>
                                        <span className="font-sans text-xs text-gray-500">
                                            9:30 AM
                                        </span>
                                    </div>
                                    <p className="font-sans text-sm text-gray-600">
                                        Working on user authentication
                                        endpoints. Initial setup completed.
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                            Backend
                                        </span>
                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                            2.5h logged
                                        </span>
                                    </div>
                                </div>

                                <div className="border-l-4 border-green-500 pl-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-sans text-sm font-medium text-gray-900">
                                            Code review completed
                                        </span>
                                        <span className="font-sans text-xs text-gray-500">
                                            11:15 AM
                                        </span>
                                    </div>
                                    <p className="font-sans text-sm text-gray-600">
                                        Reviewed PR #234 for payment gateway
                                        integration. Approved with minor
                                        suggestions.
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                                            Review
                                        </span>
                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                            1h logged
                                        </span>
                                    </div>
                                </div>

                                <div className="border-l-4 border-purple-500 pl-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-sans text-sm font-medium text-gray-900">
                                            Testing phase initiated
                                        </span>
                                        <span className="font-sans text-xs text-gray-500">
                                            2:45 PM
                                        </span>
                                    </div>
                                    <p className="font-sans text-sm text-gray-600">
                                        Started unit testing for new
                                        authentication module. 8/12 tests
                                        passing.
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                                            Testing
                                        </span>
                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                            1.5h logged
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="dashboard-card bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                            <h3 className="font-sans text-lg font-semibold text-gray-900 mb-4">
                                Quick Stats
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-sans text-sm text-gray-600">
                                        Active Blockers
                                    </span>
                                    <span className="font-sans text-2xl font-bold text-green-600">
                                        0
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="font-sans text-sm text-gray-600">
                                        Tests Generated
                                    </span>
                                    <span className="font-sans text-2xl font-bold text-blue-600">
                                        127
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="font-sans text-sm text-gray-600">
                                        Forms Locked
                                    </span>
                                    <span className="font-sans text-2xl font-bold text-red-600">
                                        2
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="font-sans text-sm text-gray-600">
                                        Time Logged
                                    </span>
                                    <span className="font-sans text-2xl font-bold text-purple-600">
                                        5h
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PublicDashboard;
