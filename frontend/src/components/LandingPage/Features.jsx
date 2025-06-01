import { useEffect, useRef } from "react";

function Features() {
  const cardsRef = useRef([]);

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
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);

        card.addEventListener("click", () => {
          card.style.transform = "scale(0.98)";
          setTimeout(() => {
            card.style.transform = "translateY(0)";
          }, 150);
        });

        card.addEventListener("mouseenter", () => {
          card.style.boxShadow = "0 10px 25px rgba(99, 102, 241, 0.15)";
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
      indicators: ["bg-green-400", "bg-green-400", "bg-yellow-400", "bg-red-400"],
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
    <section id="widgets" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-inter text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Features
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Real SprintSync modules in action. See how your team's work flows
            seamlessly.
          </p>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgetData.map((widget, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="widget-card bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-inter text-lg font-semibold text-gray-900">
                  {widget.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${widget.badgeClass}`}
                >
                  {widget.status}
                </span>
              </div>
              <div className="space-y-2">
                {widget.description.map((desc, idx) => (
                  <p
                    key={idx}
                    className={`font-inter text-sm ${
                      idx === 0 ? "text-gray-600" : "text-gray-500"
                    }`}
                  >
                    {desc}
                  </p>
                ))}

                {widget.progress && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${widget.progressColor}`}
                      style={{ width: widget.progress }}
                    ></div>
                  </div>
                )}

                {widget.tags && (
                  <div className="flex space-x-2">
                    {widget.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {widget.indicators && (
                  <div className="flex space-x-1">
                    {widget.indicators.map((clr, idx) => (
                      <div key={idx} className={`w-2 h-2 ${clr} rounded-full`} />
                    ))}
                  </div>
                )}

                {widget.logs && (
                  <div className="text-xs text-gray-400 space-y-1">
                    {widget.logs.map((log, idx) => (
                      <p key={idx}>{log}</p>
                    ))}
                  </div>
                )}

                {widget.locked && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
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
