import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, BookOpen, FileText, Edit, Trash2, History } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assessment, Class } from '../../types';
import CreateAssessmentModal from './CreateAssessmentModal';
import GradeEntryModal from './GradeEntryModal';
import AssessmentHistory from './AssessmentHistory';

export default function AssessmentManagement() {
  const { state } = useApp();
  const { assessments, classes, students, darkMode } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGradeEntryModal, setShowGradeEntryModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [activeTab, setActiveTab] = useState<'assessments' | 'history'>('assessments');

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === '' || assessment.classId === selectedClass;
    const matchesType = selectedType === '' || assessment.type === selectedType;
    return matchesSearch && matchesClass && matchesType;
  });

  const getClassInfo = (classId: string) => {
    return classes.find(c => c.id === classId);
  };

  const getAssessmentTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'test': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <Edit className="w-4 h-4" />;
      case 'project': return <FileText className="w-4 h-4" />;
      case 'exam': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getAssessmentTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'test': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'assignment': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'project': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Assessment Management
        </h2>
        {activeTab === 'assessments' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assessment</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'assessments', label: 'Assessments', icon: BookOpen },
            { id: 'history', label: 'History', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'assessments' && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="test">Test</option>
              <option value="assignment">Assignment</option>
              <option value="project">Project</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          {/* Assessments List */}
          <div className="space-y-4">
        {filteredAssessments.map(assessment => {
          const classInfo = getClassInfo(assessment.classId);
          const isOverdueAssessment = isOverdue(assessment.dueDate);
          
          return (
            <div
              key={assessment.id}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 transition-colors duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${getAssessmentTypeColor(assessment.type)}`}>
                      {getAssessmentTypeIcon(assessment.type)}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {assessment.title}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {classInfo?.name} • {assessment.subject}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                        Total Marks
                      </p>
                      <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {assessment.totalMarks}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                        Weight
                      </p>
                      <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {assessment.weight}%
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                        Due Date
                      </p>
                      <p className={`text-lg font-semibold ${isOverdueAssessment ? 'text-red-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatDate(assessment.dueDate)}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                        Students
                      </p>
                      <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {classInfo?.studentIds.length || 0}
                      </p>
                    </div>
                  </div>

                  {assessment.instructions && (
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {assessment.instructions}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedAssessment(assessment);
                      setShowGradeEntryModal(true);
                    }}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Enter Grades</span>
                  </button>
                  <button className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

          {filteredAssessments.length === 0 && (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No assessments found</p>
              <p>Create your first assessment or adjust your search criteria</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'history' && <AssessmentHistory />}

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <CreateAssessmentModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Grade Entry Modal */}
      {showGradeEntryModal && selectedAssessment && (
        <GradeEntryModal 
          assessment={selectedAssessment}
          onClose={() => {
            setShowGradeEntryModal(false);
            setSelectedAssessment(null);
          }} 
        />
      )}
    </div>
  );
}
