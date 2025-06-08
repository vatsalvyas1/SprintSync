function DailyJournal() {
  return (
    <div>
      <section id="daily-journals" className="min-h-screen bg-gray-50 p-6 block md:ml-64">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Journals</h1>
            <p className="text-gray-600">Track development productivity without Jira clutter</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => toggleCalendarView()} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Calendar View
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* Sticky Add Task Input */}
        <div className="sticky top-6 z-30 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input type="text" placeholder="What are you working on today?" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="w-32">
                <input type="text" placeholder="2h 30m" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <button onClick={() => addTask()} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter by:</label>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Dates</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Person:</label>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Team Members</option>
              <option>Alex Johnson</option>
              <option>Sarah Chen</option>
              <option>Mike Rodriguez</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Task Type:</label>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Tasks</option>
              <option>Development</option>
              <option>Testing</option>
              <option>Bug Fixes</option>
              <option>Meetings</option>
            </select>
          </div>
        </div>

        {/* Timeline Layout */}
        <div className="space-y-8">
          {/* Today's Entries */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Today - March 15, 2024</h2>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  6 tasks • 7h 45m
                </span>
              </div>
              <button onClick={() => openDayModal('2024-03-15')} className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
            </div>
            
            <div className="space-y-4">
              {/* Task Entry 1 */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Implemented user authentication API endpoints</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Development
                      </span>
                      <span className="text-sm font-medium text-gray-600">2h 30m</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Created login, logout, and token refresh endpoints with proper validation and error handling.</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img className="w-5 h-5 rounded-full" src="https://avatar.iran.liara.run/public/12" alt="User" />
                      <span className="text-xs text-gray-500">Alex Johnson • 9:00 AM</span>
                    </div>
                    <button onClick={() => editTask('task1')} className="text-xs text-blue-600 hover:text-blue-700">Edit</button>
                  </div>
                </div>
              </div>

              {/* Task Entry 2 */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Fixed form validation bug in survey builder</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Bug Fix
                      </span>
                      <span className="text-sm font-medium text-gray-600">1h 15m</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Resolved issue where required field validation wasn't triggering on form submission.</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img className="w-5 h-5 rounded-full" src="https://avatar.iran.liara.run/public/12" alt="User" />
                      <span className="text-xs text-gray-500">Alex Johnson • 11:30 AM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Blocker Resolved
                      </span>
                      <button onClick={() => editTask('task2')} className="text-xs text-blue-600 hover:text-blue-700">Edit</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Entry 3 */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Sprint planning meeting</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Meeting
                      </span>
                      <span className="text-sm font-medium text-gray-600">1h 00m</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Discussed upcoming features and estimated story points for next sprint.</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img className="w-5 h-5 rounded-full" src="https://avatar.iran.liara.run/public/12" alt="User" />
                      <span className="text-xs text-gray-500">Alex Johnson • 2:00 PM</span>
                    </div>
                    <button onClick={() => editTask('task3')} className="text-xs text-blue-600 hover:text-blue-700">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yesterday's Entries */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Yesterday - March 14, 2024</h2>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  4 tasks • 6h 20m
                </span>
              </div>
              <button onClick={() => openDayModal('2024-03-14')} className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
            </div>
            
            <div className="space-y-4">
              {/* Task Entry 4 */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Database schema design for user preferences</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Development
                      </span>
                      <span className="text-sm font-medium text-gray-600">3h 00m</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Designed and implemented database tables for storing user preferences and settings.</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img className="w-5 h-5 rounded-full" src="https://avatar.iran.liara.run/public/23" alt="User" />
                      <span className="text-xs text-gray-500">Sarah Chen • 10:00 AM</span>
                    </div>
                    <button onClick={() => editTask('task4')} className="text-xs text-blue-600 hover:text-blue-700">Edit</button>
                  </div>
                </div>
              </div>

              {/* Task Entry 5 */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Code review for form builder component</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Review
                      </span>
                      <span className="text-sm font-medium text-gray-600">1h 30m</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Reviewed pull request for new drag-and-drop form builder functionality.</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img className="w-5 h-5 rounded-full" src="https://avatar.iran.liara.run/public/34" alt="User" />
                      <span className="text-xs text-gray-500">Mike Rodriguez • 2:30 PM</span>
                    </div>
                    <button onClick={() => editTask('task5')} className="text-xs text-blue-600 hover:text-blue-700">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">32h</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">24</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">5</div>
                <div className="text-sm text-gray-600">Blockers Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">8</div>
                <div className="text-sm text-gray-600">Meetings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View Modal */}
        <div id="calendarModal" className="fixed inset-0 z-50 hidden overflow-y-auto" aria-modal="true" aria-hidden="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => closeCalendarModal()}></div>
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Calendar View</h3>
                <button onClick={() => closeCalendarModal()} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {/* Calendar Header */}
                <div className="p-2 text-center text-sm font-medium text-gray-700">Sun</div>
                <div className="p-2 text-center text-sm font-medium text-gray-700">Mon</div>
                <div className="p-2 text-center text-sm font-medium text-gray-700">Tue</div>
                <div className="p-2 text-center text-sm font-medium text-gray-700">Wed</div>
                <div className="p-2 text-center text-sm font-medium text-gray-700">Thu</div>
                <div className="p-2 text-center text-sm font-medium text-gray-700">Fri</div>
                <div className="p-2 text-center text-sm font-medium text-gray-700">Sat</div>
                
                {/* Calendar Days */}
                <div className="p-2 text-center text-sm text-gray-400">25</div>
                <div className="p-2 text-center text-sm text-gray-400">26</div>
                <div className="p-2 text-center text-sm text-gray-400">27</div>
                <div className="p-2 text-center text-sm text-gray-400">28</div>
                <div className="p-2 text-center text-sm text-gray-400">29</div>
                <div className="p-2 text-center text-sm text-gray-900 bg-blue-100 rounded">1</div>
                <div className="p-2 text-center text-sm text-gray-900">2</div>
                
                <div className="p-2 text-center text-sm text-gray-900">3</div>
                <div className="p-2 text-center text-sm text-gray-900 bg-green-100 rounded">4</div>
                <div className="p-2 text-center text-sm text-gray-900">5</div>
                <div className="p-2 text-center text-sm text-gray-900 bg-orange-100 rounded">6</div>
                <div className="p-2 text-center text-sm text-gray-900">7</div>
                <div className="p-2 text-center text-sm text-gray-900 bg-purple-100 rounded">8</div>
                <div className="p-2 text-center text-sm text-gray-900">9</div>
                
                <div className="p-2 text-center text-sm text-gray-900">10</div>
                <div className="p-2 text-center text-sm text-gray-900 bg-blue-100 rounded">11</div>
                <div className="p-2 text-center text-sm text-gray-900">12</div>
                <div className="p-2 text-center text-sm text-gray-900">13</div>
                <div className="p-2 text-center text-sm text-gray-900 bg-green-100 rounded">14</div>
                <div className="p-2 text-center text-sm text-gray-900 bg-blue-500 rounded font-medium">15</div>
                <div className="p-2 text-center text-sm text-gray-900">16</div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-100 rounded"></div>
                  <span className="text-gray-600">Development</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <span className="text-gray-600">Testing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-100 rounded"></div>
                  <span className="text-gray-600">Bug Fixes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-100 rounded"></div>
                  <span className="text-gray-600">Meetings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day Details Modal */}
        <div id="dayModal" className="fixed inset-0 z-50 hidden overflow-y-auto" aria-modal="true" aria-hidden="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => closeDayModal()}></div>
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">March 15, 2024 - Daily Summary</h3>
                <button onClick={() => closeDayModal()} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {/* Day Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">7h 45m</div>
                  <div className="text-sm text-gray-600">Total Time</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">6</div>
                  <div className="text-sm text-gray-600">Tasks</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">1</div>
                  <div className="text-sm text-gray-600">Blockers</div>
                </div>
              </div>
              
              {/* Task Breakdown Chart */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Time Breakdown</h4>
                <canvas id="dayChart" width="400" height="200"></canvas>
              </div>
              
              {/* Notes Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Daily Notes</h4>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4" placeholder="Add notes about your day...">Good progress on authentication system. Need to follow up on form validation issue tomorrow.</textarea>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button onClick={() => closeDayModal()} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Close
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DailyJournal