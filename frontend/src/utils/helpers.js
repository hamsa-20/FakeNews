// Utility functions for the application

export const formatConfidence = (confidence) => {
  return (confidence * 100).toFixed(1) + '%';
};

export const getConfidenceLevel = (confidence) => {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.6) return 'medium';
  return 'low';
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const validateNewsText = (text) => {
  const minLength = 10;
  const maxLength = 10000;
  
  if (!text || text.trim().length === 0) {
    return { isValid: false, message: 'News text cannot be empty' };
  }
  
  if (text.trim().length < minLength) {
    return { isValid: false, message: `News text must be at least ${minLength} characters` };
  }
  
  if (text.length > maxLength) {
    return { isValid: false, message: `News text cannot exceed ${maxLength} characters` };
  }
  
  return { isValid: true };
};

export const calculateOverallPrediction = (predictions) => {
  const modelResults = Object.values(predictions);
  const realCount = modelResults.filter(p => p.prediction === 'real').length;
  const fakeCount = modelResults.filter(p => p.prediction === 'fake').length;
  
  if (realCount > fakeCount) return 'real';
  if (fakeCount > realCount) return 'fake';
  return 'uncertain';
};

export const calculateAverageConfidence = (predictions) => {
  const confidences = Object.values(predictions).map(p => p.confidence);
  return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
};