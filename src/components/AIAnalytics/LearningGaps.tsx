import React, { useState } from 'react';
import { Target, Clock, BookOpen, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { LearningGap } from '../../types';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface LearningGapsProps {
  gaps: LearningGap[];
  students: Student[];
}

export default function LearningGaps({ gaps, students }: LearningGapsProps) {
  const { state } = useApp();
  const { darkMode } = state;
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'closed'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'minor' | 'moderate' | 'major' | 'critical'>('all');

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'major':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'moderate':
        return <Target className="w-5 h-5 text-yellow-500" />;
      case 'minor':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-100';
      case 'major':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-800 dark:text-orange-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-100';
      case 'minor':
        return 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-100';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Target className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredGaps = gaps.filter(gap => {
    const statusMatch = filter === 'all' || gap.status === filter;
    const severityMatch = severityFilter === 'all' || gap.severity === severityFilter;
    return statusMatch && severityMatch;
  });

  const gapSummary = {
    total: gaps.length,
    open: gaps.filter(g => g.status === 'open').length,
    in_progress: gaps.filter(g => g.status === 'in_progress').length,
    closed: gaps.filter(g => g.status === 'closed').length,
    critical: gaps.filter(g => g.severity === 'critical').length,
    major: gaps.filter(g => g.severity === 'major').length,
    moderate: gaps.filter(g => g.severity === 'moderate').length,
    minor: gaps.filter(g => g.severity === 'minor').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Gaps</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {gapSummary.total}
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Open</p>
              <p className={`text-2xl font-bold text-red-600`}>
                {gapSummary.open}
              </p>
            </div>
            <Target className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
              <p className={`text-2xl font-bold text-yellow-600`}>
                {gapSummary.in_progress}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Closed</p>
              <p className={`text-2xl font-bold text-green-600`}>
                {gapSummary.closed}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Status
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Severity
          </label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="major">Major</option>
            <option value="moderate">Moderate</option>
            <option value="minor">Minor</option>
          </select>
        </div>
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {filteredGaps.map((gap) => (
          <div
            key={gap.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(gap.severity)}
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {gap.topic} - {gap.subject}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getStudentName(gap.studentId)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                  {gap.severity}
                </span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(gap.status)}
                  <span className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {gap.status}
                  </span>
                </div>
              </div>
            </div>

            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {gap.description}
            </p>

            {/* Suggested Resources */}
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Suggested Resources:
              </h4>
              <div className="flex flex-wrap gap-2">
                {gap.suggestedResources.map((resource, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </div>

            {/* Time to Close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Estimated time to close: {gap.estimatedTimeToClose} days
                </span>
              </div>
              <div className="flex space-x-2">
                {gap.status === 'open' && (
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                    Start Intervention
                  </button>
                )}
                {gap.status === 'in_progress' && (
                  <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                    Mark as Closed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGaps.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No learning gaps found for the selected filters.</p>
        </div>
      )}

      {/* Severity Breakdown */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Severity Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { severity: 'critical', count: gapSummary.critical, color: 'red' },
            { severity: 'major', count: gapSummary.major, color: 'orange' },
            { severity: 'moderate', count: gapSummary.moderate, color: 'yellow' },
            { severity: 'minor', count: gapSummary.minor, color: 'green' },
          ].map(({ severity, count, color }) => (
            <div key={severity} className="text-center">
              <div className={`text-2xl font-bold text-${color}-600`}>
                {count}
              </div>
              <div className={`text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {severity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
