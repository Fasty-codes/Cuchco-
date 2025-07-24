import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import chessHero from '../assets/images/chess-learn-hero.jpg'; // Use a nice chess image or replace with a suitable one
const chessHero = "https://images.unsplash.com/photo-1523875194681-bedd468c58bf";

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
        <li>Moves one square in any direction: horizontally, vertically, or diagonally.<br /><span style={{ color: '#007bff', fontSize: 15 }}><b>മൂല, നേരായ, അറ്റം എന്നിവയിലായി ഒരു ചതുരം മാത്രം നീങ്ങാം.</b></span></li>
        <li>Captures by moving one square in any direction onto a square occupied by an enemy piece.<br /><span style={{ color: '#007bff', fontSize: 15 }}><b>എതിരാളിയുടെ പീസ് ഉള്ള ചതുരത്തിലേക്ക് ഒരു ചതുരം നീങ്ങി പിടിക്കാം.</b></span></li>
        <li>If the king is attacked (in check), you must get out of check on your next move.<br /><span style={{ color: '#007bff', fontSize: 15 }}><b>രാജാവിന് ചെക്ക് കിട്ടിയാൽ, അടുത്ത നീക്കത്തിൽ അതിനെ നിന്ന് രക്ഷപ്പെടണം.</b></span></li>
        <li>If the king is checkmated, the game is over.<br /><span style={{ color: '#007bff', fontSize: 15 }}><b>രാജാവ് ചെക്ക്മേറ്റായാൽ കളി അവസാനിക്കും.</b></span></li>
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
        <li>Moves any number of squares in any direction: horizontally, vertically, or diagonally.<br /><span style={{ color: '#a020f0', fontSize: 15 }}><b>ക്വീൻക്ക് ഏത് ദിശയിലേക്കും എത്രയും ദൂരം നീങ്ങാം.</b></span></li>
        <li>Captures by moving to a square occupied by an enemy piece in any direction.<br /><span style={{ color: '#a020f0', fontSize: 15 }}><b>ഏത് ദിശയിലായാലും എതിരാളിയുടെ പീസ് ഉള്ള ചതുരത്തിലേക്ക് നീങ്ങി പിടിക്കാം.</b></span></li>
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
        <li>Moves any number of squares vertically or horizontally.<br /><span style={{ color: '#222', fontSize: 15 }}><b>നേരായ വരകളിൽ (അടിവര, തൊട്ടുവര) എത്രയും ദൂരം നീങ്ങാം.</b></span></li>
        <li>Captures by moving to a square occupied by an enemy piece vertically or horizontally.<br /><span style={{ color: '#222', fontSize: 15 }}><b>നേരായ വരകളിൽ എതിരാളിയുടെ പീസ് ഉള്ള ചതുരത്തിലേക്ക് നീങ്ങി പിടിക്കാം.</b></span></li>
        <li>Participates in castling with the king.<br /><span style={{ color: '#222', fontSize: 15 }}><b>രാജാവിനൊപ്പം കാസ്റ്റ്ലിംഗ് ചെയ്യാൻ റൂക്ക് ഉപയോഗിക്കുന്നു.</b></span></li>
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
        <li>Moves any number of squares diagonally.<br /><span style={{ color: '#28a745', fontSize: 15 }}><b>ബിഷപ്പ് കോണുകളിൽ മാത്രം എത്രയും ദൂരം നീങ്ങാം.</b></span></li>
        <li>Captures by moving to a square occupied by an enemy piece diagonally.<br /><span style={{ color: '#28a745', fontSize: 15 }}><b>കോണുകളിൽ എതിരാളിയുടെ പീസ് ഉള്ള ചതുരത്തിലേക്ക് നീങ്ങി പിടിക്കാം.</b></span></li>
        <li>Each bishop stays on one color for the whole game.<br /><span style={{ color: '#28a745', fontSize: 15 }}><b>ഒരു ബിഷപ്പ് മുഴുവൻ കളിയിലും ഒരേ നിറത്തിലുള്ള ചതുരങ്ങളിൽ മാത്രം നീങ്ങും.</b></span></li>
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
        <li>Moves in an L-shape: two squares in one direction, then one square perpendicular.<br /><span style={{ color: '#e67e22', fontSize: 15 }}><b>നൈറ്റ് രണ്ട് ചതുരം നേരെ, ഒന്ന് വലത്തോ ഇടത്തോ എന്നിങ്ങനെ L-ആകൃതിയിൽ നീങ്ങും.</b></span></li>
        <li>Captures by moving to a square occupied by an enemy piece in an L-shape.<br /><span style={{ color: '#e67e22', fontSize: 15 }}><b>L-ആകൃതിയിൽ എതിരാളിയുടെ പീസ് ഉള്ള ചതുരത്തിലേക്ക് നീങ്ങി പിടിക്കാം.</b></span></li>
        <li>Can jump over other pieces.<br /><span style={{ color: '#e67e22', fontSize: 15 }}><b>മറ്റ് പീസുകളെ മുകളിൽ നിന്ന് ചാടാൻ കഴിയും.</b></span></li>
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
        <li>Moves forward one square.<br /><span style={{ color: '#b58863', fontSize: 15 }}><b>പോൺ മുന്നോട്ട് മാത്രം ഒരു ചതുരം നീങ്ങാം.</b></span></li>
        <li>Can move two squares forward from its starting position.<br /><span style={{ color: '#b58863', fontSize: 15 }}><b>ആദ്യ നീക്കത്തിൽ മാത്രം രണ്ട് ചതുരം മുന്നോട്ട് നീങ്ങാം.</b></span></li>
        <li>Captures one square diagonally forward.<br /><span style={{ color: '#b58863', fontSize: 15 }}><b>മുന്നോട്ട് കോണിൽ ഒരു ചതുരം നീങ്ങി എതിരാളിയുടെ പീസ് പിടിക്കാം.</b></span></li>
        <li>Promotes to a Queen, Rook, Bishop, or Knight upon reaching the last rank.<br /><span style={{ color: '#b58863', fontSize: 15 }}><b>അവസാന വരിയിലെത്തുമ്പോൾ പോൺ വലിയ പീസായി മാറാം.</b></span></li>
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

