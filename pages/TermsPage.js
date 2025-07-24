import React from 'react';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f6f7fa', padding: '3.5rem 0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(30,34,90,0.10)', padding: '2.5rem 2.2rem', border: '1.5px solid #e9ecef' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 24, letterSpacing: 0.5, color: '#1976d2', textAlign: 'center' }}>Terms of Service</h1>
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1976d2', marginBottom: 8 }}>Introduction</h2>
          <p style={{ color: '#444', fontSize: 16, lineHeight: 1.7 }}>Welcome to Cuchco! By using our website, you agree to these Terms of Service. Please read them carefully.</p>
        </section>
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1976d2', marginBottom: 8 }}>User Responsibilities</h2>
          <p style={{ color: '#444', fontSize: 16, lineHeight: 1.7 }}>You agree to use Cuchco for lawful purposes only and to respect the rights and safety of other users. You are responsible for your account and any activity under it.</p>
        </section>
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1976d2', marginBottom: 8 }}>Content</h2>
          <p style={{ color: '#444', fontSize: 16, lineHeight: 1.7 }}>All content on Cuchco is for educational purposes. You may not copy, distribute, or use content without permission. User-generated content must comply with our guidelines.</p>
        </section>
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1976d2', marginBottom: 8 }}>Privacy</h2>
          <p style={{ color: '#444', fontSize: 16, lineHeight: 1.7 }}>We respect your privacy. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
        </section>
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1976d2', marginBottom: 8 }}>Limitation of Liability</h2>
          <p style={{ color: '#444', fontSize: 16, lineHeight: 1.7 }}>Cuchco is provided "as is" without warranties. We are not liable for any damages or losses resulting from your use of the site.</p>
        </section>
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1976d2', marginBottom: 8 }}>Changes to Terms</h2>
          <p style={{ color: '#444', fontSize: 16, lineHeight: 1.7 }}>We may update these Terms of Service at any time. Changes will be posted on this page. Continued use of Cuchco means you accept the new terms.</p>
        </section>
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1976d2', marginBottom: 8 }}>Contact</h2>
          <p style={{ color: '#444', fontSize: 16, lineHeight: 1.7 }}>If you have any questions about these Terms, please contact us through the Contact page.</p>
        </section>
      </div>
    </div>
  );
} 