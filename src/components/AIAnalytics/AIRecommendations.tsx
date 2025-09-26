import React, { useState } from 'react';
import { Lightbulb, Users, Target, BookOpen, CheckCircle, Clock, X } from 'lucide-react';
import { AIRecommendation } from '../../types';
import { Student } from '../../types';

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  students: Student[];
}

export default function AIRecommendations({ recommendations, students }: AIRecommendationsProps) {
  const { state } = useApp();
  const { darkMode } = state;
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'dismissed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null);

  const getStudentNames = (studentIds: string[]) => {
    return studentIds.map(id => students.find(s => s.id === id)?.name || 'Unknown Student');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'teaching_strategy':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'intervention':
        return <Target className="w-5 h-5 text-red-500" />;
      case 'resource':
        return <BookOpen className="w-5 h-5 text-green-500" />;
      case 'assessment':
        return <Target className="w-5 h-5 text-purple-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-100';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <Target className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'dismissed':
        return <X className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const statusMatch = filter === 'all' || rec.status === filter;
    const priorityMatch = priorityFilter === 'all' || rec.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const recommendationSummary = {
    total: recommendations.length,
    pending: recommendations.filter(r => r.status === 'pending').length,
    in_progress: recommendations.filter(r => r.status === 'in_progress').length,
    completed: recommendations.filter(r => r.status === 'completed').length,
    dismissed: recommendations.filter(r => r.status === 'dismissed').length,
    high: recommendations.filter(r => r.priority === 'high').length,
    medium: recommendations.filter(r => r.priority === 'medium').length,
    low: recommendations.filter(r => r.priority === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {recommendationSummary.total}
              </p>
            </div>
            <Lightbulb className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
              <p className={`text-2xl font-bold text-yellow-600`}>
                {recommendationSummary.pending}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
              <p className={`text-2xl font-bold text-blue-600`}>
                {recommendationSummary.in_progress}
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
              <p className={`text-2xl font-bold text-green-600`}>
                {recommendationSummary.completed}
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
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 transition-colors duration-200 cursor-pointer hover:shadow-md`}
            onClick={() => setSelectedRecommendation(recommendation)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(recommendation.type)}
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {recommendation.title}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {recommendation.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                  {recommendation.priority}
                </span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(recommendation.status)}
                  <span className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {recommendation.status}
                  </span>
                </div>
              </div>
            </div>

            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {recommendation.description}
            </p>

            {/* Target Students */}
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Target Students ({recommendation.targetStudents.length}):
              </h4>
              <div className="flex flex-wrap gap-2">
                {getStudentNames(recommendation.targetStudents).slice(0, 5).map((name, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {name}
                  </span>
                ))}
                {recommendation.targetStudents.length > 5 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    +{recommendation.targetStudents.length - 5} more
                  </span>
                )}
              </div>
            </div>

            {/* Impact and Resources */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {recommendation.estimatedImpact}% impact
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {recommendation.requiredResources.length} resources
                  </span>
                </div>
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(recommendation.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No recommendations found for the selected filters.</p>
        </div>
      )}

      {/* Recommendation Detail Modal */}
      {selectedRecommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(selectedRecommendation.type)}
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRecommendation.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRecommendation(null)}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Description
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedRecommendation.description}
                  </p>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Implementation Steps:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {selectedRecommendation.implementationSteps.map((step, index) => (
                      <li key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Required Resources:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedRecommendation.requiredResources.map((resource, index) => (
                      <li key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedRecommendation.priority)}`}>
                      {selectedRecommendation.priority} priority
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedRecommendation.estimatedImpact}% estimated impact
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Start Implementation
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
