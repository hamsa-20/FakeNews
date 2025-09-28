import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Changed from './styles/index.css'
import App from './App';  // Changed from './components/App'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);