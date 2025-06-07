import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

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
        const response = await axios.get(`http://localhost:8000/api/v1/checklist/${checklistId}`);
        setChecklist(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [checklistId]);

  const updateItemStatus = async (itemId, newStatus) => {
    try {
      await axios.post('http://localhost:8000/api/v1/checklist/change-item-state', {
        checklistId,
        itemId,
        status: newStatus
      });
      // Refresh checklist data
      const response = await axios.get(`http://localhost:8000/api/v1/checklist/${checklistId}`);
      setChecklist(response.data.data);
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const calculateCompletionPercentage = (items) => {
    if (!items || items.length === 0) return 0;
    const doneItems = items.filter(item => item.status === 'done').length;
    return Math.round((doneItems / items.length) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'backlog':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done':
        return 'Done';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'backlog':
        return 'Backlog';
      default:
        return status || 'Unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 p-6 md:ml-64 flex items-center justify-center text-gray-600">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-50 p-6 md:ml-64 flex items-center justify-center text-red-600">Error: {error}</div>;
  if (!checklist) return <div className="min-h-screen bg-gray-50 p-6 md:ml-64 flex items-center justify-center text-gray-600">No checklist found</div>;

  return (
    <section id="checklist-detail" className="min-h-screen bg-gray-50 p-6 md:ml-64">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{checklist.name || "Untitled Checklist"}</h1>
          <p className="text-gray-600">
            {checklist.sprint || "No sprint"} • Due {checklist.dueDate ? new Date(checklist.dueDate).toLocaleDateString() : "No due date"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Link
            to="/deployment"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Back to Checklists
          </Link>
        </div>
      </div>

      {/* Checklist Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{checklist.name || "Untitled Checklist"}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(checklist.priority)}`}>
                  {checklist.priority || "Unknown"}
                </span>
                {checklist.sprintLink && (
                  <a
                    href={checklist.sprintLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Sprint
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {calculateCompletionPercentage(checklist.checklistItems)}%
            </div>
            <div className="text-xs text-gray-500">
              {checklist.checklistItems.filter(item => item.status === 'done').length}/{checklist.checklistItems.length} tasks
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {checklist.checklistItems?.length > 0 ? (
            checklist.checklistItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={item.status === 'done'}
                  onChange={() => {
                    const newStatus = item.status === 'done' ? 'pending' : 'done';
                    updateItemStatus(item._id, newStatus);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className={`text-sm text-gray-900 ${item.status === 'done' ? 'line-through' : ''}`}>
                  {item.description || "Unnamed item"}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {getStatusText(item.status)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No items in this checklist</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/12" alt="Assignee" />
            <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/23" alt="Assignee" />
          </div>
        </div>
      </div>

      {/* Timeline Progress Tracker */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Checklist Activity Timeline</h2>
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-8">
            {checklist.checklistItems?.length > 0 ? (
              checklist.checklistItems
                .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                .map((item) => (
                  <div key={item._id} className="relative flex items-start space-x-4">
                    <div className={`relative z-10 w-4 h-4 ${
                      item.status === 'done' ? 'bg-green-500' :
                      item.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                    } rounded-full border-4 border-white shadow`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.description || "Unnamed item"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {checklist.name || "Untitled Checklist"} • {new Date(item.updatedAt || item.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <img className="w-6 h-6 rounded-full" src="https://avatar.iran.liara.run/public/12" alt="User" />
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-sm text-gray-500">No activity to display</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}