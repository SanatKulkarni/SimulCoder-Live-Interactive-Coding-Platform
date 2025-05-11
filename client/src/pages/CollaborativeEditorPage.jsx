import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
// Removed: import Editor from 'react-simple-code-editor';

const CollaborativeEditorPage = () => {
  const { sessionId } = useParams();
  const [code, setCode] = useState('');
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const wsUrl = `ws://127.0.0.1:8000/ws/editor/${sessionId}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      setCode(event.data);
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

  const handleCodeChange = (event) => { // Changed to accept event for textarea
    const newCode = event.target.value;
    setCode(newCode);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(newCode);
    }
  };

  const copySessionLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Session link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link: ', err));
  };

  // Removed noOpHighlight function

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 flex flex-col">
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

      <div className="flex-grow rounded-lg overflow-hidden shadow-2xl border border-gray-700 bg-gray-800">
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="w-full h-full p-4 bg-gray-800 text-gray-200 font-mono text-sm focus:outline-none resize-none caret-purple-400"
          placeholder="Start coding here..."
          spellCheck="false" // Optional: disable spellcheck for code
        />
      </div>
      <footer className="mt-4 text-sm text-gray-500 text-center">
        Share the link to this page with others to collaborate in real-time.
      </footer>
    </div>
  );
};

export default CollaborativeEditorPage;