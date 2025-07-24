import React from 'react';
import { Link } from 'react-router-dom';
import { FaCube, FaFlagCheckered, FaPuzzlePiece, FaMagic, FaFeather, FaChess } from 'react-icons/fa';

const tools = [
  {
    to: '/3x3solver',
    icon: <FaCube size={38} color="#0288d1" style={{ marginBottom: 12 }} />,
    title: '3x3 Solver',
    desc: "Get solutions for your 3x3 Rubik's Cube.",
  },
  {
    to: '/timer',
    icon: <FaFlagCheckered size={38} color="#009688" style={{ marginBottom: 12 }} />,
    title: 'Timer',
    desc: 'Track your solve times and improve your speed.',
  },
  {
    to: '/scramble-gen',
    icon: <FaPuzzlePiece size={38} color="#ffb300" style={{ marginBottom: 12 }} />,
    title: 'Scramble Generator',
    desc: 'Generate random scrambles for practice.',
  },
  {
    to: '/story-ai',
    icon: <FaMagic size={38} color="#0288d1" style={{ marginBottom: 12 }} />,
    title: 'Storywriting AI',
    desc: 'Generate creative stories with AI. Just give a prompt!',
  },
  {
    to: '/poem-gen',
    icon: <FaFeather size={38} color="#0097a7" style={{ marginBottom: 12 }} />,
    title: 'Poem Generator',
    desc: 'Generate creative poems with AI. Just give a prompt!',
  },
  {
    to: '/play-chess',
    icon: <FaChess size={38} color="#7c3aed" style={{ marginBottom: 12 }} />,
    title: 'Chess Sim',
    desc: 'Play against a chess bot or yourself.',
  },
];

const ToolsPage = () => {
  return (
    <div style={bgStyle}>
      <h1 style={headingStyle}>All Tools</h1>
      <div style={gridStyle}>
        {tools.map(tool => (
          <Link to={tool.to} style={toolCardStyle} key={tool.to}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px #b2ebf2'}
            onMouseOut={e => e.currentTarget.style.boxShadow = toolCardStyle.boxShadow}
          >
            {tool.icon}
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px 0', color: '#0288d1', letterSpacing: '-0.5px' }}>{tool.title}</h2>
            <p style={{ color: '#444', fontSize: 16, margin: 0 }}>{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

const bgStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(120deg, #e0f7fa 0%, #b2ebf2 100%)',
  padding: '3rem 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
const headingStyle = {
  color: '#0097a7',
  fontWeight: 900,
  fontSize: 38,
  marginBottom: 36,
  fontFamily: 'Poppins, sans-serif',
  letterSpacing: '-1px',
  textShadow: '0 2px 12px #b2ebf2',
};
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '2.5rem',
  width: '100%',
  maxWidth: 1100,
  padding: '0 2rem',
};
const toolCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '220px',
  padding: '2.2rem 1.5rem 1.7rem 1.5rem',
  border: '1.5px solid #b2ebf2',
  borderRadius: '18px',
  textDecoration: 'none',
  color: '#222',
  background: 'rgba(255,255,255,0.98)',
  boxShadow: '0 2px 8px rgba(0,191,255,0.07)',
  transition: 'box-shadow 0.2s, border 0.2s',
  fontFamily: 'inherit',
  margin: 0,
};

export default ToolsPage;