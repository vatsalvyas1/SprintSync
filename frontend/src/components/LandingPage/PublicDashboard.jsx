import { useState, useEffect } from "react";
import { backendUrl } from "../../constant";
import { Link } from "react-router-dom";

function PublicDashboard() {
  const [forms, setForms] = useState([]);
  const [journals, setJournals] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sprintCount, setSprintCount] = useState();

  const fetchForms = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/v1/form/`);
      const data = await res.json();
      setForms(data);
    } catch (err) {
      console.error("Failed to fetch forms:", err);
    }
  };

  const fetchJournals = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/v1/journal`);
      if (!res.ok) throw new Error("Failed to fetch journals");
      const data = await res.json();
      setJournals(data);
    } catch (err) {
      console.error("Error fetching journals:", err.message);
    }
  };

  const fetchChecklists = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/v1/checklist/checklists`);
      const data = await res.json();
      setChecklists(data.data || []);
    } catch (err) {
      console.error("Error fetching checklists:", err.message);
    }
  };

  const fetchSprintCount = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/v1/retrospectives/get-all-sprint-count`);
      const data = await res.json();
      setSprintCount(data.data.count);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  }

  const fetchData = async () => {
    setLoading(true); // Set loading to true when starting fetch
    try {
      await Promise.all([fetchForms(), fetchJournals(), fetchChecklists(), fetchSprintCount()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Always set loading to false when done
    }
  };

  useEffect(() => {
    fetchData(); // Remove the duplicate fetchSprintCount() call
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const lockedFormsCount = forms.filter((form) => form.isLocked).length;

  const getTodaysTasksCount = () => {
    const now = new Date();
    return journals.filter((entry) => {
      const entryDate = new Date(entry.startTime);
      return entryDate.toDateString() === now.toDateString();
    }).length;
  };

  const todaysTasksCount = getTodaysTasksCount();

  const calculateCompletionPercentage = (items) => {
    if (!items || items.length === 0) return 0;
    const doneItems = items.filter(item => item.status === 'done').length;
    return Math.round((doneItems / items.length) * 100);
  };

  const getPendingDeploymentsCount = () => {
    return checklists.filter((checklist) => {
      const completionPercentage = calculateCompletionPercentage(checklist.checklistItems);
      return completionPercentage < 100;
    }).length;
  };

  const pendingDeploymentsCount = getPendingDeploymentsCount();

  return (
    <div className="md:ml-64 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Control Center</h1>
        <p className="text-gray-600">Your development workflow at a glance</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          color="blue"
          count={loading ? "..." : lockedFormsCount.toString()}
          title="Active Forms"
          description="Currently checked out"
          iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />

        <DashboardCard
          color="orange"
          count={loading ? "..." : pendingDeploymentsCount.toString()}
          title="Pending Deployments"
          description="Awaiting release"
          iconPath="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />

        <DashboardCard
          color="green"
          count={loading ? "..." : todaysTasksCount.toString()}
          title="Today's Tasks"
          description="Development items"
          iconPath="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />

        <DashboardCard
          color="indigo"
          count={loading ? "..." : (sprintCount?.toString() || "0")}
          title="Total Sprints"
          description="Retrospective Summary"
          iconPath="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>

          <div className="space-y-4">
            {[
              {
                iconBg: "bg-green-100",
                iconColor: "text-green-600",
                iconPath: "M5 13l4 4L19 7",
                content: "Form validation deployment completed",
                time: "2 minutes ago",
                badge: "Done",
                badgeColor: "bg-green-100 text-green-800"
              },
              {
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
                iconPath: "M12 6v6m0 0v6m0-6h6m-6 0H6",
                content: "New QA checklist created for Survey Builder v2.1",
                time: "15 minutes ago",
                badge: "New",
                badgeColor: "bg-blue-100 text-blue-800"
              },
              {
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                iconPath: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
                content: "Sarah Chen checked out Form Builder Core",
                time: "1 hour ago",
                badge: "Locked",
                badgeColor: "bg-orange-100 text-orange-800"
              },
              {
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
                iconPath: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                content: "Sprint retrospective feedback submitted",
                time: "3 hours ago",
                badge: "Feedback",
                badgeColor: "bg-purple-100 text-purple-800"
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${item.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <svg
                    className={`w-4 h-4 ${item.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={item.iconPath}
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{item.content}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Team Status + Sprint Progress */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/deployment" className="block">
                <ActionButton
                  label="New Checklist"
                  iconPath="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  color="blue"
                />
              </Link>
              <Link to="/ai-test-generator" className="block">
                <ActionButton
                  label="Start QA Test"
                  iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  color="white"
                  textColor="gray-700"
                />
              </Link>
              <Link to="/retrospectives" className="block">
                <ActionButton
                  label="Add Retro Item"
                  iconPath="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  color="white"
                  textColor="gray-700"
                />
              </Link>
            </div>
          </div>

          {/* Team Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Status</h3>
            {[
              {
                name: "Alex Johnson",
                role: "Frontend Dev",
                status: "Available",
                badgeColor: "bg-green-100 text-green-800",
                img: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1750528458/3_va6uqp.png",
              },
              {
                name: "Sarah Chen",
                role: "QA Engineer",
                status: "Testing",
                badgeColor: "bg-orange-100 text-orange-800",
                img: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1750528458/3_va6uqp.png",
              },
              {
                name: "Mike Rodriguez",
                role: "Backend Dev",
                status: "Deploying",
                badgeColor: "bg-blue-100 text-blue-800",
                img: "https://res.cloudinary.com/dhrhfuzb0/image/upload/v1750528458/3_va6uqp.png",
              },
            ].map((member, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={member.img}
                    alt={member.name}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${member.badgeColor}`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>

          {/* Sprint Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sprint Progress</h3>
            <div className="relative h-48 w-full bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart would be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionButton = ({ label, iconPath, color, textColor = "white" }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      text: "text-white"
    },
    white: {
      bg: "bg-white",
      hover: "hover:bg-gray-50",
      text: "text-gray-700"
    }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <button
      className={`w-full flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors border border-gray-300 ${colors.bg} ${colors.hover} ${colors.text}`}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={iconPath}
        />
      </svg>
      {label}
    </button>
  );
}

const DashboardCard = ({ color, count, title, description, iconPath }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'hover:border-blue-300'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      border: 'hover:border-orange-300'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'hover:border-green-300'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'hover:border-purple-300'
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      border: 'hover:border-indigo-300'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${colors.border} transition-colors`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <svg
            className={`w-6 h-6 ${colors.text}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={iconPath}
            />
          </svg>
        </div>
        <span className={`text-2xl font-bold ${colors.text}`}>{count}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
};

export default PublicDashboard;