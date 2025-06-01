import { useEffect, useRef } from 'react';

const modulesData = [
  {
    title: "Deployment Checklist",
    description: "Track deployment steps and ownership across sprints with automated progress monitoring.",
    stats: [
      { label: "Current Sprint", value: "Sprint 21" },
      { label: "Completion Rate", value: "90%", color: "text-green-600" },
    ],
  },
  {
    title: "QA Testing",
    description: "Manage test cases, track validation progress, and export results for stakeholder reviews.",
    stats: [
      { label: "Active Forms", value: "3" },
      { label: "Pass Rate", value: "75%", color: "text-yellow-600" },
    ],
  },
  {
    title: "AI Test Generator",
    description: "Generate comprehensive test cases from specifications using AI-powered analysis and edge case detection.",
    stats: [
      { label: "Tests Generated", value: "127" },
      { label: "Success Rate", value: "94%", color: "text-blue-600" },
    ],
  },
  {
    title: "Retrospectives",
    description: "Collect team feedback, track improvement actions, and maintain sprint retrospective history.",
    stats: [
      { label: "Feedback Items", value: "24" },
      { label: "Action Items", value: "8 Resolved", color: "text-green-600" },
    ],
  },
  {
    title: "Task Journal",
    description: "Track daily work logs outside Jira with time tracking and blocker identification.",
    stats: [
      { label: "Today's Entries", value: "3" },
      { label: "Active Blockers", value: "0", color: "text-green-600" },
    ],
  },
  {
    title: "Form Locker",
    description: "Prevent concurrent editing conflicts with real-time form locking and user notifications.",
    stats: [
      { label: "Active Locks", value: "2" },
      { label: "Avg Lock Time", value: "12 mins", color: "text-blue-600" },
    ],
  },
];

function Modules() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, options);

    cardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = `${index * 0.15}s`;

        observer.observe(card);

        // Click interaction
        card.addEventListener('click', () => {
          card.style.transform = 'scale(0.98) translateY(0)';
          setTimeout(() => {
            card.style.transform = 'translateY(0)';
          }, 150);
        });

        // Hover interaction
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = '';
        });
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="modules" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-inter text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            6 Modules. 1 Purpose — Sync Your Sprint.
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Each module designed for real EXL workflows. No complexity, just productivity.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modulesData.map((module, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="module-card bg-gray-50 rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 cursor-pointer"
            >
              <h3 className="font-inter text-xl font-semibold text-gray-900 mb-3">{module.title}</h3>
              <p className="font-inter text-gray-600 mb-4">{module.description}</p>
              <div className="space-y-2">
                {module.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="flex justify-between text-sm">
                    <span className="font-inter text-gray-500">{stat.label}</span>
                    <span className={`font-inter font-medium ${stat.color || "text-gray-700"}`}>
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
