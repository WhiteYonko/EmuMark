export interface Teacher {
  id: string;
  name: string;
  email: string;
  school: string;
  subjects: string[];
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  age: number;
  avatar?: string;
  subjects: string[];
  overallGrade: number;
  performanceData: {
    subject: string;
    grade: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface TestTemplate {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questions: Question[];
  totalMarks: number;
  duration: number;
  createdAt: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'true-false';
  question: string;
  marks: number;
  options?: string[];
  correctAnswer?: string | string[];
}

export interface TestResult {
  id: string;
  studentId: string;
  testId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: string;
  markedAt: string;
  feedback: string;
  answers: {
    questionId: string;
    answer: string;
    marks: number;
    feedback?: string;
  }[];
}

export interface UploadedTest {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  studentId?: string;
  testTemplateId?: string;
  status: 'processing' | 'completed' | 'error';
  aiAnalysis?: {
    detectedText: string[];
    confidence: number;
    suggestedGrade: number;
  };
}