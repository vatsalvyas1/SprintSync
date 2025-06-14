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

  const teamMembers = [...new Set(journals.map(j => j.user?.name).filter(Boolean))];

  const applyFilters = (entries) => {
    const now = new Date();

    return entries.filter((entry) => {
      const entryDate = new Date(entry.startTime);

      if (filters.date === "today") {
        if (entryDate.toDateString() !== now.toDateString()) return false;
      } else if (filters.date === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        if (entryDate < startOfWeek) return false;
      } else if (filters.date === "month") {
        if (
          entryDate.getMonth() !== now.getMonth() ||
          entryDate.getFullYear() !== now.getFullYear()
        ) return false;
      }

      if (filters.user !== "all" && entry.user?.name !== filters.user) return false;
      if (filters.taskType !== "all" && entry.taskType !== filters.taskType) return false;

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


  const filteredJournals = applyFilters(journals);
  const summary = getThisWeekSummary();

  return (
    <div className="mt-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Journal Entries</h2>

   {/* Weekly Summary Card */}
<div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week Summary</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="text-center">
      <div className="text-2xl font-bold text-blue-600 mb-1">
        {getThisWeekSummary().totalTime}
      </div>
      <div className="text-sm text-gray-600">Total Time</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-green-600 mb-1">
        {getThisWeekSummary().tasksCompleted}
      </div>
      <div className="text-sm text-gray-600">Tasks Completed</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-purple-600 mb-1">
        {getThisWeekSummary().meetings}
      </div>
      <div className="text-sm text-gray-600">Meetings</div>
    </div>
  </div>
</div>


      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All Team Members</option>
          {teamMembers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={filters.taskType}
          onChange={(e) => setFilters({ ...filters, taskType: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All Task Types</option>
          <option value="development">Development</option>
          <option value="testing">Testing</option>
          <option value="bug fixes">Bug Fixes</option>
          <option value="meeting">Meeting</option>
        </select>
      </div>

      {filteredJournals.length === 0 ? (
        <p>No journal entries found.</p>
      ) : (
        filteredJournals.map((journal) => (
          <div
            key={journal._id}
            className="border p-4 rounded mb-4 bg-gray-50 shadow-sm"
          >
            <p className="text-sm text-gray-500 mb-1">
              <strong>Added by:</strong> {journal.user?.name || "Unknown User"}
            </p>
            <h3 className="font-semibold text-lg">{journal.title}</h3>
            <p className="text-sm text-gray-700">{journal.description}</p>
            <p className="text-sm mt-1">
              <strong>Start:</strong> {new Date(journal.startTime).toLocaleString()}
            </p>
            <p className="text-sm">
              <strong>Duration:</strong> {journal.duration}
            </p>
            <p className="text-sm">
              <strong>Task Type:</strong> {journal.taskType.charAt(0).toUpperCase() + journal.taskType.slice(1)}
            </p>
            {journal.dailyNotes && (
              <p className="text-sm italic text-gray-600 mt-1">
                Notes: {journal.dailyNotes}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default JournalList;
