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
  parentContacts: {
    primary: {
      name: string;
      email: string;
      phone: string;
      relationship: string;
    };
    secondary?: {
      name: string;
      email: string;
      phone: string;
      relationship: string;
    };
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalInfo?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
  };
  enrollmentDate: string;
  classIds: string[];
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

export interface Class {
  id: string;
  name: string;
  grade: string;
  subject: string;
  teacherId: string;
  studentIds: string[];
  schedule: {
    day: string;
    time: string;
    duration: number;
  }[];
  room: string;
  description?: string;
  createdAt: string;
  academicYear: string;
}

export interface Assessment {
  id: string;
  title: string;
  subject: string;
  classId: string;
  type: 'quiz' | 'test' | 'assignment' | 'project' | 'exam';
  totalMarks: number;
  weight: number; // percentage of final grade
  dueDate: string;
  instructions?: string;
  createdAt: string;
  createdBy: string;
}

export interface GradeEntry {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback?: string;
  gradedBy: string;
  gradedAt: string;
  isLate: boolean;
  latePenalty?: number;
}

export interface AssessmentHistory {
  studentId: string;
  subject: string;
  assessments: {
    assessmentId: string;
    title: string;
    type: string;
    score: number;
    maxScore: number;
    percentage: number;
    date: string;
    feedback?: string;
  }[];
  averageScore: number;
  totalAssessments: number;
}