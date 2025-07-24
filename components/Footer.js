import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setMessage('🎉 You are subscribed! Welcome to the Cuchco newsletter.');
            setEmail('');
        }, 1200);
    };

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h1 className="logo-text">Cuchco</h1>
                    <p>
                        The best place to learn cubing, coding, and chess, track your progress, and connect with a global community of learners.
                    </p>
                </div>
                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/faq">F.A.Q.</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                    </ul>
                </div>
                <div className="footer-section contact-form">
                    <h2>Newsletter</h2>
                    <p style={{ color: '#ccc', marginBottom: 8, fontSize: '1rem' }}>Get the latest updates, tips, and exclusive content. No spam, ever!</p>
                    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                        <input
                            type="email"
                            name="email"
                            className="text-input contact-input"
                            placeholder="Your email address..."
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={status === 'loading'}
                            required
                        />
                        <button type="submit" className="btn btn-big contact-btn" disabled={status === 'loading' || status === 'success'}>
                            {status === 'loading' ? (
                                <span className="newsletter-spinner" style={{ display: 'inline-block', verticalAlign: 'middle', width: 22, height: 22, border: '3px solid #fff', borderTop: '3px solid #4CAF50', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                            ) : (
                                <>
                                    <i className="fa fa-paper-plane" style={{ marginRight: 8 }}></i>Subscribe
                                </>
                            )}
                        </button>
                    </form>
                    {status === 'success' && <div style={{ color: '#4CAF50', marginTop: 10, fontWeight: 600 }}>{message}</div>}
                    {status === 'error' && <div style={{ color: '#ff5252', marginTop: 10 }}>{message}</div>}
                </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="social-icons">
                <a href="https://instagram.com/fasty_codes" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                    <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com/company/cuchco" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                    <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://github.com/Fasty-codes" target="_blank" rel="noopener noreferrer" className="social-icon github">
                    <i className="fab fa-github"></i>
                </a>
                <a href="https://youtube.com/@dona_editz_2.0" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
                    <i className="fab fa-youtube"></i>
                </a>
                <a href="https://youtube.com/@cuberA_2.0" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
                    <i className="fab fa-youtube"></i>
                </a>
            </div>
            
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Cuchco | Designed with passion
            </div>
        </footer>
    );
};

export default Footer; 