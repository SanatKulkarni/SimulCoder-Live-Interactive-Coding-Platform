import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import QuestionForm from '../components/Question/QuestionForm';


const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [newSessionId, setNewSessionId] = useState('');
  const [joinSessionId, setJoinSessionId] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionData, setQuestionData] = useState(null);


  const handleCreateSession = () => {
    if (showQuestionForm) {
      setShowQuestionForm(true);
    } else {
      const id = newSessionId.trim() || `session-${Date.now().toString(36).slice(-6)}`;
      if (id) {
        navigate(`/session/${id}`, { state: { questionData } });
      } else {
        alert("Please enter a session name or leave blank for an auto-generated one.");
      }
    }
  };

  const handleJoinSession = (e) => {
    e.preventDefault();
    if (joinSessionId.trim()) {
      navigate(`/session/${joinSessionId.trim()}`);
    } else {
      alert("Please enter a session ID to join.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-800 shadow-xl rounded-lg p-8 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-400">Dashboard</h1>
        </div>
        <p className="text-lg mb-6">
          Welcome, <span className="font-semibold">{currentUser?.full_name || currentUser?.email}!</span>
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Create Session Card */}
          <div className="bg-gray-700/50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Start a New Session</h2>
            {!showQuestionForm ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={newSessionId}
                  onChange={(e) => setNewSessionId(e.target.value)}
                  placeholder="Optional: Custom Session Name"
                  className="w-full p-2 mb-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleCreateSession()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    Create Simple Session
                  </button>
                  <button
                    onClick={() => setShowQuestionForm(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            ) : (
              <QuestionForm
                onSubmit={(data) => {
                  setQuestionData(data);
                  const id = newSessionId.trim() || `session-${Date.now().toString(36).slice(-6)}`;
                  navigate(`/session/${id}`, { state: { questionData: data } });
                }}
                onCancel={() => setShowQuestionForm(false)}
              />
            )}
          </div>

          {/* Join Session Card */}
          <div className="bg-gray-700/50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Join an Existing Session</h2>
            <form onSubmit={handleJoinSession}>
              <input
                type="text"
                value={joinSessionId}
                onChange={(e) => setJoinSessionId(e.target.value)}
                placeholder="Enter Session ID or Link"
                className="w-full p-2 mb-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Join Session
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 p-6 border border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Your Recent Sessions</h2>
          <p className="text-gray-400">Feature coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;