import React from 'react';

const BOARD_SIZE = 8;
const CENTER = 3; // 0-indexed, so (3,3) is d4

const PIECE_META = {
  King: {
    importance: 'Most important piece',
    desc: 'The King must be protected at all costs. If it is checkmated, the game is over.',
    ml: 'രാജാവിനെ എപ്പോഴും സംരക്ഷിക്കണം. രാജാവ് ചെക്ക്മേറ്റായാൽ കളി അവസാനിക്കും.'
  },
  Queen: {
    importance: 'Most powerful piece',
    desc: 'The Queen can move any number of squares in any direction.',
    ml: 'ക്വീൻ ഏത് ദിശയിലേക്കും എത്രയും ദൂരം നീങ്ങാം. ഏറ്റവും ശക്തമായ പീസ്.'
  },
  Rook: {
    importance: 'Valuable for castling',
    desc: 'The Rook moves in straight lines and is key for castling.',
    ml: 'റൂക്ക് നേരായ വരകളിൽ നീങ്ങുന്നു. കാസ്റ്റ്ലിംഗിന് പ്രധാനപ്പെട്ടതാണ്.'
  },
  Bishop: {
    importance: 'Long-range piece',
    desc: 'The Bishop moves diagonally and controls long diagonals.',
    ml: 'ബിഷപ്പ് കോണുകളിൽ നീങ്ങുന്നു. ഒരേ നിറത്തിലുള്ള ചതുരങ്ങളിൽ മാത്രം നീങ്ങും.'
  },
  Knight: {
    importance: 'Unique jumper',
    desc: 'The Knight moves in an L-shape and can jump over pieces.',
    ml: 'നൈറ്റ് എൽ-ആകൃതിയിൽ നീങ്ങുന്നു. മറ്റ് പീസുകളെ മുകളിൽ നിന്ന് ചാടാം.'
  },
  Pawn: {
    importance: 'Numerous and promotable',
    desc: 'Pawns move forward and can promote to any major piece.',
    ml: 'പോൺ മുന്നോട്ട് മാത്രം നീങ്ങും. അവസാന വരിയിലെത്തുമ്പോൾ മറ്റേതെങ്കിലും വലിയ പീസായി മാറാം.'
  }
};

function getMoves(piece) {
  const moves = [];
  const add = (r, c) => {
    if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && !(r === CENTER && c === CENTER)) {
      moves.push([r, c]);
    }
  };
  switch (piece) {
    case 'King':
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) add(CENTER + dr, CENTER + dc);
      break;
    case 'Queen':
      for (let d = 1; d < BOARD_SIZE; d++) {
        for (let [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]) {
          add(CENTER + dr*d, CENTER + dc*d);
        }
      }
      break;
    case 'Rook':
      for (let d = 1; d < BOARD_SIZE; d++) {
        add(CENTER + d, CENTER);
        add(CENTER - d, CENTER);
        add(CENTER, CENTER + d);
        add(CENTER, CENTER - d);
      }
      break;
    case 'Bishop':
      for (let d = 1; d < BOARD_SIZE; d++) {
        add(CENTER + d, CENTER + d);
        add(CENTER - d, CENTER - d);
        add(CENTER + d, CENTER - d);
        add(CENTER - d, CENTER + d);
      }
      break;
    case 'Knight':
      for (let [dr, dc] of [[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[1,2],[1,-2],[1,2]]) {
        add(CENTER + dr, CENTER + dc);
      }
      break;
    case 'Pawn':
      add(CENTER - 1, CENTER); // one forward
      add(CENTER - 2, CENTER); // two forward
      add(CENTER - 1, CENTER - 1); // capture left
      add(CENTER - 1, CENTER + 1); // capture right
      break;
    default:
      break;
  }
  return moves;
}

