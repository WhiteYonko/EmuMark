import React, { useState } from 'react';
import { Plus, Search, Filter, Users, Calendar, MapPin, BookOpen, Edit, Trash2, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Class } from '../../types';
import CreateClassModal from './CreateClassModal';
import ClassDetailsModal from './ClassDetailsModal';

export default function ClassManagement() {
  const { state } = useApp();
  const { classes, students, subjects, darkMode } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === '' || cls.grade === selectedGrade;
    const matchesSubject = selectedSubject === '' || cls.subject === selectedSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  const getSubjectInfo = (subjectName: string) => {
    return subjects.find(s => s.name === subjectName);
  };

  const getClassStats = (classId: string) => {
    const classInfo = classes.find(c => c.id === classId);
    const classStudents = students.filter(s => classInfo?.studentIds.includes(s.id));
    const assessments = state.assessments.filter(a => a.classId === classId);
    
    return {
      studentCount: classStudents.length,
      assessmentCount: assessments.length,
      averageGrade: classStudents.length > 0 
        ? Math.round(classStudents.reduce((sum, s) => sum + s.overallGrade, 0) / classStudents.length)
        : 0
    };
  };

  const formatSchedule = (schedule: Class['schedule']) => {
    return schedule.map(s => `${s.day} ${s.time}`).join(', ');
  };

  const handleViewDetails = (classInfo: Class) => {
    setSelectedClass(classInfo);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Class Management
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Class</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
          <input
            type="text"
            placeholder="Search classes..."
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
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">All Grades</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
        </select>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.name}>{subject.name}</option>
          ))}
        </select>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map(classInfo => {
          const stats = getClassStats(classInfo.id);
          const subjectInfo = getSubjectInfo(classInfo.subject);
          
          return (
            <div
              key={classInfo.id}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 transition-colors duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${subjectInfo?.color || 'bg-gray-500'}`}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {classInfo.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {classInfo.grade} • {classInfo.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleViewDetails(classInfo)}
                    className={`p-1 rounded transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className={`p-1 rounded transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Class Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-blue-500 mr-1" />
                    <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.studentCount}
                    </span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Students
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <BookOpen className="w-4 h-4 text-green-500 mr-1" />
                    <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.assessmentCount}
                    </span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Assessments
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <span className={`text-lg font-semibold ${
                      stats.averageGrade >= 80 ? 'text-green-500' : 
                      stats.averageGrade >= 70 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {stats.averageGrade}%
                    </span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Avg Grade
                  </p>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Schedule
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatSchedule(classInfo.schedule)}
                </p>
              </div>

              {/* Room */}
              <div className="flex items-center space-x-2 mt-3">
                <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {classInfo.room}
                </span>
              </div>

              {/* Description */}
              {classInfo.description && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {classInfo.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleViewDetails(classInfo)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Manage</span>
                </button>
                <button className="flex items-center justify-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <UserPlus className="w-4 h-4" />
                  <span>Add Students</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No classes found</p>
          <p>Create your first class or adjust your search criteria</p>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <CreateClassModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Class Details Modal */}
      {showDetailsModal && selectedClass && (
        <ClassDetailsModal 
          classInfo={selectedClass}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedClass(null);
          }} 
        />
      )}
    </div>
  );
}
