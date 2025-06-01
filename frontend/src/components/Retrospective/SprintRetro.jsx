import React, { useState } from 'react';

function SprintRetro() {
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    wellItems: [
      {
        id: 'fb1',
        text: 'Great collaboration between frontend and backend teams during API integration',
        votes: 3,
        author: 'Alex Johnson',
        time: '2h ago',
        avatar: 'https://avatar.iran.liara.run/public/12',
        comments: 2
      },
      {
        id: 'fb2',
        text: 'Sprint planning was well organized and realistic',
        votes: 5,
        author: 'Sarah Chen',
        time: '4h ago',
        avatar: 'https://avatar.iran.liara.run/public/23',
        comments: 1
      },
      {
        id: 'fb3',
        text: 'QA testing was thorough and caught critical bugs early',
        votes: 7,
        author: 'Mike Rodriguez',
        time: '6h ago',
        avatar: 'https://avatar.iran.liara.run/public/34',
        comments: 3
      }
    ],
    poorItems: [
      {
        id: 'fb4',
        text: 'Database migration took longer than expected and blocked development',
        votes: 8,
        author: 'Emma Wilson',
        time: '1h ago',
        avatar: 'https://avatar.iran.liara.run/public/45',
        comments: 4
      },
      {
        id: 'fb5',
        text: 'Communication gaps between BA and dev team on requirements',
        votes: 6,
        author: 'David Kim',
        time: '3h ago',
        avatar: 'https://avatar.iran.liara.run/public/56',
        comments: 2
      }
    ],
    suggestions: [
      {
        id: 'fb6',
        text: 'Implement daily standup check-ins for better communication',
        votes: 9,
        author: 'Lisa Park',
        time: '30m ago',
        avatar: 'https://avatar.iran.liara.run/public/67',
        comments: 5
      },
      {
        id: 'fb7',
        text: 'Create a shared knowledge base for common issues and solutions',
        votes: 4,
        author: 'Tom Anderson',
        time: '1h ago',
        avatar: 'https://avatar.iran.liara.run/public/78',
        comments: 1
      }
    ]
  });

  const [newFeedback, setNewFeedback] = useState({
    category: 'What Went Well',
    text: '',
    anonymous: false
  });

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Sarah Chen',
      text: 'Absolutely! The API documentation was also very helpful.',
      time: '1h ago',
      avatar: 'https://avatar.iran.liara.run/public/23'
    },
    {
      id: 2,
      author: 'Mike Rodriguez',
      text: 'We should continue this approach for future integrations.',
      time: '45m ago',
      avatar: 'https://avatar.iran.liara.run/public/34'
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const openFeedbackModal = () => setFeedbackModal(true);
  const closeFeedbackModal = () => {
    setFeedbackModal(false);
    setNewFeedback({ category: 'What Went Well', text: '', anonymous: false });
  };

  const openCommentModal = (feedbackId) => {
    setSelectedFeedback(feedbackId);
    setCommentModal(true);
  };
  const closeCommentModal = () => {
    setCommentModal(false);
    setSelectedFeedback(null);
    setNewComment('');
  };

  const voteFeedback = (feedbackId) => {
    setFeedbackData(prev => {
      const updateVotes = (items) => 
        items.map(item => 
          item.id === feedbackId 
            ? { ...item, votes: item.votes + 1 }
            : item
        );

      return {
        wellItems: updateVotes(prev.wellItems),
        poorItems: updateVotes(prev.poorItems),
        suggestions: updateVotes(prev.suggestions)
      };
    });
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!newFeedback.text.trim()) return;

    const feedback = {
      id: `fb${Date.now()}`,
      text: newFeedback.text,
      votes: 0,
      author: newFeedback.anonymous ? 'Anonymous' : 'Current User',
      time: 'just now',
      avatar: 'https://avatar.iran.liara.run/public/45',
      comments: 0
    };

    setFeedbackData(prev => {
      const categoryKey = 
        newFeedback.category === 'What Went Well' ? 'wellItems' :
        newFeedback.category === 'What Didn\'t Go Well' ? 'poorItems' : 'suggestions';
      
      return {
        ...prev,
        [categoryKey]: [...prev[categoryKey], feedback]
      };
    });

    closeFeedbackModal();
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: 'Current User',
      text: newComment,
      time: 'just now',
      avatar: 'https://avatar.iran.liara.run/public/45'
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const getTotalFeedback = () => {
    return feedbackData.wellItems.length + feedbackData.poorItems.length + feedbackData.suggestions.length;
  };

  const getTotalVotes = () => {
    const allItems = [...feedbackData.wellItems, ...feedbackData.poorItems, ...feedbackData.suggestions];
    return allItems.reduce((sum, item) => sum + item.votes, 0);
  };

  const getTotalComments = () => {
    const allItems = [...feedbackData.wellItems, ...feedbackData.poorItems, ...feedbackData.suggestions];
    return allItems.reduce((sum, item) => sum + item.comments, 0);
  };

  const FeedbackCard = ({ item, bgColor, borderColor }) => (
    <div className={`${bgColor} ${borderColor} rounded-lg p-4 hover:shadow-sm transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-900">{item.text}</p>
        <div className="flex items-center space-x-1 ml-2">
          <button 
            onClick={() => voteFeedback(item.id)} 
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>
          <span className="text-xs font-medium text-gray-600">{item.votes}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img className="w-5 h-5 rounded-full" src={item.avatar} alt="User" />
          <span className="text-xs text-gray-500">{item.author} • {item.time}</span>
        </div>
        <button 
          onClick={() => openCommentModal(item.id)} 
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          {item.comments} comments
        </button>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50 p-4 md:p-6 md:ml-64">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Sprint Retro Board</h1>
          <p className="text-gray-600 text-sm md:text-base">Collect and track retrospective feedback</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={anonymousMode}
              onChange={(e) => setAnonymousMode(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Anonymous Mode</span>
          </label>
          <div className="flex gap-2">
            <button 
              onClick={openFeedbackModal} 
              className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Feedback
            </button>
            <button className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* What Went Well Column */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">What Went Well</h2>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {feedbackData.wellItems.length} items
            </span>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {feedbackData.wellItems.map(item => (
              <FeedbackCard 
                key={item.id} 
                item={item} 
                bgColor="bg-green-50" 
                borderColor="border-green-200" 
              />
            ))}
          </div>
        </div>

        {/* What Didn't Go Well Column */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">What Didn't Go Well</h2>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {feedbackData.poorItems.length} items
            </span>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {feedbackData.poorItems.map(item => (
              <FeedbackCard 
                key={item.id} 
                item={item} 
                bgColor="bg-red-50" 
                borderColor="border-red-200" 
              />
            ))}
          </div>
        </div>

        {/* Suggestions Column */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Suggestions</h2>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {feedbackData.suggestions.length} items
            </span>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {feedbackData.suggestions.map(item => (
              <FeedbackCard 
                key={item.id} 
                item={item} 
                bgColor="bg-blue-50" 
                borderColor="border-blue-200" 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6 text-center">
          <div className="text-xl md:text-2xl font-bold text-green-600 mb-1 md:mb-2">{getTotalFeedback()}</div>
          <div className="text-xs md:text-sm text-gray-600">Total Feedback</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6 text-center">
          <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1 md:mb-2">{getTotalVotes()}</div>
          <div className="text-xs md:text-sm text-gray-600">Total Votes</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6 text-center">
          <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1 md:mb-2">{getTotalComments()}</div>
          <div className="text-xs md:text-sm text-gray-600">Comments</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6 text-center">
          <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1 md:mb-2">85%</div>
          <div className="text-xs md:text-sm text-gray-600">Participation</div>
        </div>
      </div>

      {/* Word Cloud Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Feedback Themes</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-4 md:py-8">
          <span className="text-lg md:text-2xl font-bold text-blue-600">Communication</span>
          <span className="text-base md:text-xl font-semibold text-green-600">Collaboration</span>
          <span className="text-sm md:text-lg font-medium text-purple-600">Testing</span>
          <span className="text-base md:text-xl font-semibold text-red-600">Migration</span>
          <span className="text-sm md:text-base font-medium text-orange-600">Planning</span>
          <span className="text-sm md:text-lg font-medium text-indigo-600">Requirements</span>
          <span className="text-sm md:text-base font-medium text-pink-600">Standup</span>
          <span className="text-base md:text-xl font-semibold text-teal-600">Knowledge</span>
          <span className="text-sm md:text-base font-medium text-yellow-600">Process</span>
          <span className="text-sm md:text-lg font-medium text-gray-600">Integration</span>
        </div>
      </div>

      {/* Add Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm" aria-modal="true" >
          <div className="flex items-center justify-center min-h-screen p-4 sm:p-0">
            <div className="fixed bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeFeedbackModal}></div>
            
            <div className="relative w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-xl transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add Feedback</h3>
                <button onClick={closeFeedbackModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newFeedback.category}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option>What Went Well</option>
                    <option>What Didn't Go Well</option>
                    <option>Suggestions</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    rows="4" 
                    placeholder="Share your thoughts about this sprint..."
                    value={newFeedback.text}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, text: e.target.value }))}
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={newFeedback.anonymous}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, anonymous: e.target.checked }))}
                  />
                  <label className="ml-2 text-sm text-gray-700">Submit anonymously</label>
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button type="button" onClick={closeFeedbackModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="button" onClick={handleSubmitFeedback} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors">
                    Add Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {commentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 sm:p-0">
            <div className="fixed bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeCommentModal}></div>
            
            <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Comments & Reactions</h3>
                  <button onClick={closeCommentModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                {/* Original Feedback */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <p className="text-sm text-gray-900 mb-1 md:mb-2">Great collaboration between frontend and backend teams during API integration</p>
                  <div className="flex items-center space-x-2">
                    <img className="w-4 h-4 md:w-5 md:h-5 rounded-full" src="https://avatar.iran.liara.run/public/12" alt="User" />
                    <span className="text-xs text-gray-500">Alex Johnson • 2h ago</span>
                  </div>
                </div>
                
                {/* Comments List */}
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-64 md:max-h-96 overflow-y-auto">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-2 md:space-x-3">
                      <img className="w-6 h-6 md:w-8 md:h-8 rounded-full" src={comment.avatar} alt="User" />
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-2 md:p-3">
                          <p className="text-xs md:text-sm text-gray-900">{comment.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{comment.author} • {comment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Comment */}
                <div className="border-t border-gray-200 pt-3 md:pt-4">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <img className="w-6 h-6 md:w-8 md:h-8 rounded-full" src="https://avatar.iran.liara.run/public/45" alt="Current user" />
                    <div className="flex-1">
                      <textarea 
                        className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm" 
                        rows="2" 
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      ></textarea>
                      <div className="flex items-center justify-end mt-1 md:mt-2">
                        <button 
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SprintRetro;