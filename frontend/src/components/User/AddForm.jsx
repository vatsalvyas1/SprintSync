import { useState } from "react";

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
      const res = await fetch("http://localhost:8000/api/v1/form", {
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-1">Create a New Form</h2>
      <p className="text-gray-600 mb-6">
        Fill out the details below to create your new form
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-800 mb-1">
            Form Name
          </label>
          <input
            type="text"
            name="formName"
            placeholder="Enter a name for your form"
            value={formData.formName}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-800 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Describe the purpose of this form"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium text-gray-800 mb-1">
            Notes (Optional)
          </label>
          <input
            type="text"
            name="notes"
            placeholder="Optional notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Any additional information you want to include
          </p>
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
          >
            Create Form
          </button>
        </div>

        {successMsg && <p className="text-green-600 mt-4">{successMsg}</p>}
      </form>

      {/* Cancel Button (conditionally rendered) */}
      {onCancel && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-blue-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AddForm;
