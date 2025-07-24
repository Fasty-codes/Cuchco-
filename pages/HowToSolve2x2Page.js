import React from 'react';
import { useNavigate } from 'react-router-dom';

const HowToSolve2x2Page = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem 0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', color: '#333' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 24, background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>← Back to Cubing</button>
        <h1 style={{ color: '#afb42b', fontSize: 36, marginBottom: 16, fontWeight: 700 }}>How to Solve a 2x2 Rubik's Cube (Beginner's Method)</h1>
        <p style={{ fontSize: 18, color: '#555', marginBottom: 32 }}>A detailed, step-by-step guide for solving the 2x2 cube, inspired by the Speedcube.com.au beginner's instructions.</p>

        {/* Notation/Legend Section */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ color: '#afb42b', fontSize: 24, marginBottom: 10 }}>Notation / Legend</h2>
          <ul style={{ margin: '12px 0 0 18px', color: '#555', fontSize: 16 }}>
            <li><b>F</b>: Front face (the side facing you)</li>
            <li><b>R</b>: Right face</li>
            <li><b>U</b>: Up face (top)</li>
            <li><b>L</b>: Left face</li>
            <li><b>D</b>: Down face (bottom)</li>
            <li><b>B</b>: Back face</li>
            <li><b>'</b> (apostrophe): Counterclockwise turn (e.g., R' means turn the right face counterclockwise)</li>
            <li>No apostrophe: Clockwise turn</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#afb42b', fontSize: 24, marginBottom: 10 }}>Step 1: Complete the White Layer</h2>
          <p style={{ fontSize: 16, color: '#555' }}>
            <b>Goal:</b> Get all four white stickers on one face, with the side colors matching the adjacent faces.<br /><br />
            <b>How:</b> Find a white corner and move it to the bottom layer if it isn't already there. Then, position it below where it needs to go and use <b>R U R' U'</b> (or similar moves) to insert it. Repeat for all four white corners.<br /><br />
            <b>Tips:</b>
            <ul style={{ margin: '8px 0 0 18px', color: '#555', fontSize: 15 }}>
              <li>If a white corner is in the top layer but not oriented correctly, move it to the bottom layer first by using any moves that don't disturb the solved pieces.</li>
              <li>Don't worry if you mess up previously solved corners; just keep practicing the insertions.</li>
            </ul>
          </p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#afb42b', fontSize: 24, marginBottom: 10 }}>Step 2: Place Last Layer Corners</h2>
          <p style={{ fontSize: 16, color: '#555' }}>
            <b>Goal:</b> Get all yellow corners in the correct position (ignore orientation for now).<br /><br />
            <b>How:</b> Hold the cube with white on the bottom. Find a yellow corner on the top layer that matches the side colors of the bottom layer (ignore yellow for now). Place it in the front top right position. Use this algorithm to cycle the top corners:
            <br /><b>U R U' L' U R' U' L</b>
            <br />Repeat until all corners are in the correct position (they may not be oriented yet).<br /><br />
            <b>Tips:</b>
            <ul style={{ margin: '8px 0 0 18px', color: '#555', fontSize: 15 }}>
              <li>If two corners are in the correct position, keep turning the top layer until only one is correct, then use the algorithm.</li>
              <li>After each use of the algorithm, check if all corners are in the right place.</li>
            </ul>
          </p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#afb42b', fontSize: 24, marginBottom: 10 }}>Step 3: Orient Last Layer Corners</h2>
          <p style={{ fontSize: 16, color: '#555' }}>
            <b>Goal:</b> Turn the yellow corners so the yellow stickers are all on top.<br /><br />
            <b>How:</b> Hold the cube so the corner you want to orient is in the top right. Use this algorithm:
            <br /><b>R' D' R D</b>
            <br />Repeat until the yellow sticker is on top. Then turn only the top layer to bring the next unsolved corner to the top right and repeat. The cube may look scrambled during this step, but it will solve itself as you finish.<br /><br />
            <b>Tips:</b>
            <ul style={{ margin: '8px 0 0 18px', color: '#555', fontSize: 15 }}>
              <li>Keep the same side of the bottom layer facing you throughout this step.</li>
              <li>Don't rotate the whole cube—just the top layer between corners.</li>
            </ul>
          </p>
        </section>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2 style={{ color: '#28a745', fontWeight: 700, fontSize: 28 }}>Congratulations!</h2>
          <p style={{ fontSize: 18, color: '#555' }}>You've solved the 2x2 Rubik's Cube!</p>
        </div>

        {/* Malayalam Explanation */}
        <section style={{ marginTop: 56, background: '#f8f9fa', borderRadius: 14, padding: '2rem 1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ color: '#afb42b', fontSize: 22, fontWeight: 800, marginBottom: 18, textAlign: 'center' }}>മലയാളം വിശദീകരണം</h2>
          <section style={{ marginBottom: 24 }}>
            <h3 style={{ color: '#afb42b', fontSize: 18, marginBottom: 8 }}>1. വൈറ്റ് ലെയർ പൂർത്തിയാക്കുക</h3>
            <p style={{ fontSize: 16, color: '#333' }}>
              <b>ലക്ഷ്യം:</b> വൈറ്റ് കളർ ഉള്ള എല്ലാ കോർണറുകളും ഒരു വശത്ത് ക്രമീകരിക്കുക. സൈഡ് കളറുകളും പൊരുത്തപ്പെടുന്നുവെന്ന് നോക്കുക.<br /><br />
              <b>എങ്ങനെ:</b> വൈറ്റ് കോർണർ മുകളിൽ ഉണ്ടെങ്കിൽ, ആദ്യം അതിനെ താഴേക്ക് കൊണ്ടുവരിക. ശേഷം ശരിയായ സ്ഥാനത്ത് എത്തിക്കാൻ <b>R U R' U'</b> പോലുള്ള ചലനങ്ങൾ ഉപയോഗിക്കുക. എല്ലാ വൈറ്റ് കോർണറുകൾക്കും ആവർത്തിക്കുക.<br /><br />
              <b>ടിപ്സ്:</b>
              <ul style={{ margin: '8px 0 0 18px', color: '#555', fontSize: 15 }}>
                <li>മുകളിൽ കോർണർ തെറ്റായ സ്ഥാനത്താണെങ്കിൽ, താഴേക്ക് കൊണ്ടുവന്ന് ശരിയായി ഇടുക.</li>
                <li>മുമ്പ് പരിഹരിച്ച കോർണറുകൾ തെറ്റിയാൽ, വീണ്ടും ശ്രമിക്കുക.</li>
              </ul>
            </p>
          </section>
          <section style={{ marginBottom: 24 }}>
            <h3 style={{ color: '#afb42b', fontSize: 18, marginBottom: 8 }}>2. അവസാന ലെയർ കോർണറുകൾ സ്ഥാനം മാറ്റുക</h3>
            <p style={{ fontSize: 16, color: '#333' }}>
              <b>ലക്ഷ്യം:</b> മഞ്ഞ കോർണറുകൾ ശരിയായ സ്ഥാനത്ത് എത്തിക്കുക (ഓറിയന്റേഷൻ വേണ്ട).<br /><br />
              <b>എങ്ങനെ:</b> ക്യൂബ് താഴേക്ക് വൈറ്റ് വച്ച്, മുകളിൽ ഉള്ള കോർണറുകൾക്ക് സൈഡ് കളറുകൾ പൊരുത്തപ്പെടുന്നുവെന്ന് നോക്കുക (മഞ്ഞ കളർ അവഗണിക്കുക). <b>U R U' L' U R' U' L</b> ഉപയോഗിച്ച് കോർണറുകൾ ശരിയായ സ്ഥാനത്ത് എത്തിക്കുക.<br /><br />
              <b>ടിപ്സ്:</b>
              <ul style={{ margin: '8px 0 0 18px', color: '#555', fontSize: 15 }}>
                <li>രണ്ട് കോർണറുകൾ ശരിയായ സ്ഥാനത്താണെങ്കിൽ, മുകളിൽ ലെയർ തിരിച്ച് ഒന്ന് മാത്രം ശരിയാക്കുക, പിന്നെ അൽഗോരിതം ഉപയോഗിക്കുക.</li>
                <li>ഓരോ പ്രാവശ്യം അൽഗോരിതം ചെയ്ത ശേഷം, എല്ലാ കോർണറുകളും പരിശോധിക്കുക.</li>
              </ul>
            </p>
          </section>
          <section style={{ marginBottom: 24 }}>
            <h3 style={{ color: '#afb42b', fontSize: 18, marginBottom: 8 }}>3. അവസാന ലെയർ കോർണറുകൾ തിരിക്കുക</h3>
            <p style={{ fontSize: 16, color: '#333' }}>
              <b>ലക്ഷ്യം:</b> മഞ്ഞ കോർണറുകൾ മുകളിൽ വരുത്തുക.<br /><br />
              <b>എങ്ങനെ:</b> തിരിക്കേണ്ട കോർണർ മുകളിൽ വലതുവശത്ത് വച്ച് <b>R' D' R D</b> ആവർത്തിക്കുക. മഞ്ഞ കളർ മുകളിൽ വരുമ്പോൾ അടുത്ത കോർണറിലേക്ക് പോവുക. ഈ ഘട്ടത്തിൽ ക്യൂബ് അല്പം കുഴപ്പമുണ്ടാകാം, പക്ഷേ അവസാനം എല്ലാം ശരിയാകും.<br /><br />
              <b>ടിപ്സ്:</b>
              <ul style={{ margin: '8px 0 0 18px', color: '#555', fontSize: 15 }}>
                <li>ഈ ഘട്ടത്തിൽ, ക്യൂബിന്റെ അടിഭാഗം എപ്പോഴും നിങ്ങളുടെ മുന്നിൽ തന്നെ വയ്ക്കുക.</li>
                <li>ഓരോ കോർണറിനും മുകളിൽ ലെയർ മാത്രം തിരിക്കുക, മുഴുവൻ ക്യൂബ് തിരിക്കരുത്.</li>
              </ul>
            </p>
          </section>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <h3 style={{ color: '#28a745', fontWeight: 700, fontSize: 20 }}>അഭിനന്ദനങ്ങൾ!</h3>
            <p style={{ color: '#555', fontSize: 16 }}>2x2 ക്യൂബ് പരിഹരിക്കാൻ നിങ്ങൾക്ക് കഴിഞ്ഞു!</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToSolve2x2Page; 