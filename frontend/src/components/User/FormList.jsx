import { useEffect, useState } from "react";

const FormList = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/form", {
          credentials: "include"
        });

        if (!res.ok) throw new Error("Failed to fetch forms");

        const data = await res.json();
        setForms(data);
      } catch (err) {
        console.error("Error fetching forms:", err);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">All Forms</h2>
      {forms.length === 0 ? (
        <p>No forms available.</p>
      ) : (
        <ul className="space-y-4">
          {forms.map((form) => (
            <li
              key={form._id}
              className="border p-4 rounded hover:shadow transition"
            >
              <h3 className="text-lg font-semibold">{form.formName}</h3>
              <p className="text-sm text-gray-700">{form.description}</p>
              {form.notes && (
                <p className="text-sm text-gray-500 mt-1">📝 {form.notes}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Created: {new Date(form.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormList;
