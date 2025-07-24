import React, { useState } from 'react';
import './Solver3x3Page.css';
// Make sure to install cubejs: npm install cubejs
import Cube from 'cubejs';

const COLORS = [
  { name: 'yellow', hex: '#ffe600' },
  { name: 'white', hex: '#fff' },
  { name: 'green', hex: '#43a047' },
  { name: 'blue', hex: '#1976d2' },
  { name: 'red', hex: '#e53935' },
  { name: 'orange', hex: '#ff9800' },
];

function getDefaultCube() {
  return {
    U: Array(9).fill('yellow'),   // Up is yellow
    D: Array(9).fill('white'),    // Down is white
    F: Array(9).fill('green'),    // Front is green
    B: Array(9).fill('blue'),     // Back is blue
    L: Array(9).fill('red'),      // Left is red
    R: Array(9).fill('orange'),   // Right is orange
  };
}

function getColorString(cube) {
  // Map face colors to cubejs notation: U=U, R=R, F=F, D=D, L=L, B=B
  // We'll use: U=yellow, D=white, F=green, B=blue, L=red, R=orange
  // Map: yellow=U, white=D, green=F, blue=B, red=L, orange=R
  const colorMap = {
    yellow: 'U',
    white: 'D',
    green: 'F',
    blue: 'B',
    red: 'L',
    orange: 'R',
  };
  // Order: U, R, F, D, L, B (cubejs expects this order)
  return [
    ...cube.U,
    ...cube.R,
    ...cube.F,
    ...cube.D,
    ...cube.L,
    ...cube.B,
  ].map(c => colorMap[c]).join('');
}

const Solver3x3Page = () => {
  const [cube, setCube] = useState(getDefaultCube());
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [solution, setSolution] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStickerClick = (face, idx) => {
    setCube(prev => ({
      ...prev,
      [face]: prev[face].map((c, i) => (i === idx ? selectedColor : c)),
    }));
  };

  const handleColorPick = (color) => setSelectedColor(color);

  const handleReset = () => {
    setCube(getDefaultCube());
    setSolution('');
    setError('');
  };

  const handleSolve = () => {
    setLoading(true);
    setError('');
    setSolution('');
    // Color count check
    const allStickers = [
      ...cube.U,
      ...cube.L,
      ...cube.F,
      ...cube.R,
      ...cube.B,
      ...cube.D,
    ];
    const counts = COLORS.reduce((acc, c) => {
      acc[c.name] = allStickers.filter(x => x === c.name).length;
      return acc;
    }, {});
    const invalid = Object.values(counts).some(count => count !== 9);
    if (invalid) {
      setError('Each color must appear exactly 9 times.\n' + Object.entries(counts).map(([k,v]) => `${k}: ${v}`).join(', '));
      setLoading(false);
      return;
    }
    // Use cubejs
    try {
      const colorString = getColorString(cube);
      const cubejs = Cube();
      cubejs.fromString(colorString);
      const sol = cubejs.solve();
      setSolution(sol);
    } catch (e) {
      setError('Could not solve the cube. The state may be unsolvable or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solver3x3-page">
      <h1>3x3 Rubik's Cube Solver</h1>
      <div className="solver3x3-color-palette">
        {COLORS.map(c => (
          <button
            key={c.name}
            className={`solver3x3-color-btn${selectedColor === c.name ? ' selected' : ''}`}
            style={{ background: c.hex, border: selectedColor === c.name ? '2px solid #333' : '1px solid #ccc' }}
            onClick={() => handleColorPick(c.name)}
            aria-label={c.name}
          />
        ))}
      </div>
      <div className="solver3x3-net">
        {/* Render the cube net: U on top, L F R B in a row, D at bottom */}
        <div className="solver3x3-net-row">
          <div className="solver3x3-net-face blank" />
          <div className="solver3x3-net-face" style={{ border: '3px solid #ffe600' }}>
            <div className="solver3x3-face-label">Up (Yellow)</div>
            <div className="solver3x3-face-grid">
              {cube.U.map((color, i) => (
                <div
                  key={`U${i}`}
                  className="solver3x3-sticker"
                  style={{ background: COLORS.find(c => c.name === color)?.hex || color }}
                  onClick={() => handleStickerClick('U', i)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="solver3x3-net-row">
          <div className="solver3x3-net-face" style={{ border: '3px solid #e53935' }}>
            <div className="solver3x3-face-label">Left (Red)</div>
            <div className="solver3x3-face-grid">
              {cube.L.map((color, i) => (
                <div
                  key={`L${i}`}
                  className="solver3x3-sticker"
                  style={{ background: COLORS.find(c => c.name === color)?.hex || color }}
                  onClick={() => handleStickerClick('L', i)}
                />
              ))}
            </div>
          </div>
          <div className="solver3x3-net-face" style={{ border: '3px solid #43a047' }}>
            <div className="solver3x3-face-label">Front (Green)</div>
            <div className="solver3x3-face-grid">
              {cube.F.map((color, i) => (
                <div
                  key={`F${i}`}
                  className="solver3x3-sticker"
                  style={{ background: COLORS.find(c => c.name === color)?.hex || color }}
                  onClick={() => handleStickerClick('F', i)}
                />
              ))}
            </div>
          </div>
          <div className="solver3x3-net-face" style={{ border: '3px solid #ff9800' }}>
            <div className="solver3x3-face-label">Right (Orange)</div>
            <div className="solver3x3-face-grid">
              {cube.R.map((color, i) => (
                <div
                  key={`R${i}`}
                  className="solver3x3-sticker"
                  style={{ background: COLORS.find(c => c.name === color)?.hex || color }}
                  onClick={() => handleStickerClick('R', i)}
                />
              ))}
            </div>
          </div>
          <div className="solver3x3-net-face" style={{ border: '3px solid #1976d2' }}>
            <div className="solver3x3-face-label">Back (Blue)</div>
            <div className="solver3x3-face-grid">
              {cube.B.map((color, i) => (
                <div
                  key={`B${i}`}
                  className="solver3x3-sticker"
                  style={{ background: COLORS.find(c => c.name === color)?.hex || color }}
                  onClick={() => handleStickerClick('B', i)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="solver3x3-net-row">
          <div className="solver3x3-net-face blank" />
          <div className="solver3x3-net-face" style={{ border: '3px solid #fff' }}>
            <div className="solver3x3-face-label">Down (White)</div>
            <div className="solver3x3-face-grid">
              {cube.D.map((color, i) => (
                <div
                  key={`D${i}`}
                  className="solver3x3-sticker"
                  style={{ background: COLORS.find(c => c.name === color)?.hex || color }}
                  onClick={() => handleStickerClick('D', i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Legend for face colors */}
      <div style={{ marginTop: 18, marginBottom: 8, fontSize: 15, color: '#555', textAlign: 'center' }}>
        <strong>Face Color Legend:</strong> Up = Yellow, Down = White, Front = Green, Back = Blue, Left = Red, Right = Orange
      </div>
      <div className="solver3x3-controls">
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSolve} disabled={loading}>{loading ? 'Solving...' : 'Solve'}</button>
      </div>
      {error && <div className="solver3x3-solution" style={{ color: '#d00' }}>{error}</div>}
      {solution && (
        <div className="solver3x3-solution">
          <h3>Solution:</h3>
          <div>{solution}</div>
        </div>
      )}
    </div>
  );
};

export default Solver3x3Page;
