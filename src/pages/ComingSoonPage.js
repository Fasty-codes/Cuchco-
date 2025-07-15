import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ComingSoonPage.css';
import wideMovesImg from '../assets/images/wide-moves.png';
import sliceMovesImg from '../assets/images/slice-moves.png';
import rotationsImg from '../assets/images/rotations.png';
import notationCheatsheet from '../assets/images/notation-cheatsheet.webp';
import faceMovesImg from '../assets/images/face-moves.png';
import primeMovesImg from '../assets/images/prime-moves.png';
import basicF2LImg from '../assets/images/basic-f2l.png';
import basicOLLImg from '../assets/images/basic-oll.png';
import basicPllImg from '../assets/images/basic-pll.png';
import twolookOLLImg from '../assets/images/2look-oll.png';
import twolookPllImg from '../assets/images/2look-pll.png';
import F2LImg1 from '../assets/images/f2l-1.png';
import F2LImg2 from '../assets/images/f2l-2.png';
import FullOLLImg1 from '../assets/images/oll-1.png';
import FullOLLImg2 from '../assets/images/oll-2.png';
import FullOLLImg3 from '../assets/images/oll-3.png';
import FullOLLImg4 from '../assets/images/oll-4.png';
import PLLImg1 from '../assets/images/pll-1.png';
import PLLImg2 from '../assets/images/pll-2.png';

