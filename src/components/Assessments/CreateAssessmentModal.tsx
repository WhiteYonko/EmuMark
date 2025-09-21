import React, { useState } from 'react';
import { X, Calendar, BookOpen, FileText, Edit, FolderOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assessment } from '../../types';

interface CreateAssessmentModalProps {
  onClose: () => void;
}

export default function CreateAssessmentModal({ onClose }: CreateAssessmentModalProps) {
  const { state, dispatch } = useApp();
  const { classes, darkMode, currentTeacher } = state;
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    classId: '',
    type: 'quiz' as 'quiz' | 'test' | 'assignment' | 'project' | 'exam',
    totalMarks: 100,
    weight: 10,
    dueDate: '',
    instructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId || !formData.title || !formData.dueDate) {
      return;
    }

    const newAssessment: Assessment = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      classId: formData.classId,
      type: formData.type,
      totalMarks: formData.totalMarks,
      weight: formData.weight,
      dueDate: formData.dueDate,
      instructions: formData.instructions,
      createdAt: new Date().toISOString(),
      createdBy: currentTeacher?.id || '1'
    };

    dispatch({ type: 'ADD_ASSESSMENT', payload: newAssessment });
    onClose();
  };

  const getAssessmentTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'test': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <Edit className="w-4 h-4" />;
      case 'project': return <FolderOpen className="w-4 h-4" />;
      case 'exam': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const selectedClass = classes.find(c => c.id === formData.classId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Create New Assessment
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Basic Information
            </h3>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Assessment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., Chapter 5 Quiz, Midterm Exam"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Class *
                </label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) => {
                    const selectedClass = classes.find(c => c.id === e.target.value);
                    setFormData(prev => ({ 
                      ...prev, 
                      classId: e.target.value,
                      subject: selectedClass?.subject || ''
                    }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Assessment Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="assignment">Assignment</option>
                  <option value="project">Project</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Marks *
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={formData.totalMarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Weight (%) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Instructions
            </h3>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Assessment Instructions (Optional)
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Provide detailed instructions for the assessment..."
              />
            </div>
          </div>

          {/* Preview */}
          {selectedClass && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Preview
              </h4>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  {getAssessmentTypeIcon(formData.type)}
                </div>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formData.title || 'Assessment Title'}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedClass.name} • {formData.totalMarks} marks • {formData.weight}% weight
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
