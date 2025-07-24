import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'storyHistory';

const StoryAIPage = () => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stories, setStories] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

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

  // Load stories from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setStories(JSON.parse(saved));
    }
    // Inject Google Font for heading
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Save stories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories));
  }, [stories]);

  async function generateStory() {
    setLoading(true);
    setError('');
    setStory('');
    setSelectedHistory(null);
    try {
      const response = await fetch('http://localhost:3001/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content || 'No story generated.';
      setStory(aiMessage);
      // Add to history (store prompt and story only)
      const newStory = { id: Date.now(), prompt, story: aiMessage };
      setStories([newStory, ...stories]);
    } catch (err) {
      setError('Failed to generate story.');
    } finally {
      setLoading(false);
    }
  }

  function deleteStory(id) {
    setStories(stories.filter(s => s.id !== id));
    if (selectedHistory && selectedHistory.id === id) setSelectedHistory(null);
  }

  function continueChat(storyObj) {
    setPrompt(storyObj.prompt + '\n' + storyObj.story);
    setStory('');
    setSelectedHistory(null);
  }

  function selectHistory(storyObj) {
    setSelectedHistory(storyObj);
    setStory(storyObj.story);
    setPrompt(storyObj.prompt);
  }

  // --- Styles ---
  const gradientBg = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)', // blue/teal gradient
    padding: '2.5rem 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  };
  const card = {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    boxShadow: '0 8px 32px rgba(0,191,255,0.13), 0 1.5px 8px rgba(0,150,136,0.07)',
    padding: '2.5rem 2rem',
    maxWidth: 540,
    width: '90%',
    marginBottom: 24,
    position: 'relative',
    transition: 'box-shadow 0.2s',
  };
  const heading = {
    color: '#0097a7', // teal
    fontWeight: 900,
    fontSize: 38,
    marginBottom: 18,
    fontFamily: 'Poppins, sans-serif',
    letterSpacing: '-1px',
    textShadow: '0 2px 12px #b2ebf2',
  };
  const textarea = {
    width: '100%',
    borderRadius: 12,
    border: '1.5px solid #4dd0e1',
    padding: 16,
    fontSize: 18,
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
    padding: '12px 32px',
    fontWeight: 800,
    fontSize: 19,
    cursor: loading ? 'not-allowed' : 'pointer',
    marginBottom: 18,
    boxShadow: '0 2px 8px rgba(0,191,255,0.09)',
    transition: 'background 0.2s, box-shadow 0.2s',
    ...extra,
  });
  const storyBox = {
    background: 'linear-gradient(120deg, #e0f7fa 60%, #b2ebf2 100%)',
    borderRadius: 16,
    padding: 22,
    marginTop: 22,
    color: '#333',
    fontSize: 19,
    whiteSpace: 'pre-line',
    boxShadow: '0 2px 12px rgba(0,191,255,0.10)',
    fontFamily: 'inherit',
    lineHeight: 1.6,
    letterSpacing: '0.01em',
  };
  const historyCard = {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: 14,
    boxShadow: '0 2px 8px rgba(0,150,136,0.08)',
    marginBottom: 14,
    padding: 16,
    position: 'relative',
    cursor: 'pointer',
    border: '1.5px solid #b2ebf2',
    transition: 'box-shadow 0.2s, border 0.2s',
  };
  const historyPrompt = {
    color: '#0288d1', // blue
    fontWeight: 700,
    fontSize: 17,
    marginBottom: 2,
    letterSpacing: '0.01em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  const historySection = {
    marginTop: 32,
    width: '90%',
    maxWidth: 540,
    background: 'rgba(255,255,255,0.90)',
    borderRadius: 18,
    boxShadow: '0 2px 12px rgba(0,150,136,0.07)',
    padding: 18,
  };
  const closeBtn = {
    background: '#607d8b',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '6px 16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 10,
    marginTop: 10,
  };

  return (
    <div style={gradientBg}>
      <div style={card}>
        <h1 style={heading}>Storywriting AI</h1>
        <p style={{ color: '#333', fontSize: 19, marginBottom: 24, fontWeight: 500, letterSpacing: '0.01em' }}>
          Enter a prompt or idea and let AI write a creative story for you!
        </p>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Type your story idea or prompt here..."
          rows={4}
          style={textarea}
        />
        <button
          onClick={generateStory}
          disabled={!prompt.trim() || loading}
          style={button('#fff', 'linear-gradient(90deg, #0288d1 60%, #26c6da 100%)')}
        >
          {loading ? 'Generating...' : 'Generate Story'}
        </button>
        {error && <div style={{ color: '#d00', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
        {story && !selectedHistory && (
          <div style={storyBox}>
            {story}
          </div>
        )}
        {/* Show selected history story */}
        {selectedHistory && (
          <div style={storyBox}>
            <div style={{ fontWeight: 700, color: '#0288d1', marginBottom: 6 }}>Prompt:</div>
            <div style={{ color: '#444', marginBottom: 10, whiteSpace: 'pre-line' }}>{selectedHistory.prompt}</div>
            <div style={{ fontWeight: 700, color: '#0097a7', marginBottom: 6 }}>Story:</div>
            <div style={{ color: '#333', marginBottom: 10, whiteSpace: 'pre-line' }}>{selectedHistory.story}</div>
            <button onClick={() => continueChat(selectedHistory)} style={button('#fff', '#0288d1', { marginRight: 10, padding: '8px 20px', fontSize: 16, borderRadius: 8 })}>Continue Chat</button>
            <button onClick={() => deleteStory(selectedHistory.id)} style={button('#fff', '#d00', { padding: '8px 20px', fontSize: 16, borderRadius: 8 })}>Delete</button>
            <button onClick={() => setSelectedHistory(null)} style={closeBtn}>Close</button>
          </div>
        )}
      </div>
      {/* Story History */}
      <div style={historySection}>
        <h2 style={{ color: '#0288d1', fontSize: 22, marginBottom: 12, fontWeight: 800, letterSpacing: '0.01em' }}>Story History</h2>
        {stories.length === 0 && <div style={{ color: '#888', fontSize: 16 }}>No stories yet.</div>}
        {stories.map(s => (
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
    </div>
  );
};

export default StoryAIPage;