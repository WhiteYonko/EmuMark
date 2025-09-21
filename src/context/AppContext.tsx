import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Teacher, Student, Subject, TestTemplate, TestResult, UploadedTest, Class, Assessment, GradeEntry, AssessmentHistory } from '../types';

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
        ]
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