// Add General Chess Rules section before the PIECES rendering in ChessLearnPage
const GENERAL_RULES = [
  {
    title: 'Check',
    en: 'When the king is under direct attack, it is in check. You must make a move to get out of check.',
    ml: 'രാജാവ് നേരിട്ട് ആക്രമിക്കപ്പെടുമ്പോൾ അതിനെ ചെക്ക് എന്ന് പറയുന്നു. ചെക്കിൽ നിന്ന് രക്ഷപ്പെടണം.'
  },
  {
    title: 'Checkmate',
    en: 'If the king is in check and cannot escape, it is checkmate. The game ends immediately.',
    ml: 'ചെക്കിൽ നിന്ന് രാജാവിന് രക്ഷയില്ലെങ്കിൽ അതാണ് ചെക്ക്മേറ്റ്. കളി ഉടൻ അവസാനിക്കും.'
  },
  {
    title: 'Stalemate',
    en: 'If a player has no legal moves and is not in check, it is stalemate. The game is a draw.',
    ml: 'ഒരു കളിക്കാരന് നിയമപ്രകാരമുള്ള നീക്കങ്ങളൊന്നുമില്ല, പക്ഷേ രാജാവ് ചെക്കിലല്ലെങ്കിൽ അത് സ്റ്റെയിൽമേറ്റ്. കളി സമം.'
  },
  {
    title: 'Draw',
    en: 'A game can end in a draw for several reasons: stalemate, insufficient material, threefold repetition, or agreement.',
    ml: 'സ്റ്റെയിൽമേറ്റ്, മതിയായ പീസുകൾ ഇല്ലായ്മ, മൂന്നു പ്രാവശ്യം ആവർത്തനം, അല്ലെങ്കിൽ ഇരുവരുടെയും സമ്മതം എന്നിവ കാരണം കളി സമമായി തീരാം.'
  },
  {
    title: 'Castling',
    en: 'A special move involving the king and a rook. The king moves two squares towards a rook, and the rook jumps over the king. Conditions: neither piece has moved, no pieces between them, and the king is not in check or passing through check.',
    ml: 'രാജാവും റൂക്കും ചേർന്ന് ചെയ്യുന്ന പ്രത്യേക നീക്കം. രാജാവ് രണ്ട് ചതുരം റൂക്കിന്റെ ദിശയിലേക്ക് നീങ്ങും, റൂക്ക് രാജാവിനെ കടന്ന് അടുത്ത് വരും. ഇരുവരും മുമ്പ് നീങ്ങിയിട്ടില്ല, ഇടയിൽ പീസുകളില്ല, രാജാവ് ചെക്കിലല്ല, ചെക്കിലൂടെ കടന്നുപോകുന്നില്ല എന്നിങ്ങനെയുള്ള നിബന്ധനകൾ.'
  },
  {
    title: 'En Passant',
    en: 'A special pawn capture. If an opponent’s pawn moves two squares forward from its starting position and lands next to your pawn, you can capture it as if it had moved only one square.',
    ml: 'പോൺ ചെയ്യാവുന്ന പ്രത്യേക പിടിത്തം. എതിരാളിയുടെ പോൺ ആദ്യ നീക്കത്തിൽ രണ്ട് ചതുരം മുന്നോട്ട് വരുമ്പോൾ, അതിന്റെ പക്കൽ നിൽക്കുന്ന നിങ്ങളുടെ പോൺ അതിനെ ഒരു ചതുരം നീങ്ങിയതുപോലെ പിടിക്കാം.'
  },
  {
    title: 'Pawn Promotion',
    en: 'When a pawn reaches the last rank, it can be promoted to a queen, rook, bishop, or knight.',
    ml: 'പോൺ അവസാന വരിയിലെത്തുമ്പോൾ അത് ക്വീൻ, റൂക്ക്, ബിഷപ്പ്, അല്ലെങ്കിൽ നൈറ്റ് ആയി മാറ്റാം.'
  },
];

