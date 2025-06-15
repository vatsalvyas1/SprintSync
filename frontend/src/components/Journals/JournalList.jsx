import { useEffect, useState } from "react";

function JournalList({ newEntry }) {
    const [journals, setJournals] = useState([]);
    const [filters, setFilters] = useState({
        date: "all",
        user: "all",
        taskType: "all",
    });

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const fetchJournals = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/v1/journal`);
            if (!res.ok) throw new Error("Failed to fetch journals");
            const data = await res.json();
            setJournals(data);
        } catch (err) {
            console.error("Error fetching journals:", err.message);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, []);

    useEffect(() => {
        if (newEntry) {
            setJournals((prev) => [newEntry, ...prev]);
        }
    }, [newEntry]);

    const teamMembers = [
        ...new Set(journals.map((j) => j.user?.name).filter(Boolean)),
    ];

    const applyFilters = (entries) => {
        const now = new Date();

        return entries.filter((entry) => {
            const entryDate = new Date(entry.startTime);

            if (filters.date === "today") {
                if (entryDate.toDateString() !== now.toDateString())
                    return false;
            } else if (filters.date === "week") {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                if (entryDate < startOfWeek) return false;
            } else if (filters.date === "month") {
                if (
                    entryDate.getMonth() !== now.getMonth() ||
                    entryDate.getFullYear() !== now.getFullYear()
                )
                    return false;
            }

            if (filters.user !== "all" && entry.user?.name !== filters.user)
                return false;
            if (
                filters.taskType !== "all" &&
                entry.taskType !== filters.taskType
            )
                return false;

            return true;
        });
    };

    const parseDuration = (duration) => {
        let hours = 0;
        let minutes = 0;
        const hMatch = duration.match(/(\d+)h/);
        const mMatch = duration.match(/(\d+)m/);
        if (hMatch) hours = parseInt(hMatch[1]);
        if (mMatch) minutes = parseInt(mMatch[1]);
        return hours * 60 + minutes;
    };

    const getThisWeekSummary = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const thisWeekEntries = journals.filter((j) => {
            const entryDate = new Date(j.startTime);
            const isThisWeek = entryDate >= startOfWeek;

            // Filter by selected user (if not "all")
            const isMatchingUser =
                filters.user === "all" || j.user?.name === filters.user;

            return isThisWeek && isMatchingUser;
        });

        let totalMinutes = 0;
        let meetings = 0;
        for (const entry of thisWeekEntries) {
            totalMinutes += parseDuration(entry.duration || "0m");
            if (entry.taskType === "meeting") meetings++;
        }

        return {
            totalTime: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
            tasksCompleted: thisWeekEntries.length,
            meetings,
        };
    };

    const getTaskTypeColor = (taskType) => {
        const colors = {
            development: "bg-blue-100 text-blue-800",
            testing: "bg-green-100 text-green-800",
            "bug fixes": "bg-orange-100 text-orange-800",
            meeting: "bg-purple-100 text-purple-800",
        };
        return colors[taskType] || "bg-gray-100 text-gray-800";
    };

    const getTaskTypeDotColor = (taskType) => {
        const colors = {
            development: "bg-blue-500",
            testing: "bg-green-500",
            "bug fixes": "bg-orange-500",
            meeting: "bg-purple-500",
        };
        return colors[taskType] || "bg-gray-500";
    };

    const groupJournalsByDate = (journals) => {
        const grouped = {};
        journals.forEach((journal) => {
            const date = new Date(journal.startTime).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(journal);
        });
        return grouped;
    };

    const filteredJournals = applyFilters(journals);
    const summary = getThisWeekSummary();
    const groupedJournals = groupJournalsByDate(filteredJournals);

    return (
        <div className="mt-6 md:ml-64 md:min-h-screen">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Journal Entries
            </h2>

            {/* Weekly Summary Card */}
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    This Week Summary
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="text-center">
                        <div className="mb-1 text-2xl font-bold text-blue-600">
                            {summary.totalTime}
                        </div>
                        <div className="text-sm text-gray-600">Total Time</div>
                    </div>
                    <div className="text-center">
                        <div className="mb-1 text-2xl font-bold text-green-600">
                            {summary.tasksCompleted}
                        </div>
                        <div className="text-sm text-gray-600">
                            Tasks Completed
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="mb-1 text-2xl font-bold text-purple-600">
                            {summary.meetings}
                        </div>
                        <div className="text-sm text-gray-600">Meetings</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                <div className="flex flex-col space-y-1 md:flex-row md:items-center md:space-y-0 md:space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                        Filter by:
                    </label>
                    <select
                        value={filters.date}
                        onChange={(e) =>
                            setFilters({ ...filters, date: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
                    >
                        <option value="all">All Dates</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>

                <div className="flex flex-col space-y-1 md:flex-row md:items-center md:space-y-0 md:space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                        Person:
                    </label>
                    <select
                        value={filters.user}
                        onChange={(e) =>
                            setFilters({ ...filters, user: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
                    >
                        <option value="all">All Team Members</option>
                        {teamMembers.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col space-y-1 md:flex-row md:items-center md:space-y-0 md:space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                        Task Type:
                    </label>
                    <select
                        value={filters.taskType}
                        onChange={(e) =>
                            setFilters({ ...filters, taskType: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-auto"
                    >
                        <option value="all">All Tasks</option>
                        <option value="development">Development</option>
                        <option value="testing">Testing</option>
                        <option value="bug fixes">Bug Fixes</option>
                        <option value="meeting">Meeting</option>
                    </select>
                </div>
            </div>

            {/* Timeline Layout */}
            <div className="space-y-8">
                {Object.keys(groupedJournals).length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                        <p className="text-gray-500">
                            No journal entries found.
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedJournals).map(([date, entries]) => {
                        const totalDuration = entries.reduce((total, entry) => {
                            return (
                                total + parseDuration(entry.duration || "0m")
                            );
                        }, 0);
                        const totalTime = `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`;

                        return (
                            <div
                                key={date}
                                className="rounded-lg border border-gray-200 bg-white p-6"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {new Date(date).toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </h2>
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                            {entries.length} tasks • {totalTime}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {entries.map((journal) => (
                                        <div
                                            key={journal._id}
                                            className="flex items-start space-x-4 rounded-lg bg-gray-50 p-4"
                                        >
                                            <div
                                                className={`mt-2 h-2 w-2 rounded-full ${getTaskTypeDotColor(journal.taskType)}`}
                                            ></div>
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <h3 className="text-sm font-medium text-gray-900">
                                                        {journal.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-2">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTaskTypeColor(journal.taskType)}`}
                                                        >
                                                            {journal.taskType
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                journal.taskType.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {journal.duration}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="mb-2 text-sm text-gray-600">
                                                    {journal.description}
                                                </p>
                                                {journal.dailyNotes && (
                                                    <p className="mb-2 text-sm text-gray-500 italic">
                                                        Notes:{" "}
                                                        {journal.dailyNotes}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-xs font-medium text-white">
                                                            {journal.user?.name?.charAt(
                                                                0
                                                            ) || "U"}
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {journal.user
                                                                ?.name ||
                                                                "Unknown User"}{" "}
                                                            •{" "}
                                                            {new Date(
                                                                journal.startTime
                                                            ).toLocaleTimeString(
                                                                "en-US",
                                                                {
                                                                    hour: "numeric",
                                                                    minute: "2-digit",
                                                                    hour12: true,
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Legend */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded bg-blue-100"></div>
                        <span className="text-gray-600">Development</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded bg-green-100"></div>
                        <span className="text-gray-600">Testing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded bg-orange-100"></div>
                        <span className="text-gray-600">Bug Fixes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded bg-purple-100"></div>
                        <span className="text-gray-600">Meetings</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JournalList;
