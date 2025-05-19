import React from 'react';

const QuestionDisplay = ({ question }) => {
  if (!question) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-4 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-purple-400">{question.title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          question.difficulty === 'Easy' ? 'bg-green-600/20 text-green-400' :
          question.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' :
          'bg-red-600/20 text-red-400'
        }`}>
          {question.difficulty}
        </span>
      </div>

      <div className="space-y-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap">{question.description}</p>
        </div>

        {question.constraints && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Constraints:</h3>
            <pre className="bg-gray-900/50 p-3 rounded-md text-gray-300 font-mono text-sm whitespace-pre-wrap">
              {question.constraints}
            </pre>
          </div>
        )}

        {question.examples && question.examples.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Examples:</h3>
            <div className="space-y-4">
              {question.examples.map((example, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Example {index + 1}:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm font-medium text-purple-400">Input:</span>
                      <pre className="mt-1 p-2 bg-gray-800 rounded text-gray-300 font-mono text-sm overflow-x-auto">
                        {example.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-purple-400">Output:</span>
                      <pre className="mt-1 p-2 bg-gray-800 rounded text-gray-300 font-mono text-sm overflow-x-auto">
                        {example.output}
                      </pre>
                    </div>
                  </div>
                  {example.explanation && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-purple-400">Explanation:</span>
                      <p className="mt-1 text-gray-300 text-sm">{example.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {question.tags && question.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;