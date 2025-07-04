import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
    const { user } = useAuth();

    return (
        <div className="homepage">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>
                        {user ? `Welcome back, ${user.username}!` : 'Master the Cube'}
                    </h1>
                    <p>
                        {user ? 'Ready to beat your record?' : 'Join the world\'s fastest-growing cubing community. Learn, practice, and compete.'}
                    </p>
                    <Link to={user ? "/timer" : "/signup"} className="hero-cta-button">
                        {user ? 'Start Timer' : 'Get Started'}
                    </Link>
                </div>
                <div className="hero-spline">
                  <div className="sketchfab-embed-wrapper" style={{ width: "100%", height: "400px" }}>
                    <iframe
                      title="Rubik's Cube Speed Solving"
                      frameBorder="0"
                      allowFullScreen
                      mozallowfullscreen="true"
                      webkitallowfullscreen="true"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      xr-spatial-tracking="true"
                      execution-while-out-of-viewport="true"
                      execution-while-not-rendered="true"
                      web-share="true"
                      width="100%"
                      height="400"
                      src="https://sketchfab.com/models/7472d2f875fc43bd9ddac4a611cd80ce/embed"
                    ></iframe>
                  </div>
                </div>
            </section>

            <section className="features-section">
                <h2>Why CubeCraze?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Learn Methods</h3>
                        <p>Step-by-step tutorials for beginners to advanced cubers.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Track Progress</h3>
                        <p>An advanced timer to log your solves and track your PBs.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Join Community</h3>
                        <p>Connect with other cubers, share tips, and compete.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage; 