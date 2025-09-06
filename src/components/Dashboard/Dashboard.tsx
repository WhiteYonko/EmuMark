import React from 'react';
import { Users, FileText, TrendingUp, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import PerformanceChart from './PerformanceChart';

export default function Dashboard() {
  const { state } = useApp();
  const { students, testTemplates, testResults, darkMode } = state;

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'blue',
      trend: '+5.2%'
    },
    {
      title: 'Test Templates',
      value: testTemplates.length + 8, // Demo data
      icon: FileText,
      color: 'green',
      trend: '+2.1%'
    },
    {
      title: 'Tests Marked',
      value: testResults.length + 45, // Demo data
      icon: TrendingUp,
      color: 'purple',
      trend: '+12.5%'
    },
    {
      title: 'Avg. Grade',
      value: '82%',
      icon: Clock,
      color: 'orange',
      trend: '+3.2%'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <select className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Term</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="w-4 h-4" />
            <span>Create New Test</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <Users className="w-4 h-4" />
            <span>Add Student</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}