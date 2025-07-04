import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OnboardingModal.css';

// List of available avatars (add more as needed)
const avatarImages = [
  require('../assets/images/2x2-rubiks-cube.jpg'),
  require('../assets/images/3x3-rubiks-cube.jpg'),
  require('../assets/images/4x4-rubiks-cube.jpg'),
  require('../assets/images/pyraminx-cube.jpg'),
  require('../assets/images/model.jpg'),
  require('../assets/images/community.jpg'),
];

const OnboardingModal = () => {
    const { showAvatarModal, setShowAvatarModal, pendingUser, updateUserProfile, setPendingUser } = useAuth();
    const [selected, setSelected] = useState(null);
    const [uploadUrl, setUploadUrl] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const navigate = useNavigate();

    if (!showAvatarModal || !pendingUser) return null;

    const handleSelect = (img) => {
        setSelected(img);
        setUploadUrl('');
        setUploadFile(null);
        setFileName('');
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            setUploadUrl(URL.createObjectURL(file));
            setSelected(null);
            setFileName(file.name);
        }
    };

    const handleSave = () => {
        let avatar = selected;
        if (uploadUrl) avatar = uploadUrl;
        updateUserProfile({ avatar });
        setShowAvatarModal(false);
        setPendingUser(null);
    };

    const handleCompleteProfile = () => {
        if (selectedRegion) {
            updateUserProfile({ region: selectedRegion });
            navigate('/community');
        } else {
            alert('Please select a region.');
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center' }}>
                <h2 style={{ color: '#007bff', marginBottom: 18 }}>Choose Your Avatar</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 18 }}>
                    {avatarImages.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`avatar${i}`}
                            onClick={() => handleSelect(img)}
                            style={{ width: 64, height: 64, borderRadius: '50%', border: selected === img ? '3px solid #007bff' : '2px solid #eee', cursor: 'pointer', objectFit: 'cover', boxShadow: selected === img ? '0 0 8px #007bff' : 'none', transition: 'box-shadow 0.2s, border 0.2s' }}
                        />
                    ))}
                </div>
                <div style={{ marginBottom: 18 }}>
                    <label htmlFor="avatar-upload" style={{ display: 'inline-block', background: '#007bff', color: '#fff', borderRadius: 8, padding: '10px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
                        Choose File
                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                    </label>
                    {fileName && <div style={{ fontSize: 14, color: '#007bff', marginTop: 4 }}>{fileName}</div>}
                </div>
                {uploadUrl && (
                    <img src={uploadUrl} alt="uploaded avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid #007bff', objectFit: 'cover', marginBottom: 12 }} />
                )}
                <button onClick={handleSave} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontSize: 18, fontWeight: 600, cursor: 'pointer', marginTop: 8 }} disabled={!selected && !uploadUrl}>Save Avatar</button>
            </div>
        </div>
    );
};

export default OnboardingModal; 