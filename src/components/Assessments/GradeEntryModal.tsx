import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assessment, GradeEntry, Student } from '../../types';

interface GradeEntryModalProps {
  assessment: Assessment;
  onClose: () => void;
}

export default function GradeEntryModal({ assessment, onClose }: GradeEntryModalProps) {
  const { state, dispatch } = useApp();
  const { classes, students, gradeEntries, darkMode, currentTeacher } = state;
  
  const [grades, setGrades] = useState<{ [studentId: string]: { score: number; feedback: string } }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const classInfo = classes.find(c => c.id === assessment.classId);
  const classStudents = students.filter(s => classInfo?.studentIds.includes(s.id));
  const existingGrades = gradeEntries.filter(g => g.assessmentId === assessment.id);

  useEffect(() => {
    // Initialize grades with existing data
    const initialGrades: { [studentId: string]: { score: number; feedback: string } } = {};
    
    classStudents.forEach(student => {
      const existingGrade = existingGrades.find(g => g.studentId === student.id);
      initialGrades[student.id] = {
        score: existingGrade?.score || 0,
        feedback: existingGrade?.feedback || ''
      };
    });
    
    setGrades(initialGrades);
    setSavedCount(existingGrades.length);
  }, [assessment.id, classStudents, existingGrades]);

  const handleScoreChange = (studentId: string, score: number) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], score: Math.max(0, Math.min(score, assessment.totalMarks)) }
    }));
  };

  const handleFeedbackChange = (studentId: string, feedback: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], feedback }
    }));
  };

  const calculatePercentage = (score: number) => {
    return Math.round((score / assessment.totalMarks) * 100);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 70) return 'text-yellow-500';
    if (percentage >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const handleSave = async () => {
    setIsSaving(true);
    let saved = 0;

    for (const [studentId, gradeData] of Object.entries(grades)) {
      if (gradeData.score > 0) {
        const existingGrade = existingGrades.find(g => g.studentId === studentId);
        const percentage = calculatePercentage(gradeData.score);
        const isLate = new Date() > new Date(assessment.dueDate);

        const gradeEntry: GradeEntry = {
          id: existingGrade?.id || `${Date.now()}-${studentId}`,
          assessmentId: assessment.id,
          studentId,
          score: gradeData.score,
          maxScore: assessment.totalMarks,
          percentage,
          feedback: gradeData.feedback,
          gradedBy: currentTeacher?.id || '1',
          gradedAt: new Date().toISOString(),
          isLate,
          latePenalty: isLate ? 5 : 0
        };

        if (existingGrade) {
          dispatch({ type: 'UPDATE_GRADE_ENTRY', payload: gradeEntry });
        } else {
          dispatch({ type: 'ADD_GRADE_ENTRY', payload: gradeEntry });
        }
        saved++;
      }
    }

    setSavedCount(saved);
    setIsSaving(false);
  };

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Enter Grades: {assessment.title}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {classInfo?.name} • {assessment.totalMarks} total marks • {assessment.weight}% weight
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

        <div className="p-6 space-y-6">
          {/* Assessment Info */}
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {assessment.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Due: {new Date(assessment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {savedCount} of {classStudents.length} graded
                </p>
                <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(savedCount / classStudents.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Entry Table */}
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Student
                    </th>
                    <th className={`text-center py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Score
                    </th>
                    <th className={`text-center py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Percentage
                    </th>
                    <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student, index) => {
                    const gradeData = grades[student.id] || { score: 0, feedback: '' };
                    const percentage = calculatePercentage(gradeData.score);
                    
                    return (
                      <tr key={student.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {student.name}
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {student.grade}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              max={assessment.totalMarks}
                              value={gradeData.score}
                              onChange={(e) => handleScoreChange(student.id, parseInt(e.target.value) || 0)}
                              className={`w-20 px-2 py-1 border rounded text-center ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              / {assessment.totalMarks}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-semibold ${getGradeColor(percentage)}`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Add feedback..."
                            value={gradeData.feedback}
                            onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
                            className={`w-full px-2 py-1 border rounded ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {savedCount} students graded
                </span>
              </div>
              {savedCount < classStudents.length && (
                <div className="flex items-center space-x-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {classStudents.length - savedCount} remaining
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Close
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Grades</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
