import { useEffect, useState } from 'react';

function Checklist() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openNewChecklistModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeNewChecklistModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const openChecklistDetails = (checklistId) => {
    console.log('Opening checklist details for:', checklistId);
    // Add your actual logic here
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

  useEffect(() => {
    // Placeholder for drag-and-drop logic if you add it
    console.log('Deployment checklist loaded');
  }, []);

  return (
    <section id="deployment-checklist" className="min-h-screen bg-gray-50 p-6 md:ml-64" style={{ display: 'block' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deployment Checklist</h1>
          <p className="text-gray-600">Track and manage deployment tasks across sprints</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={openNewChecklistModal} 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New Checklist
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Active Checklists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Checklist Card 1 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Survey Builder v2.1</h3>
                <p className="text-sm text-gray-500">Sprint 24 • Due Mar 15</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">75%</div>
              <div className="text-xs text-gray-500">6/8 tasks</div>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-900 line-through">Database migration scripts</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Done</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-900 line-through">API endpoint testing</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Done</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-900">Frontend build verification</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/12" alt="Assignee" />
              <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/23" alt="Assignee" />
              <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/34" alt="Assignee" />
            </div>
            <button onClick={() => openChecklistDetails('survey-builder')} className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
          </div>
        </div>

        {/* Checklist Card 2 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-orange-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Form Validation Engine</h3>
                <p className="text-sm text-gray-500">Sprint 24 • Due Mar 18</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">40%</div>
              <div className="text-xs text-gray-500">2/5 tasks</div>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-900 line-through">Code review completion</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Done</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-900">Unit test coverage check</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-900">Performance benchmarking</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/45" alt="Assignee" />
              <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/56" alt="Assignee" />
            </div>
            <button onClick={() => openChecklistDetails('form-validation')} className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
          </div>
        </div>

        {/* Checklist Card 3 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Authentication</h3>
                <p className="text-sm text-gray-500">Sprint 23 • Completed</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-xs text-gray-500">7/7 tasks</div>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-900 line-through">Security audit passed</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Done</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-900 line-through">Production deployment</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Done</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-900 line-through">Post-deployment monitoring</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Done</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/67" alt="Assignee" />
              <img className="w-6 h-6 rounded-full border-2 border-white" src="https://avatar.iran.liara.run/public/78" alt="Assignee" />
            </div>
            <button onClick={() => openChecklistDetails('user-auth')} className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
          </div>
        </div>
      </div>

      {/* Timeline Progress Tracker */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Deployment Timeline</h2>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Timeline Items */}
          <div className="space-y-8">
            {/* Timeline Item 1 */}
            <div className="relative flex items-start space-x-4">
              <div className="relative z-10 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Database Migration Completed</h3>
                    <p className="text-sm text-gray-500">Survey Builder v2.1 • 2 hours ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img className="w-6 h-6 rounded-full" src="https://avatar.iran.liara.run/public/12" alt="User" />
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex items-start space-x-4">
              <div className="relative z-10 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">API Testing in Progress</h3>
                    <p className="text-sm text-gray-500">Form Validation Engine • Started 1 hour ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img className="w-6 h-6 rounded-full" src="https://avatar.iran.liara.run/public/23" alt="User" />
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex items-start space-x-4">
              <div className="relative z-10 w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Frontend Build Scheduled</h3>
                    <p className="text-sm text-gray-500">Survey Builder v2.1 • Scheduled for 3:00 PM</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img className="w-6 h-6 rounded-full" src="https://avatar.iran.liara.run/public/34" alt="User" />
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative flex items-start space-x-4">
              <div className="relative z-10 w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Production Deployment</h3>
                    <p className="text-sm text-gray-500">Form Validation Engine • Scheduled for Mar 18</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img className="w-6 h-6 rounded-full" src="https://avatar.iran.liara.run/public/45" alt="User" />
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>
                  </div>
                </div>
              </div>
            </div>
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
            {/* Background overlay */}
            <div 
              className="fixed transition-opacity bg-gray-500 bg-opacity-75" 
              onClick={closeNewChecklistModal}
              aria-hidden="true"
            ></div>
            
            {/* Modal content */}
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
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter project name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sprint</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Sprint 24</option>
                      <option>Sprint 25</option>
                      <option>Sprint 26</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Checklist Items</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Add checklist item" />
                      <button type="button" className="px-3 py-2 text-blue-600 hover:text-blue-700">
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