// Capturing diagram for all pieces
function CaptureDiagram({ piece, icon, color }) {
  // Place the piece in the center, enemy in a typical capture square
  const board = Array.from({ length: 8 }, (_, r) => Array(8).fill(null));
  board[CENTER][CENTER] = 'piece';
  let captureSquares = [];
  let enemy = null;
  switch (piece) {
    case 'King':
      captureSquares = [[CENTER - 1, CENTER - 1]];
      enemy = [[CENTER - 1, CENTER - 1]];
      break;
    case 'Queen':
      captureSquares = [[CENTER - 2, CENTER - 2]];
      enemy = [[CENTER - 2, CENTER - 2]];
      break;
    case 'Rook':
      captureSquares = [[CENTER, CENTER + 2]];
      enemy = [[CENTER, CENTER + 2]];
      break;
    case 'Bishop':
      captureSquares = [[CENTER + 2, CENTER - 2]];
      enemy = [[CENTER + 2, CENTER - 2]];
      break;
    case 'Knight':
      captureSquares = [[CENTER - 2, CENTER - 1]];
      enemy = [[CENTER - 2, CENTER - 1]];
      break;
    case 'Pawn':
      captureSquares = [[CENTER - 1, CENTER - 1]];
      enemy = [[CENTER - 1, CENTER - 1]];
      break;
    default:
      break;
  }
  const squareSize = 28;
  return (
    <div style={{ display: 'inline-block', margin: 8 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        width: squareSize * 8,
        height: squareSize * 8,
        border: '1.5px solid #bbb',
        borderRadius: 6,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {[...Array(64)].map((_, idx) => {
          const r = Math.floor(idx / 8);
          const c = idx % 8;
          const isLight = (r + c) % 2 === 0;
          const isCapture = captureSquares.some(([hr, hc]) => hr === r && hc === c);
          let bg = isCapture ? '#ffdddd' : isLight ? '#f0d9b5' : '#b58863';
          return (
            <div key={idx} style={{
              background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              position: 'relative',
              border: '1px solid #eee',
              width: squareSize, height: squareSize
            }}>
              {board[r][c] === 'piece' && <i className={`fa ${icon}`} style={{ color, fontSize: 18 }} aria-hidden="true"></i>}
              {enemy && enemy.some(([er, ec]) => er === r && ec === c) && <i className="fa fa-chess-pawn" style={{ color: '#d00', fontSize: 18, opacity: 0.8 }} aria-hidden="true" title="Enemy piece" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Pawn-specific diagrams (unchanged)
function PawnRuleDiagram({ type }) {
  const pawnRow = 5, pawnCol = 3;
  const board = Array.from({ length: 8 }, (_, r) => Array(8).fill(null));
  board[pawnRow][pawnCol] = 'pawn';
  let highlights = [];
  let promo = null;
  if (type === 'single') {
    highlights = [[pawnRow - 1, pawnCol]];
  } else if (type === 'double') {
    highlights = [[pawnRow - 2, pawnCol]];
  } else if (type === 'capture') {
    highlights = [[pawnRow - 1, pawnCol - 1], [pawnRow - 1, pawnCol + 1]];
    board[pawnRow - 1][pawnCol - 1] = 'enemy';
    board[pawnRow - 1][pawnCol + 1] = 'enemy';
  } else if (type === 'promotion') {
    highlights = [[0, pawnCol]];
    promo = true;
  }
  const squareSize = 28;
  return (
    <div style={{ display: 'inline-block', margin: 8 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        width: squareSize * 8,
        height: squareSize * 8,
        border: '1.5px solid #bbb',
        borderRadius: 6,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {[...Array(64)].map((_, idx) => {
          const r = Math.floor(idx / 8);
          const c = idx % 8;
          const isLight = (r + c) % 2 === 0;
          const isHighlight = highlights.some(([hr, hc]) => hr === r && hc === c);
          let bg = isHighlight ? '#dbeafe' : isLight ? '#f0d9b5' : '#b58863';
          return (
            <div key={idx} style={{
              background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              position: 'relative',
              border: '1px solid #eee',
              width: squareSize, height: squareSize
            }}>
              {board[r][c] === 'pawn' && <i className="fa fa-chess-pawn" style={{ color: '#b58863', fontSize: 18 }} aria-hidden="true"></i>}
              {board[r][c] === 'enemy' && <i className="fa fa-chess-pawn" style={{ color: '#d00', fontSize: 18, opacity: 0.7 }} aria-hidden="true"></i>}
              {promo && r === 0 && c === pawnCol && <i className="fa fa-chess-queen" style={{ color: '#a020f0', fontSize: 18, marginLeft: 2 }} aria-hidden="true" title="Promoted"></i>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PIECES = [
  {
    name: 'King',
    icon: 'fa-chess-king',
    color: '#007bff',
    ...PIECE_META.King,
    rules: (
      <ol style={{ textAlign: 'left', fontSize: 18, margin: '0 auto 0 auto', maxWidth: 350, paddingLeft: 24 }}>
        <li>Moves one square in any direction: horizontally, vertically, or diagonally.</li>
        <li>Captures by moving one square in any direction onto a square occupied by an enemy piece.</li>
        <li>If the king is attacked (in check), you must get out of check on your next move.</li>
        <li>If the king is checkmated, the game is over.</li>
      </ol>
    )
  },
  {
    name: 'Queen',
    icon: 'fa-chess-queen',
    color: '#a020f0',
    ...PIECE_META.Queen,
    rules: (
      <ol style={{ textAlign: 'left', fontSize: 18, margin: '0 auto 0 auto', maxWidth: 350, paddingLeft: 24 }}>
        <li>Moves any number of squares in any direction: horizontally, vertically, or diagonally.</li>
        <li>Captures by moving to a square occupied by an enemy piece in any direction.</li>
      </ol>
    )
  },
  {
    name: 'Rook',
    icon: 'fa-chess-rook',
    color: '#222',
    ...PIECE_META.Rook,
    rules: (
      <ol style={{ textAlign: 'left', fontSize: 18, margin: '0 auto 0 auto', maxWidth: 350, paddingLeft: 24 }}>
        <li>Moves any number of squares vertically or horizontally.</li>
        <li>Captures by moving to a square occupied by an enemy piece vertically or horizontally.</li>
        <li>Participates in castling with the king.</li>
      </ol>
    )
  },
  {
    name: 'Bishop',
    icon: 'fa-chess-bishop',
    color: '#28a745',
    ...PIECE_META.Bishop,
    rules: (
      <ol style={{ textAlign: 'left', fontSize: 18, margin: '0 auto 0 auto', maxWidth: 350, paddingLeft: 24 }}>
        <li>Moves any number of squares diagonally.</li>
        <li>Captures by moving to a square occupied by an enemy piece diagonally.</li>
        <li>Each bishop stays on one color for the whole game.</li>
      </ol>
    )
  },
  {
    name: 'Knight',
    icon: 'fa-chess-knight',
    color: '#e67e22',
    ...PIECE_META.Knight,
    rules: (
      <ol style={{ textAlign: 'left', fontSize: 18, margin: '0 auto 0 auto', maxWidth: 350, paddingLeft: 24 }}>
        <li>Moves in an L-shape: two squares in one direction, then one square perpendicular.</li>
        <li>Captures by moving to a square occupied by an enemy piece in an L-shape.</li>
        <li>Can jump over other pieces.</li>
      </ol>
    )
  },
  {
    name: 'Pawn',
    icon: 'fa-chess-pawn',
    color: '#b58863',
    ...PIECE_META.Pawn,
    rules: (
      <ol style={{ textAlign: 'left', fontSize: 18, margin: '0 auto 0 auto', maxWidth: 350, paddingLeft: 24 }}>
        <li>Moves forward one square.</li>
        <li>Can move two squares forward from its starting position.</li>
        <li>Captures one square diagonally forward.</li>
        <li>Promotes to a Queen, Rook, Bishop, or Knight upon reaching the last rank.</li>
      </ol>
    ),
    diagrams: [
      { type: 'single', label: 'Single move' },
      { type: 'double', label: 'Double move (from start)' },
      { type: 'capture', label: 'Capturing' },
      { type: 'promotion', label: 'Promotion' },
    ]
  },
];

function PieceBoard({ piece, icon, color }) {
  const moves = getMoves(piece);
  // Make the knight's board smaller and reduce margin for compactness
  const isKnight = piece === 'Knight';
  const boardSize = isKnight ? 200 : 340;
  const fontSizeCenter = isKnight ? 22 : 32;
  const fontSizeOther = isKnight ? 22 : 36;
  const borderRadius = isKnight ? 8 : 12;
  const margin = isKnight ? '0 auto 0 auto' : '0 auto 0 auto';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
      gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
      width: boardSize,
      height: boardSize,
      margin,
      border: '2px solid #bbb',
      borderRadius: borderRadius,
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      background: '#fff',
      overflow: 'hidden',
    }}>
      {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, idx) => {
        const r = Math.floor(idx / BOARD_SIZE);
        const c = idx % BOARD_SIZE;
        const isCenter = r === CENTER && c === CENTER;
        const isMove = moves.some(([mr, mc]) => mr === r && mc === c);
        const isLight = (r + c) % 2 === 0;
        return (
          <div
            key={idx}
            style={{
              background: isMove
                ? color + '33'
                : isLight
                ? '#f0d9b5'
                : '#b58863',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isCenter ? fontSizeCenter : fontSizeOther,
              fontWeight: isCenter ? 700 : 400,
              position: 'relative',
              border: '1px solid #eee',
              transition: 'background 0.2s',
            }}
          >
            {isCenter ? (
              <i className={`fa ${icon}`} style={{ color, fontSize: fontSizeCenter }} aria-hidden="true"></i>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// In the card rendering, reduce minHeight and marginBottom for knight's rules
const ChessLearnPage = () => (
  <div style={{ minHeight: '100vh', padding: '2rem 0', background: '#f7f9fb', textAlign: 'center' }}>
    <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>Learn Chess: Piece Rules</h1>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3.5rem', marginTop: 32 }}>
      {PIECES.map(piece => (
        <div key={piece.name} style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.5rem 2rem', width: 470, textAlign: 'center', transition: 'transform 0.2s', border: `3px solid ${piece.color}` }}>
          <i className={`fa ${piece.icon}`} style={{ fontSize: 70, color: piece.color, marginBottom: 8 }} aria-hidden="true"></i>
          <h2 style={{ fontSize: 32, color: piece.color, margin: '0 0 6px 0' }}>{piece.name}</h2>
          <div style={{ fontWeight: 600, color: '#555', fontSize: 18, marginBottom: 2 }}>{piece.importance}</div>
          <div style={{ color: '#666', fontSize: 16, marginBottom: 2 }}>{piece.desc}</div>
          <div style={{ color: '#3b3b3b', fontSize: 15, fontStyle: 'italic', marginBottom: 10 }}>{PIECE_META[piece.name].ml}</div>
          <div style={{ fontSize: 20, color: '#444', minHeight: piece.name === 'Knight' ? 30 : 80, marginBottom: piece.name === 'Knight' ? 8 : 18 }}>{piece.rules}</div>
          {piece.name === 'Pawn' && (
            <div style={{ margin: '12px 0 18px 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
              {piece.diagrams.map(d => (
                <div key={d.type} style={{ textAlign: 'center' }}>
                  <PawnRuleDiagram type={d.type} />
                  <div style={{ fontSize: 15, color: '#555', marginTop: 2 }}>{d.label}</div>
                </div>
              ))}
            </div>
          )}
          {piece.name !== 'Pawn' && (
            <div style={{ margin: piece.name === 'Knight' ? '8px 0 8px 0' : '12px 0 18px 0', textAlign: 'center' }}>
              <CaptureDiagram piece={piece.name} icon={piece.icon} color={piece.color} />
              <div style={{ fontSize: 15, color: '#555', marginTop: 2 }}>Capturing</div>
            </div>
          )}
          <PieceBoard piece={piece.name} icon={piece.icon} color={piece.color} />
        </div>
      ))}
    </div>
  </div>
);

export default ChessLearnPage; 