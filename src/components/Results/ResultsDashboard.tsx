import React, { useState } from 'react';
import { Search, Filter, Download, Eye, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const mockResults = [
  {
    id: '1',
    student: 'Emma Thompson',
    test: 'Mathematics Quiz - Multiplication',
    subject: 'Mathematics',
    score: 18,
    totalMarks: 20,
    percentage: 90,
    submittedAt: '2024-01-20T10:30:00Z',
    status: 'excellent'
  },
  {
    id: '2',
    student: 'Liam Johnson',
    test: 'English Comprehension Test',
    subject: 'English',
    score: 15,
    totalMarks: 25,
    percentage: 60,
    submittedAt: '2024-01-20T11:15:00Z',
    status: 'needs-improvement'
  },
  {
    id: '3',
    student: 'Sofia Chen',
    test: 'Science - Living Things',
    subject: 'Science',
    score: 28,
    totalMarks: 30,
    percentage: 93,
    submittedAt: '2024-01-19T14:20:00Z',
    status: 'excellent'
  },
  {
    id: '4',
    student: 'Emma Thompson',
    test: 'Geography Quiz',
    subject: 'Geography',
    score: 22,
    totalMarks: 25,
    percentage: 88,
    submittedAt: '2024-01-18T09:45:00Z',
    status: 'good'
  }
];

export default function ResultsDashboard() {
  const { state } = useApp();
  const { subjects, darkMode } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (percentage >= 80) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    if (percentage >= 60) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      excellent: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      good: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'needs-improvement': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return styles[status as keyof typeof styles] || styles['needs-improvement'];
  };

  const filteredResults = mockResults.filter(result => {
    const matchesSearch = result.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.test.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === '' || result.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Test Results
        </h2>
        <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Results</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tests', value: '24', color: 'blue' },
          { label: 'Average Score', value: '83%', color: 'green' },
          { label: 'Excellent (90%+)', value: '12', color: 'green' },
          { label: 'Need Support (<60%)', value: '3', color: 'red' }
        ].map((stat, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
            <p className={`text-2xl font-bold ${
              stat.color === 'green' ? 'text-green-600' : 
              stat.color === 'red' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
          <input
            type="text"
            placeholder="Search results..."
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

      {/* Results Table */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Student
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Test
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Score
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Performance
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Date
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredResults.map((result) => (
                <tr key={result.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <div className="font-medium">{result.student}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{result.subject}</div>
                  </td>
                  <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    <div className="max-w-xs truncate">{result.test}</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap`}>
                    <div className={`text-lg font-bold ${getGradeColor(result.percentage).split(' ')[0]}`}>
                      {result.score}/{result.totalMarks}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {result.percentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(result.status)}`}>
                      {result.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className={`p-1 rounded transition-colors ${
                        darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                      }`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className={`p-1 rounded transition-colors ${
                        darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                      }`}>
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredResults.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg mb-2">No results found</p>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}