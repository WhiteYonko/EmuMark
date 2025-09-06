import React, { useState } from 'react';
import { Download, Calendar, Users, TrendingUp, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Reports() {
  const { state } = useApp();
  const { students, subjects, darkMode } = state;
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Mock data for charts and reports
  const performanceData = [
    { student: 'Emma Thompson', math: 90, english: 85, science: 88, overall: 88 },
    { student: 'Liam Johnson', math: 75, english: 68, science: 72, overall: 72 },
    { student: 'Sofia Chen', math: 95, english: 90, science: 92, overall: 92 },
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', average: 85, students: 15, improvement: '+5%' },
    { subject: 'English', average: 78, students: 15, improvement: '+2%' },
    { subject: 'Science', average: 82, students: 15, improvement: '+8%' },
    { subject: 'History', average: 76, students: 12, improvement: '-1%' },
    { subject: 'Geography', average: 80, students: 10, improvement: '+3%' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Reports & Analytics
        </h2>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-term">This Term</option>
            <option value="this-year">This Year</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Class Average', value: '82%', change: '+3%', positive: true, icon: TrendingUp },
          { title: 'Total Students', value: students.length.toString(), change: '+2', positive: true, icon: Users },
          { title: 'Tests Completed', value: '45', change: '+12', positive: true, icon: Calendar },
          { title: 'Improvement Rate', value: '78%', change: '+5%', positive: true, icon: TrendingUp },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.positive ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-2`}>
                  from last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subject Performance */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Subject Performance Overview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject</th>
                <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Average</th>
                <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Students</th>
                <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Trend</th>
                <th className={`text-left py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {subjectPerformance.map((subject, index) => (
                <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}>
                  <td className={`py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">{subject.subject}</span>
                    </div>
                  </td>
                  <td className={`py-4 font-semibold ${
                    subject.average >= 85 ? 'text-green-600' : 
                    subject.average >= 75 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {subject.average}%
                  </td>
                  <td className={`py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {subject.students}
                  </td>
                  <td className={`py-4 font-medium ${
                    subject.improvement.startsWith('+') ? 'text-green-600' : 
                    subject.improvement.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {subject.improvement}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className={`w-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mr-3`}>
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${subject.average}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {subject.average}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Performance Comparison */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Individual Student Performance
        </h3>
        <div className="space-y-4">
          {performanceData.map((student, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {student.student}
                </h4>
                <span className={`font-bold text-lg ${
                  student.overall >= 85 ? 'text-green-600' : 
                  student.overall >= 75 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {student.overall}%
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { subject: 'Math', score: student.math, color: 'bg-blue-500' },
                  { subject: 'English', score: student.english, color: 'bg-green-500' },
                  { subject: 'Science', score: student.science, color: 'bg-purple-500' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.subject}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-16 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}