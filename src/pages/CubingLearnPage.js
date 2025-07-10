import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

// Cards for different cubes
const LEVELS = [
  {
    key: '2x2',
    label: '2x2 Cube',
    description: 'Learn to solve the 2x2 Rubik\'s Cube.',
    path: '/learn/cubing/2x2',
  },
  {
    key: '3x3',
    label: '3x3 Cube',
    description: 'Master the classic 3x3 Rubik\'s Cube.',
    path: '/learn/cubing/3x3',
  },
  {
    key: '4x4',
    label: '4x4 Cube',
    description: 'Take on the challenge of the 4x4 Rubik\'s Cube.',
    path: '/learn/cubing/4x4',
  },
  {
    key: 'pyraminx',
    label: 'Pyraminx',
    description: 'Learn to solve the Pyraminx puzzle.',
    path: '/learn/cubing/pyraminx',
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
  const [shake, setShake] = useState({}); // { levelKey: true/false }

  useEffect(() => {
    if (user?.username) {
      setProgress(getUserProgress(user.username));
    }
  }, [user]);

  // Only 3x3 is unlocked
  const isUnlocked = (levelKey) => levelKey === '3x3';

  const handleStart = (levelKey) => {
    if (isUnlocked(levelKey)) {
      const level = LEVELS.find(l => l.key === levelKey);
      if (level && level.path) {
        navigate(level.path);
      }
    } else {
      setShake(prev => ({ ...prev, [levelKey]: true }));
      setTimeout(() => setShake(prev => ({ ...prev, [levelKey]: false })), 500);
    }
  };

  // Add shake animation CSS
  const style = document.createElement('style');
  style.innerHTML = `
    .shake-card {
      animation: shake 0.5s;
    }
    @keyframes shake {
      0% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-8px); }
      80% { transform: translateX(8px); }
      100% { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

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

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0', background: '#f7f9fb', textAlign: 'center' }}>
      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>Learn Cubing</h1>
      <p style={{ fontSize: 20, color: '#333', marginBottom: 32 }}>
        Welcome to the Cubing Learning page! Choose your cube to begin your journey.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
        {LEVELS.map((level) => {
          const unlocked = isUnlocked(level.key);
          const completed = !!progress[level.key];
          return (
            <div
              key={level.key}
              className={shake[level.key] ? 'shake-card' : ''}
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
                transition: 'box-shadow 0.2s',
              }}
            >
              <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 12 }}>
                {level.label} {!unlocked && <FaLock style={{ marginLeft: 8, color: '#888', fontSize: 20, verticalAlign: 'middle' }} />}
              </h2>
              <p style={{ color: '#555', fontSize: 16, marginBottom: 24 }}>{level.description}</p>
              {completed && (
                <span style={{ color: '#28a745', fontWeight: 600, marginBottom: 12 }}>Completed ✓</span>
              )}
              <button
                onClick={() => handleStart(level.key)}
                disabled={completed}
                style={{
                  marginTop: 'auto',
                  padding: '10px 24px',
                  fontSize: 18,
                  borderRadius: 8,
                  background: unlocked && !completed ? '#007bff' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  cursor: completed ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  width: '100%',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {completed ? 'Completed' : unlocked ? 'Go to Page' : (<><span>Locked</span> <FaLock style={{ marginLeft: 8, color: '#fff', fontSize: 18, verticalAlign: 'middle' }} /></>)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CubingLearnPage; 