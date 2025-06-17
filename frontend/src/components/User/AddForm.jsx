import { useState } from "react";
import { backendUrl } from "../../constant";

const AddForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    formName: "",
    description: "",
    notes: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({ formName: "", description: "", notes: "" });
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendUrl}/api/v1/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create form");

      await res.json();
      setSuccessMsg("Form created successfully!");
      setFormData({ formName: "", description: "", notes: "" });
    } catch (err) {
      console.error(err);
      setSuccessMsg("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-1 text-gray-900">Create a New Form</h2>
      <p className="text-gray-500 mb-4 text-sm">
        Fill out the details below to create your new form.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Form Name
          </label>
          <input
            type="text"
            name="formName"
            placeholder="e.g., Customer Feedback"
            value={formData.formName}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Version GUID
          </label>
          <textarea
            name="description"
            placeholder="Enter the version GUID for this form"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 min-h-[70px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Notes <span className="text-sm text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            name="notes"
            placeholder="Any additional information"
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            For example, “Internal use only”.
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition text-sm"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm"
          >
            Create
          </button>
        </div>

        {successMsg && (
          <p className={`text-sm mt-2 ${successMsg.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {successMsg}
          </p>
        )}
      </form>

      {onCancel && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-blue-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AddForm;
