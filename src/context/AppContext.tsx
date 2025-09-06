import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Teacher, Student, Subject, TestTemplate, TestResult, UploadedTest } from '../types';

interface AppState {
  currentTeacher: Teacher | null;
  students: Student[];
  subjects: Subject[];
  testTemplates: TestTemplate[];
  testResults: TestResult[];
  uploadedTests: UploadedTest[];
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
            ]
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
            ]
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
            ]
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