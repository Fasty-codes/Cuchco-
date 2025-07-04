import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CommunityPage from './pages/CommunityPage';
import OnboardingModal from './components/OnboardingModal';
import ToolsPage from './pages/ToolsPage';
import Solver3x3Page from './pages/Solver3x3Page';
import TimerPage from './pages/TimerPage';
import ScrambleGenPage from './pages/ScrambleGenPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CubingLearnPage from './pages/CubingLearnPage';
import CodingLearnPage from './pages/CodingLearnPage';
import ChessLearnPage from './pages/ChessLearnPage';
import AISidebar from './components/AISidebar';
import './components/AISidebar.css';
import { FaRobot } from 'react-icons/fa';

function App() {
  const [aiOpen, setAiOpen] = React.useState(false);
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/onboarding" element={<OnboardingModal />} />
              <Route 
                path="/learn" 
                element={
                  <ProtectedRoute>
                    <div style={{ minHeight: '100vh', padding: '2rem 0', background: '#f7f9fb', textAlign: 'center' }}>
                      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>Learn</h1>
                      <div style={{ fontSize: 22, margin: '32px 0' }}>
                        <a href="/learn/cubing" style={{ margin: '0 18px', color: '#007bff', textDecoration: 'underline' }}>Cubing</a>
                        <a href="/learn/coding" style={{ margin: '0 18px', color: '#007bff', textDecoration: 'underline' }}>Coding</a>
                        <a href="/learn/chess" style={{ margin: '0 18px', color: '#007bff', textDecoration: 'underline' }}>Chess</a>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route path="/learn/cubing" element={<ProtectedRoute><CubingLearnPage /></ProtectedRoute>} />
              <Route path="/learn/coding" element={<ProtectedRoute><CodingLearnPage /></ProtectedRoute>} />
              <Route path="/learn/chess" element={<ProtectedRoute><ChessLearnPage /></ProtectedRoute>} />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <CommunityPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tools" 
                element={
                  <ProtectedRoute>
                    <ToolsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/3x3solver" element={<ProtectedRoute><Solver3x3Page /></ProtectedRoute>} />
              <Route path="/timer" element={<ProtectedRoute><TimerPage /></ProtectedRoute>} />
              <Route path="/scramble-gen" element={<ProtectedRoute><ScrambleGenPage /></ProtectedRoute>} />
              {/* Add other routes like Timer, etc. later */}
            </Routes>
          </main>
          <Footer />
          <AISidebar open={aiOpen} onClose={() => setAiOpen(false)} />
          {!aiOpen && (
            <button className="ai-fab" onClick={() => setAiOpen(true)} title="Ask Cuchco AI">
              <FaRobot size={32} />
            </button>
          )}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
