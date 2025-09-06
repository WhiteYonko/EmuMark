import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import AddStudentModal from './AddStudentModal';
import StudentCard from './StudentCard';

export default function StudentManagement() {
  const { state } = useApp();
  const { students, darkMode } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === '' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const grades = ['Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Student Management
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
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
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">All Grades</option>
          {grades.map(grade => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
        <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
          darkMode 
            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}>
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg mb-2">No students found</p>
          <p>Try adjusting your search criteria</p>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}