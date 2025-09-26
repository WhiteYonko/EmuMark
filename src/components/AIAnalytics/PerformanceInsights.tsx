import React, { useState } from 'react';
import { Brain, Eye, EyeOff, CheckCircle, AlertCircle, Info, TrendingUp } from 'lucide-react';
import { PerformanceInsight } from '../../types';
import { useApp } from '../../context/AppContext';

interface PerformanceInsightsProps {
  insights: PerformanceInsight[];
}

export default function PerformanceInsights({ insights }: PerformanceInsightsProps) {
  const { state } = useApp();
  const { darkMode, students } = state;
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'medium' | 'low'>('all');
  const [selectedInsight, setSelectedInsight] = useState<PerformanceInsight | null>(null);

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weakness':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'strength':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'recommendation':
        return <Brain className="w-5 h-5 text-purple-500" />;
      default:
        return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredInsights = insights.filter(insight => {
    switch (filter) {
      case 'unread':
        return !insight.isRead;
      case 'high':
        return insight.priority === 'high';
      case 'medium':
        return insight.priority === 'medium';
      case 'low':
        return insight.priority === 'low';
      default:
        return true;
    }
  });

  const priorityCounts = {
    all: insights.length,
    unread: insights.filter(i => !i.isRead).length,
    high: insights.filter(i => i.priority === 'high').length,
    medium: insights.filter(i => i.priority === 'medium').length,
    low: insights.filter(i => i.priority === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Insights' },
          { key: 'unread', label: 'Unread' },
          { key: 'high', label: 'High Priority' },
          { key: 'medium', label: 'Medium Priority' },
          { key: 'low', label: 'Low Priority' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              filter === key
                ? 'bg-blue-600 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label} ({priorityCounts[key as keyof typeof priorityCounts]})
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 transition-colors duration-200 cursor-pointer hover:shadow-md`}
            onClick={() => setSelectedInsight(insight)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(insight.type)}
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {insight.title}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getStudentName(insight.studentId)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getPriorityIcon(insight.priority)}
                {!insight.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>

            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {insight.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  insight.category === 'academic' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                    : insight.category === 'behavioral'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
                    : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                }`}>
                  {insight.category}
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {insight.confidence}% confidence
                </span>
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(insight.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No insights found for the selected filter.</p>
        </div>
      )}

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(selectedInsight.type)}
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedInsight.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Student: {getStudentName(selectedInsight.studentId)}
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedInsight.description}
                  </p>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Suggested Actions:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedInsight.suggestedActions.map((action, index) => (
                      <li key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedInsight.priority === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        : selectedInsight.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    }`}>
                      {selectedInsight.priority} priority
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedInsight.confidence}% confidence
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      // Mark as read logic would go here
                      setSelectedInsight(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Mark as Read
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
