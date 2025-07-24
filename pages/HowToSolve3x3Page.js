import React from 'react';
import { useNavigate } from 'react-router-dom';
import whiteCrossImg from '../assets/images/face-moves.png';
import f2lImg from '../assets/images/basic-f2l.png';
import ollImg from '../assets/images/basic-oll.png';
import pllImg from '../assets/images/basic-pll.png';

const HowToSolve3x3Page = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem 0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', color: '#333' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 24, background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>← Back to 3x3 Learning</button>
        <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 16, fontWeight: 700 }}>How to Solve a 3x3 Rubik's Cube (Beginner's Method)</h1>
        <p style={{ fontSize: 18, color: '#555', marginBottom: 32 }}>Follow this step-by-step guide to solve the 3x3 cube, even if you've never solved one before!</p>

        {/* English Steps with Images */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#1976d2', fontSize: 26, marginBottom: 10 }}>Notation</h2>
          <div style={{ margin: '20px 0', textAlign: 'center' }}>
            <img src={whiteCrossImg} alt="Cube Notation" style={{ maxWidth: 420, width: '100%', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
          </div>
          <p style={{ fontSize: 16, color: '#555' }}>
            Before you start, it's important to understand the basic notation used in cube algorithms:
            <ul style={{ margin: '12px 0 0 18px', color: '#555', fontSize: 15 }}>
              <li><b>F</b>: Front face</li>
              <li><b>R</b>: Right face</li>
              <li><b>U</b>: Up face</li>
              <li><b>L</b>: Left face</li>
              <li><b>D</b>: Down face</li>
              <li><b>'</b> (apostrophe): Counterclockwise turn (e.g., R' means turn the right face counterclockwise)</li>
              <li>No apostrophe: Clockwise turn</li>
            </ul>
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#1976d2', fontSize: 26, marginBottom: 10 }}>1. White Cross</h2>
          <p style={{ fontSize: 16, color: '#555' }}>
            Start by making a white cross on the white face. Focus on matching the white edge pieces with the center pieces of the adjacent faces. This step is intuitive—practice moving the white edges into place without worrying about algorithms.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#1976d2', fontSize: 26, marginBottom: 10 }}>2. White Corners</h2>
          <p style={{ fontSize: 16, color: '#555' }}>
            Next, solve the white corners to complete the first layer. Position a white corner below its correct spot, then use this algorithm until the corner is placed:
            <br /><b>R U R' U'</b>
            <br />Repeat as needed for each white corner.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#1976d2', fontSize: 26, marginBottom: 10 }}>3. Second Layer (F2L)</h2>
          <div style={{ margin: '16px 0' }}>
            <img src={f2lImg} alt="Second Layer (F2L)" style={{ maxWidth: 300, width: '100%', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
          </div>
          <p style={{ fontSize: 16, color: '#555' }}>
            Turn the cube so the solved white face is now on the bottom. Solve the four edge pieces of the middle layer using these algorithms:
            <ul style={{ margin: '12px 0 0 18px', color: '#555', fontSize: 15 }}>
              <li><b>For edge on top, no yellow:</b> U R U' R' U' F' U F</li>
              <li><b>For edge on top, no yellow (left):</b> U' L' U L U F U' F'</li>
            </ul>
            If an edge is in the wrong place, use the algorithm to pop it out, then insert it correctly.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#1976d2', fontSize: 26, marginBottom: 10 }}>4. Yellow Cross</h2>
          <div style={{ margin: '16px 0' }}>
            <img src={ollImg} alt="Yellow Cross (OLL)" style={{ maxWidth: 300, width: '100%', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
          </div>
          <p style={{ fontSize: 16, color: '#555' }}>
            Make a yellow cross on the top face. Use this algorithm:
            <br /><b>F R U R' U' F'</b>
            <br />Apply as needed to get from a dot, "L" shape, or line to a cross.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#1976d2', fontSize: 26, marginBottom: 10 }}>5. Yellow Edges</h2>
          <p style={{ fontSize: 16, color: '#555' }}>
            Position the yellow edge pieces correctly using:
            <br /><b>R U R' U R U2 R' U</b>
            <br />You may need to repeat this algorithm to solve all yellow edges.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#1976d2', fontSize: 26, marginBottom: 10 }}>6. Yellow Corners (Permute)</h2>
          <div style={{ margin: '16px 0' }}>
            <img src={pllImg} alt="Yellow Corners (PLL)" style={{ maxWidth: 300, width: '100%', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
          </div>
          <p style={{ fontSize: 16, color: '#555' }}>
            Move the yellow corners to their correct locations (ignore orientation for now) with:
            <br /><b>U R U' L' U R' U' L</b>
            <br />Repeat as needed until all yellow corners are in the right place.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#1976d2', fontSize: 26, marginBottom: 10 }}>7. Orient Yellow Corners</h2>
          <p style={{ fontSize: 16, color: '#555' }}>
            Finally, orient the yellow corners to finish the cube. Hold the cube so an unsolved yellow corner is on the front-right-top, then do:
            <br /><b>R' D' R D</b>
            <br />Repeat until the corner is oriented, then turn only the top layer to bring another unsolved yellow corner to the front-right-top and repeat. The cube may look scrambled during this step, but it will solve itself as you finish.
          </p>
        </section>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2 style={{ color: '#28a745', fontWeight: 700, fontSize: 28 }}>Congratulations!</h2>
          <p style={{ fontSize: 18, color: '#555' }}>You have completed the beginner's method for solving the 3x3 Rubik's Cube!</p>
        </div>

        {/* Malayalam Explanation with Images */}
        <section style={{ marginTop: 56, background: '#f8f9fa', borderRadius: 14, padding: '2rem 1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ color: '#1976d2', fontSize: 24, fontWeight: 800, marginBottom: 18, textAlign: 'center', fontFamily: `'Baloo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'` }}>മലയാളം വിശദീകരണം</h2>

          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#1976d2', fontSize: 20, marginBottom: 10, fontFamily: `'Baloo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'` }}>നോട്ടേഷൻ</h3>
            <div style={{ margin: '20px 0', textAlign: 'center' }}>
              <img src={whiteCrossImg} alt="Cube Notation" style={{ maxWidth: 420, width: '100%', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
            </div>
            <p style={{ fontSize: 16, color: '#333', fontFamily: `'Baloo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'` }}>
              ക്യൂബിന്റെ ചലനങ്ങൾ സൂചിപ്പിക്കാൻ ചില അക്ഷരങ്ങൾ ഉപയോഗിക്കുന്നു:
              <ul style={{ margin: '12px 0 0 18px', color: '#555', fontSize: 15 }}>
                <li><b>F</b>: മുന്നിലെ ഭാഗം</li>
                <li><b>R</b>: വലത്തുഭാഗം</li>
                <li><b>U</b>: മുകളിലെ ഭാഗം</li>
                <li><b>L</b>: ഇടതുഭാഗം</li>
                <li><b>D</b>: താഴെയുള്ള ഭാഗം</li>
                <li><b>'</b> (അപ്പോസ്ട്രോഫി): എതിര്‍ദിശയിൽ തിരിക്കുക (ഉദാ: R' = വലത്തുഭാഗം എതിര്‍ദിശയിൽ)</li>
                <li>അപ്പോസ്ട്രോഫിയില്ലെങ്കിൽ: ക്ലോക്ക്‌വൈസ് തിരിക്കുക</li>
              </ul>
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#1976d2', fontSize: 20, marginBottom: 10 }}>1. വൈറ്റ് ക്രോസ്</h3>
            <p style={{ fontSize: 16, color: '#333' }}>
              ആദ്യം വൈറ്റ് കളറിൽ ഒരു ക്രോസ് രൂപപ്പെടുത്തുക. വൈറ്റ് എഡ്ജ് ക്യൂബ് കഷണങ്ങൾ ശരിയായ സ്ഥാനത്തും, അതിന്റെ സൈഡ് കളറുകൾ സെന്റർ കളറുമായി പൊരുത്തപ്പെടുന്ന വിധത്തിൽ ക്രമീകരിക്കുക. ഈ ഘട്ടം ലളിതമാണ്, ആവശ്യമെങ്കിൽ പലതവണ ശ്രമിക്കുക.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#1976d2', fontSize: 20, marginBottom: 10 }}>2. വൈറ്റ് കോർണറുകൾ</h3>
            <p style={{ fontSize: 16, color: '#333' }}>
              വൈറ്റ് കോർണർ കഷണങ്ങൾ ശരിയായ സ്ഥാനത്ത് എത്തിക്കുക. കോർണർ കഷണം മുകളിലേക്കു കൊണ്ടുവന്ന്, താഴെ കാണുന്ന ചലനക്രമം ആവർത്തിക്കുക:
              <br /><b>R U R' U'</b>
              <br />ഓരോ വൈറ്റ് കോർണറിനും ആവർത്തിക്കുക.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#1976d2', fontSize: 20, marginBottom: 10 }}>3. രണ്ടാം ലെയർ</h3>
            <div style={{ margin: '16px 0' }}>
              <img src={f2lImg} alt="Second Layer (F2L)" style={{ maxWidth: 300, width: '100%', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
            </div>
            <p style={{ fontSize: 16, color: '#333' }}>
              വൈറ്റ് ഫേസ് താഴേക്ക് തിരിച്ച്, മധ്യലെയർ എഡ്ജ് കഷണങ്ങൾ ശരിയായ സ്ഥാനത്ത് എത്തിക്കുക. താഴെ കാണുന്ന അൽഗോരിതങ്ങൾ ഉപയോഗിക്കുക:
              <ul style={{ margin: '12px 0 0 18px', color: '#555', fontSize: 15 }}>
                <li><b>മുകളിൽ എഡ്ജ്, മഞ്ഞ കളർ ഇല്ല:</b> U R U' R' U' F' U F</li>
                <li><b>ഇടത് വശത്തേക്ക്:</b> U' L' U L U F U' F'</li>
              </ul>
              എഡ്ജ് തെറ്റായ സ്ഥാനത്താണെങ്കിൽ, അൽഗോരിതം ഉപയോഗിച്ച് പുറത്തെടുക്കുക, പിന്നെ ശരിയായി ഇടുക.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#1976d2', fontSize: 20, marginBottom: 10 }}>4. മഞ്ഞ ക്രോസ്</h3>
            <div style={{ margin: '16px 0' }}>
              <img src={ollImg} alt="Yellow Cross (OLL)" style={{ maxWidth: 300, width: '100%', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
            </div>
            <p style={{ fontSize: 16, color: '#333' }}>
              മുകളിലെ ഫേസിൽ മഞ്ഞ ക്രോസ് ഉണ്ടാക്കുക. താഴെ കാണുന്ന അൽഗോരിതം ആവർത്തിച്ച് ക്രോസ് രൂപപ്പെടുത്താം:
              <br /><b>F R U R' U' F'</b>
              <br />ഡോട്ട്, "L" ആകൃതി, ലൈൻ എന്നിവയിൽ നിന്ന് ക്രോസിലേക്ക് എത്താൻ ആവർത്തിക്കുക.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#1976d2', fontSize: 20, marginBottom: 10 }}>5. മഞ്ഞ എഡ്ജുകൾ</h3>
            <p style={{ fontSize: 16, color: '#333' }}>
              മഞ്ഞ എഡ്ജ് കഷണങ്ങൾ ശരിയായ സ്ഥാനത്ത് എത്തിക്കാൻ:
              <br /><b>R U R' U R U2 R' U</b>
              <br />ആവശ്യാനുസരണം ആവർത്തിക്കുക.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#1976d2', fontSize: 20, marginBottom: 10 }}>6. മഞ്ഞ കോർണറുകൾ (സ്ഥാനം)</h3>
            <div style={{ margin: '16px 0' }}>
              <img src={pllImg} alt="Yellow Corners (PLL)" style={{ maxWidth: 300, width: '100%', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
            </div>
            <p style={{ fontSize: 16, color: '#333' }}>
              മഞ്ഞ കോർണർ കഷണങ്ങൾ ശരിയായ സ്ഥാനത്ത് എത്തിക്കാൻ (ഓറിയന്റേഷൻ വേണ്ട):
              <br /><b>U R U' L' U R' U' L</b>
              <br />എല്ലാ കോർണറുകളും ശരിയായ സ്ഥാനത്ത് വരുംവരെ ആവർത്തിക്കുക.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#1976d2', fontSize: 20, marginBottom: 10 }}>7. കോർണർ ഓറിയന്റേഷൻ</h3>
            <p style={{ fontSize: 16, color: '#333' }}>
              ഒടുവിൽ, മഞ്ഞ കോർണർ കഷണങ്ങൾ ശരിയായി തിരിക്കാൻ:
              <br /><b>R' D' R D</b>
              <br />ഓരോ കോർണറിനും ആവർത്തിക്കുക. ക്യൂബ് മുഴുവൻ തിരിക്കരുത്, മുകളിൽ ലെയർ മാത്രം തിരിക്കുക.
            </p>
          </section>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <h3 style={{ color: '#28a745', fontWeight: 700, fontSize: 22 }}>അഭിനന്ദനങ്ങൾ!</h3>
            <p style={{ color: '#555', fontSize: 16 }}>3x3 ക്യൂബ് പരിഹരിക്കാൻ നിങ്ങൾക്ക് കഴിഞ്ഞു!</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToSolve3x3Page;