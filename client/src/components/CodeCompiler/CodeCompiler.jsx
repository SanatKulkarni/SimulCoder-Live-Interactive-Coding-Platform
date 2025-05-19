import React, { useState } from 'react';
import axios from 'axios';

const CodeCompiler = ({ code, language, onOutputChange }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://compiler-backend-woad.vercel.app/api/verify', {
        language,
        code,
        testCases: [{ input, expectedOutput: '' }]
      });

      if (response.data.success) {
        onOutputChange({
          type: 'output',
          content: response.data.results[0].actualOutput
        });
      } else {
        setError(response.data.error || 'Compilation failed');
        onOutputChange({
          type: 'error',
          content: response.data.error || 'Compilation failed'
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to compile code. Please try again.';
      setError(errorMessage);
      onOutputChange({
        type: 'error',
        content: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-200 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 font-mono"
          placeholder="Enter input (if required)..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Compiling...
          </div>
        ) : (
          'Run Code'
        )}
      </button>
    </div>
  );
};

export default CodeCompiler;