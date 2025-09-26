import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Teacher, Student, Subject, TestTemplate, TestResult, UploadedTest, Class, Assessment, GradeEntry, AssessmentHistory, AIAnalyticsData } from '../types';

interface AppState {
  currentTeacher: Teacher | null;
  students: Student[];
  subjects: Subject[];
  testTemplates: TestTemplate[];
  testResults: TestResult[];
  uploadedTests: UploadedTest[];
  classes: Class[];
  assessments: Assessment[];
  gradeEntries: GradeEntry[];
  assessmentHistory: AssessmentHistory[];
  aiAnalytics: AIAnalyticsData;
  currentView: string;
  darkMode: boolean;
}

type AppAction = 
  | { type: 'SET_TEACHER'; payload: Teacher }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'ADD_TEST_TEMPLATE'; payload: TestTemplate }
  | { type: 'ADD_TEST_RESULT'; payload: TestResult }
  | { type: 'ADD_UPLOADED_TEST'; payload: UploadedTest }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: Class }
  | { type: 'DELETE_CLASS'; payload: string }
  | { type: 'ADD_ASSESSMENT'; payload: Assessment }
  | { type: 'UPDATE_ASSESSMENT'; payload: Assessment }
  | { type: 'DELETE_ASSESSMENT'; payload: string }
  | { type: 'ADD_GRADE_ENTRY'; payload: GradeEntry }
  | { type: 'UPDATE_GRADE_ENTRY'; payload: GradeEntry }
  | { type: 'DELETE_GRADE_ENTRY'; payload: string }
  | { type: 'BULK_ADD_STUDENTS'; payload: Student[] }
  | { type: 'UPDATE_AI_ANALYTICS'; payload: AIAnalyticsData }
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_INITIAL_DATA' };

