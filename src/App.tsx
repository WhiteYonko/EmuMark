import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import StudentManagement from './components/Students/StudentManagement';
import TestTemplates from './components/Tests/TestTemplates';
import FileUpload from './components/Upload/FileUpload';
import ResultsDashboard from './components/Results/ResultsDashboard';
import Reports from './components/Reports/Reports';

function AppContent() {
  const { state, dispatch } = useApp();
  const { currentView, darkMode } = state;

  useEffect(() => {
    // Load initial demo data
    dispatch({ type: 'LOAD_INITIAL_DATA' });
    
    // Set demo teacher
    dispatch({ 
      type: 'SET_TEACHER', 
      payload: {
        id: '1',
        name: 'Ms. Sarah Wilson',
        email: 'sarah.wilson@greenfield.edu',
        school: 'Greenfield Primary School',
        subjects: ['Mathematics', 'English', 'Science']
      }
    });
  }, [dispatch]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'students':
        return <StudentManagement />;
      case 'tests':
        return <TestTemplates />;
      case 'upload':
        return <FileUpload />;
      case 'results':
        return <ResultsDashboard />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;