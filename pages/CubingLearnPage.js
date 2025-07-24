import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import cubeHero from '../assets/images/3x3-rubiks-cube.jpg';

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
  // Insert How to Solve 3x3 card after 3x3
  {
    key: 'howtosolve',
    label: 'How to Solve 3x3',
    description: 'Step-by-step beginner guide for solving the 3x3 cube.',
    path: '/learn/cubing/3x3/how-to-solve',
    isHowToSolve: true,
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
      <section
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 0 1.5rem 0',
          background: 'linear-gradient(90deg, #f7f9fb 60%, #e3f0ff 100%)',
          borderBottom: '2px solid #e0e7ef',
          marginBottom: 32,
          borderRadius: 24,
          boxShadow: '0 6px 32px rgba(0,0,0,0.10)',
          maxWidth: 1100,
          marginLeft: 'auto',
          marginRight: 'auto',
          overflow: 'hidden',
        }}
      >
        {/* Background image overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'rgba(255,255,255,0.7)',
        }}>
          <img
            src={cubeHero}
            alt="Cubing background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(16px) brightness(0.7)',
              opacity: 0.22,
            }}
          />
        </div>
        {/* Foreground content */}
        <div style={{ position: 'relative', zIndex: 1, flex: '1 1 350px', minWidth: 320, maxWidth: 520, padding: '0 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <h1 style={{ color: '#007bff', fontSize: 40, marginBottom: 18, textAlign: 'left' }}>Welcome to Cubing Mastery</h1>
          <p style={{ fontSize: 20, color: '#444', marginBottom: 22, textAlign: 'left' }}>
            Learn to solve all types of cubes, from beginner to advanced. Track your progress, master new methods, and join the speedcubing community. Whether you’re just starting or aiming for sub-10, this is your home for cubing improvement!
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, flex: '1 1 320px', minWidth: 280, maxWidth: 420, padding: '0 2rem', textAlign: 'center' }}>
          <img src={cubeHero} alt="Cubing learning hero" style={{ width: '100%', maxWidth: 400, borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }} />
        </div>
      </section>
      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>Learn Cubing</h1>
      <p style={{ fontSize: 20, color: '#333', marginBottom: 32 }}>
        Welcome to the Cubing Learning page! Choose your cube to begin your journey.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
        {LEVELS.filter(level => level.key !== 'howtosolve').map((level) => {
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
                cursor: unlocked ? 'pointer' : 'not-allowed',
                overflow: 'hidden',
              }}
              onClick={() => {
                if (unlocked) navigate(level.path);
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
                onClick={e => {
                  e.stopPropagation();
                  handleStart(level.key);
                }}
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

      {/* Long How to Solve 3x3 Card at the very bottom */}
      <div
        style={{
          margin: '48px auto 0 auto',
          background: '#e3f2fd',
          borderRadius: 16,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          border: '2px solid #90caf9',
          boxShadow: '0 4px 24px rgba(33,150,243,0.10)',
          cursor: 'pointer',
          maxWidth: 900,
          transition: 'box-shadow 0.2s',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
        }}
        onClick={() => navigate('/learn/cubing/3x3/how-to-solve')}
        onMouseEnter={e => {
          const arrow = e.currentTarget.querySelector('.howtosolve-arrow');
          if (arrow) arrow.style.opacity = 1;
        }}
        onMouseLeave={e => {
          const arrow = e.currentTarget.querySelector('.howtosolve-arrow');
          if (arrow) arrow.style.opacity = 0;
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: 28, marginBottom: 10, color: '#1976d2', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 14 }}>
            How to Solve a 3x3 (Beginner Guide)
            <span
              className="howtosolve-arrow"
              style={{
                marginLeft: 10,
                fontSize: 36,
                color: '#1976d2',
                opacity: 0,
                transition: 'opacity 0.2s',
                display: 'inline-block',
              }}
            >
              &rarr;
            </span>
          </h2>
          <p style={{ color: '#333', fontSize: 18, margin: 0, maxWidth: 600 }}>
            Step-by-step guide for absolute beginners. Learn the easiest way to solve the 3x3 Rubik's Cube with clear instructions and Malayalam support!
          </p>
        </div>
      </div>

      {/* Long How to Solve 2x2 Card */}
      <div
        style={{
          margin: '32px auto 0 auto',
          background: '#f0f4c3',
          borderRadius: 16,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          border: '2px solid #dce775',
          boxShadow: '0 4px 24px rgba(205,220,57,0.10)',
          cursor: 'pointer',
          maxWidth: 900,
          transition: 'box-shadow 0.2s',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
        }}
        onClick={() => navigate('/learn/cubing/2x2/how-to-solve')}
        onMouseEnter={e => {
          const arrow = e.currentTarget.querySelector('.howtosolve-arrow');
          if (arrow) arrow.style.opacity = 1;
        }}
        onMouseLeave={e => {
          const arrow = e.currentTarget.querySelector('.howtosolve-arrow');
          if (arrow) arrow.style.opacity = 0;
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: 28, marginBottom: 10, color: '#afb42b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 14 }}>
            How to Solve a 2x2 (Beginner Guide)
            <span
              className="howtosolve-arrow"
              style={{
                marginLeft: 10,
                fontSize: 36,
                color: '#afb42b',
                opacity: 0,
                transition: 'opacity 0.2s',
                display: 'inline-block',
              }}
            >
              &rarr;
            </span>
          </h2>
          <p style={{ color: '#333', fontSize: 18, margin: 0, maxWidth: 600 }}>
            Step-by-step guide for absolute beginners. 
          </p>
        </div>
      </div>

      {/* Long How to Solve 4x4 Card */}
      <div
        style={{
          margin: '32px auto 0 auto',
          background: '#ffe0b2',
          borderRadius: 16,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          border: '2px solid #ffb74d',
          boxShadow: '0 4px 24px rgba(255,183,77,0.10)',
          cursor: 'pointer',
          maxWidth: 900,
          transition: 'box-shadow 0.2s',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
        }}
        onClick={() => navigate('/learn/cubing/4x4/how-to-solve')}
        onMouseEnter={e => {
          const arrow = e.currentTarget.querySelector('.howtosolve-arrow');
          if (arrow) arrow.style.opacity = 1;
        }}
        onMouseLeave={e => {
          const arrow = e.currentTarget.querySelector('.howtosolve-arrow');
          if (arrow) arrow.style.opacity = 0;
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: 28, marginBottom: 10, color: '#f57c00', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 14 }}>
            How to Solve a 4x4 (Beginner Guide)
            <span
              className="howtosolve-arrow"
              style={{
                marginLeft: 10,
                fontSize: 36,
                color: '#f57c00',
                opacity: 0,
                transition: 'opacity 0.2s',
                display: 'inline-block',
              }}
            >
              &rarr;
            </span>
          </h2>
          <p style={{ color: '#333', fontSize: 18, margin: 0, maxWidth: 600 }}>
            Step-by-step guide for absolute beginners. 
          </p>
        </div>
      </div>

      {/* Long How to Solve Pyraminx Card */}
      <div
        style={{
          margin: '32px auto 48px auto',
          background: '#e1bee7',
          borderRadius: 16,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          border: '2px solid #ba68c8',
          boxShadow: '0 4px 24px rgba(186,104,200,0.10)',
          cursor: 'pointer',
          maxWidth: 900,
          transition: 'box-shadow 0.2s',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
        }}
        onClick={() => navigate('/learn/cubing/pyraminx/how-to-solve')}
        onMouseEnter={e => {
          const arrow = e.currentTarget.querySelector('.howtosolve-arrow');
          if (arrow) arrow.style.opacity = 1;
        }}
        onMouseLeave={e => {
          const arrow = e.currentTarget.querySelector('.howtosolve-arrow');
          if (arrow) arrow.style.opacity = 0;
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: 28, marginBottom: 10, color: '#8e24aa', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 14 }}>
            How to Solve a Pyraminx (Beginner Guide)
            <span
              className="howtosolve-arrow"
              style={{
                marginLeft: 10,
                fontSize: 36,
                color: '#8e24aa',
                opacity: 0,
                transition: 'opacity 0.2s',
                display: 'inline-block',
              }}
            >
              &rarr;
            </span>
          </h2>
          <p style={{ color: '#333', fontSize: 18, margin: 0, maxWidth: 600 }}>
            Step-by-step guide for absolute beginners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CubingLearnPage; 