// Add a mapping for Malayalam piece names
const PIECE_ML_NAMES = {
  King: 'രാജാവ്',
  Queen: 'റാണി',
  Rook: 'രഥം',
  Bishop: 'ആന',
  Knight: 'കുതിര',
  Pawn: 'പോൺ',
};

const englishVideos = {
  King: "https://www.youtube.com/embed/JWCbRxsybjg",
  Queen: "https://www.youtube.com/embed/_xTYIIRzIug",
  Rook: "https://www.youtube.com/embed/PlgnoYqsK-8",
  Bishop: "https://www.youtube.com/embed/_y3eA21rD1w",
  Knight: "https://www.youtube.com/embed/N6EWk8xd6FM",
  Pawn: "https://www.youtube.com/embed/gODqPoBbVgU",
};

const malayalamVideos = {
  King: "https://www.youtube.com/embed/-Zr87Ky0i0s",
  Queen: null, // No Malayalam video found
  Rook: null,  // No Malayalam video found
  Bishop: "https://www.youtube.com/embed/m0L-1NUwuZY",
  Knight: null, // No Malayalam video found
  Pawn: "https://www.youtube.com/embed/nQaUhL8StWY",
};

const CHESS_CARDS = [
  { label: 'Piece Rules', icon: 'fa-chess', route: '/learn/chess/piece-rules' },
  { label: 'Show It', icon: 'fa-eye', route: '/learn/chess/show-it' },
  { label: 'Openings', icon: 'fa-chess-board', route: '/learn/chess/openings' },
  { label: 'Tactics', icon: 'fa-bolt', route: '/learn/chess/tactics' },
  { label: 'Endgames', icon: 'fa-flag-checkered', route: '/learn/chess/endgames' },
  { label: 'Puzzles', icon: 'fa-puzzle-piece', route: '/learn/chess/puzzles' },
];

