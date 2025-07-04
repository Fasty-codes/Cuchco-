import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/Rubiks-cube-1.jpg';
import './Header.css';
import { FaCamera } from 'react-icons/fa';
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
    const { user, logout } = useAuth();
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

    const systemAvatars = [RubiksCube1, RubiksCube2, RubiksCube3, RubiksCube4, RubiksCube5, RubiksCube6, RubiksCube7, RubiksCube8, RubiksCube9, RubiksCube10];

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
        // Upload to Supabase Storage
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id || user.username}-${Date.now()}.${fileExt}`;
        const { data: storageData, error: storageError } = await supabase.storage.from('avatars').upload(fileName, avatarFile, { upsert: true });
        if (storageError) {
            setFeedback('Upload failed: ' + storageError.message);
            setUploading(false);
            return;
        }
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        const avatarUrl = publicUrlData.publicUrl;
        // Update user profile in Supabase
        const { error: updateError } = await supabase.from('users').update({ avatar: avatarUrl }).eq('id', user.id);
        if (updateError) {
            setFeedback('Failed to update profile: ' + updateError.message);
            setUploading(false);
            return;
        }
        window.location.reload(); // Fastest way to reflect everywhere
    };

    const handleSystemAvatarSelect = async (avatarUrl) => {
        if (!user) return;
        setUploading(true);
        setFeedback('');
        // Update user profile in Supabase
        const { error: updateError } = await supabase.from('users').update({ avatar: avatarUrl }).eq('id', user.id);
        if (updateError) {
            setFeedback('Failed to update profile.');
            setUploading(false);
            return;
        }
        window.location.reload();
    };

    return (
        <header className="app-header">
            <div className="header-logo">
                <img src={logo} alt="Cuchco Logo" />
                <Link to="/">Cuchco</Link>
            </div>
            <button className="hamburger" aria-label="Toggle navigation" onClick={() => setNavOpen(o => !o)}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
            <nav className={`header-nav${navOpen ? ' open' : ''}`}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li
                        className="tools-dropdown"
                        onMouseEnter={() => setLearnOpen(true)}
                        onMouseLeave={() => { setLearnOpen(false); setCubingOpen(false); }}
                    >
                        <button
                            className="tools-dropdown-btn"
                            tabIndex={0}
                            aria-haspopup="true"
                            aria-expanded={learnOpen}
                            onFocus={() => setLearnOpen(true)}
                            onBlur={e => {
                                if (!e.currentTarget.parentNode.contains(e.relatedTarget)) {
                                    setLearnOpen(false);
                                    setCubingOpen(false);
                                }
                            }}
                        >
                            Learn ▼
                        </button>
                        <ul className="dropdown-menu" style={{ display: learnOpen ? 'block' : 'none' }}>
                            <li
                                className="tools-dropdown"
                                onMouseEnter={() => setCubingOpen(true)}
                                onMouseLeave={() => setCubingOpen(false)}
                                style={{ position: 'relative' }}
                            >
                                <Link to="/learn/cubing" style={{ display: 'inline-block', width: '100%' }}>Cubing ▶</Link>
                                <ul
                                    className="dropdown-menu"
                                    style={{
                                        display: cubingOpen ? 'block' : 'none',
                                        position: 'absolute',
                                        left: '100%',
                                        top: 0,
                                        minWidth: 140,
                                        zIndex: 100,
                                    }}
                                >
                                    <li><button style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '8px 16px', cursor: 'pointer' }} onClick={() => alert('Coming soon...')}>2x2</button></li>
                                    <li><button style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '8px 16px', cursor: 'pointer' }} onClick={() => alert('Coming soon...')}>3x3</button></li>
                                    <li><button style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '8px 16px', cursor: 'pointer' }} onClick={() => alert('Coming soon...')}>4x4</button></li>
                                    <li><button style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '8px 16px', cursor: 'pointer' }} onClick={() => alert('Coming soon...')}>Pyraminx</button></li>
                                </ul>
                            </li>
                            <li><Link to="/learn/coding">Coding</Link></li>
                            <li><Link to="/learn/chess">Chess</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/community">Community</Link></li>
                    <li><Link to="/leaderboard">Leaderboard</Link></li>
                    <li
                        className="tools-dropdown"
                        ref={dropdownRef}
                        onMouseEnter={() => setToolsOpen(true)}
                        onMouseLeave={() => setToolsOpen(false)}
                    >
                        <button
                            className="tools-dropdown-btn"
                            tabIndex={0}
                            aria-haspopup="true"
                            aria-expanded={toolsOpen}
                            onFocus={() => setToolsOpen(true)}
                            onBlur={e => {
                                if (!e.currentTarget.parentNode.contains(e.relatedTarget)) {
                                    setToolsOpen(false);
                                }
                            }}
                        >
                            Tools ▼
                        </button>
                        <ul className="dropdown-menu" style={{ display: toolsOpen ? 'block' : 'none' }}>
                            <li><Link to="/timer">Timer</Link></li>
                            <li><Link to="/scramble-gen">Scramble Generator</Link></li>
                            <li><Link to="/solver-3x3">3x3 Solver</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <div className={`header-auth${navOpen ? ' open' : ''}`}>
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
                        <span className="welcome-user">Welcome, {user.username}!</span>
                        <button onClick={logout} className="auth-button logout">Logout</button>
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
                        <Link to="/login" className="auth-button login">Login</Link>
                        <Link to="/signup" className="auth-button signup">Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header; 