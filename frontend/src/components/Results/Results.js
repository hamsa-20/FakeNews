import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, TrendingUp } from 'lucide-react';
import './Results.css';

const Results = ({ results, onReset }) => {
  const getStatusIcon = (prediction, confidence) => {
    if (prediction === 'real' && confidence > 0.7) {
      return <CheckCircle className="status-icon real" />;
    } else if (prediction === 'fake' && confidence > 0.7) {
      return <XCircle className="status-icon fake" />;
    } else {
      return <AlertTriangle className="status-icon uncertain" />;
    }
  };

  const getStatusText = (prediction, confidence) => {
    if (confidence > 0.8) {
      return prediction === 'real' ? 'Highly Likely Real' : 'Highly Likely Fake';
    } else if (confidence > 0.6) {
      return prediction === 'real' ? 'Likely Real' : 'Likely Fake';
    } else {
      return 'Uncertain';
    }
  };

  const getOverallPrediction = () => {
    const predictions = results.predictions;
    const realCount = Object.values(predictions).filter(p => p.prediction === 'real').length;
    const fakeCount = Object.values(predictions).filter(p => p.prediction === 'fake').length;
    
    if (realCount > fakeCount) return 'real';
    if (fakeCount > realCount) return 'fake';
    return 'uncertain';
  };

  const getAverageConfidence = () => {
    const confidences = Object.values(results.predictions).map(p => p.confidence);
    return (confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length).toFixed(3);
  };

  return (
    <div className="results">
      <div className="results-header">
        <TrendingUp className="results-icon" />
        <h2>Analysis Results</h2>
      </div>

      <div className="overall-result">
        <div className="overall-status">
          {getStatusIcon(getOverallPrediction(), parseFloat(getAverageConfidence()))}
          <div className="overall-info">
            <h3>Overall Assessment</h3>
            <p className="overall-prediction">{getStatusText(getOverallPrediction(), parseFloat(getAverageConfidence()))}</p>
            <p className="average-confidence">Average Confidence: {getAverageConfidence()}</p>
          </div>
        </div>
      </div>

      <div className="model-results">
        <h3>Individual Model Results</h3>
        <div className="results-grid">
          {Object.entries(results.predictions).map(([model, result]) => (
            <div key={model} className="result-card">
              <div className="result-header">
                {getStatusIcon(result.prediction, result.confidence)}
                <h4>{model.charAt(0).toUpperCase() + model.slice(1)} Model</h4>
              </div>
              
              <div className="result-details">
                <div className="prediction-info">
                  <span className="label">Prediction:</span>
                  <span className={`prediction ${result.prediction}`}>
                    {result.prediction.toUpperCase()}
                  </span>
                </div>
                
                <div className="confidence-info">
                  <span className="label">Confidence:</span>
                  <span className="confidence">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                
                <div className="confidence-bar">
                  <div 
                    className={`confidence-fill ${result.prediction}`}
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="analysis-info">
        <p><strong>Analysis Time:</strong> {new Date(results.timestamp).toLocaleString()}</p>
        <p><strong>Models Used:</strong> {Object.keys(results.predictions).join(', ')}</p>
      </div>

      <button onClick={onReset} className="reset-btn">
        <RotateCcw className="btn-icon" />
        Analyze Another Article
      </button>
    </div>
  );
};

export default Results;