import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import QuestionDisplay from '../components/Question/QuestionDisplay';
import debounce from 'lodash/debounce';
import Editor from '@monaco-editor/react';
import CodeCompiler from '../components/CodeCompiler/CodeCompiler';

const CollaborativeEditorPage = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const [code, setCode] = useState('');
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [questionData, setQuestionData] = useState(location.state?.questionData);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState(null);

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

        <div className="w-1/2 flex flex-col gap-4">
          <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-700 bg-gray-800 flex-grow">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => {
                setCode(value);
                sendCodeUpdate(value);
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                tabSize: 4,
                insertSpaces: true,
                autoIndent: 'full',
                formatOnPaste: true,
                formatOnType: true,
                scrollBeyondLastLine: false,
                readOnly: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                renderWhitespace: 'selection',
                automaticLayout: true
              }}
            />
          </div>

          <div className="rounded-lg bg-gray-800 border border-gray-700 p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-200 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <CodeCompiler
              code={code}
              language={language}
              onOutputChange={(result) => {
                setOutput(result);
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                  ws.current.send(JSON.stringify({
                    type: 'output_update',
                    output: result,
                    session_id: sessionId
                  }));
                }
              }}
            />

            {output && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-200 mb-2">Output</h3>
                <div className={`p-4 rounded-md ${output.type === 'error' ? 'bg-red-900/20' : 'bg-green-900/20'}`}>
                  <pre className={`whitespace-pre-wrap font-mono text-sm ${
                    output.type === 'error' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {output.content}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="mt-4 text-sm text-gray-500 text-center">
        Share the link to this page with others to collaborate in real-time.
      </footer>
    </div>
  );
};

export default CollaborativeEditorPage;