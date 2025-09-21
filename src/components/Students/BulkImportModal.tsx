import React, { useState } from 'react';
import { X, Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

interface BulkImportModalProps {
  onClose: () => void;
}

export default function BulkImportModal({ onClose }: BulkImportModalProps) {
  const { state, dispatch } = useApp();
  const { darkMode, subjects } = state;
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<Student[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      processFile(uploadedFile);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrors([]);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setErrors(['File must contain at least a header row and one data row']);
        setIsProcessing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['name', 'grade', 'age', 'primary_contact_name', 'primary_contact_email', 'primary_contact_phone'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setErrors([`Missing required columns: ${missingHeaders.join(', ')}`]);
        setIsProcessing(false);
        return;
      }

      const students: Student[] = [];
      const newErrors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length !== headers.length) {
          newErrors.push(`Row ${i + 1}: Column count mismatch`);
          continue;
        }

        const studentData: any = {};
        headers.forEach((header, index) => {
          studentData[header] = values[index];
        });

        // Validate required fields
        if (!studentData.name || !studentData.grade || !studentData.age) {
          newErrors.push(`Row ${i + 1}: Missing required fields (name, grade, age)`);
          continue;
        }

        // Parse subjects (comma-separated)
        const studentSubjects = studentData.subjects ? 
          studentData.subjects.split(',').map((s: string) => s.trim()) : 
          ['Mathematics', 'English'];

        const student: Student = {
          id: `imported-${Date.now()}-${i}`,
          name: studentData.name,
          grade: studentData.grade,
          age: parseInt(studentData.age),
          subjects: studentSubjects,
          overallGrade: 0,
          performanceData: studentSubjects.map(subject => ({
            subject,
            grade: 0,
            trend: 'stable' as const
          })),
          parentContacts: {
            primary: {
              name: studentData.primary_contact_name || '',
              email: studentData.primary_contact_email || '',
              phone: studentData.primary_contact_phone || '',
              relationship: studentData.primary_contact_relationship || 'Parent'
            },
            secondary: studentData.secondary_contact_name ? {
              name: studentData.secondary_contact_name,
              email: studentData.secondary_contact_email || '',
              phone: studentData.secondary_contact_phone || '',
              relationship: studentData.secondary_contact_relationship || 'Parent'
            } : undefined
          },
          emergencyContact: {
            name: studentData.emergency_contact_name || studentData.primary_contact_name || '',
            phone: studentData.emergency_contact_phone || studentData.primary_contact_phone || '',
            relationship: studentData.emergency_contact_relationship || 'Emergency Contact'
          },
          address: studentData.street ? {
            street: studentData.street,
            city: studentData.city || '',
            state: studentData.state || '',
            zipCode: studentData.zip_code || ''
          } : undefined,
          medicalInfo: {
            allergies: studentData.allergies ? studentData.allergies.split(',').map((a: string) => a.trim()) : [],
            medications: studentData.medications ? studentData.medications.split(',').map((m: string) => m.trim()) : [],
            conditions: studentData.conditions ? studentData.conditions.split(',').map((c: string) => c.trim()) : []
          },
          enrollmentDate: new Date().toISOString().split('T')[0],
          classIds: []
        };

        students.push(student);
      }

      setImportData(students);
      setErrors(newErrors);
    } catch (error) {
      setErrors(['Error processing file. Please check the format and try again.']);
    }

    setIsProcessing(false);
  };

  const handleImport = () => {
    if (importData.length > 0) {
      dispatch({ type: 'BULK_ADD_STUDENTS', payload: importData });
      onClose();
    }
  };

  const downloadTemplate = () => {
    const template = [
      'name,grade,age,primary_contact_name,primary_contact_email,primary_contact_phone,primary_contact_relationship,secondary_contact_name,secondary_contact_email,secondary_contact_phone,secondary_contact_relationship,emergency_contact_name,emergency_contact_phone,emergency_contact_relationship,street,city,state,zip_code,subjects,allergies,medications,conditions',
      'John Doe,Grade 4,9,Jane Doe,jane.doe@email.com,+1-555-0123,Mother,John Doe Sr.,john.doe@email.com,+1-555-0124,Father,Jane Doe,+1-555-0123,Mother,123 Main St,Springfield,IL,62701,"Mathematics,English,Science",,,"',
      'Jane Smith,Grade 4,10,Mary Smith,mary.smith@email.com,+1-555-0125,Mother,,,,,Mary Smith,+1-555-0125,Mother,456 Oak Ave,Springfield,IL,62702,"Mathematics,English,Science",,,"'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Bulk Import Students
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

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Import Instructions
            </h3>
            <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• Download the template CSV file to see the required format</li>
              <li>• Required fields: name, grade, age, primary_contact_name, primary_contact_email, primary_contact_phone</li>
              <li>• Optional fields: secondary contact, emergency contact, address, medical info, subjects</li>
              <li>• Subjects should be comma-separated (e.g., "Mathematics,English,Science")</li>
              <li>• Maximum file size: 5MB</li>
            </ul>
          </div>

          {/* Template Download */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Download Template
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get the CSV template with sample data
                </p>
              </div>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {file ? file.name : 'Click to upload CSV file'}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    or drag and drop
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Processing file...</span>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Import Errors</span>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900' : 'bg-red-50'}`}>
                <ul className="text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-red-600">{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Preview */}
          {importData.length > 0 && (
            <div className="space-y-4">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Preview ({importData.length} students)
              </h3>
              <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                <table className="w-full text-sm">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Grade</th>
                      <th className="px-3 py-2 text-left">Age</th>
                      <th className="px-3 py-2 text-left">Primary Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.slice(0, 10).map((student, index) => (
                      <tr key={index} className={`border-t border-gray-200 dark:border-gray-600 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-3 py-2">{student.name}</td>
                        <td className="px-3 py-2">{student.grade}</td>
                        <td className="px-3 py-2">{student.age}</td>
                        <td className="px-3 py-2">{student.parentContacts.primary.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importData.length > 10 && (
                  <div className={`px-3 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ... and {importData.length - 10} more students
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
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
              onClick={handleImport}
              disabled={importData.length === 0 || errors.length > 0}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {importData.length} Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
