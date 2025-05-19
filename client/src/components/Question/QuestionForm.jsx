import React, { useState } from 'react';

const QuestionForm = ({ onSubmit, onCancel }) => {
  const [questionData, setQuestionData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    tags: '',
    constraints: '',
    starterCode: '',
    examples: [{ input: '', output: '', explanation: '' }]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...questionData.examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setQuestionData(prev => ({
      ...prev,
      examples: newExamples
    }));
  };

  const addExample = () => {
    setQuestionData(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeExample = (index) => {
    if (questionData.examples.length > 1) {
      setQuestionData(prev => ({
        ...prev,
        examples: prev.examples.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...questionData,
      tags: questionData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={questionData.title}
          onChange={handleInputChange}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
        <textarea
          name="description"
          value={questionData.description}
          onChange={handleInputChange}
          rows="4"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-200"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Difficulty</label>
          <select
            name="difficulty"
            value={questionData.difficulty}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-200"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={questionData.tags}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-200"
            placeholder="e.g., arrays, strings, dynamic-programming"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Constraints</label>
        <textarea
          name="constraints"
          value={questionData.constraints}
          onChange={handleInputChange}
          rows="2"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-200"
          placeholder="e.g., 1 ≤ n ≤ 10^5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">Starter Code</label>
        <textarea
          name="starterCode"
          value={questionData.starterCode}
          onChange={handleInputChange}
          rows="4"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-200 font-mono"
          placeholder="def solution(nums):\n    # Your code here\n    pass"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-200">Examples</label>
          <button
            type="button"
            onClick={addExample}
            className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
          >
            Add Example
          </button>
        </div>

        {questionData.examples.map((example, index) => (
          <div key={index} className="p-4 border border-gray-600 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Example {index + 1}</span>
              {questionData.examples.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExample(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Input</label>
                <textarea
                  value={example.input}
                  onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-200 font-mono"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Output</label>
                <textarea
                  value={example.output}
                  onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-200 font-mono"
                  rows="2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Explanation</label>
              <textarea
                value={example.explanation}
                onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-gray-200"
                rows="2"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Create Question
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;