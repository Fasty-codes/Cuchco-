import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaCamera, FaMicrophone, FaArrowRight, FaImage, FaSync } from 'react-icons/fa';
import './AISidebar.css';
import { GoogleGenAI } from "@google/genai";
import Tesseract from 'tesseract.js';

const SYSTEM_PROMPT = 'You are an expert assistant for chess, cubing, and coding. Only answer questions about these topics. If the question is not about these, politely refuse.';

// WARNING: Never expose your Gemini API key in frontend code!
// For production, create a backend endpoint to proxy requests securely.

const ai = new GoogleGenAI({ apiKey: "AIzaSyC2-hfC1yrQe_VFZVEbXi8KAe2LLw8uIeY", apiVersion: "v1" });

async function fetchAIResponse(message, imageData) {
  try {
    const parts = [];
    if (imageData) {
      parts.push({ inlineData: { data: imageData.split(',')[1], mimeType: 'image/png' } });
    }
    if (message && message.trim()) {
      parts.push({ text: message });
    } else if (imageData) {
      parts.push({ text: 'Describe this image.' });
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{ parts }],
    });
    return (
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini"
    );
  } catch (err) {
    return "Error: " + err.message;
  }
}

const AISidebar = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! I am your Cuchco AI. Ask me about chess, cubing, or coding!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const chatEndRef = useRef(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaTab, setMediaTab] = useState('media'); // 'media' or 'camera'
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // 'user' or 'environment'
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (showMediaModal && mediaTab === 'camera') {
      setCameraActive(true);
    } else {
      setCameraActive(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [showMediaModal, mediaTab]);

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      const constraints = {
        video: { facingMode: cameraFacingMode }
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        })
        .catch(() => {
          alert('Could not access camera.');
          setCameraActive(false);
        });
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [cameraActive, cameraFacingMode]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !imagePreview) || loading) return;
    const userMsg = { from: 'user', text: input, image: imagePreview };
    setMessages(msgs => [...msgs, userMsg]);
    setLoading(true);
    setInput('');
    setImagePreview(null);
    const aiText = await fetchAIResponse(input, imagePreview);
    setMessages(msgs => [...msgs, { from: 'ai', text: aiText }]);
    setLoading(false);
  };

  const handlePhotoInput = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      setInput(prev => (prev ? prev + ' ' : '') + text.trim());
    } catch (err) {
      alert('Failed to extract text from image.');
    }
    setLoading(false);
  };

  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + ' ' : '') + transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = () => {
        setListening(false);
      };
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
    setListening(true);
    recognitionRef.current.start();
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setImagePreview(dataUrl);
    setShowMediaModal(false);
    setCameraActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleSwitchCamera = () => {
    setCameraFacingMode(mode => (mode === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className={`ai-sidebar${open ? ' open' : ''}`}>
      <div className="ai-sidebar-header">
        <span className="ai-gemini-icon" style={{ marginRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
          <i className='bx bxs-sparkles'></i>
        </span>
        <span>Cuchco AI</span>
        <button className="ai-sidebar-close" onClick={onClose}><FaTimes size={20} /></button>
      </div>
      <div className="ai-sidebar-chat">
        {messages.map((msg, i) => (
          <div key={i} className={`ai-msg ai-msg-${msg.from}`}>{msg.text}{msg.image && <div style={{ marginTop: 8 }}><img src={msg.image} alt="sent" style={{ maxWidth: 120, borderRadius: 6 }} /></div>}</div>
        ))}
        {loading && <div className="ai-msg ai-msg-ai">Thinking...</div>}
        <div ref={chatEndRef} />
      </div>
      {imagePreview && (
        <div style={{ padding: '0 18px 8px 18px', textAlign: 'center', position: 'relative', display: 'inline-block' }}>
          <img src={imagePreview} alt="preview" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, marginBottom: 6 }} />
          <button
            type="button"
            onClick={() => setImagePreview(null)}
            style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Remove image"
          >
            <FaTimes size={14} />
          </button>
        </div>
      )}
      <form className="ai-sidebar-input-row" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setInputActive(true)}
          onBlur={() => setInputActive(false)}
          placeholder="Ask about chess, cubing, or coding..."
          className={`ai-sidebar-input${(inputActive || input) ? ' ai-sidebar-input-active' : ''}`}
          disabled={loading}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="ai-photo-input"
          onChange={handlePhotoInput}
          disabled={loading}
        />
        <button
          type="button"
          className="ai-sidebar-photo-btn"
          title="Add photo or take now"
          style={{ cursor: loading ? 'not-allowed' : 'pointer', marginRight: 8, display: 'flex', alignItems: 'center', height: '100%' }}
          onClick={() => setShowMediaModal(true)}
        >
          <FaImage size={20} />
        </button>
        <button
          type="button"
          className={`ai-sidebar-voice-btn${listening ? ' listening' : ''}`}
          onClick={handleVoiceInput}
          disabled={loading || listening}
          title={listening ? 'Listening...' : 'Voice input'}
          style={{ marginRight: 8, display: 'flex', alignItems: 'center', height: '100%', background: listening ? undefined : 'white', border: 'none', padding: 0 }}
        >
          <FaMicrophone size={20} color={listening ? '#007bff' : undefined} />
        </button>
        <button type="submit" className="ai-sidebar-send" disabled={loading}>
          <FaArrowRight size={18} />
        </button>
      </form>
      {showMediaModal && (
        <div className="ai-media-modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 2000 }} onClick={() => setShowMediaModal(false)}>
          <div className="ai-media-modal" style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 340, margin: '10vh auto', position: 'relative', zIndex: 2001 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', marginBottom: 18 }}>
              <button onClick={() => setMediaTab('media')} style={{ flex: 1, fontWeight: 600, background: mediaTab === 'media' ? '#e6f0ff' : '#f7f9fb', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer' }}>Media</button>
              <button onClick={() => setMediaTab('camera')} style={{ flex: 1, fontWeight: 600, background: mediaTab === 'camera' ? '#e6f0ff' : '#f7f9fb', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', marginLeft: 8 }}>Take Now</button>
              <button onClick={() => setShowMediaModal(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 18, marginLeft: 8, cursor: 'pointer' }}><FaTimes /></button>
            </div>
            {mediaTab === 'media' && (
              <div style={{ textAlign: 'center' }}>
                <label htmlFor="ai-photo-input-modal" style={{ display: 'inline-block', padding: '18px 0', cursor: 'pointer', color: '#007bff', fontWeight: 600 }}>Choose an image to upload</label>
                <input type="file" accept="image/*" id="ai-photo-input-modal" style={{ display: 'none' }} onChange={handlePhotoInput} />
              </div>
            )}
            {mediaTab === 'camera' && (
              <div style={{
                textAlign: 'center',
                minHeight: isMobile ? '100vh' : 180,
                minWidth: isMobile ? '100vw' : undefined,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                position: isMobile ? 'fixed' : 'static',
                top: 0,
                left: 0,
                background: isMobile ? '#000' : undefined,
                zIndex: isMobile ? 3000 : undefined,
                padding: isMobile ? 0 : undefined
              }}>
                {cameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline style={{ width: isMobile ? '100vw' : 220, height: isMobile ? '100vh' : 160, borderRadius: isMobile ? 0 : 10, background: '#000', marginBottom: 12, objectFit: 'cover' }} />
                    <div style={{ display: 'flex', gap: 18, marginTop: isMobile ? -60 : 0, justifyContent: 'center' }}>
                      <button onClick={handleCapture} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: '50%', width: isMobile ? 64 : 44, height: isMobile ? 64 : 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 32 : 22, cursor: 'pointer', boxShadow: '0 2px 8px #007bff33' }} title="Capture">
                        <FaCamera />
                      </button>
                      <button onClick={handleSwitchCamera} style={{ background: '#fff', color: '#007bff', border: '2px solid #007bff', borderRadius: '50%', width: isMobile ? 64 : 44, height: isMobile ? 64 : 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 32 : 22, cursor: 'pointer', boxShadow: '0 2px 8px #007bff22' }} title="Switch Camera">
                        <FaSync />
                      </button>
                    </div>
                  </>
                ) : (
                  <span>Camera not active.</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISidebar; 