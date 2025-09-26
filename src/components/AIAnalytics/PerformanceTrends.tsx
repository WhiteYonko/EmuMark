import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Calendar } from 'lucide-react';
import { PerformanceTrend } from '../../types';
import { Student } from '../../types';

interface PerformanceTrendsProps {
  trends: PerformanceTrend[];
  students: Student[];
}

export default function PerformanceTrends({ trends, students }: PerformanceTrendsProps) {
  const { state } = useApp();
  const { darkMode } = state;
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'stable':
        return <Minus className="w-5 h-5 text-blue-500" />;
      case 'volatile':
        return <BarChart3 className="w-5 h-5 text-yellow-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-100';
      case 'declining':
        return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-100';
      case 'stable':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-100';
      case 'volatile':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const filteredTrends = trends.filter(trend => {
    const studentMatch = selectedStudent === 'all' || trend.studentId === selectedStudent;
    const subjectMatch = selectedSubject === 'all' || trend.subject === selectedSubject;
    return studentMatch && subjectMatch;
  });

  const uniqueStudents = Array.from(new Set(trends.map(t => t.studentId)));
  const uniqueSubjects = Array.from(new Set(trends.map(t => t.subject)));

  const trendSummary = {
    improving: trends.filter(t => t.trend === 'improving').length,
    declining: trends.filter(t => t.trend === 'declining').length,
    stable: trends.filter(t => t.trend === 'stable').length,
    volatile: trends.filter(t => t.trend === 'volatile').length,
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Student
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Students</option>
            {uniqueStudents.map(studentId => (
              <option key={studentId} value={studentId}>
                {getStudentName(studentId)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Subject
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
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trend Summary */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Trend Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(trendSummary).map(([trend, count]) => (
            <div key={trend} className="text-center">
              <div className={`text-2xl font-bold ${
                trend === 'improving' ? 'text-green-600' :
                trend === 'declining' ? 'text-red-600' :
                trend === 'stable' ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {count}
              </div>
              <div className={`text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {trend} trends
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trends List */}
      <div className="space-y-4">
        {filteredTrends.map((trend) => (
          <div
            key={`${trend.studentId}-${trend.subject}`}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getTrendIcon(trend.trend)}
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getStudentName(trend.studentId)} - {trend.subject}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {trend.period} trend analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(trend.trend)}`}>
                  {trend.trend}
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {trend.confidence}% confidence
                </span>
              </div>
            </div>

            {/* Trend Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Trend Score
                </span>
                <span className={`text-sm font-bold ${
                  trend.trendScore > 0 ? 'text-green-600' : 
                  trend.trendScore < 0 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {trend.trendScore > 0 ? '+' : ''}{trend.trendScore.toFixed(1)}
                </span>
              </div>
              <div className={`w-full h-2 rounded-full ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-2 rounded-full ${
                    trend.trendScore > 0 ? 'bg-green-500' : 
                    trend.trendScore < 0 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, Math.abs(trend.trendScore))}%`,
                    marginLeft: trend.trendScore < 0 ? `${100 - Math.abs(trend.trendScore)}%` : '0'
                  }}
                ></div>
              </div>
            </div>

            {/* Data Points Chart */}
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Performance Over Time
              </h4>
              <div className="flex items-end space-x-1 h-20">
                {trend.dataPoints.map((point, index) => {
                  const height = (point.score / 100) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t ${
                          trend.trend === 'improving' ? 'bg-green-400' :
                          trend.trend === 'declining' ? 'bg-red-400' :
                          trend.trend === 'stable' ? 'bg-blue-400' : 'bg-yellow-400'
                        }`}
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {point.score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Predicted Score */}
            {trend.predictedScore && (
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Predicted Next Score
                  </span>
                  <span className={`text-lg font-bold ${
                    trend.predictedScore > 80 ? 'text-green-600' :
                    trend.predictedScore > 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {trend.predictedScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            {/* Data Points Table */}
            <div className="mt-4">
              <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Recent Assessments
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Date
                      </th>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Score
                      </th>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trend.dataPoints.slice(-5).map((point, index) => (
                      <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {new Date(point.date).toLocaleDateString()}
                        </td>
                        <td className={`py-2 font-medium ${
                          point.score >= 80 ? 'text-green-600' :
                          point.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {point.score}%
                        </td>
                        <td className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {point.assessmentType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrends.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No trends found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}
