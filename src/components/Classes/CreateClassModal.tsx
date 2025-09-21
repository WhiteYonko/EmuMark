import React, { useState } from 'react';
import { X, Calendar, MapPin, BookOpen, Clock, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Class } from '../../types';

interface CreateClassModalProps {
  onClose: () => void;
}

export default function CreateClassModal({ onClose }: CreateClassModalProps) {
  const { state, dispatch } = useApp();
  const { subjects, darkMode, currentTeacher } = state;
  
  const [formData, setFormData] = useState({
    name: '',
    grade: 'Grade 4',
    subject: '',
    room: '',
    description: '',
    schedule: [{ day: 'Monday', time: '09:00', duration: 60 }] as Class['schedule']
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) newErrors.push('Class name is required');
    if (!formData.subject) newErrors.push('Subject is required');
    if (!formData.room.trim()) newErrors.push('Room is required');
    if (formData.schedule.length === 0) newErrors.push('At least one schedule entry is required');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const newClass: Class = {
      id: Date.now().toString(),
      name: formData.name,
      grade: formData.grade,
      subject: formData.subject,
      teacherId: currentTeacher?.id || '1',
      studentIds: [],
      schedule: formData.schedule,
      room: formData.room,
      description: formData.description,
      createdAt: new Date().toISOString(),
      academicYear: '2024-2025'
    };

    dispatch({ type: 'ADD_CLASS', payload: newClass });
    onClose();
  };

  const addScheduleEntry = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: 'Monday', time: '09:00', duration: 60 }]
    }));
  };

  const removeScheduleEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const updateScheduleEntry = (index: number, field: keyof Class['schedule'][0], value: string | number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Create New Class
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
                Class Name *
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
                placeholder="e.g., Mathematics Grade 4A"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Grade *
                </label>
                <select
                  required
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
                  Subject *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Room *
                </label>
                <input
                  type="text"
                  required
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Room 101"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Academic Year
                </label>
                <input
                  type="text"
                  value="2024-2025"
                  disabled
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Brief description of the class..."
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Schedule
              </h3>
              <button
                type="button"
                onClick={addScheduleEntry}
                className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Time</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.schedule.map((entry, index) => (
                <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Schedule Entry {index + 1}
                    </span>
                    {formData.schedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeScheduleEntry(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Day
                      </label>
                      <select
                        value={entry.day}
                        onChange={(e) => updateScheduleEntry(index, 'day', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Time
                      </label>
                      <input
                        type="time"
                        value={entry.time}
                        onChange={(e) => updateScheduleEntry(index, 'time', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="180"
                        value={entry.duration}
                        onChange={(e) => updateScheduleEntry(index, 'duration', parseInt(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900' : 'bg-red-50'}`}>
              <ul className="text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-600">{error}</li>
                ))}
              </ul>
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
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
