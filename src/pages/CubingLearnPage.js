import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LEVELS = [
  {
    key: 'basic',
    label: 'Basic',
    description: 'Start with the fundamentals of cubing.',
    content: (
      <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
        <h3>What is a Rubik's Cube?</h3>
        <p>The Rubik's Cube is a 3D combination puzzle. The goal is to align all faces so each shows a single color.</p>
        <h3>Cube Types</h3>
        <ul>
          <li>2x2: Pocket cube, simple and fast to solve.</li>
          <li>3x3: Classic Rubik's Cube, most popular.</li>
          <li>4x4 and up: More complex, more pieces.</li>
        </ul>
        <h3>Basic Notation</h3>
        <ul>
          <li><b>F</b>: Front face clockwise</li>
          <li><b>R</b>: Right face clockwise</li>
          <li><b>U</b>: Upper face clockwise</li>
          <li>Add an apostrophe (e.g., F') for counterclockwise</li>
        </ul>
        <h3>Beginner's Method</h3>
        <ol>
          <li>Make a white cross</li>
          <li>Solve white corners</li>
          <li>Solve the middle layer edges</li>
          <li>Make a yellow cross</li>
          <li>Solve yellow corners</li>
          <li>Finish the cube</li>
        </ol>
      </div>
    ),
  },
  {
    key: 'intermediate',
    label: 'Intermediate',
    description: 'Learn more advanced moves and methods.',
    content: (
      <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
        <h3>F2L (First Two Layers)</h3>
        <p>Pair up and insert corners and edges together for faster solves.</p>
        <h3>OLL (Orientation of Last Layer)</h3>
        <p>Learn algorithms to make the last layer all one color on top.</p>
        <h3>PLL (Permutation of Last Layer)</h3>
        <p>Learn algorithms to move the last layer pieces into place.</p>
        <h3>Practice Tips</h3>
        <ul>
          <li>Practice finger tricks for speed</li>
          <li>Learn to look ahead while solving</li>
        </ul>
      </div>
    ),
  },
  {
    key: 'advanced',
    label: 'Advanced',
    description: 'Master advanced algorithms and speedcubing.',
    content: (
      <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
        <h3>Full CFOP Method</h3>
        <p>Learn all 57 OLL and 21 PLL algorithms for the fastest solves.</p>
        <h3>Other Methods</h3>
        <ul>
          <li>Roux</li>
          <li>ZZ</li>
          <li>Advanced F2L</li>
        </ul>
        <h3>Competition Tips</h3>
        <ul>
          <li>Practice with a timer</li>
          <li>Join cubing communities</li>
          <li>Learn to solve under pressure</li>
        </ul>
      </div>
    ),
  },
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

const CubingLearnPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [activeLevel, setActiveLevel] = useState(null);

  useEffect(() => {
    if (user?.username) {
      setProgress(getUserProgress(user.username));
    }
  }, [user]);

  const handleStart = (levelKey) => {
    setActiveLevel(levelKey);
  };

  const handleComplete = (levelKey) => {
    if (!user?.username) return;
    const newProgress = { ...progress, [levelKey]: true };
    setUserProgress(user.username, newProgress);
    setProgress(newProgress);
    setActiveLevel(null);
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

  const isUnlocked = (levelIdx) => {
    if (levelIdx === 0) return true;
    const prevLevelKey = LEVELS[levelIdx - 1].key;
    return !!progress[prevLevelKey];
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0', background: '#f7f9fb', textAlign: 'center' }}>
      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>Learn Cubing</h1>
      <p style={{ fontSize: 20, color: '#333', marginBottom: 32 }}>
        Welcome to the Cubing Learning page! Choose your level to begin your journey.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
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
      {activeLevel && (
        <div style={{ background: '#fff', maxWidth: 700, margin: '0 auto', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem 1.5rem', marginBottom: 40 }}>
          <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 18 }}>{LEVELS.find(l => l.key === activeLevel).label} Level</h2>
          {LEVELS.find(l => l.key === activeLevel).content}
          <button
            onClick={() => handleComplete(activeLevel)}
            style={{ marginTop: 32, padding: '10px 24px', fontSize: 18, borderRadius: 8, background: '#28a745', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            Mark as Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default CubingLearnPage; 