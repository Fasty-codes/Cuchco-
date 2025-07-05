import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
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
                    <br />
                    <form>
                        <input type="email" name="email" className="text-input contact-input" placeholder="Your email address..." />
                        <button type="submit" className="btn btn-big contact-btn">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="social-icons">
                <a href="https://instagram.com/cuchco" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                    <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com/company/cuchco" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                    <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://github.com/cuchco" target="_blank" rel="noopener noreferrer" className="social-icon github">
                    <i className="fab fa-github"></i>
                </a>
                <a href="https://youtube.com/@cuchco" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
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