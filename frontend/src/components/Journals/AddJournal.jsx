import { useState } from "react";
import { backendUrl } from "../../constant";

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

            const res = await fetch(`${backendUrl}/api/v1/journal`, {
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
        <div className="sticky top-6 z-30 md:ml-64 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <form onSubmit={handleSubmit}>
                    {/* Mobile Layout */}
                    <div className="block md:hidden space-y-3">
                        <div>
                            <input
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="What are you working on today?"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                                <div className="flex gap-1">
                                    <select
                                        name="hours"
                                        value={formData.hours}
                                        onChange={handleChange}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        {[...Array(13).keys()].map((h) => (
                                            <option key={h} value={h}>
                                                {h}h
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="minutes"
                                        value={formData.minutes}
                                        onChange={handleChange}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        {[0, 15, 30, 45].map((m) => (
                                            <option key={m} value={m}>
                                                {m}m
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                                <input
                                    name="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    name="taskType"
                                    value={formData.taskType}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="meeting">Meeting</option>
                                    <option value="development">Dev</option>
                                    <option value="testing">Testing</option>
                                    <option value="bug fixes">Bugs</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2">
                            <input
                                name="description"
                                type="text"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description (required)"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <input
                                name="dailyNotes"
                                type="text"
                                value={formData.dailyNotes}
                                onChange={handleChange}
                                placeholder="Daily Notes (optional)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add Task
                        </button>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4 mb-3">
                            <div className="flex-1">
                                <input
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="What are you working on today?"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="w-32">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                                <div className="flex gap-1">
                                    <select
                                        name="hours"
                                        value={formData.hours}
                                        onChange={handleChange}
                                        className="w-16 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        {[...Array(13).keys()].map((h) => (
                                            <option key={h} value={h}>
                                                {h}h
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="minutes"
                                        value={formData.minutes}
                                        onChange={handleChange}
                                        className="w-16 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        {[0, 15, 30, 45].map((m) => (
                                            <option key={m} value={m}>
                                                {m}m
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="w-32">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                                <input
                                    name="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div className="w-32">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Task Type</label>
                                <select
                                    name="taskType"
                                    value={formData.taskType}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="meeting">Meeting</option>
                                    <option value="development">Development</option>
                                    <option value="testing">Testing</option>
                                    <option value="bug fixes">Bug Fixes</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add Task
                            </button>
                        </div>
                        
                        {/* Desktop Secondary row for description and notes */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <input
                                    name="description"
                                    type="text"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description (required)"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    name="dailyNotes"
                                    type="text"
                                    value={formData.dailyNotes}
                                    onChange={handleChange}
                                    placeholder="Daily Notes (optional)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddJournal;