import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend: string;
}

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const { state } = useApp();
  const { darkMode } = state;

  const isPositiveTrend = trend.startsWith('+');

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 transition-colors duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 ${colorMap[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          isPositiveTrend ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend}
        </span>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-2`}>
          from last month
        </span>
      </div>
    </div>
  );
}