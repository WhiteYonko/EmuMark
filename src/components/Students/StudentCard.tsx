import React from 'react';
import { MoreVertical, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

interface StudentCardProps {
  student: Student;
}

export default function StudentCard({ student }: StudentCardProps) {
  const { state } = useApp();
  const { darkMode, subjects } = state;

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-green-500';
    if (grade >= 70) return 'text-yellow-500';
    if (grade >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  const getSubjectColor = (subjectName: string) => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject?.color || 'bg-gray-500';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 transition-colors duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </span>
          </div>
          <div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {student.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {student.grade} • Age {student.age}
            </p>
          </div>
        </div>
        <button className={`p-1 rounded-full transition-colors ${
          darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
        }`}>
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Overall Grade
          </span>
          <span className={`text-lg font-bold ${getGradeColor(student.overallGrade)}`}>
            {student.overallGrade}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${student.overallGrade}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Subject Performance
        </h4>
        {student.performanceData.map((subject, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 ${getSubjectColor(subject.subject)} rounded-full`}></div>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {subject.subject}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(subject.trend)}
              <span className={`text-sm font-medium ${getGradeColor(subject.grade)}`}>
                {subject.grade}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Details
        </button>
      </div>
    </div>
  );
}