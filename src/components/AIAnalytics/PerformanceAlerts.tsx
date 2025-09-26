import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, Clock, User } from 'lucide-react';
import { PerformanceAlert } from '../../types';
import { Student } from '../../types';

interface PerformanceAlertsProps {
  alerts: PerformanceAlert[];
  students: Student[];
}

export default function PerformanceAlerts({ alerts, students }: PerformanceAlertsProps) {
  const { state } = useApp();
  const { darkMode } = state;
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'warning' | 'info'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'grade_drop' | 'missing_assignment' | 'attendance' | 'behavior' | 'improvement'>('all');

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-100';
      case 'info':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-100';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grade_drop':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'missing_assignment':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'attendance':
        return <User className="w-4 h-4 text-orange-500" />;
      case 'behavior':
        return <XCircle className="w-4 h-4 text-purple-500" />;
      case 'improvement':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'grade_drop':
        return 'Grade Drop';
      case 'missing_assignment':
        return 'Missing Assignment';
      case 'attendance':
        return 'Attendance';
      case 'behavior':
        return 'Behavior';
      case 'improvement':
        return 'Improvement';
      default:
        return 'Unknown';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filter === 'all' || alert.severity === filter;
    const typeMatch = typeFilter === 'all' || alert.type === typeFilter;
    return severityMatch && typeMatch;
  });

  const alertSummary = {
    total: alerts.length,
    unread: alerts.filter(a => !a.isRead).length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
    actionRequired: alerts.filter(a => a.actionRequired).length,
  };

  const markAsRead = (alertId: string) => {
    // This would typically dispatch an action to update the alert
    console.log('Marking alert as read:', alertId);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Alerts</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {alertSummary.total}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unread</p>
              <p className={`text-2xl font-bold text-yellow-600`}>
                {alertSummary.unread}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Critical</p>
              <p className={`text-2xl font-bold text-red-600`}>
                {alertSummary.critical}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Action Required</p>
              <p className={`text-2xl font-bold text-orange-600`}>
                {alertSummary.actionRequired}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Severity
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
            <option value="all">All Severity</option>
            <option value="unread">Unread</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Types</option>
            <option value="grade_drop">Grade Drop</option>
            <option value="missing_assignment">Missing Assignment</option>
            <option value="attendance">Attendance</option>
            <option value="behavior">Behavior</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 transition-colors duration-200 ${
              !alert.isRead ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(alert.severity)}
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {alert.title}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getStudentName(alert.studentId)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
                <div className="flex items-center space-x-1">
                  {getTypeIcon(alert.type)}
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {getTypeLabel(alert.type)}
                  </span>
                </div>
                {!alert.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>

            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {alert.message}
            </p>

            {/* Related Data */}
            {alert.relatedData && (
              <div className={`mb-4 p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Additional Information:
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(alert.relatedData).map(([key, value]) => (
                    <div key={key}>
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </span>
                      <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {typeof value === 'number' ? value.toFixed(1) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {alert.actionRequired && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-orange-800 text-orange-100' : 'bg-orange-100 text-orange-800'
                  }`}>
                    Action Required
                  </span>
                )}
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(alert.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex space-x-2">
                {!alert.isRead && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    Mark as Read
                  </button>
                )}
                {alert.actionRequired && (
                  <button className="px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm">
                    Take Action
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No alerts found for the selected filters.</p>
        </div>
      )}

      {/* Alert Types Breakdown */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Alert Types Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { type: 'grade_drop', count: alerts.filter(a => a.type === 'grade_drop').length, color: 'red' },
            { type: 'missing_assignment', count: alerts.filter(a => a.type === 'missing_assignment').length, color: 'yellow' },
            { type: 'attendance', count: alerts.filter(a => a.type === 'attendance').length, color: 'orange' },
            { type: 'behavior', count: alerts.filter(a => a.type === 'behavior').length, color: 'purple' },
            { type: 'improvement', count: alerts.filter(a => a.type === 'improvement').length, color: 'green' },
          ].map(({ type, count, color }) => (
            <div key={type} className="text-center">
              <div className={`text-2xl font-bold text-${color}-600`}>
                {count}
              </div>
              <div className={`text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getTypeLabel(type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
