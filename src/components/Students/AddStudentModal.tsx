import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

interface AddStudentModalProps {
  onClose: () => void;
}

export default function AddStudentModal({ onClose }: AddStudentModalProps) {
  const { state, dispatch } = useApp();
  const { subjects, darkMode } = state;
  
  const [formData, setFormData] = useState({
    name: '',
    grade: 'Grade 4',
    age: 9,
    selectedSubjects: [] as string[],
    parentContacts: {
      primary: {
        name: '',
        email: '',
        phone: '',
        relationship: 'Mother'
      },
      secondary: {
        name: '',
        email: '',
        phone: '',
        relationship: 'Father'
      }
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: 'Grandparent'
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    medicalInfo: {
      allergies: [] as string[],
      medications: [] as string[],
      conditions: [] as string[]
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.name,
      grade: formData.grade,
      age: formData.age,
      subjects: formData.selectedSubjects,
      overallGrade: 0,
      performanceData: formData.selectedSubjects.map(subject => ({
        subject,
        grade: 0,
        trend: 'stable' as const
      })),
      parentContacts: formData.parentContacts,
      emergencyContact: formData.emergencyContact,
      address: formData.address,
      medicalInfo: formData.medicalInfo,
      enrollmentDate: new Date().toISOString().split('T')[0],
      classIds: []
    };

    dispatch({ type: 'ADD_STUDENT', payload: newStudent });
    onClose();
  };

  const toggleSubject = (subjectName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectName)
        ? prev.selectedSubjects.filter(s => s !== subjectName)
        : [...prev.selectedSubjects, subjectName]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-md m-4`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Add New Student
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Basic Information
            </h3>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Student Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Grade *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option>Grade 3</option>
                  <option>Grade 4</option>
                  <option>Grade 5</option>
                  <option>Grade 6</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Age *
                </label>
                <input
                  type="number"
                  min="6"
                  max="12"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Subjects *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {subjects.map(subject => (
                  <label key={subject.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.selectedSubjects.includes(subject.name)}
                      onChange={() => toggleSubject(subject.name)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {subject.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Parent Contacts */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Parent Contacts
            </h3>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Primary Contact *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.parentContacts.primary.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentContacts: {
                      ...prev.parentContacts,
                      primary: { ...prev.parentContacts.primary, name: e.target.value }
                    }
                  }))}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <select
                  value={formData.parentContacts.primary.relationship}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentContacts: {
                      ...prev.parentContacts,
                      primary: { ...prev.parentContacts.primary, relationship: e.target.value }
                    }
                  }))}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option>Mother</option>
                  <option>Father</option>
                  <option>Guardian</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.parentContacts.primary.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentContacts: {
                      ...prev.parentContacts,
                      primary: { ...prev.parentContacts.primary, email: e.target.value }
                    }
                  }))}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  required
                  value={formData.parentContacts.primary.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentContacts: {
                      ...prev.parentContacts,
                      primary: { ...prev.parentContacts.primary, phone: e.target.value }
                    }
                  }))}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Secondary Contact (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.parentContacts.secondary.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentContacts: {
                      ...prev.parentContacts,
                      secondary: { ...prev.parentContacts.secondary, name: e.target.value }
                    }
                  }))}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <select
                  value={formData.parentContacts.secondary.relationship}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentContacts: {
                      ...prev.parentContacts,
                      secondary: { ...prev.parentContacts.secondary, relationship: e.target.value }
                    }
                  }))}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Guardian</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.parentContacts.secondary.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentContacts: {
                      ...prev.parentContacts,
                      secondary: { ...prev.parentContacts.secondary, email: e.target.value }
                    }
                  }))}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.parentContacts.secondary.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentContacts: {
                      ...prev.parentContacts,
                      secondary: { ...prev.parentContacts.secondary, phone: e.target.value }
                    }
                  }))}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Emergency Contact
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Name"
                required
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                }))}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                }))}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <select
                value={formData.emergencyContact.relationship}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                }))}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option>Grandparent</option>
                <option>Aunt/Uncle</option>
                <option>Family Friend</option>
                <option>Other</option>
              </select>
            </div>
          </div>

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
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}