import React from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import basicF2LImage from '../assets/images/basic-f2l.png';

function BasicContent() {
  const [showModal, setShowModal] = useState(false);
  const [showVerifying, setShowVerifying] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [video, setVideo] = useState(null);
  const [scramble, setScramble] = useState('');
  const [solveTime, setSolveTime] = useState('');
  const [stars, setStars] = useState(0);
  const [certReady, setCertReady] = useState(false);
  const [userName, setUserName] = useState('');
  const certRef = React.useRef();

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };
  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handleScrambleChange = (e) => {
    setScramble(e.target.value);
  };
  const handleTimeChange = (e) => {
    setSolveTime(e.target.value);
  };

  const verifyVideo = async (videoFile) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      
      video.onloadedmetadata = () => {
        // Simulate video analysis - in real implementation, you'd use computer vision
        // For now, we'll simulate based on video duration and file size
        const hasCube = videoFile.size > 1000000; // Simulate cube detection
        const hasTimer = video.duration > 5; // Simulate timer detection
        
        if (!hasCube) {
          resolve({ success: false, message: 'Verification failed! No cube detected in the video.' });
        } else if (!hasTimer) {
          resolve({ success: false, message: 'Verification failed! No timer detected in the video.' });
        } else {
          resolve({ success: true });
        }
      };
      
      video.onerror = () => {
        resolve({ success: false, message: 'Verification failed! Could not load video file.' });
      };
      
      video.src = URL.createObjectURL(videoFile);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);
    setShowVerifying(true);
    
    // Verify the video
    const verificationResult = await verifyVideo(video);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowVerifying(false);
    
    if (!verificationResult.success) {
      setErrorMessage(verificationResult.message);
      setShowError(true);
      return;
    }
    
    // Star logic based on time
    const time = parseFloat(solveTime);
    let s = 0;
    if (time <= 70) s = 3;
    else if (time <= 80) s = 2;
    else if (time <= 90) s = 1;
    setStars(s);
    
    setShowCertificate(true);
  };

  const handleDownload = async (type) => {
    try {
      console.log('Starting download...', type);
      if (!certRef.current) {
        console.error('Certificate ref not found');
        return;
      }
      
      console.log('Certificate element found, generating canvas...');
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: '#f9fafc',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true
      });
      
      console.log('Canvas generated, creating download link...');
      const link = document.createElement('a');
      const fileName = `cuchco_certificate_${userName || 'user'}_${Date.now()}.${type}`;
      link.download = fileName;
      link.href = canvas.toDataURL(`image/${type}`, 0.9);
      
      console.log('Triggering download...');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download completed');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem 1.5rem' }}>
      <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 24, textAlign: 'center' }}>Basic Learning</h2>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32 }}>
        <a href="#white-cross" style={{ color: '#007bff', fontWeight: 600, fontSize: 18, textDecoration: 'none' }}>White Cross</a>
        <a href="#f2l" style={{ color: '#007bff', fontWeight: 600, fontSize: 18, textDecoration: 'none' }}>F2L</a>
        <a href="#oll" style={{ color: '#007bff', fontWeight: 600, fontSize: 18, textDecoration: 'none' }}>OLL</a>
        <a href="#pll" style={{ color: '#007bff', fontWeight: 600, fontSize: 18, textDecoration: 'none' }}>PLL</a>
      </nav>
      <section id="white-cross" style={{ marginBottom: 48 }}>
        <h3 style={{ fontSize: 24, marginBottom: 12 }}>1. White Cross</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
            <h4 style={{ fontSize: 19, marginBottom: 10 }}>Malayalam Explanation</h4>
            <p style={{ color: '#222', fontSize: 18, marginBottom: 12, fontFamily: `'Ballo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'`, lineHeight: 1.7, fontWeight: 500, letterSpacing: '0.01em' }}>വൈറ്റ്ക്രോസ് എന്നത് ക്യൂബിന്റെ വെളുത്ത സൈഡിൽ ഒരു പ്ലസ് (+) രൂപത്തിൽ വെളുത്ത എഡ്ജുകൾ ക്രമീകരിക്കുന്ന ഘട്ടമാണ്. ഇത് തുടക്കക്കാരൻ പഠിക്കേണ്ട ആദ്യപാഠമാണ്.</p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
              <iframe src="https://www.youtube.com/embed/xoNQplp4FQ8?list=PLIxaCw75sZhW7VtgguEhWW-hqDfPy5mhI" title="Malayalam White Cross" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen></iframe>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280, background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
            <h4 style={{ fontSize: 19, marginBottom: 10 }}>English Explanation</h4>
            <p style={{ color: '#444', fontSize: 16, marginBottom: 10 }}>The white cross is the step where you arrange the white edge pieces on the white face in a plus (+) shape. This is the first step every beginner should learn.</p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
              <iframe src="https://www.youtube.com/embed/M-vKaV2NbEo?list=PLqrfspOsG9B9HdFkp01xUh257W1Rz8-fy" title="English White Cross" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen></iframe>
            </div>
          </div>
        </div>
      </section>
      <section id="f2l" style={{ marginBottom: 48 }}>
        <h3 style={{ fontSize: 24, marginBottom: 12 }}>2. F2L (First Two Layers)</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
            <h4 style={{ fontSize: 19, marginBottom: 10 }}>Malayalam Explanation</h4>
            <p style={{ color: '#222', fontSize: 18, marginBottom: 12, fontFamily: `'Ballo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'`, lineHeight: 1.7, fontWeight: 500, letterSpacing: '0.01em' }}>F2L എന്നത് ക്യൂബിന്റെ ആദ്യ രണ്ട് ലെയറുകൾ ഒരുമിച്ച് പരിഹരിക്കുന്ന ഘട്ടമാണ്. കോർണറും എഡ്ജും ചേർത്ത് ശരിയായ സ്ഥാനത്ത് ഇടുന്നു.</p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
              <iframe src="https://www.youtube.com/embed/N4M1dPxRVCY" title="Malayalam F2L" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen></iframe>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280, background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
            <h4 style={{ fontSize: 19, marginBottom: 10 }}>English Explanation</h4>
            <p style={{ color: '#444', fontSize: 16, marginBottom: 10 }}>F2L stands for First Two Layers. In this step, you pair up the corner and edge pieces and insert them together to solve the first two layers of the cube.</p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
              <iframe src="https://www.youtube.com/embed/ReOZZHscIGk?list=PLqrfspOsG9B9HdFkp01xUh257W1Rz8-fy" title="English F2L" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen></iframe>
            </div>
          </div>
        </div>
      </section>
      <section id="oll" style={{ marginBottom: 48 }}>
        <h3 style={{ fontSize: 24, marginBottom: 12 }}>3. OLL (Orient Last Layer)</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
            <h4 style={{ fontSize: 19, marginBottom: 10 }}>Malayalam Explanation</h4>
            <p style={{ color: '#222', fontSize: 18, marginBottom: 12, fontFamily: `'Ballo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'`, lineHeight: 1.7, fontWeight: 500, letterSpacing: '0.01em' }}>OLL ഘട്ടത്തിൽ ക്യൂബിന്റെ അവസാന ലെയറിലെ എല്ലാ സ്റ്റിക്കറുകളും ശരിയായ നിറത്തിലാക്കുന്നു. ഇതിന് വിവിധ ആൽഗോരിതങ്ങൾ ഉപയോഗിക്കുന്നു.</p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
              <iframe src="https://www.youtube.com/embed/PHpUoOdvv-o?list=PLIxaCw75sZhW7VtgguEhWW-hqDfPy5mhI" title="Malayalam OLL" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen></iframe>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280, background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
            <h4 style={{ fontSize: 19, marginBottom: 10 }}>English Explanation</h4>
            <p style={{ color: '#444', fontSize: 16, marginBottom: 10 }}>OLL stands for Orient Last Layer. In this step, you use algorithms to make all stickers on the last layer the same color (usually yellow). There are 57 different OLL cases, but beginners start with 2-look OLL.</p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
              <iframe src="https://www.youtube.com/embed/6PSBaxlBqRg?list=PLqrfspOsG9B9HdFkp01xUh257W1Rz8-fy" title="English OLL" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen></iframe>
            </div>
          </div>
        </div>
      </section>
      <section id="pll" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 24, marginBottom: 12 }}>4. PLL (Permute Last Layer)</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
            <h4 style={{ fontSize: 19, marginBottom: 10 }}>Malayalam Explanation</h4>
            <p style={{ color: '#222', fontSize: 18, marginBottom: 12, fontFamily: `'Ballo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'`, lineHeight: 1.7, fontWeight: 500, letterSpacing: '0.01em' }}>PLL ഘട്ടത്തിൽ അവസാന ലെയറിലെ സ്റ്റിക്കറുകൾ ശരിയായ സ്ഥാനത്തേക്ക് മാറ്റുന്നു. ഇതാണ് ക്യൂബ് പൂർണ്ണമായി പരിഹരിക്കുന്ന അവസാന ഘട്ടം.</p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
              <iframe src="https://www.youtube.com/embed/p9VaTP-XNW8?list=PLIxaCw75sZhW7VtgguEhWW-hqDfPy5mhI" title="Malayalam PLL" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen></iframe>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280, background: '#f8f9fa', borderRadius: 8, padding: 16 }}>
            <h4 style={{ fontSize: 19, marginBottom: 10 }}>English Explanation</h4>
            <p style={{ color: '#444', fontSize: 16, marginBottom: 10 }}>PLL stands for Permute Last Layer. In this final step, you use algorithms to move the last layer pieces into their correct positions, completing the cube. There are 21 different PLL cases, but beginners start with 2-look PLL.</p>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
              <iframe src="https://www.youtube.com/embed/ZC9nwou59ow?list=PLqrfspOsG9B9HdFkp01xUh257W1Rz8-fy" title="English PLL" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen></iframe>
            </div>
          </div>
        </div>
      </section>
      <section id="certification" style={{ marginTop: 48, textAlign: 'center' }}>
        <h2 style={{ color: '#007bff', fontSize: 24, marginBottom: 16 }}>Get Your Certification!</h2>
        <button onClick={() => setShowModal(true)} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 2.5rem', fontSize: 20, fontWeight: 600, cursor: 'pointer' }}>Submit Solve for Certificate</button>
        
        {/* Upload Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
              <h3 style={{ marginBottom: 16 }}>Upload Solve Video & Details</h3>
              <div style={{ color: '#007bff', fontWeight: 500, marginBottom: 12, fontSize: 15, textAlign: 'left' }}>
                <b>Instructions:</b>
                <ul style={{ margin: '8px 0 8px 18px', padding: 0, fontSize: 14, color: '#333', textAlign: 'left' }}>
                  <li>Record a <b>live video</b> of your solve.</li>
                  <li>Show the <b>scramble</b> clearly at the start.</li>
                  <li>Show a <b>timer</b> (physical or on-screen) in the video.</li>
                  <li>Start the timer, solve the cube, and stop the timer in one continuous shot.</li>
                  <li>Make sure the time and scramble are visible in the video.</li>
                </ul>
              </div>
              <form onSubmit={handleSubmit}>
                <input type="file" accept="video/*" onChange={handleVideoChange} required style={{ marginBottom: 12 }} /><br />
                <input type="text" placeholder="Your Name" value={userName} onChange={handleNameChange} required style={{ marginBottom: 12, width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc' }} /><br />
                <input type="text" placeholder="Scramble used" value={scramble} onChange={handleScrambleChange} required style={{ marginBottom: 12, width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc' }} /><br />
                <input type="number" step="0.01" placeholder="Solve Time (seconds)" value={solveTime} onChange={handleTimeChange} required style={{ marginBottom: 12, width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc' }} /><br />
                <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontSize: 18, fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Submit</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: '#bbb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontSize: 18, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Verifying Modal */}
        {showVerifying && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: '#007bff', marginBottom: 16 }}>Verifying...</div>
              <div style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>Please wait while we verify your video submission.</div>
              <div style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showError && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: '#dc3545', marginBottom: 16 }}>❌ Verification Failed</div>
              <div style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>{errorMessage}</div>
              <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>
                Please ensure your video contains:
                <ul style={{ textAlign: 'left', margin: '8px 0 8px 20px' }}>
                  <li>A clear view of the cube</li>
                  <li>A visible timer</li>
                  <li>The complete solve process</li>
                </ul>
              </div>
              <button onClick={() => setShowError(false)} style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Try Again</button>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {showCertificate && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 500, maxWidth: 600, boxShadow: '0 2px 16px rgba(0,0,0,0.15)', textAlign: 'center' }}>
              <h3 style={{ marginBottom: 16, color: '#007bff' }}>Your Certificate</h3>
              <div ref={certRef} style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '3px solid #007bff',
                borderRadius: 16,
                padding: 20,
                margin: '0 auto 16px auto',
                width: 480,
                height: 320,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Decorative corner elements */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: 50, 
                  height: 50, 
                  borderTop: '3px solid #fff', 
                  borderLeft: '3px solid #fff',
                  borderTopLeftRadius: 16
                }}></div>
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0, 
                  width: 50, 
                  height: 50, 
                  borderTop: '3px solid #fff', 
                  borderRight: '3px solid #fff',
                  borderTopRightRadius: 16
                }}></div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: 50, 
                  height: 50, 
                  borderBottom: '3px solid #fff', 
                  borderLeft: '3px solid #fff',
                  borderBottomLeftRadius: 16
                }}></div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  width: 50, 
                  height: 50, 
                  borderBottom: '3px solid #fff', 
                  borderRight: '3px solid #fff',
                  borderBottomRightRadius: 16
                }}></div>

                {/* Certificate content */}
                <div style={{ textAlign: 'center', color: '#fff', position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ 
                      color: '#fff', 
                      fontSize: 22, 
                      marginBottom: 8, 
                      fontFamily: 'serif', 
                      letterSpacing: 1,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      fontWeight: 'bold'
                    }}>🎉 Certificate of Completion 🎉</h2>
                    
                    <div style={{ 
                      fontSize: 14, 
                      marginBottom: 6,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}>This certifies that</div>
                    
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: 18, 
                      marginBottom: 6,
                      color: '#ffd700',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}>{userName || '_________'}</div>
                    
                    <div style={{ 
                      fontSize: 13, 
                      marginBottom: 4,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}>has successfully completed the</div>
                    
                    <div style={{ 
                      fontSize: 14, 
                      marginBottom: 4,
                      fontWeight: 'bold',
                      color: '#ffd700',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>🎯 Basic Level of 3x3 Cubing 🎯</div>
                    
                    <div style={{ 
                      fontSize: 13, 
                      marginBottom: 4,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}>with an impressive solve time of</div>
                    
                    <div style={{ 
                      fontSize: 16, 
                      marginBottom: 6,
                      fontWeight: 'bold',
                      color: '#ffd700',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>⏱️ {solveTime} seconds ⏱️</div>
                    
                    <div style={{ 
                      fontSize: 11, 
                      marginBottom: 8,
                      fontFamily: 'monospace',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      padding: '4px 8px',
                      borderRadius: 6,
                      display: 'inline-block'
                    }}>Scramble: {scramble}</div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      fontSize: 24, 
                      margin: '8px 0',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>{Array.from({length: 3}, (_, i) => i < stars ? '⭐' : '☆').join(' ')}</div>
                    
                    <div style={{ 
                      fontSize: 13, 
                      marginTop: 6,
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}>🏆 Organization: <span style={{ color: '#ffd700' }}>cuchco</span> 🏆</div>
                    
                    <div style={{ 
                      fontSize: 10, 
                      marginTop: 4,
                      opacity: 0.8,
                      fontStyle: 'italic'
                    }}>Certificate ID: {Date.now()}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                <button onClick={() => handleDownload('png')} style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Download as PNG</button>
                <button onClick={() => handleDownload('jpeg')} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Download as JPG</button>
              </div>
              <button onClick={() => setShowCertificate(false)} style={{ background: '#bbb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>Close</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 18, color: '#555', fontSize: 16 }}>
          <b>Star Criteria:</b><br />
          1 Star: &le; 1:30 (90s)<br />
          2 Stars: &le; 1:20 (80s)<br />
          3 Stars: &le; 1:10 (70s)
        </div>
      </section>
    </div>
  );
}

const LEVELS = {
  basic: {
    label: 'Basic',
    content: BasicContent,
  },
  intermediate: {
    label: 'Intermediate',
    content: (
      <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
        <h3>F2L, OLL, PLL</h3>
        <p>Pair up and insert corners and edges (F2L), orient the last layer (OLL), and permute the last layer (PLL).</p>
        <ul>
          <li>Learn intuitive F2L</li>
          <li>Basic OLL and PLL algorithms</li>
        </ul>
      </div>
    ),
  },
  advanced: {
    label: 'Advanced',
    content: (
      <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
        <h3>Full CFOP & Speedcubing</h3>
        <ul>
          <li>All 57 OLL and 21 PLL algorithms</li>
          <li>Advanced F2L cases</li>
          <li>Lookahead, finger tricks, and competition tips</li>
        </ul>
      </div>
    ),
  },
};

const ThreeByThreeLevelPage = () => {
  const { level } = useParams();
  const levelData = LEVELS[level];
  const [language, setLanguage] = useState('english');

  const content = {
    english: {
      title: "3x3 Cube Learning",
      algorithmsTitle: "🔢 Basic Algorithms",
      basicMovesTitle: "🔄 Basic Moves",
      basicMovesDesc: "Standard cube notation for all face rotations",
      commonAlgorithmsTitle: "⚡ Common Algorithms",
      f2lTitle: "🔗 F2L (First Two Layers)",
      f2lDesc: "F2L is the most important step for speedcubing. You pair up corner and edge pieces and insert them together. This step alone can take 50-60% of your total solve time, so mastering it is crucial for improving your speed.",
      f2lCases: "Basic F2L Cases:",
      f2lCase1: "• Corner and edge in top layer",
      f2lCase2: "• Corner in top, edge in middle", 
      f2lCase3: "• Edge in top, corner in middle",
      f2lCase4: "• Both pieces in wrong positions",
      tipsTitle: "💡 Learning Tips",
      practiceTitle: "🎯 Practice Strategy",
      speedTitle: "⚡ Speed Improvement",
      mentalTitle: "🧠 Mental Game",
      chooseLevel: "📚 Choose Your Level",
      basicDesc: "Learn the fundamentals: White Cross, F2L, OLL, PLL",
      intermediateDesc: "Master F2L, learn basic OLL and PLL algorithms",
      advancedDesc: "Full CFOP method with all algorithms and speedcubing techniques",
      viewInMalayalam: "View in Malayalam",
      viewInEnglish: "View in English"
    },
    malayalam: {
      title: "3x3 ക്യൂബ് പഠനം",
      algorithmsTitle: "🔢 അടിസ്ഥാന അൽഗോരിതങ്ങൾ",
      basicMovesTitle: "🔄 അടിസ്ഥാന നീക്കങ്ങൾ",
      basicMovesDesc: "എല്ലാ മുഖ ഭ്രമണങ്ങൾക്കുമുള്ള സ്റ്റാൻഡേർഡ് ക്യൂബ് നോട്ടേഷൻ",
      commonAlgorithmsTitle: "⚡ സാധാരണ അൽഗോരിതങ്ങൾ",
      f2lTitle: "🔗 F2L (ആദ്യ രണ്ട് ലെയറുകൾ)",
      f2lDesc: "F2L എന്നത് സ്പീഡ്ക്യൂബിംഗിൽ ഏറ്റവും പ്രധാനപ്പെട്ട ഘട്ടമാണ്. നിങ്ങൾ കോർണർ, എഡ്ജ് കഷണങ്ങൾ ജോഡിയാക്കി ഒരുമിച്ച് ചേർക്കുന്നു. ഈ ഘട്ടം മാത്രം നിങ്ങളുടെ മൊത്തം സോൾവ് സമയത്തിന്റെ 50-60% എടുക്കും, അതിനാൽ വേഗത മെച്ചപ്പെടുത്താൻ ഇത് മാസ്റ്റർ ചെയ്യേണ്ടത് നിർണായകമാണ്.",
      f2lCases: "അടിസ്ഥാന F2L കേസുകൾ:",
      f2lCase1: "• മുകളിലെ ലെയറിൽ കോർണർ, എഡ്ജ്",
      f2lCase2: "• മുകളിൽ കോർണർ, മധ്യത്തിൽ എഡ്ജ്",
      f2lCase3: "• മുകളിൽ എഡ്ജ്, മധ്യത്തിൽ കോർണർ", 
      f2lCase4: "• രണ്ട് കഷണങ്ങളും തെറ്റായ സ്ഥാനത്ത്",
      tipsTitle: "💡 പഠന നുറുങ്ങുകൾ",
      practiceTitle: "🎯 പരിശീലന തന്ത്രം",
      speedTitle: "⚡ വേഗത മെച്ചപ്പെടുത്തൽ",
      mentalTitle: "🧠 മാനസിക കളി",
      chooseLevel: "📚 നിങ്ങളുടെ ലെവൽ തിരഞ്ഞെടുക്കുക",
      basicDesc: "അടിസ്ഥാനങ്ങൾ പഠിക്കുക: വൈറ്റ് ക്രോസ്, F2L, OLL, PLL",
      intermediateDesc: "F2L മാസ്റ്റർ ചെയ്യുക, അടിസ്ഥാന OLL, PLL അൽഗോരിതങ്ങൾ പഠിക്കുക",
      advancedDesc: "എല്ലാ അൽഗോരിതങ്ങളും സ്പീഡ്ക്യൂബിംഗ് സാങ്കേതിക വിദ്യകളും ഉള്ള പൂർണ്ണ CFOP രീതി",
      viewInMalayalam: "മലയാളത്തിൽ കാണുക",
      viewInEnglish: "ഇംഗ്ലീഷിൽ കാണുക"
    }
  };

  const currentContent = content[language];

  if (!levelData) {
    return (
      <>
        <div style={{ minHeight: '100vh', padding: '2rem 0', background: '#f7f9fb', textAlign: 'center' }}>
          <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>{currentContent.title}</h1>
          
          {/* Language Toggle Button */}
          <div style={{ marginBottom: 24 }}>
            <button 
              onClick={() => setLanguage(language === 'english' ? 'malayalam' : 'english')}
              style={{ 
                background: '#007bff', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: '0.75rem 1.5rem', 
                fontSize: 16, 
                fontWeight: 600, 
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,123,255,0.3)'
              }}
            >
              {language === 'english' ? currentContent.viewInMalayalam : currentContent.viewInEnglish}
            </button>
          </div>
          
          {/* Algorithms sections */}
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'left' }}>
            {/* Basic Algorithms Header */}
            <section style={{ marginBottom: 48, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
              <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 24, textAlign: 'center' }}>🔧 Basic Algorithms</h2>
              <p style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 32 }}>
                {language === 'english' ? 'Learn the fundamental algorithms for solving the 3x3 cube using the CFOP method.' : 'CFOP രീതി ഉപയോഗിച്ച് 3x3 ക്യൂബ് പരിഹരിക്കാനുള്ള അടിസ്ഥാന അൽഗോരിതങ്ങൾ പഠിക്കുക.'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20, textAlign: 'center', cursor: 'pointer' }}>
                  <h3 style={{ fontSize: 20, marginBottom: 12, color: '#007bff' }}>F2L</h3>
                  <p style={{ color: '#666', fontSize: 14 }}>
                    {language === 'english' ? 'First Two Layers - Pair and insert corners and edges together' : 'ആദ്യ രണ്ട് ലെയറുകൾ - കോർണറുകളും എഡ്ജുകളും ഒരുമിച്ച് ജോഡിയാക്കി ചേർക്കുക'}
                  </p>
                </div>
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20, textAlign: 'center', cursor: 'pointer' }}>
                  <h3 style={{ fontSize: 20, marginBottom: 12, color: '#007bff' }}>OLL</h3>
                  <p style={{ color: '#666', fontSize: 14 }}>
                    {language === 'english' ? 'Orientation of Last Layer - Make the top face all one color' : 'അവസാന ലെയറിന്റെ ഓറിയന്റേഷൻ - മുകളിലെ മുഖം എല്ലാം ഒരേ നിറമാക്കുക'}
                  </p>
                </div>
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20, textAlign: 'center', cursor: 'pointer' }}>
                  <h3 style={{ fontSize: 20, marginBottom: 12, color: '#007bff' }}>PLL</h3>
                  <p style={{ color: '#666', fontSize: 14 }}>
                    {language === 'english' ? 'Permutation of Last Layer - Move pieces to their correct positions' : 'അവസാന ലെയറിന്റെ പെർമ്യൂട്ടേഷൻ - കഷണങ്ങൾ ശരിയായ സ്ഥാനങ്ങളിലേക്ക് നീക്കുക'}
                  </p>
                </div>
              </div>
            </section>

            {/* F2L Section */}
            <section style={{ marginBottom: 48, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
              <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 24, textAlign: 'center' }}>🔧 F2L (First Two Layers)</h2>
              <p style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 32 }}>
                {language === 'english' ? 'F2L is the second step of the CFOP method. You pair up a corner and edge piece, then insert them together into the correct slot. This is much more efficient than solving corners and edges separately.' : 'F2L എന്നത് CFOP രീതിയുടെ രണ്ടാമത്തെ ഘട്ടമാണ്. നിങ്ങൾ ഒരു കോർണർ, എഡ്ജ് കഷണങ്ങൾ ജോഡിയാക്കി, പിന്നെ അവ ഒരുമിച്ച് ശരിയായ സ്ലോട്ടിലേക്ക് ചേർക്കുന്നു. കോർണറുകളും എഡ്ജുകളും വേറെ വേറെ പരിഹരിക്കുന്നതിനേക്കാൾ ഇത് കൂടുതൽ കാര്യക്ഷമമാണ്.'}
              </p>
              <div style={{ textAlign: 'center', margin: '24px 0 32px 0' }}>
                <img src={basicF2LImage} alt="Basic F2L" style={{ maxWidth: 600, width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16, color: '#007bff' }}>{language === 'english' ? 'Basic F2L Cases' : 'അടിസ്ഥാന F2L കേസുകൾ'}</h3>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#333', backgroundColor: '#fff', padding: 12, borderRadius: 6 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Case 1:' : 'കേസ് 1:'}</strong> {language === 'english' ? 'Corner and edge in top layer' : 'മുകളിലെ ലെയറിൽ കോർണർ, എഡ്ജ്'}<br />
                      <strong>{language === 'english' ? 'Algorithm:' : 'അൽഗോരിതം:'}</strong> R U R'<br />
                      <strong>{language === 'english' ? 'Setup:' : 'സെറ്റപ്പ്:'}</strong> U R U' R'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Case 2:' : 'കേസ് 2:'}</strong> {language === 'english' ? 'Corner in top, edge in middle' : 'മുകളിൽ കോർണർ, മധ്യത്തിൽ എഡ്ജ്'}<br />
                      <strong>{language === 'english' ? 'Algorithm:' : 'അൽഗോരിതം:'}</strong> U R U' R' U' F' U F<br />
                      <strong>{language === 'english' ? 'Setup:' : 'സെറ്റപ്പ്:'}</strong> F U F' U R U' R'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Case 3:' : 'കേസ് 3:'}</strong> {language === 'english' ? 'Edge in top, corner in middle' : 'മുകളിൽ എഡ്ജ്, മധ്യത്തിൽ കോർണർ'}<br />
                      <strong>{language === 'english' ? 'Algorithm:' : 'അൽഗോരിതം:'}</strong> U' F' U F U R U' R'<br />
                      <strong>{language === 'english' ? 'Setup:' : 'സെറ്റപ്പ്:'}</strong> R U R' U' F U' F'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Case 4:' : 'കേസ് 4:'}</strong> {language === 'english' ? 'Both pieces wrong' : 'രണ്ട് കഷണങ്ങളും തെറ്റ്'}<br />
                      <strong>{language === 'english' ? 'Algorithm:' : 'അൽഗോരിതം:'}</strong> R U R' U' F' U F<br />
                      <strong>{language === 'english' ? 'Setup:' : 'സെറ്റപ്പ്:'}</strong> F U' F' U R U' R'
                    </div>
                  </div>
                </div>
                
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16, color: '#007bff' }}>{language === 'english' ? 'Advanced F2L Cases' : 'വിപുലമായ F2L കേസുകൾ'}</h3>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#333', backgroundColor: '#fff', padding: 12, borderRadius: 6 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Case 5:' : 'കേസ് 5:'}</strong> {language === 'english' ? 'Corner oriented, edge flipped' : 'കോർണർ ഓറിയന്റഡ്, എഡ്ജ് ഫ്ലിപ്പ് ചെയ്തു'}<br />
                      <strong>{language === 'english' ? 'Algorithm:' : 'അൽഗോരിതം:'}</strong> R U R' U' R U R'<br />
                      <strong>{language === 'english' ? 'Setup:' : 'സെറ്റപ്പ്:'}</strong> R U' R' U R U' R'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Case 6:' : 'കേസ് 6:'}</strong> {language === 'english' ? 'Edge oriented, corner twisted' : 'എഡ്ജ് ഓറിയന്റഡ്, കോർണർ ട്വിസ്റ്റ് ചെയ്തു'}<br />
                      <strong>{language === 'english' ? 'Algorithm:' : 'അൽഗോരിതം:'}</strong> R U R' U' R U R'<br />
                      <strong>{language === 'english' ? 'Setup:' : 'സെറ്റപ്പ്:'}</strong> R U' R' U R U' R'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Case 7:' : 'കേസ് 7:'}</strong> {language === 'english' ? 'Both pieces oriented wrong' : 'രണ്ട് കഷണങ്ങളും തെറ്റായി ഓറിയന്റഡ്'}<br />
                      <strong>{language === 'english' ? 'Algorithm:' : 'അൽഗോരിതം:'}</strong> R U R' U' R U R'<br />
                      <strong>{language === 'english' ? 'Setup:' : 'സെറ്റപ്പ്:'}</strong> R U' R' U R U' R'
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* OLL Section */}
            <section style={{ marginBottom: 48, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
              <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 24, textAlign: 'center' }}>🔧 OLL (Orientation of Last Layer)</h2>
              <p style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 32 }}>
                {language === 'english' ? 'OLL is the third step of the CFOP method. You use algorithms to make all the pieces on the top face the same color (usually yellow). There are 57 different OLL cases, but beginners start with 2-look OLL.' : 'OLL എന്നത് CFOP രീതിയുടെ മൂന്നാമത്തെ ഘട്ടമാണ്. മുകളിലെ മുഖത്തെ എല്ലാ കഷണങ്ങളും ഒരേ നിറമാക്കാൻ (സാധാരണയായി മഞ്ഞ) നിങ്ങൾ അൽഗോരിതങ്ങൾ ഉപയോഗിക്കുന്നു. 57 വ്യത്യസ്ത OLL കേസുകൾ ഉണ്ട്, പക്ഷേ തുടക്കക്കാർ 2-look OLL-ൽ നിന്ന് ആരംഭിക്കുന്നു.'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16, color: '#007bff' }}>{language === 'english' ? 'Basic OLL Cases (2-Look)' : 'അടിസ്ഥാന OLL കേസുകൾ (2-Look)'}</h3>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#333', backgroundColor: '#fff', padding: 12, borderRadius: 6 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Sune:</strong> R U R' U R U2 R'<br />
                      <strong>Anti-Sune:</strong> R U2 R' U' R U' R'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Headlights:</strong> R U R' U R U' R' U R U2 R'<br />
                      <strong>Chameleon:</strong> R U R' U' R' F R F'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Bowtie:</strong> F R U R' U' F'<br />
                      <strong>H:</strong> R U R' U R U' R' U R U2 R'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Pi:</strong> R U2 R2 U' R2 U' R2 U2 R<br />
                      <strong>U:</strong> R U R' U R U2 R'
                    </div>
                  </div>
                </div>
                
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16, color: '#007bff' }}>{language === 'english' ? 'Advanced OLL Cases' : 'വിപുലമായ OLL കേസുകൾ'}</h3>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#333', backgroundColor: '#fff', padding: 12, borderRadius: 6 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'All Corners Oriented:' : 'എല്ലാ കോർണറുകളും ഓറിയന്റഡ്:'}</strong><br />
                      • Sune: R U R' U R U2 R'<br />
                      • Anti-Sune: R U2 R' U' R U' R'<br />
                      • Double Sune: R U R' U R U2 R' U R U R' U R U2 R'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Cross Cases:' : 'ക്രോസ് കേസുകൾ:'}</strong><br />
                      • Dot: F R U R' U' F'<br />
                      • L: F R U R' U' F'<br />
                      • Line: F R U R' U' F'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Tips:' : 'നുറുങ്ങുകൾ:'}</strong><br />
                      • {language === 'english' ? 'Learn recognition patterns' : 'തിരിച്ചറിയൽ പാറ്റേണുകൾ പഠിക്കുക'}<br />
                      • {language === 'english' ? 'Practice with different cases' : 'വ്യത്യസ്ത കേസുകളോടെ പരിശീലിക്കുക'}<br />
                      • {language === 'english' ? 'Use 2-look OLL for beginners' : 'തുടക്കക്കാർക്ക് 2-look OLL ഉപയോഗിക്കുക'}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PLL Section */}
            <section style={{ marginBottom: 48, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
              <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 24, textAlign: 'center' }}>🔧 PLL (Permutation of Last Layer)</h2>
              <p style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 32 }}>
                {language === 'english' ? 'PLL is the final step of the CFOP method. You use algorithms to move the pieces on the top face to their correct positions, completing the solve. There are 21 different PLL cases, but beginners start with 2-look PLL.' : 'PLL എന്നത് CFOP രീതിയുടെ അവസാന ഘട്ടമാണ്. മുകളിലെ മുഖത്തെ കഷണങ്ങൾ അവയുടെ ശരിയായ സ്ഥാനങ്ങളിലേക്ക് നീക്കാൻ നിങ്ങൾ അൽഗോരിതങ്ങൾ ഉപയോഗിക്കുന്നു, സോൾവ് പൂർത്തിയാക്കുന്നു. 21 വ്യത്യസ്ത PLL കേസുകൾ ഉണ്ട്, പക്ഷേ തുടക്കക്കാർ 2-look PLL-ൽ നിന്ന് ആരംഭിക്കുന്നു.'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16, color: '#007bff' }}>{language === 'english' ? 'Basic PLL Cases' : 'അടിസ്ഥാന PLL കേസുകൾ'}</h3>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#333', backgroundColor: '#fff', padding: 12, borderRadius: 6 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>U Perm (a):</strong> R U' R U R U R U' R' U' R2<br />
                      <strong>U Perm (b):</strong> R2 U R U R' U' R' U' R' U R'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>J Perm (a):</strong> R U R' F' R U R' U' R' F R2 U' R'<br />
                      <strong>J Perm (b):</strong> R' U L' U2 R U' R' U2 R L
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>T Perm:</strong> R U R' U' R' F R2 U' R' U' R U R' F'<br />
                      <strong>Y Perm:</strong> F R U' R' U' R U R' F' R U R' U' R' F R F'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>H Perm:</strong> M2 U M2 U2 M2 U M2<br />
                      <strong>Z Perm:</strong> M2 U M2 U M' U2 M2 U2 M' U2
                    </div>
                  </div>
                </div>
                
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16, color: '#007bff' }}>{language === 'english' ? 'Advanced PLL Cases' : 'വിപുലമായ PLL കേസുകൾ'}</h3>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#333', backgroundColor: '#fff', padding: 12, borderRadius: 6 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>G Perms:</strong><br />
                      <strong>Ga:</strong> R2 U R' U R' U' R U' R2 U' D R' U R D'<br />
                      <strong>Gb:</strong> R' U' R U D' R2 U R' U R U' R U' R2 D<br />
                      <strong>Gc:</strong> R2 U' R U' R U R' U R2 U D' R U' R' D<br />
                      <strong>Gd:</strong> R U R' U' D R2 U' R U' R' U R' U R2 D'
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>R Perms:</strong><br />
                      <strong>Ra:</strong> R U' R' U' R U R D R' U' R D' R' U2 R'<br />
                      <strong>Rb:</strong> R' U2 R U2 R' F R U R' U' R' F' R2
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{language === 'english' ? 'Tips:' : 'നുറുങ്ങുകൾ:'}</strong><br />
                      • {language === 'english' ? 'Learn recognition patterns' : 'തിരിച്ചറിയൽ പാറ്റേണുകൾ പഠിക്കുക'}<br />
                      • {language === 'english' ? 'Practice with different cases' : 'വ്യത്യസ്ത കേസുകളോടെ പരിശീലിക്കുക'}<br />
                      • {language === 'english' ? 'Use 2-look PLL for beginners' : 'തുടക്കക്കാർക്ക് 2-look PLL ഉപയോഗിക്കുക'}<br />
                      • {language === 'english' ? 'Focus on finger tricks' : 'വിരൽ തന്ത്രങ്ങളിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക'}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Level Selection */}
          <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
            <h2 style={{ color: '#007bff', fontSize: 28, marginBottom: 24, textAlign: 'center' }}>{currentContent.chooseLevel}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              {Object.entries(LEVELS).map(([key, level]) => (
                <div key={key} style={{ 
                  background: '#f8f9fa', 
                  borderRadius: 8, 
                  padding: 20, 
                  textAlign: 'center',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  ':hover': {
                    borderColor: '#007bff',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <h3 style={{ fontSize: 20, marginBottom: 12, color: '#007bff' }}>{level.label}</h3>
                  <p style={{ color: '#666', fontSize: 14, lineHeight: 1.5, fontFamily: language === 'malayalam' ? `'Ballo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'` : 'inherit' }}>
                    {key === 'basic' && currentContent.basicDesc}
                    {key === 'intermediate' && currentContent.intermediateDesc}
                    {key === 'advanced' && currentContent.advancedDesc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0', background: '#f7f9fb', textAlign: 'center' }}>
      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>3x3: {levelData.label} Level</h1>
      {typeof levelData.content === 'function' ? <levelData.content /> : levelData.content}
    </div>
  );
};

export default ThreeByThreeLevelPage; 