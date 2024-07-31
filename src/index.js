import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Function to add event listeners
const setupEventListeners = () => {
  const handleContextMenu = (event) => event.preventDefault();
  
  const handleKeyDown = (event) => {
    if (event.keyCode === 123 || 
        (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74)) || 
        (event.ctrlKey && event.keyCode === 85)) {
      event.preventDefault();
      return false;
    }
  };

  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('keydown', handleKeyDown);

  // Cleanup the event listeners
  return () => {
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('keydown', handleKeyDown);
  };
};

const root = ReactDOM.createRoot(document.getElementById('root'));

// Set up the event listeners when the app is rendered
const cleanupListeners = setupEventListeners();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Cleanup the event listeners when the app unmounts
if (cleanupListeners) {
  window.addEventListener('beforeunload', cleanupListeners);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
