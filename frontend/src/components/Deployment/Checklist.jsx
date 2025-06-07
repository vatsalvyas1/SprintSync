import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Checklist() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checklists, setChecklists] = useState([]);
  const [newChecklist, setNewChecklist] = useState({
    name: '',
    sprint: '',
    sprintLink: '',
    dueDate: '',
    priority: 'high',
    checklistItems: []
  });
  const [newItemDescription, setNewItemDescription] = useState('');

  // Fetch checklists on component mount
  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/checklist/checklists');
      setChecklists(response.data.data);
    } catch (error) {
      console.error('Error fetching checklists:', error);
    }
  };

  const openNewChecklistModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeNewChecklistModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
    // Reset form
    setNewChecklist({
      name: '',
      sprint: '',
      sprintLink: '',
      dueDate: '',
      priority: 'high',
      checklistItems: []
    });
    setNewItemDescription('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChecklist(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addChecklistItem = () => {
    if (newItemDescription.trim() === '') return;
    
    const newItem = {
      description: newItemDescription,
      status: 'pending',
      notes: '',
      attachments: []
    };
    
    setNewChecklist(prev => ({
      ...prev,
      checklistItems: [...prev.checklistItems, newItem]
    }));
    
    setNewItemDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/v1/checklist/create', newChecklist);
      fetchChecklists();
      closeNewChecklistModal();
    } catch (error) {
      console.error('Error creating checklist:', error);
    }
  };

  const updateItemStatus = async (checklistId, itemId, newStatus) => {
    try {
      await axios.post('http://localhost:8000/api/v1/checklist/change-item-state', {
        checklistId,
        itemId,
        status: newStatus
      });
      fetchChecklists(); // Refresh the list after update
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
        return status;
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

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeNewChecklistModal();
      }
    };

    document.addEventListener('keydown', escHandler);

    return () => {
      document.removeEventListener('keydown', escHandler);
    };
  }, []);

  return (
    <section id="deployment-checklist" className="min-h-screen bg-gray-50 p-6 md:ml-64" style={{ display: 'block' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deployment Checklist</h1>
          <p className="text-gray-600">Track and manage deployment tasks across sprints</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <button 
            onClick={openNewChecklistModal} 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {/* <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg> */}
            New Checklist
          </button>

          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            {/* <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg> */}
            Export PDF
          </button>
        </div>
      </div>

      {/* Active Checklists Grid */}
      <div className="flex gap-6 mb-8 overflow-x-auto">
        {checklists != [] && checklists.map(checklist => (
          <div key={checklist._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors md:min-w-1/3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{checklist.name}</h3>
                  <p className="text-sm text-gray-500">{checklist.sprint} • Due {new Date(checklist.dueDate).toLocaleDateString()}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(checklist.priority)}`}>
                    {checklist.priority}
                  </span>
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
              {checklist.checklistItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    checked={item.status === 'done'}
                    onChange={() => {
                      const newStatus = item.status === 'done' ? 'pending' : 'done';
                      updateItemStatus(checklist._id, item._id, newStatus);
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                  />
                  <span className={`text-sm text-gray-900 ${item.status === 'done' ? 'line-through' : ''}`}>
                    {item.description}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              ))}
              {checklist.checklistItems.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{checklist.checklistItems.length - 3} more items
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/12" alt="Assignee" />
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/23" alt="Assignee" />
              </div>
              <Link className="text-sm text-blue-600 hover:text-blue-700" to={`/deployment/${checklist._id}`}>View Details</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Progress Tracker */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {checklists.slice(0, 4).map((checklist, index) => {
              const latestItem = [...checklist.checklistItems]
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
              
              if (!latestItem) return null;

              return (
                <div key={index} className="relative flex items-start space-x-4">
                  <div className={`relative z-10 w-4 h-4 ${
                    latestItem.status === 'done' ? 'bg-green-500' : 
                    latestItem.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                  } rounded-full border-4 border-white shadow`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {latestItem.description}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {checklist.name} • {new Date(latestItem.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <img className="w-6 h-6 rounded-full" src="https://avatar.iran.liara.run/public/12" alt="User" />
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          latestItem.status === 'done' ? 'bg-green-100 text-green-800' : 
                          latestItem.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(latestItem.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Checklist Modal */}
      {isModalOpen && (
        <div 
          id="newChecklistModal" 
          className="fixed inset-0 z-50 overflow-y-auto" 
          aria-modal="true"
          role="dialog"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 backdrop-blur-xs">
            <div 
              className="fixed transition-opacity bg-gray-500 bg-opacity-75" 
              onClick={closeNewChecklistModal}
              aria-hidden="true"
            ></div>
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Deployment Checklist</h3>
                <button 
                  onClick={closeNewChecklistModal} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={newChecklist.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter project name" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sprint</label>
                    <input 
                      type="text" 
                      name="sprint"
                      value={newChecklist.sprint}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter sprint (e.g., SPRINT-25)" 
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sprint Link</label>
                    <input 
                      type="url" 
                      name="sprintLink"
                      value={newChecklist.sprintLink}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="https://jira.example.com/sprint/SPRINT-25" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input 
                      type="datetime-local" 
                      name="dueDate"
                      value={newChecklist.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select 
                    name="priority"
                    value={newChecklist.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Checklist Items</label>
                  <div className="space-y-2">
                    {newChecklist.checklistItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{item.description}</span>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Add checklist item" 
                      />
                      <button 
                        type="button" 
                        onClick={addChecklistItem}
                        className="px-3 py-2 text-blue-600 hover:text-blue-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={closeNewChecklistModal} 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                    disabled={newChecklist.checklistItems.length === 0}
                  >
                    Create Checklist
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Checklist;