const ChessHomePage = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  // Content for each card
  const cardContents = {
    'Piece Rules': (
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: '#007bff', fontSize: 24, marginBottom: 16 }}>Chess Piece Rules</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {PIECES.map(piece => (
            <div key={piece.name} style={{ background: '#f8f9fa', borderRadius: 12, padding: 20, minWidth: 280, maxWidth: 340, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <i className={`fa ${piece.icon}`} style={{ fontSize: 32, color: piece.color }} aria-hidden="true"></i>
                <span style={{ fontSize: 22, fontWeight: 700 }}>{piece.name}</span>
              </div>
              <div style={{ color: '#555', fontSize: 16, marginBottom: 10 }}>{piece.importance}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 10 }}>{piece.desc}</div>
              {piece.rules}
              {piece.diagrams && (
                <div style={{ marginTop: 10 }}>
                  {piece.diagrams.map(diag => (
                    <div key={diag.type} style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 600 }}>{diag.label}:</span>
                      <PawnRuleDiagram type={diag.type} />
                    </div>
                  ))}
                </div>
              )}
              {!piece.diagrams && (
                <PieceBoard piece={piece.name} icon={piece.icon} color={piece.color} />
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    'Show It': (
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: '#007bff', fontSize: 24, marginBottom: 16 }}>Show It: Visualize Chess Moves</h3>
        <p>See how each piece moves on the board. Click a piece name to highlight its moves and watch a 3D demonstration video:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          {PIECES.map(piece => (
            <button key={piece.name} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #007bff', background: '#fff', color: '#007bff', fontWeight: 600, cursor: 'pointer', marginBottom: 8, minWidth: 90 }} onClick={() => setExpandedCard('Show It-' + piece.name)}>{piece.name}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {PIECES.map(piece => (
            expandedCard === 'Show It-' + piece.name && (
              <div key={piece.name} style={{
                margin: '16px auto',
                width: '100%',
                maxWidth: 420,
                background: '#f8f9fa',
                borderRadius: 12,
                padding: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <h4 style={{ color: piece.color, fontSize: 20, marginBottom: 10 }}>{piece.name} Moves</h4>
                <div style={{ width: '100%', maxWidth: 340, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                  <PieceBoard piece={piece.name} icon={piece.icon} color={piece.color} />
                </div>
                {/* 3D Video Section */}
                <div style={{ width: '100%', marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#444', marginBottom: 8 }}>3D Working Video</span>
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                    <iframe
                      src={englishVideos[piece.name] || 'https://www.youtube.com/embed/ye9KQIGTwgE'}
                      title={piece.name + ' 3D Chess Demo'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    />
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    ),
    'Openings': (
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: '#007bff', fontSize: 24, marginBottom: 16 }}>Chess Openings</h3>
        <p>Chess openings are the first moves of a chess game. Good openings help you control the center and develop your pieces. Here are a few famous openings:</p>
        <ul style={{ textAlign: 'left', maxWidth: 500, margin: '0 auto', fontSize: 18 }}>
          <li><b>Italian Game:</b> 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5</li>
          <li><b>Sicilian Defense:</b> 1.e4 c5</li>
          <li><b>French Defense:</b> 1.e4 e6</li>
          <li><b>Queen's Gambit:</b> 1.d4 d5 2.c4</li>
          <li><b>King's Indian Defense:</b> 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7</li>
        </ul>
        <p style={{ marginTop: 12, color: '#555' }}>Tip: Develop your pieces, control the center, and keep your king safe!</p>
      </div>
    ),
    'Tactics': (
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: '#007bff', fontSize: 24, marginBottom: 16 }}>Chess Tactics</h3>
        <p>Chess tactics are short-term combinations that win material or deliver checkmate. Here are some key tactics:</p>
        <ul style={{ textAlign: 'left', maxWidth: 500, margin: '0 auto', fontSize: 18 }}>
          <li><b>Fork:</b> One piece attacks two or more enemy pieces at once.</li>
          <li><b>Pin:</b> A piece cannot move without exposing a more valuable piece behind it.</li>
          <li><b>Skewer:</b> A valuable piece is attacked and must move, exposing a less valuable piece behind it.</li>
          <li><b>Discovered Attack:</b> Moving one piece reveals an attack from another.</li>
          <li><b>Double Check:</b> Two pieces deliver check at the same time.</li>
        </ul>
        <p style={{ marginTop: 12, color: '#555' }}>Tip: Look for tactical opportunities in every position!</p>
      </div>
    ),
    'Endgames': (
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: '#007bff', fontSize: 24, marginBottom: 16 }}>Chess Endgames</h3>
        <p>The endgame is when there are few pieces left. Here are some important endgame concepts:</p>
        <ul style={{ textAlign: 'left', maxWidth: 500, margin: '0 auto', fontSize: 18 }}>
          <li><b>King and Pawn vs. King:</b> Learn how to promote your pawn.</li>
          <li><b>Opposition:</b> Use your king to control key squares.</li>
          <li><b>Lucena Position:</b> A winning technique with a rook and pawn vs. rook.</li>
          <li><b>Philidor Position:</b> A drawing technique with a rook and pawn vs. rook.</li>
          <li><b>Basic Checkmates:</b> Practice checkmating with queen, rook, or two bishops.</li>
        </ul>
        <p style={{ marginTop: 12, color: '#555' }}>Tip: Activate your king in the endgame!</p>
      </div>
    ),
    'Puzzles': (
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: '#007bff', fontSize: 24, marginBottom: 16 }}>Chess Puzzles</h3>
        <p>Try to solve these classic chess puzzles:</p>
        <ul style={{ textAlign: 'left', maxWidth: 500, margin: '0 auto', fontSize: 18 }}>
          <li><b>Mate in 1:</b> White to move and checkmate in one move.<br/> <span style={{ color: '#007bff' }}>Example: King on e1, Queen on h5, Black King on e8. Qh5#</span></li>
          <li><b>Mate in 2:</b> White to move and checkmate in two moves.<br/> <span style={{ color: '#007bff' }}>Example: King on e1, Queen on h5, Black King on e8, pawn on f7. Qh5+ Ke7 Qf7#</span></li>
          <li><b>Find the Fork:</b> White Knight on e5, Black King on g8, Black Queen on f7. Nf7+ wins the Queen.</li>
        </ul>
        <p style={{ marginTop: 12, color: '#555' }}>Tip: Set up these positions on a board and try to solve them!</p>
      </div>
    ),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', textAlign: 'center' }}>
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
            src={chessHero}
            alt="Chess background"
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
          <h1 style={{ color: '#007bff', fontSize: 40, marginBottom: 18, textAlign: 'left' }}>Welcome to Chess Mastery</h1>
          <p style={{ fontSize: 20, color: '#444', marginBottom: 22, textAlign: 'left' }}>
            Learn chess from the ground up: master the rules, visualize moves, explore openings, sharpen your tactics, and solve puzzles. Whether you’re a total beginner or looking to level up, this is your home for chess improvement.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, flex: '1 1 320px', minWidth: 280, maxWidth: 420, padding: '0 2rem', textAlign: 'center' }}>
          <img src={chessHero} alt="Chess learning hero" style={{ width: '100%', maxWidth: 400, borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }} />
        </div>
      </section>
      <section style={{ margin: '0 auto', maxWidth: 1100, padding: '2.5rem 0 1.5rem 0' }}>
        <h2 style={{ color: '#007bff', fontSize: 30, marginBottom: 24 }}>Explore Chess Learning Paths</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
          {CHESS_CARDS.map(card => (
            <div
              key={card.label}
              onClick={() => setExpandedCard(expandedCard === card.label ? null : card.label)}
              style={{
                background: '#fff',
                border: expandedCard === card.label ? '2.5px solid #007bff' : '2.5px solid #e0e7ef',
                borderRadius: 18,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                padding: '2.1rem 2.2rem',
                fontWeight: 600,
                fontSize: 22,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                minWidth: 210,
                justifyContent: 'center',
                color: '#007bff',
                textDecoration: 'none',
                transition: 'all 0.18s',
                position: 'relative',
                cursor: 'pointer',
                flexDirection: 'column',
                marginBottom: expandedCard === card.label ? 0 : 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <i className={`fa ${card.icon}`} style={{ fontSize: 30, marginRight: 10 }} aria-hidden="true"></i>
                {card.label}
                <i className={`fa fa-chevron-${expandedCard === card.label ? 'down' : 'right'}`} style={{ fontSize: 18, marginLeft: 14, color: '#007bff', opacity: 0.7 }} aria-hidden="true"></i>
              </div>
              {expandedCard === card.label && (
                <div style={{ width: '100%', marginTop: 18, borderTop: '1px solid #e0e7ef', paddingTop: 18 }}>
                  {cardContents[card.label]}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ChessHomePage; 