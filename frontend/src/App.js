import React, { useState } from 'react';
import Header from './components/Header/Header';
import NewsInput from './components/NewsInput/NewsInput';
import Results from './components/Results/Results';
import Loading from './components/Loading/Loading';
import Footer from './components/Footer/Footer';
import './App.css';  // Changed from './styles/App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalysis = (analysisResults) => {
    setResults(analysisResults);
    setError(null);
  };

  const handleLoading = (loading) => {
    setIsLoading(loading);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setResults(null);
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          <NewsInput
            onAnalysis={handleAnalysis}
            onLoading={handleLoading}
            onError={handleError}
            onReset={handleReset}
          />
          {isLoading && <Loading />}
          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <button onClick={handleReset} className="retry-btn">
                Try Again
              </button>
            </div>
          )}
          {results && <Results results={results} onReset={handleReset} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;