const LEVELS = [
  {
    key: 'basic',
    label: 'Basic',
    description: 'Start with the fundamentals of 3x3 cubing.',
    icon: '🎯',
    difficulty: 'Beginner',
    color: '#28a745',
    gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    content: (
      <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
        <h3>3x3 Basics</h3>
        <p>Learn the basic structure, notation, and beginner's method for solving the 3x3 cube.</p>
        <ul>
          <li>Cube notation: F, R, U, L, D, B, and their inverses (e.g., F')</li>
          <li>White cross, corners, middle layer, yellow cross, last layer</li>
        </ul>
      </div>
    ),
  },
  {
    key: 'intermediate',
    label: 'Intermediate',
    description: 'Learn F2L, OLL, and PLL for faster 3x3 solves.',
    icon: '⚡',
    difficulty: 'Intermediate',
    color: '#ffc107',
    gradient: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
    content: (
      <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
        <h3>F2L, OLL, PLL</h3>
        <p>Pair up and insert corners and edges (F2L), orient the last layer (OLL), and permute the last layer (PLL).</p>
        <ul>
          <li>Learn intuitive F2L</li>
          <li>Basic OLL and PLL algorithms</li>
        </ul>
      </div>
    ),
  },
  {
    key: 'advanced',
    label: 'Advanced',
    description: 'Master full CFOP and advanced speedcubing techniques for 3x3.',
    icon: '🏆',
    difficulty: 'Advanced',
    color: '#dc3545',
    gradient: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
    content: (
      <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
        <h3>Full CFOP & Speedcubing</h3>
        <ul>
          <li>All 57 OLL and 21 PLL algorithms</li>
          <li>Advanced F2L cases</li>
          <li>Lookahead, finger tricks, and competition tips</li>
        </ul>
      </div>
    ),
  },
];

const getUserProgress = (username) => {
  if (!username) return {};
  const progress = localStorage.getItem(`cubing3x3Progress_${username}`);
  return progress ? JSON.parse(progress) : {};
};

const setUserProgress = (username, progress) => {
  if (!username) return;
  localStorage.setItem(`cubing3x3Progress_${username}`, JSON.stringify(progress));
};

const ComingSoonPage = ({ title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [activeLevel, setActiveLevel] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [introLevel, setIntroLevel] = useState(null);
  const [activeNotationSub, setActiveNotationSub] = useState(null);
  const [activeAlgSub, setActiveAlgSub] = useState(null);

  // Refs for move sections
  const faceTurnsRef = useRef(null);
  const wideMovesRef = useRef(null);
  const sliceMovesRef = useRef(null);
  const cheatsheetRef = useRef(null);
  const rotationsRef = useRef(null);
  const basicF2LRef = useRef(null);
  const basicOLLRef = useRef(null);
  const basicPllRef = useRef(null);
  const twoLookOLLRef = useRef(null);
  const twoLookPLLRef = useRef(null);
  const FullF2lRef = useRef(null);
  const FullOLLRef = useRef(null);
  const FullPLLRef = useRef(null);
  const handleScrollTo = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (title === '3x3' && user?.username) {
      setProgress(getUserProgress(user.username));
    }
  }, [user, title]);

  const handleStart = (levelKey) => {
    setIntroLevel(levelKey);
    setShowIntro(true);
  };

  const handleStartLearning = () => {
    if (introLevel) {
      navigate(`/learn/cubing/3x3/${introLevel}`);
      setShowIntro(false);
      setIntroLevel(null);
    }
  };

  const handleComplete = (levelKey) => {
    if (!user?.username) return;
    const newProgress = { ...progress, [levelKey]: true };
    setUserProgress(user.username, newProgress);
    setProgress(newProgress);
    setActiveLevel(null);
  };

  if (title === '3x3') {
    if (!user) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: 16 }}>Please log in to access the 3x3 learning page.</h2>
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
    // Box with all links
    const links = [
      { label: 'Notations', onClick: () => alert('Coming soon...') },
      { label: 'Wide Moves', onClick: () => alert('Coming soon...') },
      { label: 'Face Turns', onClick: () => alert('Coming soon...') },
      { label: 'Slice Moves', onClick: () => alert('Coming soon...') },
      { label: 'Moves Cheatsheet', onClick: () => alert('Coming soon...') },
    ];
    return (
      <div style={{ minHeight: '100vh', padding: '2rem 0', background: '#f7f9fb', textAlign: 'center' }}>
        <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>3x3 Learning Path</h1>
        <p style={{ fontSize: 20, color: '#333', marginBottom: 32 }}>
          Choose your level to begin learning the 3x3 cube.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
          {LEVELS.map((level, idx) => {
            const unlocked = isUnlocked(idx);
            const completed = !!progress[level.key];
            return (
              <div
                key={level.key}
                style={{
                  width: 320,
                  background: unlocked ? '#fff' : '#f0f0f0',
                  border: completed ? `3px solid ${level.color}` : `2px solid ${level.color}`,
                  borderRadius: 20,
                  boxShadow: unlocked ? '0 8px 32px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
                  padding: '2rem 1.5rem',
                  opacity: unlocked ? 1 : 0.6,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  transform: unlocked ? 'translateY(0)' : 'translateY(4px)',
                  ':hover': unlocked ? {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                  } : {}
                }}
                onClick={() => unlocked && handleStart(level.key)}
              >
                {/* Progress indicator */}
                {completed && (
                  <div style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    background: level.gradient,
                    color: '#fff',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 10
                  }}>
                    ✓
                  </div>
                )}
                
                {/* Level icon */}
                <div style={{
                  fontSize: 48,
                  marginBottom: 16,
                  filter: unlocked ? 'none' : 'grayscale(100%)'
                }}>
                  {level.icon}
                </div>
                
                {/* Level title */}
                <h2 style={{ 
                  color: level.color, 
                  fontSize: 32, 
                  marginBottom: 12, 
                  fontWeight: 700,
                  textAlign: 'center'
                }}>
                  {level.label}
                </h2>
                
                {/* Difficulty badge */}
                <div style={{
                  background: level.gradient,
                  color: '#fff',
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {level.difficulty}
                </div>
                
                {/* Description */}
                <p style={{ 
                  color: '#555', 
                  fontSize: 16, 
                  marginBottom: 20, 
                  textAlign: 'center',
                  lineHeight: 1.5
                }}>
                  {level.description}
                </p>
                
                {/* Status */}
                {completed ? (
                  <div style={{
                    color: level.color,
                    fontWeight: 700,
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span style={{ fontSize: 24 }}>🎉</span>
                    Completed
                  </div>
                ) : unlocked ? (
                  <button
                    style={{
                      background: level.gradient,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      padding: '12px 24px',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      ':hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    Start Learning →
                  </button>
                ) : (
                  <div style={{
                    color: '#888',
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span style={{ fontSize: 20 }}>🔒</span>
                    Complete previous level
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Notations and Algorithms in a single box, with Moves nav as first section */}
        <div style={{ maxWidth: 500, margin: '40px auto 0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem 1.5rem', textAlign: 'left' }}>
          <h2 style={{ color: '#007bff', fontSize: 24, marginBottom: 18 }}>Moves</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: 28, margin: 0 }}>
            <li style={{ marginBottom: 10 }}>
              <button onClick={() => handleScrollTo(faceTurnsRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 18, cursor: 'pointer', padding: 0, textAlign: 'left' }}>Face Turns</button>
            </li>
            <li style={{ marginBottom: 10 }}>
              <button onClick={() => handleScrollTo(wideMovesRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 18, cursor: 'pointer', padding: 0, textAlign: 'left' }}>Wide Moves</button>
            </li>
            <li style={{ marginBottom: 10 }}>
              <button onClick={() => handleScrollTo(rotationsRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 18, cursor: 'pointer', padding: 0, textAlign: 'left' }}>Rotations</button>
            </li>
            <li style={{ marginBottom: 10 }}>
              <button onClick={() => handleScrollTo(sliceMovesRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 18, cursor: 'pointer', padding: 0, textAlign: 'left' }}>Slice Moves</button>
            </li>
            <li>
              <button onClick={() => handleScrollTo(cheatsheetRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 18, cursor: 'pointer', padding: 0, textAlign: 'left' }}>Moves Cheatsheet</button>
            </li>
          </ul>
          <h2 style={{ color: '#007bff', fontSize: 24, margin: '28px 0 18px 0' }}>Algorithms</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: 28, margin: 0 }}>
            <li style={{ marginBottom: 10 }}>
              <button onClick={() => setActiveAlgSub('Basic')} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 18, fontWeight: 600, cursor: 'pointer', padding: 0, textAlign: 'left' }}>Basic</button>
              <ul style={{ listStyle: 'circle', paddingLeft: 24, margin: 0 }}>
                <li style={{ marginBottom: 8 }}>
                  <button onClick={() => handleScrollTo(basicF2LRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 17, cursor: 'pointer', padding: 0, textAlign: 'left' }}>F2L</button>
                </li>
                <li style={{ marginBottom: 8 }}>
                  <button onClick={() => handleScrollTo(basicOLLRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 17, cursor: 'pointer', padding: 0, textAlign: 'left' }}>OLL</button>
                </li>
                <li>
                  <button onClick={() => handleScrollTo(basicPllRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 17, cursor: 'pointer', padding: 0, textAlign: 'left' }}>PLL</button>
                </li>
              </ul>
            </li>
            <li style={{ marginBottom: 10 }}>
              <button onClick={() => setActiveAlgSub('2-Look')} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 18, fontWeight: 600, cursor: 'pointer', padding: 0, textAlign: 'left' }}>2-Look</button>
              <ul style={{ listStyle: 'circle', paddingLeft: 24, margin: 0 }}>
                <li style={{ marginBottom: 8 }}>
                  <button onClick={() => handleScrollTo(twoLookOLLRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 17, cursor: 'pointer', padding: 0, textAlign: 'left' }}>OLL</button>
                </li>
                <li>
                  <button onClick={() => handleScrollTo(twoLookPLLRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 17, cursor: 'pointer', padding: 0, textAlign: 'left' }}>PLL</button>
                </li>
              </ul>
            </li>
            <li>
              <button onClick={() => setActiveAlgSub('Full')} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 18, fontWeight: 600, cursor: 'pointer', padding: 0, textAlign: 'left' }}>Full</button>
              <ul style={{ listStyle: 'circle', paddingLeft: 24, margin: 0 }}>
                <li style={{ marginBottom: 8 }}>
                  <button onClick={() => handleScrollTo(FullF2lRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 17, cursor: 'pointer', padding: 0, textAlign: 'left' }}>F2L</button>
                </li>
                <li style={{ marginBottom: 8 }}>
                  <button onClick={() => handleScrollTo(FullOLLRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 17, cursor: 'pointer', padding: 0, textAlign: 'left' }}>OLL</button>
                </li>
                <li>
                  <button onClick={() => handleScrollTo(FullPLLRef)} className="clickable-link" style={{ background: 'none', border: 'none', color: '#222', fontSize: 17, cursor: 'pointer', padding: 0, textAlign: 'left' }}>PLL</button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        {/* Moves sections */}
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'left' }}>
          <section ref={faceTurnsRef} id="face-turns" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>Face Turns</h2>
            <p>The basic moves are <b>U</b>p, <b>D</b>own, <b>R</b>ight, <b>L</b>eft, <b>F</b>ront, <b>B</b>ack. Each move means to turn that side clockwise, as if you were facing that side. An apostrophe (prime) means to turn the face in the opposite direction (counterclockwise). The number 2 means to turn that face twice.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={faceMovesImg} alt="Face Moves" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 24 }} />
              <img src={primeMovesImg} alt="Prime Moves" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
          <section ref={wideMovesRef} id="wide-moves" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>Wide Moves</h2>
            <p>Wide moves turn 2 layers at once. They can be written in 2 ways: lower case (<b>u</b>, <b>d</b>, <b>r</b>, <b>l</b>, <b>f</b>, <b>b</b>) or ending in w (<b>Uw</b>, <b>Dw</b>, <b>Rw</b>, <b>Lw</b>, <b>Fw</b>, <b>Bw</b>). For example, <b>u</b> and <b>Uw</b> are the same move. There is also Uw', Uw2, etc.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={wideMovesImg} alt="Wide Moves" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
          <section ref={rotationsRef} id="rotations-moves" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>Rotations</h2>
            <p>Rotations are written as <b>x</b>, <b>y</b>, <b>z</b>. Rotations only turn the whole cube, not just one layer.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={rotationsImg} alt="Rotations" style={{ maxWidth: 600, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
          <section ref={sliceMovesRef} id="slice-moves" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>Slice Moves</h2>
            <p>Slice moves are written as <b>M</b>, <b>E</b>, <b>S</b>. Slice moves only turn the middle layer.<br/>
              <b>M</b> follows the <b>L</b> direction, <b>E</b> follows the <b>D</b> direction, <b>S</b> follows the <b>F</b> direction.
            </p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={sliceMovesImg} alt="Slice Moves" style={{ maxWidth: 400, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
          <section ref={cheatsheetRef} id="moves-cheatsheet" style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 24, marginBottom: 12 }}>
              Base Moves Cheat Sheet
              <span style={{ fontWeight: 'normal', fontSize: 16, marginLeft: 8 }}>
                (A quick reference for all the basic notations and moves you'll use while solving the cube.)
              </span>
            </h3>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <img src={notationCheatsheet} alt="Moves Cheatsheet" style={{ width: '100%', maxWidth: 700, height: 'auto', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 12 }} />
            </div>
          </section>
        </div>
        {/* Basic Algorithms */}
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'left' }}>
          <section ref={basicF2LRef} id="basic-f2l" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>Basic F2L</h2>
            <p>The first two layers (F2L) of the Rubik's Cube are solved simultaneously rather than individually, reducing the solve time considerably.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={basicF2LImg} alt="Basic F2L" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 24 }} />
              <h6 style={{ fontSize: 16, marginBottom: 12, color: '#222', fontWeight: 'normal' }}>i) U R U' R' U' F' U F'</h6>
              <h6 style={{ fontSize: 16, marginBottom: 12, color: '#222', fontWeight: 'normal' }}>ii) U' L' U L U F U' F' </h6>
            </div>
          </section>
          <section ref={basicOLLRef} id="basic-oll" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>Basic OLL</h2>
            <p>Basic OLL (Orientation of the Last Layer) algorithms are used in the CFOP (Fridrich) method for solving the Rubik's Cube, specifically to orient the last layer's pieces.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={basicOLLImg} alt="Basic OLL" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
          <section ref={basicPllRef} id="basic-pll" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>Basic PLL</h2>
            <p>Basic PLL (Permutation of the Last Layer) algorithms are used in the CFOP (Fridrich) method for solving the Rubik's Cube, specifically to permute the last layer's pieces.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={basicPllImg} alt="Slice Moves" style={{ maxWidth: 500, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
        </div>
        {/* 2-look */}
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'left' }}>
          <section ref={twoLookOLLRef} id="2-look-oll" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>2-Look OLL</h2>
            <p>A intermediate-friendly method to solve the last layer's orientation in two steps: first orienting the edges (usually to form a cross) and then orienting the corners. It requires learning about 10 algorithms..</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={twolookOLLImg} alt="2-look OLL" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
          <section ref={twoLookPLLRef} id="2-look-pll" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>2-Look PLL</h2>
            <p>A simplified method to solve the last layer's position in two steps: first permuting the corners to their correct locations and then permuting the edges. It requires learning only 6 algorithms.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={twolookPllImg} alt="2-look PLL" style={{ maxWidth: 500, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
        </div>
        { /* Full algorithms */}
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'left' }}>
          <section ref={FullF2lRef} id="basic-f2l" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>F2L</h2>
            <p>F2L is the second step in the CFOP method (Cross, F2L, OLL, PLL).It involves simultaneously solving a corner from the first layer and its corresponding edge from the middle layer.The goal is to pair these two pieces in the top layer and then insert them into their correct "F2L slot" between the center pieces.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={F2LImg1} alt="F2L(1)" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 24 }} />
              <img src={F2LImg2} alt="F2L(2)" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 24 }} />
            </div>
          </section>
          <section ref={FullOLLRef} id="oll" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>OLL</h2>
            <p>I made this help sheet for 2 look PLL & OLL a while ago. I ...OLL, or Orientation of the Last Layer, is a step in solving the Rubik's Cube using the CFOP method, where the top layer is oriented correctly. It follows the F2L (first two layers) step, and is then followed by PLL (Permutation of the Last Layer). There are 57 OLL algorithms in total.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={FullOLLImg1} alt="Full OLL(1)" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
              <img src={FullOLLImg2} alt="Full OLL(2)" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
              <img src={FullOLLImg3} alt="Full OLL(3)" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
              <img src={FullOLLImg4} alt="Full OLL(4)" style={{ maxWidth: 700, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
          <section ref={FullPLLRef} id="pll" style={{ marginBottom: 48 }}>
            <h2 style={{ color: '#007bff', fontSize: 22, marginBottom: 10 }}>PLL</h2>
            <p>After the top layer is oriented (all pieces facing the correct direction, creating a solid colored top face), PLL aims to move the pieces into their correct positions, effectively solving the entire cube.</p>
            <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
              <img src={PLLImg1} alt="Pll(1)" style={{ maxWidth: 500, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
              <img src={PLLImg2} alt="Pll(2)" style={{ maxWidth: 500, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            </div>
          </section>
        </div>
        {showIntro && introLevel && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '2rem 2.5rem', maxWidth: 420, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', textAlign: 'center' }}>
              <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 18 }}>{LEVELS.find(l => l.key === introLevel).label} Level</h2>
              <p style={{ color: '#555', fontSize: 18, marginBottom: 24 }}>{LEVELS.find(l => l.key === introLevel).description}</p>
              <button
                onClick={handleStartLearning}
                style={{ padding: '10px 24px', fontSize: 18, borderRadius: 8, background: '#007bff', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', marginRight: 12 }}
              >
                Start Learning
              </button>
              <button
                onClick={() => { setShowIntro(false); setIntroLevel(null); }}
                style={{ padding: '10px 24px', fontSize: 18, borderRadius: 8, background: '#ccc', color: '#333', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default coming soon page
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>{title || 'Coming soon...'}</h1>
      <p style={{ fontSize: 24, color: '#555' }}>This page is coming soon. Stay tuned!</p>
    </div>
  );
};

export default ComingSoonPage; 