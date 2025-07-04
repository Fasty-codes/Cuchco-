import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import './AISidebar.css';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = 'You are an expert assistant for chess, cubing, and coding. Only answer questions about these topics. If the question is not about these, politely refuse.';

// WARNING: Never expose your Gemini API key in frontend code!
// For production, create a backend endpoint to proxy requests securely.

const ai = new GoogleGenAI({ apiKey: "AIzaSyC2-hfC1yrQe_VFZVEbXi8KAe2LLw8uIeY", apiVersion: "v1" });

async function fetchAIResponse(message) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{ parts: [{ text: message }] }],
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
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setLoading(true);
    setInput('');
    const aiText = await fetchAIResponse(input);
    setMessages(msgs => [...msgs, { from: 'ai', text: aiText }]);
    setLoading(false);
  };

  return (
    <div className={`ai-sidebar${open ? ' open' : ''}`}>
      <div className="ai-sidebar-header">
        <FaRobot size={24} style={{ marginRight: 8 }} />
        <span>Cuchco AI</span>
        <button className="ai-sidebar-close" onClick={onClose}><FaTimes size={20} /></button>
      </div>
      <div className="ai-sidebar-chat">
        {messages.map((msg, i) => (
          <div key={i} className={`ai-msg ai-msg-${msg.from}`}>{msg.text}</div>
        ))}
        {loading && <div className="ai-msg ai-msg-ai">Thinking...</div>}
        <div ref={chatEndRef} />
      </div>
      <form className="ai-sidebar-input-row" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about chess, cubing, or coding..."
          className="ai-sidebar-input"
          disabled={loading}
        />
        <button type="submit" className="ai-sidebar-send" disabled={loading}>Send</button>
      </form>
    </div>
  );
};

export default AISidebar; 