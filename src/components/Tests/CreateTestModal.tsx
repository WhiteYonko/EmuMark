import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TestTemplate, Question } from '../../types';

interface CreateTestModalProps {
  onClose: () => void;
}

export default function CreateTestModal({ onClose }: CreateTestModalProps) {
  const { state, dispatch } = useApp();
  const { subjects, darkMode } = state;
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    grade: 'Grade 4',
    duration: 30,
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'multiple-choice',
      question: '',
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: ''
    }
  ]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: ''
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    
    const newTemplate: TestTemplate = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      grade: formData.grade,
      questions,
      totalMarks,
      duration: formData.duration,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_TEST_TEMPLATE', payload: newTemplate });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Create Test Template
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Test Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Grade
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option>Grade 3</option>
                  <option>Grade 4</option>
                  <option>Grade 5</option>
                  <option>Grade 6</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Questions ({questions.length})
                </h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg border p-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Question {index + 1}
                      </h4>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          className={`p-1 rounded transition-colors ${
                            darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Question
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            darkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, { type: e.target.value as Question['type'] })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            darkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="short-answer">Short Answer</option>
                          <option value="true-false">True/False</option>
                        </select>
                      </div>
                    </div>

                    {question.type === 'multiple-choice' && question.options && (
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Options
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === option}
                                onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                                className="text-blue-600"
                              />
                              <input
                                type="text"
                                placeholder={`Option ${optionIndex + 1}`}
                                value={option}
                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                  darkMode 
                                    ? 'bg-gray-600 border-gray-500 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Marks
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={question.marks}
                        onChange={(e) => updateQuestion(question.id, { marks: parseInt(e.target.value) })}
                        className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}