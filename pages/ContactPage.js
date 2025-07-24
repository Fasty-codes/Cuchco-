import React from 'react';

const SUBJECTS = [
  { value: 'FAQ', label: 'FAQ' },
  { value: 'Problem', label: 'Problem' },
  { value: 'Bug', label: 'Bug' },
  { value: 'Fix', label: 'Fix' },
];

export default function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);
    formData.append("access_key", "de895fb4-63cf-476e-a7bf-c055923f6e20");
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f7fa', padding: '3.5rem 0' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(30,34,90,0.10)', padding: '2.5rem 2rem', border: '1.5px solid #e9ecef', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10, letterSpacing: 0.5, color: '#1976d2' }}>Contact Us</h1>
        <p style={{ color: '#555', fontSize: 17, marginBottom: 32, fontWeight: 500 }}>Have a question or found a bug? Reach out to us directly!</p>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="subject" style={{ fontWeight: 600, color: '#23272f', fontSize: 15, marginBottom: 6, display: 'block' }}>Subject</label>
            <select
              id="subject"
              name="subject"
              style={{ width: '100%', padding: '0.7rem', borderRadius: 10, border: '1.5px solid #e9ecef', fontSize: 16, marginTop: 2 }}
              required
            >
              {SUBJECTS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="name" style={{ fontWeight: 600, color: '#23272f', fontSize: 15, marginBottom: 6, display: 'block' }}>Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              style={{ width: '100%', padding: '0.7rem', borderRadius: 10, border: '1.5px solid #e9ecef', fontSize: 16, marginTop: 2 }}
              placeholder="Your name"
              required
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="email" style={{ fontWeight: 600, color: '#23272f', fontSize: 15, marginBottom: 6, display: 'block' }}>Your Email</label>
            <input
              id="email"
              name="email"
              type="email"
              style={{ width: '100%', padding: '0.7rem', borderRadius: 10, border: '1.5px solid #e9ecef', fontSize: 16, marginTop: 2 }}
              placeholder="you@email.com"
              required
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="message" style={{ fontWeight: 600, color: '#23272f', fontSize: 15, marginBottom: 6, display: 'block' }}>Message</label>
            <textarea
              id="message"
              name="message"
              style={{ width: '100%', minHeight: 100, padding: '0.7rem', borderRadius: 10, border: '1.5px solid #e9ecef', fontSize: 16, marginTop: 2, resize: 'vertical' }}
              placeholder="Describe your question, problem, or feedback..."
              required
            />
          </div>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, #1976d2 0%, #43cea2 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              border: 'none',
              borderRadius: 12,
              padding: '0.9rem 0',
              marginTop: 8,
              boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Submit Form
          </button>
        </form>
        <span style={{ display: 'block', marginTop: 18, color: result === 'Form Submitted Successfully' ? '#43cea2' : '#d32f2f', fontWeight: 600, fontSize: 16 }}>{result}</span>
      </div>
    </div>
  );
} 