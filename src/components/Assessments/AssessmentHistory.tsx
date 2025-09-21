import React, { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Minus, Calendar, BookOpen, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, Assessment, GradeEntry } from '../../types';

export default function AssessmentHistory() {
  const { state } = useApp();
  const { students, assessments, gradeEntries, classes, darkMode } = state;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  // Calculate assessment history for each student
  const assessmentHistory = useMemo(() => {
    return students.map(student => {
      const studentGrades = gradeEntries.filter(g => g.studentId === student.id);
      const studentAssessments = assessments.filter(a => 
        studentGrades.some(g => g.assessmentId === a.id)
      );

      // Group by subject
      const subjectHistory: { [subject: string]: any[] } = {};
      
      studentAssessments.forEach(assessment => {
        const grade = studentGrades.find(g => g.assessmentId === assessment.id);
        if (grade) {
          if (!subjectHistory[assessment.subject]) {
            subjectHistory[assessment.subject] = [];
          }
          subjectHistory[assessment.subject].push({
            assessmentId: assessment.id,
            title: assessment.title,
            type: assessment.type,
            score: grade.score,
            maxScore: grade.maxScore,
            percentage: grade.percentage,
            date: grade.gradedAt,
            feedback: grade.feedback,
            weight: assessment.weight
          });
        }
      });

      // Calculate averages and trends for each subject
      const subjectStats = Object.entries(subjectHistory).map(([subject, assessments]) => {
        const sortedAssessments = assessments.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        const averageScore = Math.round(
          assessments.reduce((sum, a) => sum + a.percentage, 0) / assessments.length
        );
        
        // Calculate trend (comparing first half vs second half)
        const midPoint = Math.ceil(assessments.length / 2);
        const firstHalf = assessments.slice(0, midPoint);
        const secondHalf = assessments.slice(midPoint);
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (firstHalf.length > 0 && secondHalf.length > 0) {
          const firstAvg = firstHalf.reduce((sum, a) => sum + a.percentage, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((sum, a) => sum + a.percentage, 0) / secondHalf.length;
          
          if (secondAvg > firstAvg + 5) trend = 'up';
          else if (secondAvg < firstAvg - 5) trend = 'down';
        }

        return {
          subject,
          assessments: sortedAssessments,
          averageScore,
          trend,
          totalAssessments: assessments.length
        };
      });

      return {
        studentId: student.id,
        studentName: student.name,
        grade: student.grade,
        subjectHistory: subjectStats
      };
    });
  }, [students, assessments, gradeEntries]);

  const filteredHistory = assessmentHistory.filter(history => {
    const matchesSearch = history.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudent = selectedStudent === '' || history.studentId === selectedStudent;
    const matchesSubject = selectedSubject === '' || 
      history.subjectHistory.some(s => s.subject === selectedSubject);
    const matchesClass = selectedClass === '' || 
      classes.find(c => c.id === selectedClass)?.studentIds.includes(history.studentId);
    
    return matchesSearch && matchesStudent && matchesSubject && matchesClass;
  });

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-green-500';
    if (grade >= 70) return 'text-yellow-500';
    if (grade >= 60) return 'text-orange-500';
    return 'text-red-500';
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Assessment History
        </h2>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
          <input
            type="text"
            placeholder="Search students..."
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
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">All Students</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
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
          {state.subjects.map(subject => (
            <option key={subject.id} value={subject.name}>{subject.name}</option>
          ))}
        </select>
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
      </div>

      {/* Assessment History */}
      <div className="space-y-6">
        {filteredHistory.map(history => (
          <div
            key={history.studentId}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {history.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {history.studentName}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {history.grade}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.subjectHistory.map(subject => (
                <div
                  key={subject.subject}
                  className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {subject.subject}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(subject.trend)}
                      <span className={`font-semibold ${getGradeColor(subject.averageScore)}`}>
                        {subject.averageScore}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Assessments
                      </span>
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                        {subject.totalAssessments}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {subject.assessments.slice(-3).map((assessment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${getAssessmentTypeColor(assessment.type)}`}>
                              {assessment.type}
                            </span>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {assessment.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={getGradeColor(assessment.percentage)}>
                              {assessment.percentage}%
                            </span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {formatDate(assessment.date)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No assessment history found</p>
          <p>Try adjusting your search criteria or create some assessments</p>
        </div>
      )}
    </div>
  );
}
