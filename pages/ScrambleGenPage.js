import React, { useState } from 'react';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

const scrambleConfigs = {
  '2x2': { moves: ['R', 'U', 'F'], length: 11 },
  '3x3': { moves: ['R', 'L', 'U', 'D', 'F', 'B', 'r', 'l', 'u', 'd', 'f', 'b'], length: 20 },
  '4x4': { moves: ['R', 'L', 'U', 'D', 'F', 'B', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw'], length: 40 },
  'pyraminx': { moves: ['U', 'L', 'R', 'B', 'u', 'l', 'r', 'b'], length: 11 },
};

function generateScramble(puzzle) {
  const { moves, length } = scrambleConfigs[puzzle];
  const modifiers = ['', "'", '2'];
  let scramble = [];
  let prevMove = '';
  for (let i = 0; i < length; i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move[0] === prevMove[0]); // avoid repeating same face
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    prevMove = move;
  }
  return scramble.join(' ');
}

const puzzleList = [
  { key: '2x2', label: '2x2 Scramble' },
  { key: '3x3', label: '3x3 Scramble' },
  { key: '4x4', label: '4x4 Scramble' },
  { key: 'pyraminx', label: 'Pyraminx Scramble' },
];

const ScrambleGenPage = () => {
  const [scrambles, setScrambles] = useState({
    '2x2': 'Click the button below',
    '3x3': 'Click the button below',
    '4x4': 'Click the button below',
    'pyraminx': 'Click the button below',
  });

  const handleGenerate = (puzzle) => {
    setScrambles(prev => ({ ...prev, [puzzle]: generateScramble(puzzle) }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', textAlign: 'center', maxWidth: 480, width: '100%' }}>
        <GiPerspectiveDiceSixFacesRandom size={48} color="#007bff" style={{ marginBottom: '1rem' }} />
        <h1 style={{ marginBottom: '2rem', color: '#222' }}>Scramble Generator</h1>
        {puzzleList.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#00bcd4', marginBottom: 8, fontSize: 22 }}>{label}</h2>
            <div style={{ background: '#222', color: '#fff', padding: '15px 25px', borderRadius: 10, margin: '10px 0', fontSize: '1.2rem', textAlign: 'center', minHeight: '2em', letterSpacing: 2 }}>
              {scrambles[key]}
            </div>
            <button
              onClick={() => handleGenerate(key)}
              style={{ marginBottom: 8, padding: '10px 20px', fontSize: '1rem', background: '#00d435b8', border: 'none', color: '#000', borderRadius: 5, cursor: 'pointer', fontWeight: 600 }}
            >
              Generate {label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrambleGenPage; 