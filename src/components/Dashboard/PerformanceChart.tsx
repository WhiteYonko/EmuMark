import React from 'react';
import { useApp } from '../../context/AppContext';

export default function PerformanceChart() {
  const { state } = useApp();
  const { darkMode } = state;

  // Mock data for demonstration
  const monthlyData = [
    { month: 'Jan', average: 75 },
    { month: 'Feb', average: 78 },
    { month: 'Mar', average: 82 },
    { month: 'Apr', average: 79 },
    { month: 'May', average: 85 },
    { month: 'Jun', average: 88 },
  ];

  const maxScore = Math.max(...monthlyData.map(d => d.average));

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 transition-colors duration-200`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Class Performance Trend
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Score</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 flex items-end space-x-4">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-end justify-center mb-2" style={{ height: '200px' }}>
              <div 
                className="w-8 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(data.average / maxScore) * 100}%` }}
              ></div>
            </div>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {data.month}
            </span>
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              {data.average}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}