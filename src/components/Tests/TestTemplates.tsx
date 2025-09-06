import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Copy, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CreateTestModal from './CreateTestModal';

const mockTemplates = [
  {
    id: '1',
    title: 'Mathematics Quiz - Multiplication Tables',
    subject: 'Mathematics',
    grade: 'Grade 4',
    questions: 10,
    totalMarks: 20,
    duration: 30,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'English Comprehension Test',
    subject: 'English',
    grade: 'Grade 4',
    questions: 8,
    totalMarks: 25,
    duration: 45,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Science - Living Things',
    subject: 'Science',
    grade: 'Grade 4',
    questions: 12,
    totalMarks: 30,
    duration: 40,
    createdAt: '2024-01-08'
  }
];

export default function TestTemplates() {
  const { state } = useApp();
  const { subjects, darkMode } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getSubjectColor = (subjectName: string) => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject?.color || 'bg-gray-500';
  };

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === '' || template.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Test Templates
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.name}>{subject.name}</option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 transition-colors duration-200 hover:shadow-md`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${getSubjectColor(template.subject)} rounded-full`}></div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {template.subject}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button className={`p-1 rounded transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <Edit className="w-4 h-4" />
                </button>
                <button className={`p-1 rounded transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <Copy className="w-4 h-4" />
                </button>
                <button className={`p-1 rounded transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {template.title}
            </h3>

            <div className={`text-sm space-y-1 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Grade: {template.grade}</p>
              <p>Questions: {template.questions}</p>
              <p>Total Marks: {template.totalMarks}</p>
              <p>Duration: {template.duration} minutes</p>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Created: {new Date(template.createdAt).toLocaleDateString()}
              </span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg mb-2">No templates found</p>
          <p>Try adjusting your search criteria or create a new template</p>
        </div>
      )}

      {/* Create Test Modal */}
      {showCreateModal && (
        <CreateTestModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}