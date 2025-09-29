import React, { useState } from 'react';
import { BookOpen, TrendingUp, Users, Award, AlertCircle, BarChart3 } from 'lucide-react';
import { SubjectPerformanceBreakdown } from '../../types';

interface SubjectBreakdownsProps {
  breakdowns: SubjectPerformanceBreakdown[];
}

export default function SubjectBreakdowns({ breakdowns }: SubjectBreakdownsProps) {
  const { state } = useApp();
  const { darkMode } = state;
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredBreakdowns = selectedSubject === 'all' 
    ? breakdowns 
    : breakdowns.filter(b => b.subject === selectedSubject);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-100';
      case 'B':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-100';
      case 'D':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-800 dark:text-orange-100';
      case 'F':
        return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-100';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getPerformanceColor = (average: number) => {
    if (average >= 90) return 'text-green-600';
    if (average >= 80) return 'text-blue-600';
    if (average >= 70) return 'text-yellow-600';
    if (average >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (average: number) => {
    if (average >= 90) return 'Excellent';
    if (average >= 80) return 'Good';
    if (average >= 70) return 'Satisfactory';
    if (average >= 60) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Subject Filter */}
      <div className="flex items-center space-x-4">
        <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Subject:
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Subjects</option>
          {breakdowns.map(breakdown => (
            <option key={breakdown.subject} value={breakdown.subject}>
              {breakdown.subject}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBreakdowns.map((breakdown) => (
          <div
            key={breakdown.subject}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {breakdown.subject}
                </h3>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getPerformanceColor(breakdown.averageScore)}`}>
                  {breakdown.averageScore}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getPerformanceLabel(breakdown.averageScore)}
                </div>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="mb-6">
              <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Grade Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(breakdown.gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(grade)}`}>
                      Grade {grade}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-32 h-2 rounded-full ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div
                          className={`h-2 rounded-full ${
                            grade === 'A' ? 'bg-green-500' :
                            grade === 'B' ? 'bg-blue-500' :
                            grade === 'C' ? 'bg-yellow-500' :
                            grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(count / breakdown.studentCount) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="mb-6">
              <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Top Performers
              </h4>
              <div className="flex flex-wrap gap-2">
                {breakdown.topPerformers.length > 0 ? (
                  breakdown.topPerformers.map((student, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        darkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {student}
                    </span>
                  ))
                ) : (
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No top performers identified
                  </span>
                )}
              </div>
            </div>

            {/* Struggling Students */}
            <div className="mb-6">
              <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Struggling Students
              </h4>
              <div className="flex flex-wrap gap-2">
                {breakdown.strugglingStudents.length > 0 ? (
                  breakdown.strugglingStudents.map((student, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        darkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {student}
                    </span>
                  ))
                ) : (
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No struggling students identified
                  </span>
                )}
              </div>
            </div>

            {/* Common Weaknesses */}
            <div className="mb-6">
              <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Common Weaknesses
              </h4>
              <div className="space-y-1">
                {breakdown.commonWeaknesses.map((weakness, index) => (
                  <div key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    • {weakness}
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div>
              <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Improvement Suggestions
              </h4>
              <div className="space-y-1">
                {breakdown.improvementSuggestions.map((suggestion, index) => (
                  <div key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    • {suggestion}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBreakdowns.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No subject breakdowns available.</p>
        </div>
      )}

      {/* Overall Performance Summary */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Overall Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {breakdowns.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Subjects Analyzed
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              breakdowns.length > 0 
                ? getPerformanceColor(breakdowns.reduce((sum, b) => sum + b.averageScore, 0) / breakdowns.length)
                : 'text-gray-500'
            }`}>
              {breakdowns.length > 0 
                ? Math.round(breakdowns.reduce((sum, b) => sum + b.averageScore, 0) / breakdowns.length)
                : 0
              }%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Average Score
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {breakdowns.reduce((sum, b) => sum + b.studentCount, 0)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Students
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
