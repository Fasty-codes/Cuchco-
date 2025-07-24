import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'poemHistory';

const PoemGenPage = () => {
  const [prompt, setPrompt] = useState('');
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [poems, setPoems] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showPoem, setShowPoem] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  // Prevent horizontal overflow
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflowX;
    const prevBodyOverflow = body.style.overflowX;
    html.style.overflowX = 'hidden';
    body.style.overflowX = 'hidden';
    return () => {
      html.style.overflowX = prevHtmlOverflow;
      body.style.overflowX = prevBodyOverflow;
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setPoems(JSON.parse(saved));
    }
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(poems));
  }, [poems]);

  // Animated loading dots
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      setLoadingDots('.'.repeat((i % 3) + 1));
      i++;
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  async function generatePoem() {
    setLoading(true);
    setError('');
    setPoem('');
    setShowPoem(false);
    setSelectedHistory(null);
    try {
      const response = await fetch('http://localhost:3001/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: `Write a poem. ${prompt}` }),
      });
      if (!response.ok) {
        throw new Error('API error');
      }
      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content || 'No poem generated.';
      setPoem(aiMessage);
      setTimeout(() => setShowPoem(true), 100); // fade-in effect
      const newPoem = { id: Date.now(), prompt, poem: aiMessage };
      setPoems([newPoem, ...poems]);
    } catch (err) {
      setError('Failed to generate poem.');
    } finally {
      setLoading(false);
    }
  }

  function deletePoem(id) {
    setPoems(poems.filter(s => s.id !== id));
    if (selectedHistory && selectedHistory.id === id) setSelectedHistory(null);
  }

  function continueChat(poemObj) {
    setPrompt(poemObj.prompt + '\n' + poemObj.poem);
    setPoem('');
    setShowPoem(false);
    setSelectedHistory(null);
  }

  function selectHistory(poemObj) {
    setSelectedHistory(poemObj);
    setPoem(poemObj.poem);
    setPrompt(poemObj.prompt);
    setShowPoem(true);
  }

  // --- Styles ---
  const gradientBg = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(120deg, #e0f7fa 0%, #b2ebf2 100%)',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Poppins, sans-serif',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  };
  const heading = {
    color: '#0097a7',
    fontWeight: 900,
    fontSize: 44,
    marginTop: 48,
    marginBottom: 10,
    letterSpacing: '-1px',
    textShadow: '0 2px 12px #b2ebf2',
    textAlign: 'center',
  };
  const subheading = {
    color: '#333',
    fontSize: 22,
    marginBottom: 36,
    fontWeight: 500,
    letterSpacing: '0.01em',
    textAlign: 'center',
    maxWidth: 600,
  };
  const inputArea = {
    background: 'rgba(255,255,255,0.98)',
    borderRadius: 18,
    boxShadow: '0 4px 32px rgba(0,191,255,0.10)',
    padding: '2rem 2rem 1.5rem 2rem',
    maxWidth: 600,
    width: '90%',
    margin: '0 auto',
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    top: 0,
    zIndex: 2,
  };
  const textarea = {
    width: '100%',
    borderRadius: 12,
    border: '1.5px solid #4dd0e1',
    padding: 18,
    fontSize: 20,
    marginBottom: 18,
    resize: 'vertical',
    minHeight: 90,
    background: '#e0f7fa',
    boxShadow: '0 1px 4px rgba(0,150,136,0.04)',
    outline: 'none',
    transition: 'border 0.2s',
  };
  const button = (color, bg, extra = {}) => ({
    background: bg,
    color,
    border: 'none',
    borderRadius: 10,
    padding: '14px 38px',
    fontWeight: 800,
    fontSize: 21,
    cursor: loading ? 'not-allowed' : 'pointer',
    marginBottom: 18,
    boxShadow: '0 2px 8px rgba(0,191,255,0.09)',
    transition: 'background 0.2s, box-shadow 0.2s',
    ...extra,
  });
  const divider = {
    width: '100%',
    maxWidth: 600,
    height: 2,
    background: 'linear-gradient(90deg, #b2ebf2 0%, #e0f7fa 100%)',
    border: 'none',
    margin: '32px 0 32px 0',
    opacity: 0.7,
  };
  const poemBox = {
    background: 'rgba(255,255,255,0.98)',
    borderRadius: 18,
    boxShadow: '0 4px 32px rgba(0,191,255,0.10)',
    padding: '2.5rem 2rem',
    maxWidth: 700,
    width: '90%',
    margin: '0 auto',
    marginBottom: 32,
    color: '#333',
    fontSize: 22,
    whiteSpace: 'pre-line',
    lineHeight: 1.7,
    letterSpacing: '0.01em',
    opacity: showPoem ? 1 : 0,
    transform: showPoem ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.7s, transform 0.7s',
    textAlign: 'center',
    zIndex: 2,
  };
  const historySection = {
    marginTop: 0,
    width: '90%',
    maxWidth: 700,
    background: 'rgba(255,255,255,0.93)',
    borderRadius: 18,
    boxShadow: '0 2px 12px rgba(0,150,136,0.07)',
    padding: 24,
    marginBottom: 40,
    zIndex: 1,
    boxSizing: 'border-box',
  };
  const historyCard = {
    background: 'rgba(255,255,255,0.99)',
    borderRadius: 14,
    boxShadow: '0 2px 8px rgba(0,150,136,0.08)',
    marginBottom: 14,
    padding: 16,
    position: 'relative',
    cursor: 'pointer',
    border: '1.5px solid #b2ebf2',
    transition: 'box-shadow 0.2s, border 0.2s',
    textAlign: 'left',
  };
  const historyPrompt = {
    color: '#0288d1',
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 2,
    letterSpacing: '0.01em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  const closeBtn = {
    background: '#607d8b',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 20px',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 10,
    marginTop: 10,
    fontSize: 16,
  };
  const spinner = {
    display: 'inline-block',
    width: 36,
    height: 36,
    border: '4px solid #b2ebf2',
    borderTop: '4px solid #0288d1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: 16,
    verticalAlign: 'middle',
  };

  return (
    <div style={gradientBg}>
      <h1 style={heading}>Poem Generator</h1>
      <div style={subheading}>
        Enter a prompt or idea and let AI write a creative poem for you!
      </div>
      <div style={inputArea}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Type your poem idea or prompt here..."
          rows={4}
          style={textarea}
        />
        <button
          onClick={generatePoem}
          disabled={!prompt.trim() || loading}
          style={button('#fff', 'linear-gradient(90deg, #0288d1 60%, #26c6da 100%)')}
        >
          {loading ? 'Generating...' : 'Generate Poem'}
        </button>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, marginTop: 8, minHeight: 40 }}>
            <div style={spinner} />
            <span style={{ fontSize: 18, color: '#0288d1', fontWeight: 600, fontFamily: 'Poppins, sans-serif', letterSpacing: '0.01em' }}>
              Crafting your poem{loadingDots}
            </span>
          </div>
        )}
        {error && <div style={{ color: '#d00', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
      </div>
      <hr style={divider} />
      {poem && !selectedHistory && (
        <div style={poemBox}>
          {poem}
        </div>
      )}
      {/* Show selected history poem */}
      {selectedHistory && (
        <div style={poemBox}>
          <div style={{ fontWeight: 700, color: '#0288d1', marginBottom: 6 }}>Prompt:</div>
          <div style={{ color: '#444', marginBottom: 10, whiteSpace: 'pre-line' }}>{selectedHistory.prompt}</div>
          <div style={{ fontWeight: 700, color: '#0097a7', marginBottom: 6 }}>Poem:</div>
          <div style={{ color: '#333', marginBottom: 10, whiteSpace: 'pre-line' }}>{selectedHistory.poem}</div>
          <button onClick={() => continueChat(selectedHistory)} style={button('#fff', '#0288d1', { marginRight: 10 })}>Continue Chat</button>
          <button onClick={() => deletePoem(selectedHistory.id)} style={button('#fff', '#d00')}>Delete</button>
          <button onClick={() => setSelectedHistory(null)} style={closeBtn}>Close</button>
        </div>
      )}
      <div style={historySection}>
        <h2 style={{ color: '#0288d1', fontSize: 22, marginBottom: 12, fontWeight: 800, letterSpacing: '0.01em', textAlign: 'center' }}>Poem History</h2>
        {poems.length === 0 && <div style={{ color: '#888', fontSize: 16, textAlign: 'center' }}>No poems yet.</div>}
        {poems.map(s => (
          <div
            key={s.id}
            style={historyCard}
            onClick={() => selectHistory(s)}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px #b2ebf2'}
            onMouseOut={e => e.currentTarget.style.boxShadow = historyCard.boxShadow}
          >
            <div style={historyPrompt}>{s.prompt}</div>
          </div>
        ))}
      </div>
      {/* Spinner keyframes */}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PoemGenPage;