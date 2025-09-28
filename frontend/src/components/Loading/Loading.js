import React from 'react';
import { Loader2, Brain } from 'lucide-react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading">
      <div className="loading-content">
        <div className="loading-icon">
          <Brain className="brain-icon" />
          <Loader2 className="spinner" />
        </div>
        <h3>Analyzing News Article</h3>
        <p>Our models are processing your text...</p>
        <div className="loading-steps">
          <div className="step active">Preprocessing text</div>
          <div className="step active">Running model predictions</div>
          <div className="step">Generating results</div>
        </div>
      </div>
    </div>
  );
};

export default Loading;