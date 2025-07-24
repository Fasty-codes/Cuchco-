import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/Rubiks-cube-1.jpg';
import './Header.css';  
import { FaCamera, FaLock, FaHome, FaBook, FaUsers, FaTrophy, FaTools, FaThLarge, FaCube, FaChess, FaCode, FaPuzzlePiece, FaBolt, FaFlagCheckered, FaMagic, FaFeather, FaPenNib, FaLaughBeam } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClient';
import RubiksCube1 from '../assets/images/Rubiks-cube-1.jpg';
import RubiksCube2 from '../assets/images/Rubiks-cube-2.jpg';
import RubiksCube3 from '../assets/images/Rubiks-cube-3.jpg';
import RubiksCube4 from '../assets/images/Rubiks-cube-4.jpg';
import RubiksCube5 from '../assets/images/Rubiks-cube-5.jpg';
import RubiksCube6 from '../assets/images/Rubiks-cube-6.jpg';
import RubiksCube7 from '../assets/images/Rubiks-cube-7.jpg';
import RubiksCube8 from '../assets/images/Rubiks-cube-8.jpg';
import RubiksCube9 from '../assets/images/Rubiks-cube-9.jpg';
import RubiksCube10 from '../assets/images/Rubiks-cube-10.jpg';

const Header = () => {
    const { user, logout, updateUserProfile } = useAuth();
    const [toolsOpen, setToolsOpen] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const dropdownRef = useRef(null);
    const [learnOpen, setLearnOpen] = useState(false);
    const [cubingOpen, setCubingOpen] = useState(false);
    const [shakeDropdown, setShakeDropdown] = useState({});
    const [openMega, setOpenMega] = useState(null);
    const megaMenuRef = useRef();
    // Mega menu close delay timer
    const closeMegaMenuTimer = useRef();
    const [mobileSubNav, setMobileSubNav] = useState(null);
    const [mobileCubingSubNav, setMobileCubingSubNav] = useState(false);

    const systemAvatars = [RubiksCube1, RubiksCube2, RubiksCube3, RubiksCube4, RubiksCube5, RubiksCube6, RubiksCube7, RubiksCube8, RubiksCube9, RubiksCube10];

    const isMobile = () => window.innerWidth <= 800;
    const navigate = useNavigate();

    const handleNavClose = () => {
        setNavOpen(false);
        setLearnOpen(false);
        setCubingOpen(false);
        setToolsOpen(false);
    };

    function handleClickOutside(event) {
        if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
            setOpenMega(null);
        }
    }

    function handleMegaMenuEnter(menu) {
        if (closeMegaMenuTimer.current) {
            clearTimeout(closeMegaMenuTimer.current);
            closeMegaMenuTimer.current = null;
        }
        setOpenMega(menu);
    }

    function handleMegaMenuLeave() {
        closeMegaMenuTimer.current = setTimeout(() => {
            setOpenMega(null);
        }, 1000); // 1 second delay
    }

    React.useEffect(() => {
        if (openMega) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMega]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image')) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile || !user) return;
        setUploading(true);
        setFeedback('');
        
        try {
            // Upload to Supabase Storage
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${user.username}-${Date.now()}.${fileExt}`;
            
            console.log('Uploading file:', fileName);
            const { data: storageData, error: storageError } = await supabase.storage.from('avatars').upload(fileName, avatarFile, { upsert: true });
            
            if (storageError) {
                console.error('Storage error:', storageError);
                setFeedback('Upload failed: ' + storageError.message);
                setUploading(false);
                return;
            }
            
            console.log('Upload successful, getting public URL');
            // Get public URL
            const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
            const avatarUrl = publicUrlData.publicUrl;
            
            console.log('Avatar URL:', avatarUrl);
            // Update user profile in localStorage
            updateUserProfile({ avatar: avatarUrl });
            setUploading(false);
            setAvatarModalOpen(false);
            window.location.reload(); // Fastest way to reflect everywhere
        } catch (error) {
            console.error('Upload error:', error);
            
            // Fallback: use data URL if Supabase upload fails
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.log('Network error, trying fallback with data URL...');
                try {
                    // Compress the image and use as data URL
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    
                    img.onload = () => {
                        // Set canvas size to reasonable dimensions (max 150x150)
                        const maxSize = 150;
                        let { width, height } = img;
                        
                        if (width > height) {
                            if (width > maxSize) {
                                height = (height * maxSize) / width;
                                width = maxSize;
                            }
                        } else {
                            if (height > maxSize) {
                                width = (width * maxSize) / height;
                                height = maxSize;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Draw and compress the image
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Convert to data URL with compression (0.6 quality for smaller size)
                        const avatarUrl = canvas.toDataURL('image/jpeg', 0.6);
                        console.log('Using compressed data URL as fallback');
                        
                        // Update user profile in localStorage
                        updateUserProfile({ avatar: avatarUrl });
                        setUploading(false);
                        setAvatarModalOpen(false);
                        setFeedback('Uploaded (using local storage due to network issues)');
                        setTimeout(() => setFeedback(''), 3000);
                        window.location.reload();
                    };
                    
                    img.onerror = () => {
                        setFeedback('Failed to process image');
                        setUploading(false);
                    };
                    
                    // Load the image from the file
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        img.src = e.target.result;
                    };
                    reader.onerror = () => {
                        setFeedback('Failed to read file');
                        setUploading(false);
                    };
                    reader.readAsDataURL(avatarFile);
                } catch (fallbackError) {
                    console.error('Fallback error:', fallbackError);
                    setFeedback('Upload failed: ' + error.message);
                    setUploading(false);
                }
            } else {
                setFeedback('Upload failed: ' + error.message);
                setUploading(false);
            }
        }
    };

    const handleSystemAvatarSelect = async (avatarUrl) => {
        if (!user) return;
        setUploading(true);
        setFeedback('');
        // Update user profile in localStorage
        updateUserProfile({ avatar: avatarUrl });
        setUploading(false);
        setAvatarModalOpen(false);
        window.location.reload();
    };

    const MEGA_MENUS = {
        Learn: [
            {
                label: 'Cubing',
                icon: <FaCube style={{ color: '#007bff', fontSize: 28, marginRight: 12 }} />,
                desc: 'Learn to solve all types of cubes, from beginner to advanced.',
                to: '/learn/cubing',
            },
            {
                label: 'Chess',
                icon: <FaChess style={{ color: '#a020f0', fontSize: 28, marginRight: 12 }} />,
                desc: 'Master chess piece rules, tactics, openings, and more.',
                to: '/learn/chess',
            },
            {
                label: 'Coding',
                icon: <FaCode style={{ color: '#28a745', fontSize: 28, marginRight: 12 }} />,
                desc: 'Learn programming concepts and coding skills interactively.',
                to: '/learn/coding',
            },
            {
                label: 'CBSE 10th',
                icon: <FaBook style={{ color: '#ff9800', fontSize: 28, marginRight: 12 }} />,
                desc: 'CBSE 10th grade learning resources.',
                to: '/learn/cbse10',
            },
        ],
        Tools: [
            {
                label: 'Chess Sim',
                icon: <FaChess style={{ color: '#007bff', fontSize: 28, marginRight: 12 }} />,
                desc: 'Play against a chess bot or yourself.',
                to: '/play-chess',
            },
            {
                label: 'Timer',
                icon: <FaFlagCheckered style={{ color: '#28a745', fontSize: 28, marginRight: 12 }} />,
                desc: 'Use a timer for cubing or chess.',
                to: '/timer',
            },
            {
                label: 'Scramble Gen',
                icon: <FaPuzzlePiece style={{ color: '#ffc107', fontSize: 28, marginRight: 12 }} />,
                desc: 'Generate scrambles for your cubes.',
                to: '/scramble-gen',
            },
            {
                label: '3x3 Solver',
                icon: <FaCube style={{ color: '#a020f0', fontSize: 28, marginRight: 12 }} />,
                desc: 'Solve your 3x3 cube step by step.',
                to: '/solver-3x3',
            },
            {
                label: 'Storywriting AI',
                icon: <FaMagic style={{ color: '#ff69b4', fontSize: 28, marginRight: 12 }} />, // pink magic wand
                desc: 'Generate creative stories with AI.',
                to: '/story-ai',
            },
            {
                label: 'Poem Generator',
                icon: <FaFeather style={{ color: '#0288d1', fontSize: 28, marginRight: 12 }} />,
                desc: 'Generate creative poems with AI.',
                to: '/poem-gen',
            },
        ],
    };

    // Helper: nav link style
    const navLinkStyle = {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 18px',
      color: '#222',
      fontWeight: 500,
      fontSize: 18,
      borderRadius: 10,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.18s, color 0.18s',
      textDecoration: 'none',
      margin: 0,
    };
    const navLinkHoverStyle = {
      background: '#e6f0ff',
      color: '#007bff',
    };
    // For nav arrow color
    const navArrowDefault = '#b0b8c1'; // soft modern gray
    const navArrowHover = '#1976d2';   // vibrant blue

    // For mobile subnavs and mega menus, use full-width, fixed panels
    const mobilePanelStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#f7f7f7',
      zIndex: 3000,
      display: 'flex',
      flexDirection: 'column',
      padding: '5.5rem 1.5rem 2rem 1.5rem',
      overflowY: 'auto',
      boxShadow: 'none',
    };

    const mobileNavItemStyle = {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      minHeight: 48,
      padding: '10px 18px',
      color: '#222',
      fontWeight: 500,
      fontSize: 18,
      borderRadius: 10,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.18s, color 0.18s',
      textDecoration: 'none',
      margin: 0,
      boxSizing: 'border-box',
    };

    return (
        <header className="app-header">
            <div className="header-logo">
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#007bff',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 26,
                  marginRight: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
                className="app-logo-animated"
                >
                  C
                </span>
                <Link to="/" style={{ color: '#4CAF50', fontWeight: 700, fontSize: '1.7rem', textDecoration: 'none', letterSpacing: '1px' }} onClick={handleNavClose}>Cuchco</Link>
            </div>
            <button className="hamburger" aria-label="Toggle navigation" onClick={() => setNavOpen(o => !o)}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
            <nav className={`header-nav${navOpen && isMobile() ? ' open' : ''}`} style={{ flex: 1, background: '#f7f7f7' }}>
                <ul style={{ display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'center', margin: 0, padding: 0, listStyle: 'none', background: '#f7f7f7' }}>
                    <li><Link to="/" onClick={handleNavClose} style={mobileNavItemStyle}>
                        <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}><FaHome style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Home</span>
                    </Link></li>
                    {/* Learn Dropdown */}
                    <li style={{ position: 'relative' }}>
                        {isMobile() ? (
                            mobileSubNav === 'Learn' ? (
                                !mobileCubingSubNav ? (
                                    <div className="mobile-subnav" style={mobilePanelStyle}>
                                        <button onClick={() => setMobileSubNav(null)} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#007bff', fontWeight: 700, fontSize: 22, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0' }}>&larr; Back</button>
                                        <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Learn</h3>
                                        <Link to="/learn" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaBook style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Learn</Link>
                                        <button onClick={() => setMobileCubingSubNav(true)} style={mobileNavItemStyle}
                                            onMouseOver={e => { e.currentTarget.querySelector('span.arrow').style.color = navArrowHover; }}
                                            onMouseOut={e => { e.currentTarget.querySelector('span.arrow').style.color = navArrowDefault; }}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Cubing</span>
                                            <span className="arrow" style={{ fontSize: 28, fontWeight: 700, color: navArrowDefault, marginLeft: 10, display: 'flex', alignItems: 'center', lineHeight: 1 }}>{'>'}</span>
                                        </button>
                                        <Link to="/learn/chess" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaChess style={{ color: '#a020f0', fontSize: 22, marginRight: 10 }} />Chess</Link>
                                        <Link to="/learn/coding" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaCode style={{ color: '#28a745', fontSize: 22, marginRight: 10 }} />Coding</Link>
                                        <Link to="/learn/cbse10" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaBook style={{ color: '#ff9800', fontSize: 22, marginRight: 10 }} />CBSE 10th</Link>
                                    </div>
                                ) : (
                                    <div className="mobile-subnav" style={mobilePanelStyle}>
                                        <button onClick={() => setMobileCubingSubNav(false)} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#007bff', fontWeight: 700, fontSize: 22, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0' }}>&larr; Back</button>
                                        <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Cubing</h3>
                                        <Link to="/learn/cubing" onClick={() => { setMobileSubNav(null); setMobileCubingSubNav(false); handleNavClose(); }} style={mobileNavItemStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Cubing</Link>
                                        <Link to="/learn/cubing/2x2" onClick={() => { setMobileSubNav(null); setMobileCubingSubNav(false); handleNavClose(); }} style={mobileNavItemStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />2x2 Cube</Link>
                                        <Link to="/learn/cubing/3x3" onClick={() => { setMobileSubNav(null); setMobileCubingSubNav(false); handleNavClose(); }} style={mobileNavItemStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />3x3 Cube</Link>
                                        <Link to="/learn/cubing/4x4" onClick={() => { setMobileSubNav(null); setMobileCubingSubNav(false); handleNavClose(); }} style={mobileNavItemStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />4x4 Cube</Link>
                                        <Link to="/learn/cubing/pyraminx" onClick={() => { setMobileSubNav(null); setMobileCubingSubNav(false); handleNavClose(); }} style={mobileNavItemStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Pyraminx</Link>
                                    </div>
                                )
                            ) : (
                                <button
                                    className="nav-mega-btn"
                                    aria-haspopup="true"
                                    aria-expanded={mobileSubNav === 'Learn'}
                                    style={mobileNavItemStyle}
                                    onClick={() => setMobileSubNav('Learn')}
                                    onMouseOver={e => { e.currentTarget.style.background = '#e6f0ff'; e.currentTarget.style.color = navArrowHover; e.currentTarget.querySelector('span.arrow').style.color = navArrowHover; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#222'; e.currentTarget.querySelector('span.arrow').style.color = navArrowDefault; }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}><FaBook style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Learn</span>
                                    <span className="arrow" style={{ fontSize: 28, fontWeight: 700, color: navArrowDefault, marginLeft: 10, display: 'flex', alignItems: 'center', lineHeight: 1 }}>{'>'}</span>
                                </button>
                            )
                        ) : (
                            <div
                                onMouseEnter={() => handleMegaMenuEnter('Learn')}
                                onMouseLeave={handleMegaMenuLeave}
                                style={{ display: 'inline-block' }}
                            >
                                <button
                                    className="nav-mega-btn"
                                    aria-haspopup="true"
                                    aria-expanded={openMega === 'Learn'}
                                    style={navLinkStyle}
                                    onMouseOver={e => { e.currentTarget.style.background = '#e6f0ff'; e.currentTarget.style.color = navArrowHover; e.currentTarget.querySelector('span').style.color = navArrowHover; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#222'; e.currentTarget.querySelector('span').style.color = navArrowDefault; }}
                                    onClick={() => setOpenMega(openMega === 'Learn' ? null : 'Learn')}
                                >
                                    Learn <span style={{ fontSize: 28, fontWeight: 700, marginLeft: 4, color: navArrowDefault, transition: 'color 0.18s' }}>{'>'}</span>
                                </button>
                                {openMega === 'Learn' && (
                                    <div
                                        ref={megaMenuRef}
                                        className="mega-menu"
                                        style={{
                                            position: 'absolute',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            top: 'calc(100% + 12px)',
                                            background: 'rgba(255,255,255,0.7)',
                                            backdropFilter: 'blur(18px) saturate(180%)',
                                            WebkitBackdropFilter: 'blur(18px) saturate(180%)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                                            borderRadius: 18,
                                            minWidth: 540,
                                            maxWidth: 900,
                                            padding: '2rem 2.5rem',
                                            zIndex: 200,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 32,
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <div className="mega-menu-columns" style={{ display: 'flex', flexDirection: 'row', gap: 32, width: '100%' }}>
                                            <div className="mega-menu-column" style={{ minWidth: 180, flex: 1 }}>
                                                <h4 style={{ color: '#007bff', fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Cubing</h4>
                                                <Link to="/learn/cubing" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Cubing</Link>
                                                <Link to="/learn/cubing/2x2" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />2x2 Cube</Link>
                                                <Link to="/learn/cubing/3x3" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />3x3 Cube</Link>
                                                <Link to="/learn/cubing/4x4" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />4x4 Cube</Link>
                                                <Link to="/learn/cubing/pyraminx" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Pyraminx</Link>
                                            </div>
                                            <div className="mega-menu-column" style={{ minWidth: 180, flex: 1 }}>
                                                <h4 style={{ color: '#a020f0', fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Chess</h4>
                                                <Link to="/learn/chess" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaChess style={{ color: '#a020f0', fontSize: 22, marginRight: 10 }} />Chess</Link>
                                                <Link to="/learn/chess/openings" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaBolt style={{ color: '#a020f0', fontSize: 22, marginRight: 10 }} />Openings</Link>
                                                <Link to="/learn/chess/tactics" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaPuzzlePiece style={{ color: '#a020f0', fontSize: 22, marginRight: 10 }} />Tactics</Link>
                                                <Link to="/learn/chess/endgames" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaFlagCheckered style={{ color: '#a020f0', fontSize: 22, marginRight: 10 }} />Endgames</Link>
                                            </div>
                                            <div className="mega-menu-column" style={{ minWidth: 180, flex: 1 }}>
                                                <h4 style={{ color: '#28a745', fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Coding</h4>
                                                <Link to="/learn/coding" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaCode style={{ color: '#28a745', fontSize: 22, marginRight: 10 }} />Coding</Link>
                                                <Link to="/learn/coding/projects" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaCode style={{ color: '#28a745', fontSize: 22, marginRight: 10 }} />Projects</Link>
                                                <Link to="/learn/coding/algorithms" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaBolt style={{ color: '#28a745', fontSize: 22, marginRight: 10 }} />Algorithms</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                    {/* Tools Dropdown */}
                    <li style={{ position: 'relative' }}>
                        {isMobile() ? (
                            mobileSubNav === 'Tools' ? (
                                <div className="mobile-subnav" style={mobilePanelStyle}>
                                    <button onClick={() => setMobileSubNav(null)} style={{ marginBottom: 24, background: 'none', border: 'none', color: '#007bff', fontWeight: 700, fontSize: 22, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0' }}>&larr; Back</button>
                                    <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Tools</h3>
                                    <Link to="/tools" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaThLarge style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Tools</Link>
                                    <Link to="/timer" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaFlagCheckered style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Timer</Link>
                                    <Link to="/scramble-gen" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaPuzzlePiece style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Scramble Gen</Link>
                                    <Link to="/solver-3x3" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />3x3 Solver</Link>
                                    <Link to="/play-chess" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaChess style={{ color: '#a020f0', fontSize: 22, marginRight: 10 }} />Chess Sim</Link>
                                    <Link to="/story-ai" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaMagic style={{ color: '#ff69b4', fontSize: 22, marginRight: 10 }} />Storywriting AI</Link>
                                    <Link to="/poem-gen" onClick={() => { setMobileSubNav(null); handleNavClose(); }} style={mobileNavItemStyle}><FaFeather style={{ color: '#0288d1', fontSize: 22, marginRight: 10 }} />Poem Generator</Link>
                                </div>
                            ) : (
                                <button
                                    className="nav-mega-btn"
                                    aria-haspopup="true"
                                    aria-expanded={mobileSubNav === 'Tools'}
                                    style={mobileNavItemStyle}
                                    onClick={() => setMobileSubNav('Tools')}
                                    onMouseOver={e => { e.currentTarget.style.background = '#e6f0ff'; e.currentTarget.style.color = navArrowHover; e.currentTarget.querySelector('span.arrow').style.color = navArrowHover; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#222'; e.currentTarget.querySelector('span.arrow').style.color = navArrowDefault; }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}><FaThLarge style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Tools</span>
                                    <span className="arrow" style={{ fontSize: 28, fontWeight: 700, color: navArrowDefault, marginLeft: 10, display: 'flex', alignItems: 'center', lineHeight: 1 }}>{'>'}</span>
                                </button>
                            )
                        ) : (
                            <div
                                onMouseEnter={() => handleMegaMenuEnter('Tools')}
                                onMouseLeave={handleMegaMenuLeave}
                                style={{ display: 'inline-block' }}
                            >
                                <button
                                    className="nav-mega-btn"
                                    aria-haspopup="true"
                                    aria-expanded={openMega === 'Tools'}
                                    style={navLinkStyle}
                                    onMouseOver={e => { e.currentTarget.style.background = '#e6f0ff'; e.currentTarget.style.color = navArrowHover; e.currentTarget.querySelector('span').style.color = navArrowHover; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#222'; e.currentTarget.querySelector('span').style.color = navArrowDefault; }}
                                    onClick={() => setOpenMega(openMega === 'Tools' ? null : 'Tools')}
                                >
                                    Tools <span style={{ fontSize: 28, fontWeight: 700, marginLeft: 4, color: navArrowDefault, transition: 'color 0.18s' }}>{'>'}</span>
                                </button>
                                {openMega === 'Tools' && (
                                    <div
                                        ref={megaMenuRef}
                                        className="mega-menu"
                                        style={{
                                            position: 'absolute',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            top: 'calc(100% + 12px)',
                                            background: 'rgba(255,255,255,0.7)',
                                            backdropFilter: 'blur(18px) saturate(180%)',
                                            WebkitBackdropFilter: 'blur(18px) saturate(180%)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                                            borderRadius: 18,
                                            minWidth: 540,
                                            maxWidth: 900,
                                            padding: '2rem 2.5rem',
                                            zIndex: 200,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 32,
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <div className="mega-menu-columns" style={{ display: 'flex', flexDirection: 'row', gap: 32, width: '100%' }}>
                                            <div className="mega-menu-column" style={{ minWidth: 180, flex: 1 }}>
                                                <h4 style={{ color: '#007bff', fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Cubing Tools</h4>
                                                <Link to="/tools" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaThLarge style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Tools</Link>
                                                <Link to="/timer" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaFlagCheckered style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Timer</Link>
                                                <Link to="/scramble-gen" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaPuzzlePiece style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Scramble Gen</Link>
                                                <Link to="/solver-3x3" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaCube style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />3x3 Solver</Link>
                                            </div>
                                            <div className="mega-menu-column" style={{ minWidth: 180, flex: 1 }}>
                                                <h4 style={{ color: '#a020f0', fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>Chess Tools</h4>
                                                <Link to="/play-chess" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaChess style={{ color: '#a020f0', fontSize: 22, marginRight: 10 }} />Chess Sim</Link>
                                                <Link to="/timer" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaFlagCheckered style={{ color: '#a020f0', fontSize: 22, marginRight: 10 }} />Timer</Link>
                                                <Link to="/story-ai" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaMagic style={{ color: '#ff69b4', fontSize: 22, marginRight: 10 }} />Storywriting AI</Link>
                                                <Link to="/poem-gen" onClick={() => { setOpenMega(null); handleNavClose(); }} style={navLinkStyle}><FaFeather style={{ color: '#0288d1', fontSize: 22, marginRight: 10 }} />Poem Generator</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                    <li>
                      <Link to="/fun-zone" onClick={handleNavClose} style={mobileNavItemStyle}>
                        <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}><FaLaughBeam style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Fun</span>
                      </Link>
                    </li>
                    <li><Link to="/community" onClick={handleNavClose} style={mobileNavItemStyle}>
                        <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}><FaUsers style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Community</span>
                    </Link></li>
                    <li><Link to="/leaderboard" onClick={handleNavClose} style={mobileNavItemStyle}>
                        <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}><FaTrophy style={{ color: '#007bff', fontSize: 22, marginRight: 10 }} />Leaderboard</span>
                    </Link></li>
                </ul>
            </nav>
            <div className={`header-auth${navOpen && isMobile() ? ' open' : ''}`}>
                {user ? (
                    <>
                        <div className="header-avatar-wrapper" onClick={() => setAvatarModalOpen(true)} style={{ position: 'relative', display: 'inline-block', marginRight: 12, cursor: 'pointer' }}>
                            <img
                                src={user.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=You'}
                                alt="avatar"
                                className="header-avatar"
                                style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #007bff', background: '#eee', objectFit: 'cover' }}
                            />
                            <span style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: '#fff',
                                borderRadius: '50%',
                                padding: 2,
                                boxShadow: '0 0 2px #888',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <FaCamera size={16} color="#007bff" />
                            </span>
                        </div>
                        <span className="welcome-user" style={{ marginBottom: 8 }}>{`Welcome, ${user.username}!`}</span>
                        <button onClick={() => { logout(); handleNavClose(); }} className="auth-button logout" style={{ marginTop: 8 }}>Logout</button>
                        {avatarModalOpen && (
                            <div className="avatar-modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000 }} onClick={() => setAvatarModalOpen(false)}>
                                <div className="avatar-modal" style={{ background: '#fff', borderRadius: 12, padding: 32, maxWidth: 340, margin: '10vh auto', position: 'relative', zIndex: 1001 }} onClick={e => e.stopPropagation()}>
                                    <h2 style={{ marginBottom: 18, color: '#007bff' }}>Change Avatar</h2>
                                    <div style={{ marginBottom: 16 }}>
                                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Choose a system avatar:</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                                            {systemAvatars.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`avatar${idx}`}
                                                    style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #007bff', objectFit: 'cover', cursor: 'pointer' }}
                                                    onClick={() => handleSystemAvatarSelect(img)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600, margin: '18px 0 8px 0' }}>Or upload your own:</div>
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} />
                                    {avatarPreview && (
                                        <img src={avatarPreview} alt="preview" style={{ maxWidth: 100, borderRadius: '50%', margin: '16px auto', display: 'block' }} />
                                    )}
                                    <button onClick={handleAvatarUpload} disabled={!avatarFile || uploading} style={{ marginTop: 16, background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>{uploading ? 'Uploading...' : 'Save Avatar'}</button>
                                    {feedback && <div style={{ color: '#d00', marginTop: 8 }}>{feedback}</div>}
                                    <button onClick={() => setAvatarModalOpen(false)} style={{ marginTop: 24, background: '#eee', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Close</button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login" className="auth-button login" onClick={handleNavClose}>Login</Link>
                        <Link to="/signup" className="auth-button signup" onClick={handleNavClose}>Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;

// Add shake animation CSS if not present
if (typeof window !== 'undefined' && !document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.innerHTML = `
        .shake-card {
            animation: shake 0.5s;
        }
        @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-8px); }
            80% { transform: translateX(8px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
}