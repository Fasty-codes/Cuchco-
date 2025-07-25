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
import LearnPage from './pages/LearnPage';
import AISidebar from './components/AISidebar';
import './components/AISidebar.css';
import ComingSoonPage from './pages/ComingSoonPage';
import ThreeByThreeLevelPage from './pages/ThreeByThreeLevelPage';
import ChessSimPage from './pages/ChessSimPage';
import AboutPage from './pages/AboutPage';
import CBSE10Page from './pages/CBSE10Page';
import HowToSolve3x3Page from './pages/HowToSolve3x3Page';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import HowToSolve2x2Page from './pages/HowToSolve2x2Page';
import HowToSolve4x4Page from './pages/HowToSolve4x4Page';
import HowToSolvePyraminxPage from './pages/HowToSolvePyraminxPage';
import StoryAIPage from './pages/StoryAIPage';
import PoemGenPage from './pages/PoemGenPage';
import FunZonePage from './pages/FunZonePage';
import StoryPage from './pages/StoryPage';

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
              <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
              <Route path="/learn/cubing" element={<ProtectedRoute><CubingLearnPage /></ProtectedRoute>} />
              <Route path="/learn/cubing/2x2" element={<ProtectedRoute><ComingSoonPage title="2x2" /></ProtectedRoute>} />
              <Route path="/learn/cubing/3x3" element={<ProtectedRoute><ComingSoonPage title="3x3" /></ProtectedRoute>} />
              <Route path="/learn/cubing/4x4" element={<ProtectedRoute><ComingSoonPage title="4x4" /></ProtectedRoute>} />
              <Route path="/learn/cubing/pyraminx" element={<ProtectedRoute><ComingSoonPage title="Pyraminx" /></ProtectedRoute>} />
              <Route path="/learn/cubing/3x3/how-to-solve" element={<ProtectedRoute><HowToSolve3x3Page /></ProtectedRoute>} />
              <Route path="/learn/cubing/2x2/how-to-solve" element={<HowToSolve2x2Page />} />
              <Route path="/learn/cubing/4x4/how-to-solve" element={<HowToSolve4x4Page />} />
              <Route path="/learn/cubing/pyraminx/how-to-solve" element={<HowToSolvePyraminxPage />} />
              <Route path="/learn/cubing/3x3/:level" element={<ProtectedRoute><ThreeByThreeLevelPage /></ProtectedRoute>} />
              <Route path="/learn/coding" element={<ProtectedRoute><CodingLearnPage /></ProtectedRoute>} />
              <Route path="/learn/chess" element={<ProtectedRoute><ChessLearnPage /></ProtectedRoute>} />
              <Route path="/learn/cbse10" element={<ProtectedRoute><CBSE10Page /></ProtectedRoute>} />
              <Route path="/play-chess" element={<ProtectedRoute><ChessSimPage /></ProtectedRoute>} />
              <Route path="/poem-gen" element={<PoemGenPage />} />
              <Route path="/fun-zone" element={<FunZonePage />} />
              <Route path="/story" element={<ProtectedRoute><StoryPage /></ProtectedRoute>} />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <CommunityPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community/post/:postId/:slug?" 
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
              <Route path="/solver-3x3" element={<ProtectedRoute><Solver3x3Page /></ProtectedRoute>} />
              <Route path="/timer" element={<ProtectedRoute><TimerPage /></ProtectedRoute>} />
              <Route path="/scramble-gen" element={<ProtectedRoute><ScrambleGenPage /></ProtectedRoute>} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/story-ai" element={<StoryAIPage />} />
              {/* Add other routes like Timer, etc. later */}
            </Routes>
          </main>
          <Footer />
          <AISidebar open={aiOpen} onClose={() => setAiOpen(false)} />
          {!aiOpen && (
            <button className="ai-fab" onClick={() => setAiOpen(true)} title="Ask Cuchco AI">
              <i className="bx bxs-sparkles ai-fab-sparkle"></i>
            </button>
          )}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
