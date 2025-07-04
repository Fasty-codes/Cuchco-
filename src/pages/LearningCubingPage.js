import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LEVELS = [
  { key: 'basic', label: 'Basic', description: 'Start with the fundamentals of cubing.' },
  { key: 'intermediate', label: 'Intermediate', description: 'Learn more advanced moves and methods.' },
  { key: 'advanced', label: 'Advanced', description: 'Master advanced algorithms and speedcubing.' },
];

const getUserProgress = (username) => {
  if (!username) return {};
  const progress = localStorage.getItem(`cubingProgress_${username}`);
  return progress ? JSON.parse(progress) : {};
};

const setUserProgress = (username, progress) => {
  if (!username) return;
  localStorage.setItem(`cubingProgress_${username}`, JSON.stringify(progress));
};

const LearningCubingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (user?.username) {
      setProgress(getUserProgress(user.username));
    }
  }, [user]);

  const handleStart = (levelKey) => {
    // For now, just mark the level as completed and unlock the next
    if (!user?.username) return;
    const newProgress = { ...progress, [levelKey]: true };
    setUserProgress(user.username, newProgress);
    setProgress(newProgress);
  };

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: 16 }}>Please log in to access the Cubing Learning page.</h2>
        <button
          onClick={() => navigate('/login')}
          style={{ padding: '10px 24px', fontSize: 18, borderRadius: 8, background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Login
        </button>
      </div>
    );
  }

  // Unlock logic
  const isUnlocked = (levelIdx) => {
    if (levelIdx === 0) return true;
    const prevLevelKey = LEVELS[levelIdx - 1].key;
    return !!progress[prevLevelKey];
  };

  return (
    <div style={{ minHeight: '60vh', padding: '2rem 0', textAlign: 'center' }}>
      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>Learn Cubing</h1>
      <p style={{ fontSize: 20, color: '#333', marginBottom: 32 }}>
        Welcome to the Cubing Learning page! Choose your level to begin your journey.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
        {LEVELS.map((level, idx) => {
          const unlocked = isUnlocked(idx);
          const completed = !!progress[level.key];
          return (
            <div
              key={level.key}
              style={{
                width: 280,
                background: unlocked ? '#fff' : '#f0f0f0',
                border: completed ? '2px solid #28a745' : '2px solid #007bff',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                padding: '2rem 1.5rem',
                opacity: unlocked ? 1 : 0.6,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 12 }}>{level.label}</h2>
              <p style={{ color: '#555', fontSize: 16, marginBottom: 24 }}>{level.description}</p>
              {completed && (
                <span style={{ color: '#28a745', fontWeight: 600, marginBottom: 12 }}>Completed ✓</span>
              )}
              <button
                onClick={() => handleStart(level.key)}
                disabled={!unlocked || completed}
                style={{
                  marginTop: 'auto',
                  padding: '10px 24px',
                  fontSize: 18,
                  borderRadius: 8,
                  background: unlocked && !completed ? '#007bff' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  cursor: unlocked && !completed ? 'pointer' : 'not-allowed',
                  fontWeight: 700,
                  width: '100%',
                  transition: 'background 0.2s',
                }}
              >
                {completed ? 'Completed' : 'Start'}
              </button>
              {!unlocked && (
                <span style={{ color: '#888', fontSize: 14, marginTop: 10 }}>Locked</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningCubingPage; 