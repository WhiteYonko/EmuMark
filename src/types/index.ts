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

// AI Analytics Types
export interface PerformanceInsight {
  id: string;
  studentId: string;
  type: 'weakness' | 'strength' | 'trend' | 'recommendation';
  category: 'academic' | 'behavioral' | 'engagement';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  suggestedActions: string[];
  createdAt: string;
  isRead: boolean;
}

export interface PerformanceTrend {
  studentId: string;
  subject: string;
  period: 'week' | 'month' | 'term' | 'year';
  trend: 'improving' | 'declining' | 'stable' | 'volatile';
  trendScore: number; // -100 to 100
  dataPoints: {
    date: string;
    score: number;
    assessmentType: string;
  }[];
  predictedScore?: number;
  confidence: number;
}

export interface LearningGap {
  id: string;
  studentId: string;
  subject: string;
  topic: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  suggestedResources: string[];
  estimatedTimeToClose: number; // in days
  createdAt: string;
  status: 'open' | 'in_progress' | 'closed';
}

export interface AIRecommendation {
  id: string;
  type: 'teaching_strategy' | 'intervention' | 'resource' | 'assessment';
  title: string;
  description: string;
  targetStudents: string[];
  priority: 'low' | 'medium' | 'high';
  estimatedImpact: number; // 0-100
  implementationSteps: string[];
  requiredResources: string[];
  createdAt: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
}

export interface PerformanceAlert {
  id: string;
  type: 'grade_drop' | 'missing_assignment' | 'attendance' | 'behavior' | 'improvement';
  studentId: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
  isRead: boolean;
  actionRequired: boolean;
  relatedData?: any;
}

export interface SubjectPerformanceBreakdown {
  subject: string;
  averageScore: number;
  studentCount: number;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  topPerformers: string[];
  strugglingStudents: string[];
  commonWeaknesses: string[];
  improvementSuggestions: string[];
}

export interface AIAnalyticsData {
  insights: PerformanceInsight[];
  trends: PerformanceTrend[];
  learningGaps: LearningGap[];
  recommendations: AIRecommendation[];
  alerts: PerformanceAlert[];
  subjectBreakdowns: SubjectPerformanceBreakdown[];
  lastUpdated: string;
}