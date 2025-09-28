import React from 'react';
import { Shield, Bot } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Shield className="logo-icon" />
          <h1>Fake News Detector</h1>
          <Bot className="bot-icon" />
        </div>
        <p className="subtitle">Multi-Model News Verification System</p>
      </div>
    </header>
  );
};

export default Header;