const initialState: AppState = {
  currentTeacher: null,
  students: [],
  subjects: [
    { id: '1', name: 'Mathematics', color: 'bg-blue-500', icon: '📊' },
    { id: '2', name: 'English', color: 'bg-green-500', icon: '📚' },
    { id: '3', name: 'Science', color: 'bg-purple-500', icon: '🔬' },
    { id: '4', name: 'History', color: 'bg-orange-500', icon: '🏛️' },
    { id: '5', name: 'Geography', color: 'bg-teal-500', icon: '🌍' },
  ],
  testTemplates: [],
  testResults: [],
  uploadedTests: [],
  classes: [],
  assessments: [],
  gradeEntries: [],
  assessmentHistory: [],
  aiAnalytics: {
    insights: [],
    trends: [],
    learningGaps: [],
    recommendations: [],
    alerts: [],
    subjectBreakdowns: [],
    lastUpdated: new Date().toISOString(),
  },
  currentView: 'dashboard',
  darkMode: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TEACHER':
      return { ...state, currentTeacher: action.payload };
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter(s => s.id !== action.payload)
      };
    case 'ADD_TEST_TEMPLATE':
      return { ...state, testTemplates: [...state.testTemplates, action.payload] };
    case 'ADD_TEST_RESULT':
      return { ...state, testResults: [...state.testResults, action.payload] };
    case 'ADD_UPLOADED_TEST':
      return { ...state, uploadedTests: [...state.uploadedTests, action.payload] };
    case 'ADD_CLASS':
      return { ...state, classes: [...state.classes, action.payload] };
    case 'UPDATE_CLASS':
      return {
        ...state,
        classes: state.classes.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CLASS':
      return {
        ...state,
        classes: state.classes.filter(c => c.id !== action.payload)
      };
    case 'ADD_ASSESSMENT':
      return { ...state, assessments: [...state.assessments, action.payload] };
    case 'UPDATE_ASSESSMENT':
      return {
        ...state,
        assessments: state.assessments.map(a => a.id === action.payload.id ? action.payload : a)
      };
    case 'DELETE_ASSESSMENT':
      return {
        ...state,
        assessments: state.assessments.filter(a => a.id !== action.payload)
      };
    case 'ADD_GRADE_ENTRY':
      return { ...state, gradeEntries: [...state.gradeEntries, action.payload] };
    case 'UPDATE_GRADE_ENTRY':
      return {
        ...state,
        gradeEntries: state.gradeEntries.map(g => g.id === action.payload.id ? action.payload : g)
      };
    case 'DELETE_GRADE_ENTRY':
      return {
        ...state,
        gradeEntries: state.gradeEntries.filter(g => g.id !== action.payload)
      };
    case 'BULK_ADD_STUDENTS':
      return { ...state, students: [...state.students, ...action.payload] };
    case 'UPDATE_AI_ANALYTICS':
      return { ...state, aiAnalytics: action.payload };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'LOAD_INITIAL_DATA':
      return {
        ...state,
        students: [
          {
            id: '1',
            name: 'Emma Thompson',
            grade: 'Grade 4',
            age: 9,
            subjects: ['Mathematics', 'English', 'Science'],
            overallGrade: 85,
            performanceData: [
              { subject: 'Mathematics', grade: 90, trend: 'up' },
              { subject: 'English', grade: 82, trend: 'stable' },
              { subject: 'Science', grade: 83, trend: 'down' },
            ],
            parentContacts: {
              primary: {
                name: 'Sarah Thompson',
                email: 'sarah.thompson@email.com',
                phone: '+1-555-0123',
                relationship: 'Mother'
              },
              secondary: {
                name: 'John Thompson',
                email: 'john.thompson@email.com',
                phone: '+1-555-0124',
                relationship: 'Father'
              }
            },
            emergencyContact: {
              name: 'Mary Thompson',
              phone: '+1-555-0125',
              relationship: 'Grandmother'
            },
            address: {
              street: '123 Oak Street',
              city: 'Springfield',
              state: 'IL',
              zipCode: '62701'
            },
            medicalInfo: {
              allergies: ['Peanuts'],
              medications: [],
              conditions: []
            },
            enrollmentDate: '2024-08-15',
            classIds: ['class-1', 'class-2']
          },
          {
            id: '2',
            name: 'Liam Johnson',
            grade: 'Grade 4',
            age: 10,
            subjects: ['Mathematics', 'English', 'History'],
            overallGrade: 72,
            performanceData: [
              { subject: 'Mathematics', grade: 75, trend: 'up' },
              { subject: 'English', grade: 68, trend: 'down' },
              { subject: 'History', grade: 74, trend: 'stable' },
            ],
            parentContacts: {
              primary: {
                name: 'Lisa Johnson',
                email: 'lisa.johnson@email.com',
                phone: '+1-555-0126',
                relationship: 'Mother'
              }
            },
            emergencyContact: {
              name: 'Robert Johnson',
              phone: '+1-555-0127',
              relationship: 'Uncle'
            },
            address: {
              street: '456 Pine Avenue',
              city: 'Springfield',
              state: 'IL',
              zipCode: '62702'
            },
            medicalInfo: {
              allergies: [],
              medications: [],
              conditions: []
            },
            enrollmentDate: '2024-08-15',
            classIds: ['class-1', 'class-3']
          },
          {
            id: '3',
            name: 'Sofia Chen',
            grade: 'Grade 4',
            age: 9,
            subjects: ['Mathematics', 'Science', 'Geography'],
            overallGrade: 93,
            performanceData: [
              { subject: 'Mathematics', grade: 95, trend: 'stable' },
              { subject: 'Science', grade: 92, trend: 'up' },
              { subject: 'Geography', grade: 92, trend: 'up' },
            ],
            parentContacts: {
              primary: {
                name: 'Wei Chen',
                email: 'wei.chen@email.com',
                phone: '+1-555-0128',
                relationship: 'Father'
              },
              secondary: {
                name: 'Mei Chen',
                email: 'mei.chen@email.com',
                phone: '+1-555-0129',
                relationship: 'Mother'
              }
            },
            emergencyContact: {
              name: 'David Chen',
              phone: '+1-555-0130',
              relationship: 'Uncle'
            },
            address: {
              street: '789 Maple Drive',
              city: 'Springfield',
              state: 'IL',
              zipCode: '62703'
            },
            medicalInfo: {
              allergies: [],
              medications: [],
              conditions: []
            },
            enrollmentDate: '2024-08-15',
            classIds: ['class-2', 'class-3']
          }
        ],
        classes: [
          {
            id: 'class-1',
            name: 'Mathematics Grade 4A',
            grade: 'Grade 4',
            subject: 'Mathematics',
            teacherId: '1',
            studentIds: ['1', '2'],
            schedule: [
              { day: 'Monday', time: '09:00', duration: 60 },
              { day: 'Wednesday', time: '09:00', duration: 60 },
              { day: 'Friday', time: '09:00', duration: 60 }
            ],
            room: 'Room 101',
            description: 'Advanced Mathematics for Grade 4 students',
            createdAt: '2024-08-01',
            academicYear: '2024-2025'
          },
          {
            id: 'class-2',
            name: 'Science Grade 4B',
            grade: 'Grade 4',
            subject: 'Science',
            teacherId: '1',
            studentIds: ['1', '3'],
            schedule: [
              { day: 'Tuesday', time: '10:00', duration: 60 },
              { day: 'Thursday', time: '10:00', duration: 60 }
            ],
            room: 'Room 102',
            description: 'General Science for Grade 4 students',
            createdAt: '2024-08-01',
            academicYear: '2024-2025'
          },
          {
            id: 'class-3',
            name: 'English Grade 4C',
            grade: 'Grade 4',
            subject: 'English',
            teacherId: '1',
            studentIds: ['2', '3'],
            schedule: [
              { day: 'Monday', time: '11:00', duration: 60 },
              { day: 'Wednesday', time: '11:00', duration: 60 },
              { day: 'Friday', time: '11:00', duration: 60 }
            ],
            room: 'Room 103',
            description: 'English Language Arts for Grade 4 students',
            createdAt: '2024-08-01',
            academicYear: '2024-2025'
          }
        ],
        // Add some demo AI analytics data
        aiAnalytics: {
          insights: [
            {
              id: 'insight-1-decline-1',
              studentId: '2',
              type: 'weakness',
              category: 'academic',
              title: 'Recent Performance Decline',
              description: 'Liam Johnson has shown a 15% decline in recent performance.',
              priority: 'high',
              confidence: 85,
              suggestedActions: [
                'Schedule one-on-one meeting with student',
                'Review recent assignments for patterns',
                'Consider additional support resources',
                'Contact parents for discussion'
              ],
              createdAt: new Date().toISOString(),
              isRead: false,
            },
            {
              id: 'insight-3-strength-1',
              studentId: '3',
              type: 'strength',
              category: 'academic',
              title: 'Excellent Performance',
              description: 'Sofia Chen is consistently performing at a high level with an average of 93%.',
              priority: 'low',
              confidence: 95,
              suggestedActions: [
                'Consider advanced materials or enrichment activities',
                'Use as peer mentor for struggling students',
                'Maintain current support level'
              ],
              createdAt: new Date().toISOString(),
              isRead: false,
            }
          ],
          trends: [
            {
              studentId: '1',
              subject: 'Mathematics',
              period: 'month',
              trend: 'improving',
              trendScore: 12.5,
              dataPoints: [
                { date: '2024-01-01', score: 85, assessmentType: 'quiz' },
                { date: '2024-01-08', score: 88, assessmentType: 'test' },
                { date: '2024-01-15', score: 92, assessmentType: 'assignment' },
                { date: '2024-01-22', score: 90, assessmentType: 'quiz' },
                { date: '2024-01-29', score: 95, assessmentType: 'test' }
              ],
              predictedScore: 97,
              confidence: 78,
            },
            {
              studentId: '2',
              subject: 'English',
              period: 'month',
              trend: 'declining',
              trendScore: -8.2,
              dataPoints: [
                { date: '2024-01-01', score: 75, assessmentType: 'quiz' },
                { date: '2024-01-08', score: 72, assessmentType: 'test' },
                { date: '2024-01-15', score: 68, assessmentType: 'assignment' },
                { date: '2024-01-22', score: 65, assessmentType: 'quiz' },
                { date: '2024-01-29', score: 62, assessmentType: 'test' }
              ],
              predictedScore: 58,
              confidence: 82,
            }
          ],
          learningGaps: [
            {
              id: 'gap-2-english-1',
              studentId: '2',
              subject: 'English',
              topic: 'Reading Comprehension',
              severity: 'major',
              description: 'Liam Johnson is struggling with fundamental concepts in English.',
              suggestedResources: [
                'English practice worksheets',
                'Online tutorial videos',
                'One-on-one tutoring sessions',
                'Peer study groups',
                'Specialized intervention program'
              ],
              estimatedTimeToClose: 30,
              createdAt: new Date().toISOString(),
              status: 'open',
            }
          ],
          recommendations: [
            {
              id: 'rec-intervention-1',
              type: 'intervention',
              title: 'Implement Group Intervention Program',
              description: '1 students are performing below 70%. Consider implementing a targeted intervention program.',
              targetStudents: ['2'],
              priority: 'high',
              estimatedImpact: 75,
              implementationSteps: [
                'Identify common learning gaps',
                'Create small group sessions',
                'Develop targeted materials',
                'Schedule regular progress checks',
                'Involve parents in the process'
              ],
              requiredResources: [
                'Additional teaching materials',
                'Small group space',
                'Progress tracking tools',
                'Parent communication templates'
              ],
              createdAt: new Date().toISOString(),
              status: 'pending',
            }
          ],
          alerts: [
            {
              id: 'alert-2-drop-1',
              type: 'grade_drop',
              studentId: '2',
              title: 'Significant Grade Drop Detected',
              message: 'Liam Johnson has experienced a 15% drop in recent performance.',
              severity: 'critical',
              createdAt: new Date().toISOString(),
              isRead: false,
              actionRequired: true,
              relatedData: {
                recentAverage: 62,
                overallAverage: 77,
                dropPercentage: 15
              },
            }
          ],
          subjectBreakdowns: [
            {
              subject: 'Mathematics',
              averageScore: 87,
              studentCount: 2,
              gradeDistribution: { A: 1, B: 1, C: 0, D: 0, F: 0 },
              topPerformers: ['Sofia Chen'],
              strugglingStudents: [],
              commonWeaknesses: ['Problem-solving strategies', 'Word problems'],
              improvementSuggestions: [
                'Maintain current teaching strategies',
                'Consider enrichment activities',
                'Encourage peer tutoring'
              ]
            },
            {
              subject: 'English',
              averageScore: 70,
              studentCount: 2,
              gradeDistribution: { A: 0, B: 1, C: 1, D: 0, F: 0 },
              topPerformers: ['Emma Thompson'],
              strugglingStudents: ['Liam Johnson'],
              commonWeaknesses: ['Reading comprehension', 'Essay structure', 'Grammar rules'],
              improvementSuggestions: [
                'Increase practice opportunities',
                'Provide more detailed feedback',
                'Use visual aids and hands-on activities'
              ]
            }
          ],
          lastUpdated: new Date().toISOString(),
        }
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}