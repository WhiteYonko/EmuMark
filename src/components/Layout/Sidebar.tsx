import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Upload, 
  BarChart3, 
  BookOpen, 
  Settings,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'tests', label: 'Test Templates', icon: FileText },
  { id: 'upload', label: 'Upload Tests', icon: Upload },
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: BookOpen },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { currentView, darkMode } = state;

  const setView = (view: string) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  return (
    <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-colors duration-200`}>
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
          darkMode 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}>
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        
        <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
          darkMode 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}>
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}