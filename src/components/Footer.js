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
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Cuchco | Designed with passion
            </div>
        </footer>
    );
};

export default Footer; 