import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import QuestionDisplay from '../components/Question/QuestionDisplay';
import debounce from 'lodash/debounce';
// Removed: import Editor from 'react-simple-code-editor';

const CollaborativeEditorPage = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const [code, setCode] = useState('');
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [questionData, setQuestionData] = useState(location.state?.questionData);

  useEffect(() => {
    if (!sessionId) return;

    const wsUrl = `ws://127.0.0.1:8000/ws/editor/${sessionId}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      if (location.state?.questionData) {
        ws.current.send(JSON.stringify({
          type: 'question_update',
          question: location.state.questionData
        }));
      }
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'initial_state') {
        setCode(data.code || '');
        if (data.question) setQuestionData(data.question);
      } else if (data.type === 'question_update') {
        setQuestionData(data.question);
      } else if (data.type === 'code_update') {
        setCode(data.code);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [sessionId]);

  const sendCodeUpdate = useCallback(
    debounce((code) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'code_update',
          code: code,
          session_id: sessionId
        }));
      }
    }, 100),
    [sessionId]
  );

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    sendCodeUpdate(newCode);
  };

  const copySessionLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Session link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link: ', err));
  };

  // Removed noOpHighlight function

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 flex flex-col overflow-hidden">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-400">
            SimulCoder Session: <span className="text-gray-300">{sessionId}</span>
          </h1>
          <p className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={copySessionLink}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Copy Invite Link
          </button>
          <Link to="/dashboard" className="text-gray-400 hover:text-purple-300">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="flex-grow flex gap-4 overflow-hidden">
        <div className="w-1/2 overflow-y-auto rounded-lg bg-gray-800 border border-gray-700 p-4">
          {questionData ? (
            <QuestionDisplay question={questionData} />
          ) : (
            <div className="text-gray-400 text-center mt-4">
              No question assigned to this session
            </div>
          )}
        </div>

        <div className="w-1/2 rounded-lg overflow-hidden shadow-2xl border border-gray-700 bg-gray-800">
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="w-full h-full p-4 bg-gray-800 text-gray-200 font-mono text-sm focus:outline-none resize-none caret-purple-400"
            placeholder="Start coding here..."
            spellCheck="false"
          />
        </div>
      </div>
      <footer className="mt-4 text-sm text-gray-500 text-center">
        Share the link to this page with others to collaborate in real-time.
      </footer>
    </div>
  );
};

export default CollaborativeEditorPage;