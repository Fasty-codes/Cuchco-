import React from 'react';
import { Link } from 'react-router-dom';

const ToolsPage = () => {
  return (
    <div className="tools-page" style={{ padding: '2rem' }}>
      <h1>Tools</h1>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <Link to="/3x3solver" style={toolCardStyle}>
          <h2>3x3 Solver</h2>
          <p>Get solutions for your 3x3 Rubik's Cube.</p>
        </Link>
        <Link to="/timer" style={toolCardStyle}>
          <h2>Timer</h2>
          <p>Track your solve times and improve your speed.</p>
        </Link>
        <Link to="/scramble-gen" style={toolCardStyle}>
          <h2>Scramble Generator</h2>
          <p>Generate random scrambles for practice.</p>
        </Link>
      </div>
    </div>
  );
};

const toolCardStyle = {
  display: 'block',
  minWidth: '220px',
  padding: '1.5rem',
  border: '1px solid #ddd',
  borderRadius: '12px',
  textDecoration: 'none',
  color: '#222',
  background: '#fafafa',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.2s',
};

export default ToolsPage; 