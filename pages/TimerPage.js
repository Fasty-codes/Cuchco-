import React, { useState, useRef, useEffect } from 'react';
import { FaStopwatch, FaRedo, FaPlay, FaPause } from 'react-icons/fa';

const cubeTypes = [
  { label: '2x2', value: '2x2' },
  { label: '3x3', value: '3x3' },
  { label: '4x4', value: '4x4' },
  { label: '5x5', value: '5x5' },
  { label: '6x6', value: '6x6' },
  { label: 'Pyraminx', value: 'pyraminx' },
  { label: 'Skewb', value: 'skewb' },
  { label: 'Clock', value: 'clock' },
];

// Scramble generators for each type
function generateScramble(type = '3x3') {
  switch (type) {
    case '2x2':
      return generateNxNScramble(2, 9 + Math.floor(Math.random() * 3));
    case '3x3':
      return generateNxNScramble(3, 20);
    case '4x4':
      return generateNxNScramble(4, 40 + Math.floor(Math.random() * 6));
    case '5x5':
      return generateNxNScramble(5, 60 + Math.floor(Math.random() * 6));
    case '6x6':
      return generateNxNScramble(6, 80 + Math.floor(Math.random() * 6));
    case 'pyraminx':
      return generatePyraminxScramble();
    case 'skewb':
      return generateSkewbScramble();
    case 'clock':
      return generateClockScramble();
    default:
      return generateNxNScramble(3, 20);
  }
}

function generateNxNScramble(n, length) {
  // For simplicity, use 3x3 moves for all NxN, but can be improved
  const moves = ["R", "L", "U", "D", "F", "B"];
  const modifiers = ["", "'", "2"];
  let scramble = [];
  let lastMove = "";
  while (scramble.length < length) {
    let move = moves[Math.floor(Math.random() * moves.length)];
    if (move !== lastMove) {
      lastMove = move;
      let modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      scramble.push(move + modifier);
    }
  }
  return scramble.join(" ");
}

function generatePyraminxScramble() {
  const moves = ["U", "L", "R", "B"];
  const modifiers = ["", "'"];
  let scramble = [];
  for (let i = 0; i < 11; i++) {
    let move = moves[Math.floor(Math.random() * moves.length)];
    let modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
  }
  return scramble.join(" ");
}

function generateSkewbScramble() {
  const moves = ["R", "L", "U", "B"];
  const modifiers = ["", "'"];
  let scramble = [];
  for (let i = 0; i < 11; i++) {
    let move = moves[Math.floor(Math.random() * moves.length)];
    let modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
  }
  return scramble.join(" ");
}

function generateClockScramble() {
  // Simple random up/down for 12 pins
  let scramble = [];
  for (let i = 0; i < 12; i++) {
    let num = Math.floor(Math.random() * 13) - 6; // -6 to +6
    scramble.push(num > 0 ? `+${num}` : `${num}`);
  }
  return scramble.join(' ');
}

const TimerPage = () => {
  const [cubeType, setCubeType] = useState('3x3');
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [scramble, setScramble] = useState(generateScramble('3x3'));
  const [session, setSession] = useState([]);
  const intervalRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (running) {
      const start = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - start);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  // Keyboard support (spacebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleStartStop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [running, time]);

  // Update scramble when cube type changes
  useEffect(() => {
    setScramble(generateScramble(cubeType));
    setSession([]); // Reset session when cube type changes
  }, [cubeType]);

  const handleStartStop = () => {
    if (!running) {
      setTime(0);
      setRunning(true);
    } else {
      setRunning(false);
      const finalTime = (time / 1000).toFixed(2);
      setSession(prev => [finalTime, ...prev]);
      setScramble(generateScramble(cubeType));
    }
  };

  const handleReset = () => {
    setRunning(false);
    setTime(0);
    setScramble(generateScramble(cubeType));
  };

  // Helper to calculate average (removing best and worst)
  function calculateAverage(times, count) {
    if (times.length < count) return '-';
    const arr = times.slice(0, count).map(Number);
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const sum = arr.reduce((a, b) => a + b, 0) - min - max;
    const avg = sum / (count - 2);
    return avg.toFixed(2);
  }

  const ao5 = calculateAverage(session, 5);
  const ao12 = calculateAverage(session, 12);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', textAlign: 'center', maxWidth: 480, width: '100%' }}>
        <FaStopwatch size={48} color="#007bff" style={{ marginBottom: '1rem' }} />
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="cubeType" style={{ fontWeight: 600, marginRight: 8 }}>Cube Type:</label>
          <select id="cubeType" value={cubeType} onChange={e => setCubeType(e.target.value)} style={{ fontSize: 18, padding: '4px 12px', borderRadius: 6 }}>
            {cubeTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: 24, color: '#007bff', marginBottom: 12, letterSpacing: 2, fontWeight: 600 }}>{scramble}</div>
        <div style={{ fontSize: 64, fontWeight: 700, margin: '1.5rem 0', color: running ? '#28a745' : '#222', fontFamily: 'monospace' }}>
          {(time / 1000).toFixed(2)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, margin: '18px 0 0 0' }}>
          <div style={{ fontSize: 18, color: '#007bff', fontWeight: 600 }}>ao5: <span style={{ color: '#222' }}>{ao5}</span></div>
          <div style={{ fontSize: 18, color: '#007bff', fontWeight: 600 }}>ao12: <span style={{ color: '#222' }}>{ao12}</span></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button onClick={handleStartStop} style={{ background: running ? '#dc3545' : '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 2.5rem', fontSize: 22, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            {running ? <FaPause /> : <FaPlay />} {running ? 'Stop' : 'Start'}
          </button>
          <button onClick={handleReset} style={{ background: '#f0f2f5', color: '#222', border: '1px solid #bbb', borderRadius: 8, padding: '0.75rem 2.5rem', fontSize: 22, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaRedo /> Reset
          </button>
        </div>
        <div style={{ marginTop: 32, textAlign: 'left' }}>
          <h3 style={{ marginBottom: 8, color: '#007bff' }}>Session Times</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {session.length === 0 && <li style={{ color: '#888' }}>No times yet.</li>}
            {session.map((t, i) => (
              <li key={i} style={{ fontSize: 20, fontFamily: 'monospace', marginBottom: 2 }}>{t} s</li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: 24, color: '#888', fontSize: 15 }}>
        <span>Tip: Press <b>Spacebar</b> to start/stop the timer!</span>
      </div>
    </div>
  );
};

export default TimerPage; 