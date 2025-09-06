import React from 'react';
import { Bell, Search, Settings, Moon, Sun, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { state, dispatch } = useApp();
  const { currentTeacher, darkMode } = state;

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  return (
    <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b transition-colors duration-200`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">✓</span>
            </div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              TestMark AI
            </h1>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
            <input
              type="text"
              placeholder="Search students, tests, or results..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <Bell className="w-5 h-5" />
          </button>
          
          <button className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-300">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentTeacher?.name || 'Ms. Sarah Wilson'}
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentTeacher?.school || 'Greenfield Primary'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}