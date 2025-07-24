import React, { useState } from 'react';
import faqImg from '../assets/images/faq.webp';

const FAQS = [
  {
    question: 'What is Cuchco?',
    answer: 'Cuchco is a platform to learn cubing, coding, and chess, track your progress, and connect with a global community of learners.'
  },
  {
    question: 'Is Cuchco free to use?',
    answer: 'Yes! Most learning resources and community features are free. Some advanced features may require an account.'
  },
  {
    question: 'How do I start learning cubing?',
    answer: 'Go to the Cubing section from the Learn page, pick your cube, and follow the step-by-step guides and videos.'
  },
  {
    question: 'How can I join the community?',
    answer: 'Sign up for a free account and visit the Community page to join discussions, ask questions, and share your progress.'
  },
  {
    question: 'Can I track my progress?',
    answer: 'Yes! When you are logged in, your progress is tracked automatically as you complete lessons and challenges.'
  },
  {
    question: 'Who can I contact for support?',
    answer: 'Use the Contact page or email support@cuchco.com for help.'
  },
  {
    question: 'How do I add a FAQ?',
    answer: 'Go to the Contact page, select FAQ as the subject, then type your description, name, and email.'
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#f6f7fa', padding: '3.5rem 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <img src={faqImg} alt="FAQ" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 16, marginBottom: 18, boxShadow: '0 2px 12px rgba(30,34,90,0.10)' }} />
        <h1 style={{
          fontSize: 36,
          fontWeight: 900,
          margin: 0,
          marginBottom: 10,
          letterSpacing: 0.5,
          background: 'linear-gradient(90deg, #1976d2 0%, #43cea2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Frequently Asked Questions</h1>
        <p style={{ color: '#555', fontSize: 18, marginBottom: 36, fontWeight: 500 }}>Everything you need to know about Cuchco and our platform.</p>
      </div>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(30,34,90,0.10)', padding: '2.5rem 2rem', border: '1.5px solid #e9ecef' }}>
        {FAQS.map((faq, idx) => (
          <div key={idx} style={{ marginBottom: idx !== FAQS.length - 1 ? 28 : 0 }}>
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              style={{
                background: '#f8fafd',
                border: 'none',
                color: '#23272f',
                fontSize: 19,
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                padding: '1.1rem 1.2rem',
                borderRadius: 14,
                boxShadow: openIndex === idx ? '0 4px 18px rgba(33,150,243,0.08)' : '0 1px 4px rgba(30,34,90,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                outline: 'none',
                transition: 'box-shadow 0.18s, background 0.18s',
                marginBottom: 0,
              }}
              aria-expanded={openIndex === idx}
            >
              <span>{faq.question}</span>
              <span style={{
                fontSize: 28,
                marginLeft: 18,
                color: '#1976d2',
                transition: 'transform 0.3s',
                transform: openIndex === idx ? 'rotate(90deg)' : 'rotate(0deg)',
                display: 'inline-block',
              }}>
                ▼
              </span>
            </button>
            <div
              style={{
                maxHeight: openIndex === idx ? 300 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.32s cubic-bezier(.4,2,.6,1), opacity 0.22s',
                opacity: openIndex === idx ? 1 : 0,
                background: '#fafdff',
                borderRadius: '0 0 14px 14px',
                boxShadow: openIndex === idx ? '0 2px 12px rgba(33,150,243,0.07)' : 'none',
                marginTop: openIndex === idx ? 0 : 0,
                padding: openIndex === idx ? '1.1rem 1.2rem 1.2rem 1.2rem' : '0 1.2rem',
                fontSize: 17,
                color: '#444',
                fontWeight: 500,
                lineHeight: 1.7,
              }}
            >
              {openIndex === idx && (
                <div>
                  {faq.answer}
                </div>
              )}
            </div>
            {idx !== FAQS.length - 1 && (
              <div style={{ height: 1, background: 'linear-gradient(90deg, #e9ecef 0%, #f6f7fa 100%)', margin: '22px 0 0 0', border: 'none' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage; 