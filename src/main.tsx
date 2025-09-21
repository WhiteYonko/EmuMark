import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error handling for blocked resources
window.addEventListener('error', (event) => {
  if (event.message.includes('ERR_BLOCKED_BY_CLIENT')) {
    console.warn('Resource blocked by client extension:', event.filename);
    // Don't throw the error, just log it
    event.preventDefault();
    return false;
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('ERR_BLOCKED_BY_CLIENT')) {
    console.warn('Promise rejected due to blocked resource:', event.reason);
    event.preventDefault();
  }
});

// Ensure DOM is ready
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
