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
                        {user ? `Welcome back, ${user.username}!` : 'Master Three Worlds'}
                    </h1>
                    <p>
                        {user ? 'Ready to challenge yourself?' : 'Join the ultimate learning platform for Chess, Cubing, and Coding. Master strategy, speed, and logic.'}
                    </p>
                    <div className="hero-cta-buttons">
                        <Link to={user ? "/timer" : "/signup"} className="hero-cta-button primary">
                            {user ? 'Start Timer' : 'Get Started'}
                        </Link>
                        <Link to="/learn" className="hero-cta-button secondary">
                            Explore Learning
                        </Link>
                    </div>
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

            <section className="stats-section">
                <div className="stats-container">
                    <div className="stat-item">
                        <div className="stat-number">1K+</div>
                        <div className="stat-label">Active Learners</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Learning Paths</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">95%</div>
                        <div className="stat-label">Success Rate</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">AI Support</div>
                    </div>
                </div>
            </section>

            <section className="domains-section">
                <h2>Master Three Worlds with Cuchco</h2>
                <p className="section-subtitle">Choose your path to mastery</p>
                <div className="domains-grid">
                    <div className="domain-card chess">
                        <div className="domain-icon"><i className="fa fa-chess-king" aria-hidden="true"></i></div>
                        <h3>Chess Mastery</h3>
                        <p>Develop strategic thinking with Cuchco's chess platform. Master openings, tactics, and endgames while competing against AI and climbing the leaderboard.</p>
                        <div className="domain-features">
                            <span className="feature-tag">Opening Theory</span>
                            <span className="feature-tag">Tactics Training</span>
                            <span className="feature-tag">AI Opponents</span>
                        </div>
                        <Link to="/learn/chess" className="domain-link">Start Chess Journey →</Link>
                    </div>
                    <div className="domain-card cubing">
                        <div className="domain-icon"><i className="fa fa-cube" aria-hidden="true"></i></div>
                        <h3>Speed Cubing</h3>
                        <p>Perfect your cubing skills with Cuchco's advanced timer and learning system. Track your progress, learn new methods, and join the speedcubing community.</p>
                        <div className="domain-features">
                            <span className="feature-tag">Advanced Timer</span>
                            <span className="feature-tag">Method Learning</span>
                            <span className="feature-tag">Progress Tracking</span>
                        </div>
                        <Link to="/learn/cubing" className="domain-link">Start Cubing Journey →</Link>
                    </div>
                    <div className="domain-card coding">
                        <div className="domain-icon"><i class="fa fa-code" aria-hidden="true"></i></div>
                        <h3>Code & Create</h3>
                        <p>Build your programming skills with Cuchco's coding challenges and projects. Learn algorithms, solve problems, and create amazing applications.</p>
                        <div className="domain-features">
                            <span className="feature-tag">Algorithm Practice</span>
                            <span className="feature-tag">Project Building</span>
                            <span className="feature-tag">Code Challenges</span>
                        </div>
                        <Link to="/learn/coding" className="domain-link">Start Coding Journey →</Link>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2>Why Choose Cuchco?</h2>
                <p className="section-subtitle">Experience the difference</p>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa fa-graduation-cap" aria-hidden="true"></i></div>
                        <h3>Cuchco's Learning Path</h3>
                        <p>Follow Cuchco's structured learning paths designed by experts across chess, cubing, and coding domains.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa fa-chart-line" aria-hidden="true"></i></div>
                        <h3>Cuchco Analytics</h3>
                        <p>Track your progress with Cuchco's advanced analytics - from chess ratings to solve times to coding milestones.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa fa-users" aria-hidden="true"></i></div>
                        <h3>Cuchco Community</h3>
                        <p>Join the Cuchco community to share strategies, compete in tournaments, and learn from fellow enthusiasts.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa fa-robot" aria-hidden="true"></i></div>
                        <h3>Cuchco AI Coach</h3>
                        <p>Get personalized recommendations and practice against Cuchco's intelligent AI opponents and mentors.</p>
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <h2>What Our Learners Say</h2>
                <p className="section-subtitle">Real stories from the Cuchco community</p>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"Cuchco's chess platform helped me improve from 800 to 1500 rating in just 6 months!"</p>
                        </div>
                        <div className="testimonial-author">
                            <div className="author-avatar"><i className="fa fa-chess-king" aria-hidden="true"></i></div>
                            <div className="author-info">
                                <div className="author-name">Abel Manoj</div>
                                <div className="author-title">Chess Enthusiast</div>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"The cubing timer and progress tracking features are incredible. My average dropped from 45s to 25s!"</p>
                        </div>
                        <div className="testimonial-author">
                            <div className="author-avatar"><i className="fa fa-cube" aria-hidden="true"></i></div>
                            <div className="author-info">
                                <div className="author-name">Aadhidev Anil</div>
                                <div className="author-title">Speedcuber</div>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"Cuchco's coding challenges helped me land my dream job as a software engineer."</p>
                        </div>
                        <div className="testimonial-author">
                            <div className="author-avatar"><i className="fa fa-code" aria-hidden="true"></i></div>
                            <div className="author-info">
                                <div className="author-name">Steve Sam</div>
                                <div className="author-title">Frontend Developer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Start Your Journey?</h2>
                    <p>Join thousands of learners mastering chess, cubing, and coding with Cuchco</p>
                    <div className="cta-buttons">
                        <Link to={user ? "/learn" : "/signup"} className="cta-button primary">
                            {user ? 'Continue Learning' : 'Start Learning Free'}
                        </Link>
                        <Link to="/learn" className="cta-button secondary">Explore Courses</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage; 