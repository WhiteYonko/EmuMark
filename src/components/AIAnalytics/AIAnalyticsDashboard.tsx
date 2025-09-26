import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, BarChart3, Users, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIAnalyticsEngine } from '../../services/aiAnalyticsEngine';
import PerformanceInsights from './PerformanceInsights';
import PerformanceTrends from './PerformanceTrends';
import LearningGaps from './LearningGaps';
import AIRecommendations from './AIRecommendations';
import PerformanceAlerts from './PerformanceAlerts';
import SubjectBreakdowns from './SubjectBreakdowns';

export default function AIAnalyticsDashboard() {
  const { state, dispatch } = useApp();
  const { students, gradeEntries, assessments, aiAnalytics, darkMode } = state;
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate AI analytics when component mounts or data changes
  useEffect(() => {
    if (students.length > 0 && gradeEntries.length > 0) {
      generateAnalytics();
    }
  }, [students, gradeEntries, assessments]);

  const generateAnalytics = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const engine = new AIAnalyticsEngine(students, gradeEntries, assessments);
    const analytics = engine.generateAnalytics();
    
    dispatch({ type: 'UPDATE_AI_ANALYTICS', payload: analytics });
    setIsAnalyzing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'gaps', label: 'Learning Gaps', icon: Target },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'subjects', label: 'Subject Analysis', icon: BookOpen },
  ];

  const getOverviewStats = () => {
    const totalInsights = aiAnalytics.insights.length;
    const highPriorityInsights = aiAnalytics.insights.filter(i => i.priority === 'high').length;
    const unreadAlerts = aiAnalytics.alerts.filter(a => !a.isRead).length;
    const openGaps = aiAnalytics.learningGaps.filter(g => g.status === 'open').length;
    const pendingRecommendations = aiAnalytics.recommendations.filter(r => r.status === 'pending').length;

    return [
      {
        title: 'Performance Insights',
        value: totalInsights,
        icon: Brain,
        color: 'blue',
        subtitle: `${highPriorityInsights} high priority`
      },
      {
        title: 'Active Alerts',
        value: unreadAlerts,
        icon: AlertTriangle,
        color: 'red',
        subtitle: 'Requires attention'
      },
      {
        title: 'Learning Gaps',
        value: openGaps,
        icon: Target,
        color: 'orange',
        subtitle: 'Needs intervention'
      },
      {
        title: 'AI Recommendations',
        value: pendingRecommendations,
        icon: Lightbulb,
        color: 'green',
        subtitle: 'Ready to implement'
      }
    ];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getOverviewStats().map((stat, index) => (
                <div
                  key={index}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 transition-colors duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.title}
                      </p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {stat.subtitle}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Insights */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent AI Insights
              </h3>
              <div className="space-y-3">
                {aiAnalytics.insights.slice(0, 5).map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.priority === 'high' 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : insight.priority === 'medium'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {insight.title}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {insight.description}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        insight.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          : insight.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      }`}>
                        {insight.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Trends Summary */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Performance Trends Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['improving', 'declining', 'stable'].map((trend) => {
                  const count = aiAnalytics.trends.filter(t => t.trend === trend).length;
                  return (
                    <div key={trend} className="text-center">
                      <div className={`text-2xl font-bold ${
                        trend === 'improving' ? 'text-green-600' :
                        trend === 'declining' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {count}
                      </div>
                      <div className={`text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {trend} trends
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'insights':
        return <PerformanceInsights insights={aiAnalytics.insights} />;
      case 'trends':
        return <PerformanceTrends trends={aiAnalytics.trends} students={students} />;
      case 'gaps':
        return <LearningGaps gaps={aiAnalytics.learningGaps} students={students} />;
      case 'recommendations':
        return <AIRecommendations recommendations={aiAnalytics.recommendations} students={students} />;
      case 'alerts':
        return <PerformanceAlerts alerts={aiAnalytics.alerts} students={students} />;
      case 'subjects':
        return <SubjectBreakdowns breakdowns={aiAnalytics.subjectBreakdowns} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Analytics & Progress Tracking
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Intelligent insights and recommendations powered by AI
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={generateAnalytics}
            disabled={isAnalyzing}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isAnalyzing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {new Date(aiAnalytics.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {renderTabContent()}
      </div>
    </div>
  );
}
