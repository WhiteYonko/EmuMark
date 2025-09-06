import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FileUpload() {
  const { state, dispatch } = useApp();
  const { darkMode } = state;
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Simulate AI processing
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      validFiles.forEach(file => {
        const uploadedTest = {
          id: Date.now().toString() + Math.random(),
          fileName: file.name,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          status: 'completed' as const,
          aiAnalysis: {
            detectedText: ['Question 1: What is 2 + 2?', 'Answer: 4', 'Question 2: Name the capital of France', 'Answer: Paris'],
            confidence: 0.92,
            suggestedGrade: 85
          }
        };
        dispatch({ type: 'ADD_UPLOADED_TEST', payload: uploadedTest });
      });
    }, 3000);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Upload Test Papers
        </h2>
      </div>

      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : darkMode
            ? 'border-gray-600 bg-gray-800 hover:border-gray-500'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <Upload className={`w-12 h-12 mx-auto mb-4 ${
          dragActive ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {dragActive ? 'Drop files here' : 'Upload test papers'}
        </h3>
        
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          Drag and drop your files here, or click to select files
        </p>
        
        <button
          onClick={openFileDialog}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Choose Files
        </button>
        
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-3`}>
          Supports: JPG, PNG, PDF (Max 10MB per file)
        </p>
      </div>

      {/* Processing Indicator */}
      {processing && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4 flex items-center space-x-3`}>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>
            Processing files with AI...
          </span>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Uploaded Files ({uploadedFiles.length})
          </h3>
          
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <File className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {file.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {processing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className={`p-1 rounded-full transition-colors ${
                      darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Upload Guidelines
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Best Practices:
            </h4>
            <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• Ensure good lighting and clear images</li>
              <li>• Keep text horizontal and readable</li>
              <li>• Avoid shadows and glare</li>
              <li>• Use high resolution (300 DPI+)</li>
            </ul>
          </div>
          
          <div>
            <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Processing:
            </h4>
            <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• Automatic text recognition</li>
              <li>• Answer detection and grading</li>
              <li>• Performance analytics</li>
              <li>• Instant feedback generation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}