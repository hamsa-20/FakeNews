import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <p>Multi-model system for detecting fake news using advanced machine learning techniques.</p>
          </div>
          
          <div className="footer-section">
            <h4>Models</h4>
            <ul>
              <li>Twitter Dataset Model</li>
              <li>MediaEval Model</li>
              <li>Social Context Model</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <div className="contact-links">
              <a href="mailto:contact@example.com" className="footer-link">
                <Mail className="footer-icon" />
                Email
              </a>
              <a href="https://github.com/hamsa-20" className="footer-link">
                <Github className="footer-icon" />
                GitHub
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            Made with <Heart className="heart-icon" /> for fighting misinformation
          </p>
          <p>&copy; 2024 Fake News Detector. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;