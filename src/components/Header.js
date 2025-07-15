import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/Rubiks-cube-1.jpg';
import './Header.css';  
import { FaCamera, FaLock, FaHome, FaBook, FaUsers, FaTrophy, FaTools, FaThLarge } from 'react-icons/fa';
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

    const systemAvatars = [RubiksCube1, RubiksCube2, RubiksCube3, RubiksCube4, RubiksCube5, RubiksCube6, RubiksCube7, RubiksCube8, RubiksCube9, RubiksCube10];

    const isMobile = () => window.innerWidth <= 800;
    const navigate = useNavigate();

    const handleNavClose = () => {
        setNavOpen(false);
        setLearnOpen(false);
        setCubingOpen(false);
        setToolsOpen(false);
    };

    // Close dropdown on click outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setToolsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                }}>
                  C
                </span>
                <Link to="/" style={{ color: '#4CAF50', fontWeight: 700, fontSize: '1.7rem', textDecoration: 'none', letterSpacing: '1px' }} onClick={handleNavClose}>Cuchco</Link>
            </div>
            <button className="hamburger" aria-label="Toggle navigation" onClick={() => setNavOpen(o => !o)}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
            <nav className={`header-nav${navOpen ? ' open' : ''}`}>
                <ul>
                    <li><Link to="/" onClick={handleNavClose}><span className="nav-icon"><FaHome style={{marginRight:8, verticalAlign:'middle'}} /></span>Home</Link></li>
                    <li className="tools-dropdown"
                        onMouseEnter={() => { if (!isMobile()) setLearnOpen(true); }}
                        onMouseLeave={() => { if (!isMobile()) { setLearnOpen(false); setCubingOpen(false); } }}
                    >
                        <button
                            className="tools-dropdown-btn"
                            tabIndex={0}
                            aria-haspopup="true"
                            aria-expanded={learnOpen}
                            style={{ display: 'block' }}
                            onClick={() => {
                                handleNavClose();
                                navigate('/learn');
                            }}
                        >
                            <span className="nav-icon"><FaBook style={{marginRight:8, verticalAlign:'middle'}} /></span>Learn ▼
                        </button>
                        <ul className="dropdown-menu" style={{ display: learnOpen ? 'block' : 'none' }}>
                            <li className="tools-dropdown"
                                onMouseEnter={() => { if (!isMobile()) setCubingOpen(true); }}
                                onMouseLeave={() => { if (!isMobile()) setCubingOpen(false); }}
                            >
                                <button
                                    className="tools-dropdown-btn"
                                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 16px', fontSize: '1rem', display: 'block' }}
                                    onClick={() => {
                                        handleNavClose();
                                        navigate('/learn/cubing');
                                    }}
                                >Cubing ▶</button>
                                <ul
                                    className="dropdown-menu"
                                    style={{
                                        display: cubingOpen ? 'block' : 'none',
                                        position: isMobile() ? 'static' : 'absolute',
                                        left: isMobile() ? '0' : '100%',
                                        top: isMobile() ? '0' : 0,
                                        minWidth: 140,
                                        zIndex: 100,
                                    }}
                                >
                                    <li className={shakeDropdown['2x2'] ? 'shake-card' : ''}>
                                        <span style={{ width: '100%', display: 'inline-block', padding: '8px 16px', cursor: 'pointer' }}
                                            onClick={e => {
                                                e.preventDefault();
                                                setShakeDropdown(prev => ({ ...prev, ['2x2']: true }));
                                                setTimeout(() => setShakeDropdown(prev => ({ ...prev, ['2x2']: false })), 500);
                                            }}
                                        >2x2 <FaLock style={{ marginLeft: 8, color: '#888', fontSize: 16, verticalAlign: 'middle' }} /></span>
                                    </li>
                                    <li><Link to="/learn/cubing/3x3" style={{ width: '100%', display: 'inline-block', padding: '8px 16px' }} onClick={handleNavClose}>3x3</Link></li>
                                    <li className={shakeDropdown['4x4'] ? 'shake-card' : ''}>
                                        <span style={{ width: '100%', display: 'inline-block', padding: '8px 16px', cursor: 'pointer' }}
                                            onClick={e => {
                                                e.preventDefault();
                                                setShakeDropdown(prev => ({ ...prev, ['4x4']: true }));
                                                setTimeout(() => setShakeDropdown(prev => ({ ...prev, ['4x4']: false })), 500);
                                            }}
                                        >4x4 <FaLock style={{ marginLeft: 8, color: '#888', fontSize: 16, verticalAlign: 'middle' }} /></span>
                                    </li>
                                    <li className={shakeDropdown['pyraminx'] ? 'shake-card' : ''}>
                                        <span style={{ width: '100%', display: 'inline-block', padding: '8px 16px', cursor: 'pointer' }}
                                            onClick={e => {
                                                e.preventDefault();
                                                setShakeDropdown(prev => ({ ...prev, ['pyraminx']: true }));
                                                setTimeout(() => setShakeDropdown(prev => ({ ...prev, ['pyraminx']: false })), 500);
                                            }}
                                        >Pyraminx <FaLock style={{ marginLeft: 8, color: '#888', fontSize: 16, verticalAlign: 'middle' }} /></span>
                                    </li>
                                </ul>
                            </li>
                            <li><Link to="/learn/coding" onClick={handleNavClose}>Coding</Link></li>
                            <li><Link to="/learn/chess" onClick={handleNavClose}>Chess</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/community" onClick={handleNavClose}><span className="nav-icon"><FaUsers style={{marginRight:8, verticalAlign:'middle'}} /></span>Community</Link></li>
                    <li><Link to="/leaderboard" onClick={handleNavClose}><span className="nav-icon"><FaTrophy style={{marginRight:8, verticalAlign:'middle'}} /></span>Leaderboard</Link></li>
                    <li className="tools-dropdown"
                        ref={dropdownRef}
                        onMouseEnter={() => { if (!isMobile()) setToolsOpen(true); }}
                        onMouseLeave={() => { if (!isMobile()) setToolsOpen(false); }}
                    >
                        <button
                            className="tools-dropdown-btn"
                            tabIndex={0}
                            aria-haspopup="true"
                            aria-expanded={toolsOpen}
                            onClick={e => {
                                if (isMobile()) {
                                    e.preventDefault();
                                    if (toolsOpen) {
                                        setToolsOpen(false);
                                    } else {
                                        setToolsOpen(true);
                                        setLearnOpen(false);
                                        setCubingOpen(false);
                                    }
                                }
                            }}
                        >
                            <span className="nav-icon"><FaThLarge style={{marginRight:8, verticalAlign:'middle'}} /></span>More ▼
                        </button>
                        <ul className="dropdown-menu" style={{ display: toolsOpen ? 'block' : 'none' }}>
                            <li><Link to="/play-chess" onClick={handleNavClose}>Chess Sim</Link></li>
                            <li><Link to="/timer" onClick={handleNavClose}>Timer</Link></li>
                            <li><Link to="/scramble-gen" onClick={handleNavClose}>Scramble Gen</Link></li>
                            <li><Link to="/solver-3x3" onClick={handleNavClose}>3x3 Solver</Link></li>
                        </ul>
                    </li>
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