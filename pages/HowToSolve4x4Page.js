import React from 'react';
import { useNavigate } from 'react-router-dom';

const HowToSolve4x4Page = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem 0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', color: '#333' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 24, background: '#f57c00', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>← Back to Cubing</button>
        <h1 style={{ color: '#f57c00', fontSize: 36, marginBottom: 16, fontWeight: 700 }}>How to Solve a 4x4 Rubik's Cube (Beginner's Method)</h1>
        <p style={{ fontSize: 18, color: '#555', marginBottom: 32 }}>A simple, step-by-step guide for solving the 4x4 cube. If you want a more detailed 4x4 solution, let me know!</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#f57c00', fontSize: 24, marginBottom: 10 }}>Step 1: Solve the Centers</h2>
          <p style={{ fontSize: 16, color: '#555' }}>Start by solving the center pieces of each face. Make a 2x2 block of each color in the center of all six faces.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#f57c00', fontSize: 24, marginBottom: 10 }}>Step 2: Pair the Edges</h2>
          <p style={{ fontSize: 16, color: '#555' }}>Pair up the edge pieces so each edge is a matching pair. This step is unique to 4x4 cubes and is done before solving like a 3x3.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#f57c00', fontSize: 24, marginBottom: 10 }}>Step 3: Solve Like a 3x3</h2>
          <p style={{ fontSize: 16, color: '#555' }}>Once centers and edges are done, solve the cube using the standard 3x3 method. Refer to the 3x3 guide if needed.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#f57c00', fontSize: 24, marginBottom: 10 }}>Step 4: Parity Cases</h2>
          <p style={{ fontSize: 16, color: '#555' }}>You may encounter special cases (parity errors) unique to 4x4 cubes. If you need help with parity algorithms, let me know!</p>
        </section>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2 style={{ color: '#28a745', fontWeight: 700, fontSize: 28 }}>Congratulations!</h2>
          <p style={{ fontSize: 18, color: '#555' }}>You've solved the 4x4 Rubik's Cube!</p>
        </div>

        {/* Malayalam Explanation */}
        <section style={{ marginTop: 56, background: '#f8f9fa', borderRadius: 14, padding: '2rem 1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ color: '#f57c00', fontSize: 22, fontWeight: 800, marginBottom: 18, textAlign: 'center' }}>മലയാളം വിശദീകരണം</h2>
          <ol style={{ fontSize: 17, color: '#333', lineHeight: 1.8, paddingLeft: 22 }}>
            <li><b>സെന്ററുകൾ:</b> ഓരോ ഫേസിലും സെന്റർ കളർ 2x2 ബ്ലോക്കായി ക്രമീകരിക്കുക.</li>
            <li><b>എഡ്ജ് പെയറിംഗ്:</b> ഓരോ എഡ്ജും രണ്ട് കഷണങ്ങൾ ചേർത്ത് പെയർ ചെയ്യുക.</li>
            <li><b>3x3 പോലെ പരിഹരിക്കുക:</b> സെന്ററും എഡ്ജും കഴിഞ്ഞാൽ 3x3 രീതിയിൽ പരിഹരിക്കുക.</li>
            <li><b>പാരിറ്റി പ്രശ്നങ്ങൾ:</b> 4x4-ൽ മാത്രം വരുന്ന പ്രത്യേക പ്രശ്നങ്ങൾ. കൂടുതൽ സഹായം വേണമെങ്കിൽ പറയൂ!</li>
          </ol>
          <p style={{ color: '#555', fontSize: 16, marginTop: 18, textAlign: 'center' }}>4x4 ക്യൂബ് പരിഹരിക്കാൻ ഈ ഘട്ടങ്ങൾ പിന്തുടരൂ!</p>
        </section>
      </div>
    </div>
  );
};

export default HowToSolve4x4Page; 