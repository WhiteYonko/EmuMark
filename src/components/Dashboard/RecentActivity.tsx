import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const activities = [
  {
    id: 1,
    type: 'test_completed',
    message: 'Emma Thompson completed Math Test #3',
    time: '2 minutes ago',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: 2,
    type: 'test_uploaded',
    message: 'New test paper uploaded for Science',
    time: '15 minutes ago',
    icon: Clock,
    color: 'text-blue-600'
  },
  {
    id: 3,
    type: 'low_score',
    message: 'Liam Johnson scored below average in English',
    time: '1 hour ago',
    icon: AlertCircle,
    color: 'text-red-600'
  },
  {
    id: 4,
    type: 'test_completed',
    message: 'Sofia Chen completed Geography Quiz',
    time: '2 hours ago',
    icon: CheckCircle,
    color: 'text-green-600'
  }
];

export default function RecentActivity() {
  const { state } = useApp();
  const { darkMode } = state;

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 transition-colors duration-200`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <Icon className={`w-5 h-5 ${activity.color} mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {activity.message}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all activity
      </button>
    </div>
  );
}