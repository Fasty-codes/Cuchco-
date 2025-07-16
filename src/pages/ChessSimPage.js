import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { useAuth } from '../context/AuthContext';
import './ChessSimPage.css'; // For custom animations and styles
import { useNavigate } from 'react-router-dom';

const PIECE_UNICODE = {
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚',
  P: '♙', N: '♘', B: '♗', R: '♖', Q: '♕', K: '♔',
};

const highlightColor = '#b6fcb6';

const BOT_PROFILES = {
  beginner: {
    name: 'Cuchco Bot',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Bot',
    level: 'Beginner',
    logic: 'beginner',
  },
  intermediate: {
    name: 'Chessy',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Chessy',
    level: 'Intermediate',
    logic: 'intermediate',
  },
  advanced: {
    name: 'Stockfish Jr.',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Stockfish',
    level: 'Advanced',
    logic: 'advanced',
  },
};
const USER_PROFILE = {
  name: 'You',
  avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=You',
};

const PIECE_ORDER = ['q', 'r', 'b', 'n', 'p'];

function getSquareColor(i, j) {
  return (i + j) % 2 === 0 ? '#f0d9b5' : '#b58863';
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function getPieceSymbol(piece) {
  if (!piece) return '';
  const symbol = PIECE_UNICODE[piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()];
  return symbol;
}

function getMoveNotation(move) {
  // Use move.san if available, fallback to from-to
  return move.san || `${move.from}-${move.to}`;
}

function getBestCaptureMove(game, moves) {
  // Simple: prefer move with highest captured piece value
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  let best = null;
  let bestValue = -1;
  for (const m of moves) {
    if (m.captured) {
      const v = values[m.captured] || 0;
      if (v > bestValue) {
        best = m;
        bestValue = v;
      }
    }
  }
  return best;
}

function getTakenPiecesGrouped(history, capturerColor) {
  // capturerColor: 'w' for user, 'b' for bot
  const taken = {};
  for (const move of history) {
    if (move.captured && move.color === capturerColor) {
      taken[move.captured] = (taken[move.captured] || 0) + 1;
    }
  }
  return taken;
}

const ChessSimPage = () => {
  const { user } = useAuth();
  const [game, setGame] = useState(new Chess());
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [board, setBoard] = useState(game.board());
  const [legalMoves, setLegalMoves] = useState([]);
  const [userTime, setUserTime] = useState(0);
  const [botTime, setBotTime] = useState(0);
  const [activeTimer, setActiveTimer] = useState('user');
  const [userColor, setUserColor] = useState(null); // 'w' or 'b'
  const [showSetupModal, setShowSetupModal] = useState(true);
  const [showWhiteBegins, setShowWhiteBegins] = useState(false);
  const [botType, setBotType] = useState('beginner');
  const [moveHistory, setMoveHistory] = useState([]);
  const timerRef = useRef();
  const [pendingSetup, setPendingSetup] = useState({ color: 'w', bot: 'beginner' });
  const [gameStarted, setGameStarted] = useState(false);
  const navigate = useNavigate();

  // Board orientation: flip for black
  const getDisplayBoard = () => {
    if (userColor === 'b') {
      return [...board].reverse().map(row => [...row].reverse());
    }
    return board;
  };

  useEffect(() => {
    setBoard(game.board());
    setMoveHistory(game.history({ verbose: true }));
    if (game.isCheckmate()) setStatus('Checkmate!');
    else if (game.isDraw()) setStatus('Draw!');
    else if (game.isStalemate()) setStatus('Stalemate!');
    else if (game.isCheck()) setStatus('Check!');
    else setStatus('');
  }, [game]);

  // Timer logic
  useEffect(() => {
    if (!userColor || game.isGameOver()) {
      clearInterval(timerRef.current);
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if ((game.turn() === userColor)) {
        setUserTime(t => t + 100);
        setActiveTimer('user');
      } else {
        setBotTime(t => t + 100);
        setActiveTimer('bot');
      }
    }, 100);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [game, userColor]);

  // Bot move logic
  useEffect(() => {
    if (!userColor) return;
    if (game.turn() !== userColor && !game.isGameOver()) {
      setTimeout(() => {
        const moves = game.moves({ verbose: true });
        let move;
        if (botType === 'beginner') {
          move = moves[Math.floor(Math.random() * moves.length)];
        } else if (botType === 'intermediate') {
          // Prefer captures or checks
          const captures = moves.filter(m => m.captured);
          const checks = moves.filter(m => m.san && m.san.includes('+'));
          if (captures.length > 0) move = captures[Math.floor(Math.random() * captures.length)];
          else if (checks.length > 0) move = checks[Math.floor(Math.random() * checks.length)];
          else move = moves[Math.floor(Math.random() * moves.length)];
        } else if (botType === 'advanced') {
          // Prefer best capture, else random
          move = getBestCaptureMove(game, moves) || moves[Math.floor(Math.random() * moves.length)];
        }
        if (move) {
          game.move(move.san);
          setGame(new Chess(game.fen()));
        }
      }, 600);
    }
    // eslint-disable-next-line
  }, [game, userColor, botType]);

  // Show 'White begins!' if user is white and just selected color
  useEffect(() => {
    if (userColor === 'w') {
      setShowWhiteBegins(true);
      setTimeout(() => setShowWhiteBegins(false), 1800);
    }
  }, [userColor]);

  const handleSquareClick = (i, j) => {
    if (!userColor || game.isGameOver()) return;
    // Map display coordinates to real board
    let realI = userColor === 'b' ? 7 - i : i;
    let realJ = userColor === 'b' ? 7 - j : j;
    const square = String.fromCharCode(97 + realJ) + (8 - realI);
    if (game.turn() !== userColor) return;
    if (selected) {
      const move = { from: selected, to: square };
      const legal = game.moves({ square: selected, verbose: true }).some(m => m.to === square);
      if (legal) {
        game.move(move);
        setGame(new Chess(game.fen()));
        setSelected(null);
        setLegalMoves([]);
        return;
      }
      setSelected(null);
      setLegalMoves([]);
    } else {
      // Only allow selecting own pieces
      const piece = game.get(square);
      if (piece && piece.color === userColor) {
        setSelected(square);
        const moves = game.moves({ square, verbose: true }).map(m => m.to);
        setLegalMoves(moves);
      }
    }
  };

  const handleReset = () => {
    setGame(new Chess());
    setSelected(null);
    setLegalMoves([]);
    setUserTime(0);
    setBotTime(0);
    setActiveTimer('user');
    setShowSetupModal(true);
    setUserColor(null);
    setBotType('beginner');
  };

  const handleSetupChange = (field, value) => {
    setPendingSetup(prev => ({ ...prev, [field]: value }));
  };
  const handleStartGame = () => {
    setUserColor(pendingSetup.color);
    setBotType(pendingSetup.bot);
    setShowSetupModal(false);
    setGameStarted(true);
    setGame(new Chess());
    setSelected(null);
    setLegalMoves([]);
    setUserTime(0);
    setBotTime(0);
    setActiveTimer('user');
  };

  const handleExit = () => {
    navigate('/');
  };

  // Function to download moves as PGN
  const handleDownloadPGN = () => {
    const pgn = game.pgn();
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chess_game_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.pgn`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Use uploaded profile if available
  const userAvatar = user?.avatar || USER_PROFILE.avatar;
  const userName = user?.username || USER_PROFILE.name;

  // Board labels
  const files = userColor === 'b' ? ['h','g','f','e','d','c','b','a'] : ['a','b','c','d','e','f','g','h'];
  const ranks = userColor === 'b' ? [1,2,3,4,5,6,7,8] : [8,7,6,5,4,3,2,1];

  // For user, capturerColor is userColor; for bot, it's bot's color
  const userTakenGrouped = getTakenPiecesGrouped(moveHistory, userColor);
  const botTakenGrouped = getTakenPiecesGrouped(moveHistory, userColor === 'w' ? 'b' : 'w');

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 12 }}>Chess Simulator</h1>
      {/* Setup modal with Start button */}
      {showSetupModal && (
        <div style={{ position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.3)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:16, padding:'32px 48px', boxShadow:'0 4px 24px rgba(0,0,0,0.15)', textAlign:'center', minWidth:340 }}>
            <h2 style={{ color:'#007bff', marginBottom:24 }}>Choose Your Side & Bot</h2>
            <div style={{ marginBottom: 24 }}>
              <button onClick={()=>handleSetupChange('color','w')} style={{margin:'0 18px', padding:'16px 32px', fontSize:22, borderRadius:10, background:pendingSetup.color==='w'?'#f0d9b5':'#eee', color:'#222', border:pendingSetup.color==='w'?'2px solid #007bff':'2px solid #ccc', fontWeight:700, cursor:'pointer'}}>White</button>
              <button onClick={()=>handleSetupChange('color','b')} style={{margin:'0 18px', padding:'16px 32px', fontSize:22, borderRadius:10, background:pendingSetup.color==='b'?'#b58863':'#eee', color:'#fff', border:pendingSetup.color==='b'?'2px solid #007bff':'2px solid #ccc', fontWeight:700, cursor:'pointer'}}>Black</button>
            </div>
            <div style={{ marginBottom: 12, fontWeight:600 }}>Bot Level:</div>
            <div style={{ display:'flex', flexDirection:'row', justifyContent:'center', gap:16, marginBottom:24 }}>
              {Object.entries(BOT_PROFILES).map(([key, bot]) => (
                <button key={key} onClick={()=>handleSetupChange('bot',key)} style={{ padding:'10px 18px', borderRadius:8, border: pendingSetup.bot===key?'2px solid #007bff':'2px solid #ccc', background:'#f7f9fb', fontWeight:600, color:'#222', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
                  <img src={bot.avatar} alt={bot.name} style={{ width:32, height:32, borderRadius:'50%' }} />
                  <span>{bot.name} <span style={{ fontSize:13, color:'#007bff' }}>({bot.level})</span></span>
                </button>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'row', justifyContent:'center', gap:18, marginTop:18 }}>
              <button onClick={handleStartGame} style={{padding:'14px 38px', fontSize:22, borderRadius:10, background:'#007bff', color:'#fff', border:'none', fontWeight:700, cursor:'pointer'}}>Start</button>
              <button onClick={handleExit} style={{padding:'14px 38px', fontSize:22, borderRadius:10, background:'#eee', color:'#222', border:'2px solid #007bff', fontWeight:700, cursor:'pointer'}}>Exit</button>
            </div>
          </div>
        </div>
      )}
      {/* White begins message */}
      {showWhiteBegins && (
        <div style={{ background:'#fffbe6', color:'#222', fontWeight:700, fontSize:24, borderRadius:8, padding:'12px 32px', marginBottom:18, boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>White begins!</div>
      )}
      {/* Profiles with active indicator and captures */}
      <div className="chess-sim-profiles">
        {/* User profile */}
        <div className="chess-sim-profile-user" style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
          <img src={userAvatar} alt="user avatar" style={{ width: 56, height: 56, borderRadius: '50%', border: activeTimer==='user'?'4px solid #007bff':'2px solid #007bff', background: '#eee', objectFit: 'cover', boxShadow: activeTimer==='user'?'0 0 0 4px #b6fcb6':'none', transition:'box-shadow 0.2s' }} />
          {activeTimer==='user' && <span style={{ position:'absolute', top:2, right:2, width:16, height:16, borderRadius:'50%', background:'#007bff', border:'2px solid #fff', boxShadow:'0 0 6px #007bff', display:'block' }}></span>}
          <div style={{ fontWeight: 700, fontSize: 22, color: '#222', marginTop: 6 }}>{userName}</div>
          <div style={{ color: userColor === 'w' ? '#f0d9b5' : '#b58863', fontWeight: 600, fontSize: 16 }}>{userColor === 'w' ? 'White' : userColor === 'b' ? 'Black' : ''}</div>
          <div className="captures-row" style={{ marginTop: 6, minHeight: 36, display: 'flex', alignItems: 'center', gap: 6, background: '#f7f9fb', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '4px 10px', fontSize: 26, transition: 'all 0.3s' }}>
            {Object.keys(userTakenGrouped).length > 0 ? PIECE_ORDER.filter(p => userTakenGrouped[p]).map((p, i) => (
              <span key={i} className="capture-anim">{getPieceSymbol({ type: p, color: userColor === 'w' ? 'b' : 'w' })}{userTakenGrouped[p] > 1 && <span style={{ fontSize: 17, fontWeight: 700, marginLeft: 2 }}>x{userTakenGrouped[p]}</span>}</span>
            )) : <span style={{ color: '#aaa', fontSize: 15 }}>No captures</span>}
          </div>
          <div style={{ marginTop: 6, fontSize: 18, color: activeTimer === 'user' ? '#007bff' : '#333', fontWeight: 600 }}>
            Your Time: {formatTime(userTime)}
          </div>
        </div>
        <div className="profile-divider"></div>
        {/* Bot profile */}
        <div className="chess-sim-profile-bot" style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
          <img src={BOT_PROFILES[botType].avatar} alt="bot avatar" style={{ width: 56, height: 56, borderRadius: '50%', border: activeTimer==='bot'?'4px solid #d00':'2px solid #007bff', background: '#eee', objectFit: 'cover', boxShadow: activeTimer==='bot'?'0 0 0 4px #ffd6d6':'none', transition:'box-shadow 0.2s' }} />
          {activeTimer==='bot' && <span style={{ position:'absolute', top:2, right:2, width:16, height:16, borderRadius:'50%', background:'#d00', border:'2px solid #fff', boxShadow:'0 0 6px #d00', display:'block' }}></span>}
          <div style={{ fontWeight: 700, fontSize: 22, color: '#222', marginTop: 6 }}>{BOT_PROFILES[botType].name}</div>
          <div style={{ color: userColor === 'w' ? '#b58863' : '#f0d9b5', fontWeight: 600, fontSize: 16 }}>{userColor === 'w' ? 'Black' : userColor === 'b' ? 'White' : ''}</div>
          <div className="captures-row" style={{ marginTop: 6, minHeight: 36, display: 'flex', alignItems: 'center', gap: 6, background: '#f7f9fb', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '4px 10px', fontSize: 26, transition: 'all 0.3s' }}>
            {Object.keys(botTakenGrouped).length > 0 ? PIECE_ORDER.filter(p => botTakenGrouped[p]).map((p, i) => (
              <span key={i} className="capture-anim">{getPieceSymbol({ type: p, color: userColor })}{botTakenGrouped[p] > 1 && <span style={{ fontSize: 17, fontWeight: 700, marginLeft: 2 }}>x{botTakenGrouped[p]}</span>}</span>
            )) : <span style={{ color: '#aaa', fontSize: 15 }}>No captures</span>}
          </div>
          <div style={{ marginTop: 6, color:'#007bff', fontWeight:600, fontSize:13 }}>{BOT_PROFILES[botType].level}</div>
          <div style={{ marginTop: 6, fontSize: 18, color: activeTimer === 'bot' ? '#d00' : '#333', fontWeight: 600 }}>
            Bot Time: {formatTime(botTime)}
          </div>
        </div>
      </div>
      {/* Board, status, and move history */}
      <div className="chess-sim-main-flex">
        <div className="chess-sim-board-wrap" style={{ border: '4px solid #222', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', position:'relative' }}>
          {/* Board labels (files) */}
          <div className="board-files-row" style={{ display:'flex', flexDirection:'row', justifyContent:'center', marginBottom:2 }}>
            {files.map(f => <div key={f} style={{ width:56, textAlign:'center', fontWeight:600, color:'#888' }}>{f}</div>)}
          </div>
          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {getDisplayBoard().map((row, i) => (
                <tr key={i}>
                  {row.map((piece, j) => {
                    const square = String.fromCharCode(97 + (userColor === 'b' ? 7-j : j)) + (userColor === 'b' ? i+1 : 8-i);
                    const isSelected = selected === square;
                    const isLegal = legalMoves.includes(square);
                    const isWhite = piece && piece.color === 'w';
                    return (
                      <td
                        key={j}
                        onClick={() => handleSquareClick(i, j)}
                        style={{
                          width: 56,
                          height: 56,
                          background: isSelected
                            ? '#ffe066'
                            : isLegal
                              ? highlightColor
                              : getSquareColor(i, j),
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          fontSize: 36,
                          cursor: userColor && game.turn() === userColor && !game.isGameOver() ? 'pointer' : 'default',
                          border: '1px solid #888',
                          userSelect: 'none',
                          transition: 'background 0.2s',
                          color: isWhite ? '#fff' : '#222',
                          textShadow: isWhite ? '0 0 2px #222, 0 0 6px #222' : 'none',
                          backgroundClip: 'padding-box',
                        }}
                      >
                        {getPieceSymbol(piece)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Board labels (ranks) */}
          <div className="board-ranks-row" style={{ display:'flex', flexDirection:'row', justifyContent:'center', marginTop:2 }}>
            {ranks.map(r => <div key={r} style={{ width:56, textAlign:'center', fontWeight:600, color:'#888' }}>{r}</div>)}
          </div>
        </div>
      </div>
      {/* Controls and move history below the board */}
      <div className="chess-sim-main-flex" style={{ marginTop:32 }}>
        <div className="move-history-list" style={{ minWidth: 220, background:'#fff', borderRadius:8, boxShadow:'0 2px 8px rgba(0,0,0,0.08)', padding:'16px 18px', marginLeft:8, overflowX:'auto' }}>
          <div style={{ fontWeight:700, color:'#007bff', fontSize:18, marginBottom:8 }}>Move History</div>
          <ol style={{ paddingLeft:18, fontSize:16, color:'#333', margin:0 }}>
            {(() => {
              const rows = [];
              for (let i = 0; i < moveHistory.length; i += 2) {
                const userMove = moveHistory[i] ? getMoveNotation(moveHistory[i]) : '';
                const botMove = moveHistory[i+1] ? getMoveNotation(moveHistory[i+1]) : '';
                rows.push(
                  <li key={i} className="move-history-row move-anim" style={{ marginBottom:4, display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontWeight:700, color:'#007bff', minWidth:28 }}>{Math.floor(i/2)+1}.</span>
                    <span className="move-pill move-pill-white">{userMove}</span>
                    {botMove && <span style={{ color:'#888', fontWeight:700, margin:'0 2px' }}>...</span>}
                    {botMove && <span className="move-pill move-pill-black">{botMove}</span>}
                  </li>
                );
              }
              return rows;
            })()}
          </ol>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          <button onClick={handleReset} style={{ marginTop: 0, padding: '10px 24px', fontSize: 18, borderRadius: 8, background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Reset Game</button>
          <div style={{ marginTop: 24, fontSize: 20, color: '#333', minHeight: 28 }}>{status || (userColor && game.turn() === userColor ? "Your move" : userColor ? "Bot's move..." : "")}</div>
        </div>
      </div>
    </div>
  );
};

export default ChessSimPage; 