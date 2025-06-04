function FormLocker2() {
  return (
    <div>
      <section id="form-locker" className="min-h-screen bg-gray-50 p-6 block ml-64" >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Locker</h1>
            <p className="text-gray-600">Prevent multiple devs working on same form</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Real-time updates</span>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Add New Form
            </button>
            <button onClick={() => openCheckoutModal()} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Check Out Form
            </button>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">7</div>
            <div className="text-sm text-gray-600">Currently Locked</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">3</div>
            <div className="text-sm text-gray-600">Auto Check-in Soon</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">2h 15m</div>
            <div className="text-sm text-gray-600">Avg Lock Time</div>
          </div>
        </div>

        {/* Form List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Form Status Dashboard</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input type="text" placeholder="Search forms..." className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Forms</option>
                  <option>Available</option>
                  <option>Locked</option>
                  <option>My Forms</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {/* Form Item 1 - Locked */}
            <div className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">Survey Builder Core</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        🔴 Locked
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <img className="w-6 h-6 rounded-full" src="https://avatar.iran.liara.run/public/12" alt="User" />
                        <span className="text-sm text-gray-600">Checked out by Alex Johnson</span>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                      <span className="text-sm text-gray-500">Auto check-in in 6h</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => requestNotification('survey-builder')} className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM16 3h5v5h-5V3zM4 3h6v6H4V3z"></path>
                    </svg>
                    Notify Me
                  </button>
                  <button disabled className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                    Check Out
                  </button>
                </div>
              </div>
            </div>

            {/* Form Item 2 - Available */}
            <div className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">Form Validation Engine</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        🟢 Available
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">Last modified: 3 days ago</span>
                      <span className="text-sm text-gray-500">Last checked out by Sarah Chen</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => checkOutForm('form-validation')} className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Check Out
                  </button>
                </div>
              </div>
            </div>

            {/* Form Item 3 - Locked by Current User */}
            <div className="p-6 hover:bg-gray-50 transition-colors bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">User Authentication Module</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        🔵 Checked out by you
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">Checked out 45 minutes ago</span>
                      <span className="text-sm text-gray-500">Auto check-in in 7h 15m</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => extendCheckout('user-auth')} className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-14 0 9 9 0 0114 0z"></path>
                    </svg>
                    Extend
                  </button>
                  <button onClick={() => checkInForm('user-auth')} className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                    </svg>
                    Check In
                  </button>
                </div>
              </div>
            </div>

            {/* Form Item 4 - Available */}
            <div className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">Data Export Module</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        🟢 Available
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">Last modified: 1 day ago</span>
                      <span className="text-sm text-gray-500">Last checked out by Mike Rodriguez</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => checkOutForm('data-export')} className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Check Out Form Modal */}
        <div id="checkoutModal" className="fixed inset-0 z-50 hidden overflow-y-auto" aria-modal="true" aria-hidden="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => closeCheckoutModal()}></div>
            
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Check Out Form</h3>
                <button onClick={() => closeCheckoutModal()} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Form</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Form Validation Engine</option>
                    <option>Data Export Module</option>
                    <option>Email Template Builder</option>
                    <option>Analytics Dashboard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Work Duration</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>2 hours</option>
                    <option>4 hours</option>
                    <option>8 hours (1 day)</option>
                    <option>16 hours (2 days)</option>
                    <option>Custom duration</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Description</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3" placeholder="Brief description of what you'll be working on..."></textarea>
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label className="ml-2 text-sm text-gray-700">Send notification to team when checked out</label>
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => closeCheckoutModal()} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors">
                    Check Out Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <div id="toastNotification" className="fixed bottom-4 right-4 z-50 hidden transform transition-all duration-300 ease-in-out">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900" id="toastTitle">Form Available</p>
                <p className="text-sm text-gray-600" id="toastMessage">Form Validation Engine is now available for checkout.</p>
              </div>
              <button onClick={() => hideToast()} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FormLocker2;