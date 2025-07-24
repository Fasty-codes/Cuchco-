import React from 'react';

const ChessShowItPage = () => (
  <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f7f9fb' }}>
    <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '3rem 2.5rem', maxWidth: 500, textAlign: 'center', border: '3px solid #007bff' }}>
      <i className="fa fa-eye" style={{ fontSize: 70, color: '#007bff', marginBottom: 18 }} aria-hidden="true"></i>
      <h1 style={{ fontSize: 32, color: '#007bff', marginBottom: 12 }}>Show It</h1>
      <p style={{ fontSize: 20, color: '#444', marginBottom: 18 }}>
        Visual and interactive chess move demonstrations coming soon! Here you’ll be able to see and try out every move.
      </p>
    </div>
  </div>
);

export default ChessShowItPage; 