import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LearnPage.css';

const LearnPage = () => {
    const { user } = useAuth();

    return (
        <div className="learn-page">
            <div className="learn-container">
                <h1 className="learn-title">Learn</h1>
                <div className="learn-links">
                    <Link to="/learn/cubing" className="learn-link cubing">
                        <div className="link-icon">
                            <i className="fa fa-cube"></i>
                        </div>
                        <div className="link-content">
                            <h3>Cubing</h3>
                            <p>Master speedcubing techniques and improve your solve times</p>
                        </div>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                    
                    <Link to="/learn/coding" className="learn-link coding">
                        <div className="link-icon">
                            <i className="fa fa-code"></i>
                        </div>
                        <div className="link-content">
                            <h3>Coding</h3>
                            <p>Learn programming fundamentals and build amazing applications</p>
                        </div>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                    
                    <Link to="/learn/chess" className="learn-link chess">
                        <div className="link-icon">
                            <i className="fa fa-chess-king"></i>
                        </div>
                        <div className="link-content">
                            <h3>Chess</h3>
                            <p>Develop strategic thinking and master chess tactics</p>
                        </div>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                    {/* CBSE 10th Link */}
                    <Link to="/learn/cbse10" className="learn-link cbse10">
                        <div className="link-icon">
                            <i className="fa fa-book"></i>
                        </div>
                        <div className="link-content">
                            <h3>CBSE 10th</h3>
                            <p>Explore subjects, previous year question papers, and answers for CBSE 10th. Start with Maths Chapter 1!</p>
                        </div>
                        <i className="fa fa-arrow-right"></i>
                    </Link>
                </div>
                
                <div className="learn-stats">
                    <div className="stat-item">
                        <div className="stat-number">1K+</div>
                        <div className="stat-label">Active Learners</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Learning Modules</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">95%</div>
                        <div className="stat-label">Success Rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnPage; 