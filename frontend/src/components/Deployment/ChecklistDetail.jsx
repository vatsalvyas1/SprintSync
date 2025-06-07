import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ChecklistDetail() {
  const { checklistId } = useParams();
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChecklist = async () => {
      if (!checklistId) {
        setError("Invalid checklist ID");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/checklist/${checklistId}`);

        const data = await response.json();

        setChecklist(data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [checklistId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!checklist) return <div>No checklist found</div>;

  return (
    <div className="ml-60 p-4">
      <h2>{checklist.name || "Untitled Checklist"}</h2>
      <p>{checklist.priority || "No description available"}</p>
      <ul>
        {checklist.checklistItems?.length > 0 ? (
          checklist.checklistItems.map((item, index) => (
            <li key={item._id || index}>
              {item.description || "Unnamed item"} - Status: {item.status || "Unknown"}
            </li>
          ))
        ) : (
          <li>No items in this checklist</li>
        )}
      </ul>
    </div>
  );
}