import React from 'react';
import { useNavigate } from 'react-router-dom';

const HowToSolvePyraminxPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem 0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', color: '#333' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 24, background: '#8e24aa', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>← Back to Cubing</button>
        <h1 style={{ color: '#8e24aa', fontSize: 36, marginBottom: 16, fontWeight: 700 }}>How to Solve a Pyraminx (Beginner's Method)</h1>
        <p style={{ fontSize: 18, color: '#555', marginBottom: 32 }}>A simple, step-by-step guide for solving the Pyraminx. If you want a more detailed Pyraminx solution, let me know!</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#8e24aa', fontSize: 24, marginBottom: 10 }}>Step 1: Solve the Tips</h2>
          <p style={{ fontSize: 16, color: '#555' }}>Turn all four tips so the colors match the adjacent center pieces.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#8e24aa', fontSize: 24, marginBottom: 10 }}>Step 2: Solve the Centers</h2>
          <p style={{ fontSize: 16, color: '#555' }}>Rotate the centers so each face has a solid color in the center triangle.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#8e24aa', fontSize: 24, marginBottom: 10 }}>Step 3: Solve the Edges</h2>
          <p style={{ fontSize: 16, color: '#555' }}>Use simple moves to place the edge pieces in the correct spots. Most Pyraminx puzzles can be solved intuitively, but if you need help with edge algorithms, let me know!</p>
        </section>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2 style={{ color: '#28a745', fontWeight: 700, fontSize: 28 }}>Congratulations!</h2>
          <p style={{ fontSize: 18, color: '#555' }}>You've solved the Pyraminx!</p>
        </div>

        {/* Malayalam Explanation */}
        <section style={{ marginTop: 56, background: '#f8f9fa', borderRadius: 14, padding: '2rem 1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ color: '#8e24aa', fontSize: 22, fontWeight: 800, marginBottom: 18, textAlign: 'center' }}>മലയാളം വിശദീകരണം</h2>
          <ol style={{ fontSize: 17, color: '#333', lineHeight: 1.8, paddingLeft: 22 }}>
            <li><b>ടിപ്പുകൾ:</b> എല്ലാ ടിപ്പുകളും സെന്റർ കളറുമായി പൊരുത്തപ്പെടുന്ന വിധത്തിൽ തിരിക്കുക.</li>
            <li><b>സെന്ററുകൾ:</b> ഓരോ ഫേസിലും സെന്റർ ട്രയാംഗിൾ ഒരേ കളർ ആക്കുക.</li>
            <li><b>എഡ്ജുകൾ:</b> എഡ്ജ് കഷണങ്ങൾ ശരിയായ സ്ഥാനത്ത് എത്തിക്കുക. കൂടുതൽ സഹായം വേണമെങ്കിൽ പറയൂ!</li>
          </ol>
          <p style={{ color: '#555', fontSize: 16, marginTop: 18, textAlign: 'center' }}>പിറാമിൻക്സ് പരിഹരിക്കാൻ ഈ ഘട്ടങ്ങൾ പിന്തുടരൂ!</p>
        </section>
      </div>
    </div>
  );
};

export default HowToSolvePyraminxPage; 