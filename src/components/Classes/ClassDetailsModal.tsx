import React, { useState } from 'react';
import { X, Users, Calendar, MapPin, BookOpen, UserPlus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Class, Student } from '../../types';

interface ClassDetailsModalProps {
  classInfo: Class;
  onClose: () => void;
}

export default function ClassDetailsModal({ classInfo, onClose }: ClassDetailsModalProps) {
  const { state } = useApp();
  const { students, assessments, gradeEntries, darkMode } = state;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assessments'>('overview');
  const [showAddStudents, setShowAddStudents] = useState(false);

  const classStudents = students.filter(s => classInfo.studentIds.includes(s.id));
  const classAssessments = assessments.filter(a => a.classId === classInfo.id);
  
  const getClassStats = () => {
    const totalAssessments = classAssessments.length;
    const averageGrade = classStudents.length > 0 
      ? Math.round(classStudents.reduce((sum, s) => sum + s.overallGrade, 0) / classStudents.length)
      : 0;
    
    const completedAssessments = classAssessments.filter(a => {
      const dueDate = new Date(a.dueDate);
      return dueDate < new Date();
    }).length;

    return {
      studentCount: classStudents.length,
      assessmentCount: totalAssessments,
      completedAssessments,
      averageGrade
    };
  };

  const formatSchedule = (schedule: Class['schedule']) => {
    return schedule.map(s => `${s.day} ${s.time} (${s.duration}min)`).join(', ');
  };

  const getStudentPerformance = (student: Student) => {
    const studentGrades = gradeEntries.filter(g => 
      g.studentId === student.id && 
      classAssessments.some(a => a.id === g.assessmentId)
    );
    
    const averageScore = studentGrades.length > 0
      ? Math.round(studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length)
      : 0;

    return {
      totalGrades: studentGrades.length,
      averageScore,
      trend: averageScore >= 80 ? 'up' : averageScore >= 60 ? 'stable' : 'down'
    };
  };

  const stats = getClassStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {classInfo.name}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {classInfo.grade} • {classInfo.subject} • {classInfo.room}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'assessments', label: 'Assessments', icon: BookOpen }
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

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Class Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Students
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.studentCount}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Assessments
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.assessmentCount}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Completed
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.completedAssessments}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Avg Grade
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.averageGrade}%
                  </p>
                </div>
              </div>

              {/* Class Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Schedule
                  </h3>
                  <div className="space-y-2">
                    {classInfo.schedule.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {entry.day} {entry.time} ({entry.duration} minutes)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Class Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {classInfo.room}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {classInfo.subject}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {classInfo.grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {classInfo.description && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Description
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {classInfo.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Students ({classStudents.length})
                </h3>
                <button
                  onClick={() => setShowAddStudents(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Students</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classStudents.map(student => {
                  const performance = getStudentPerformance(student);
                  
                  return (
                    <div
                      key={student.id}
                      className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {student.name}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {student.grade}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Overall Grade
                          </span>
                          <span className={`font-semibold ${
                            student.overallGrade >= 80 ? 'text-green-500' : 
                            student.overallGrade >= 60 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {student.overallGrade}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Class Average
                          </span>
                          <span className={`font-semibold ${
                            performance.averageScore >= 80 ? 'text-green-500' : 
                            performance.averageScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {performance.averageScore}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Assessments
                          </span>
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {performance.totalGrades}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Assessments ({classAssessments.length})
              </h3>

              <div className="space-y-3">
                {classAssessments.map(assessment => (
                  <div
                    key={assessment.id}
                    className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {assessment.title}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {assessment.type} • {assessment.totalMarks} marks • {assessment.weight}% weight
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Due: {new Date(assessment.dueDate).toLocaleDateString()}
                        </p>
                        <p className={`text-sm ${
                          new Date(assessment.dueDate) < new Date() ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {new Date(assessment.dueDate) < new Date() ? 'Overdue' : 'Active'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
