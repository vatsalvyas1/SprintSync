import { useState } from "react";

function AddJournal({ onAdd }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    hours: "0",
    minutes: "0",
    taskType: "development",
    dailyNotes: "",
  });

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUser || !loggedInUser._id) {
      alert("User not logged in");
      return;
    }

    try {
      // Get today's date
const today = new Date();
const dateString = today.toLocaleDateString("en-CA"); // "2025-06-15"
const fullStartTime = `${dateString}T${formData.startTime}`;



      const payload = {
        title: formData.title,
        description: formData.description,
        startTime: fullStartTime,
        duration: `${formData.hours}h ${formData.minutes}m`,
        taskType: formData.taskType,
        dailyNotes: formData.dailyNotes,
        user: loggedInUser._id,
      };

      const res = await fetch("http://localhost:8000/api/v1/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add journal");

      const data = await res.json();
      onAdd(data); // Notify parent

      // Reset form
      setFormData({
        title: "",
        description: "",
        startTime: "",
        hours: "0",
        minutes: "0",
        taskType: "development",
        dailyNotes: "",
      });
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow-md max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold">Add Journal Entry</h2>

      <input
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="w-full p-2 border rounded"
      />

      {/* Start Time Only (Time Selector) */}
      <input
        name="startTime"
        type="time"
        value={formData.startTime}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      {/* Duration Selector */}
      <div className="flex gap-2">
        <select
          name="hours"
          value={formData.hours}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded"
        >
          {[...Array(13).keys()].map((h) => (
            <option key={h} value={h}>
              {h} hour{h !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <select
          name="minutes"
          value={formData.minutes}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded"
        >
          {[0, 15, 30, 45].map((m) => (
            <option key={m} value={m}>
              {m} minute{m !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <select
        name="taskType"
        value={formData.taskType}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="meeting">Meeting</option>
        <option value="development">Development</option>
        <option value="testing">Testing</option>
        <option value="bug fixes">Bug Fixes</option>
      </select>

      <textarea
        name="dailyNotes"
        value={formData.dailyNotes}
        onChange={handleChange}
        placeholder="Daily Notes (optional)"
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Journal
      </button>
    </form>
  );
}

export default AddJournal;
