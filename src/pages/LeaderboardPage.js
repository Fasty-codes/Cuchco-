import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { FaTrophy, FaMedal, FaAward, FaCrown, FaStar, FaCamera, FaVideo } from 'react-icons/fa';

const avatars = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Steve',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Cube',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Speed',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pro',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=You',
];

const regions = ['All', 'Americas', 'Europe', 'Asia', 'Africa', 'Oceania'];
const cubeTypes = [
  { key: '2x2', label: '2x2' },
  { key: '3x3', label: '3x3' },
  { key: '4x4', label: '4x4' },
  { key: 'pyraminx', label: 'Pyraminx' },
];

function formatRecord({ min, sec, ms }) {
  return `${min || 0}:${(sec || 0).toString().padStart(2, '0')}.${(ms || 0).toString().padStart(2, '0')}`;
}

function getTimeInMs({ min, sec, ms }) {
  return (parseInt(min) || 0) * 60000 + (parseInt(sec) || 0) * 1000 + (parseInt(ms) || 0) * 10;
}

function getRankIcon(rank) {
  if (rank === 1) return <FaCrown style={{ color: '#FFD700', fontSize: '20px' }} />;
  if (rank === 2) return <FaMedal style={{ color: '#C0C0C0', fontSize: '18px' }} />;
  if (rank === 3) return <FaAward style={{ color: '#CD7F32', fontSize: '16px' }} />;
  return <FaStar style={{ color: '#007bff', fontSize: '14px' }} />;
}

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [region, setRegion] = useState('All');
  const [cubeType, setCubeType] = useState('3x3');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.username || '',
    avatar: user?.avatar || avatars[5],
    region: user?.region || 'Americas',
    cubeType: '3x3',
    record: { min: '', sec: '', ms: '' },
    image: '',
    video: '',
    mediaType: '',
    mediaFile: null,
  });
  const [mediaUrl, setMediaUrl] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching records:', error);
        setFeedback('❌ Error loading leaderboard data');
      } else if (data) {
        setRecords(data);
        setFeedback('');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setFeedback('❌ Error loading leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = e => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, mediaFile: file, mediaType: file.type }));
      setMediaUrl(URL.createObjectURL(file));
    }
  };

  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleRecordChange = (field, value) => {
    setForm(f => ({ ...f, record: { ...f.record, [field]: value } }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.record.min && !form.record.sec && !form.record.ms) {
      setFeedback('Please enter a record time.');
      return;
    }
    
    setLoading(true);
    setFeedback('');

    try {
      // Insert into Supabase
      const { data, error } = await supabase.from('leaderboard').insert([
        {
          name: user?.username || form.name,
          avatar: user?.avatar || form.avatar,
          region: user?.region || form.region,
          cubeType: form.cubeType,
          min: parseInt(form.record.min) || 0,
          sec: parseInt(form.record.sec) || 0,
          ms: parseInt(form.record.ms) || 0,
          image: form.mediaType && form.mediaType.startsWith('image') ? mediaUrl : '',
          video: form.mediaType && form.mediaType.startsWith('video') ? mediaUrl : '',
          total_ms: getTimeInMs(form.record)
        }
      ]);

      if (error) {
        console.error('Supabase error:', error);
        setFeedback('Error posting record: ' + error.message);
      } else {
        setFeedback('Record posted successfully!');
        fetchRecords();
      }
    } catch (err) {
      console.error('Submit error:', err);
      setFeedback('Error posting record');
    } finally {
      setLoading(false);
    }

    setForm({
      name: user?.username || '',
      avatar: user?.avatar || avatars[5],
      region: user?.region || 'Americas',
      cubeType: '3x3',
      record: { min: '', sec: '', ms: '' },
      image: '',
      video: '',
      mediaType: '',
      mediaFile: null,
    });
    setMediaUrl('');
    setTimeout(() => setFeedback(''), 3000);
  };

  const filtered = records.filter(
    r => (region === 'All' || r.region === region) && r.cubeType === cubeType
  ).sort((a, b) => {
    const timeA = getTimeInMs(a);
    const timeB = getTimeInMs(b);
    return timeA - timeB; // Sort by fastest time first
  });

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ color: '#333', fontSize: 48, marginBottom: 24, fontWeight: 700 }}>🏆 Leaderboard</h1>
      
      <div style={{ width: '100%', maxWidth: 800, marginBottom: 32 }}>
        <h2 style={{ color: '#333', fontSize: 28, marginBottom: 16, textAlign: 'center', letterSpacing: 1 }}>Post a New Record</h2>
        {!user ? (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '2rem', textAlign: 'center', color: '#666', fontSize: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', backdropFilter: 'blur(10px)' }}>
            Please log in to post a record.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: 20, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)', 
            padding: '2rem', 
            width: '100%', 
            maxWidth: 800, 
            margin: '0 auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 20,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
              <img src={user.avatar || avatars[5]} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #007bff', boxShadow: '0 4px 16px rgba(0,123,255,0.3)' }} />
              <span style={{ fontWeight: 700, color: '#007bff', fontSize: 20 }}>{user.username}</span>
              <span style={{ color: '#666', fontSize: 16, background: 'linear-gradient(135deg, #e6f0ff 0%, #f0f8ff 100%)', borderRadius: 8, padding: '6px 16px', border: '1px solid #007bff' }}>{user.region}</span>
              <select value={form.cubeType} onChange={e => handleFormChange('cubeType', e.target.value)} style={{ 
                padding: '10px 16px', 
                borderRadius: 8, 
                fontSize: 16, 
                border: '2px solid #e9ecef',
                background: '#fff',
                color: '#333',
                fontWeight: 600
              }}>
                {cubeTypes.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="number" placeholder="Min" min="0" value={form.record.min} onChange={e => handleRecordChange('min', e.target.value)} style={{ 
                  width: 70, 
                  padding: '10px', 
                  borderRadius: 8, 
                  fontSize: 16, 
                  border: '2px solid #e9ecef',
                  textAlign: 'center'
                }} />
                <span style={{ fontSize: 18, fontWeight: 700, color: '#666' }}>:</span>
                <input type="number" placeholder="Sec" min="0" max="59" value={form.record.sec} onChange={e => handleRecordChange('sec', e.target.value)} style={{ 
                  width: 70, 
                  padding: '10px', 
                  borderRadius: 8, 
                  fontSize: 16, 
                  border: '2px solid #e9ecef',
                  textAlign: 'center'
                }} />
                <span style={{ fontSize: 18, fontWeight: 700, color: '#666' }}>.</span>
                <input type="number" placeholder="Ms" min="0" max="99" value={form.record.ms} onChange={e => handleRecordChange('ms', e.target.value)} style={{ 
                  width: 70, 
                  padding: '10px', 
                  borderRadius: 8, 
                  fontSize: 16, 
                  border: '2px solid #e9ecef',
                  textAlign: 'center'
                }} />
              </div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '10px 16px', 
                background: '#007bff', 
                color: '#fff', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 16
              }}>
                {form.mediaType?.startsWith('image') ? <FaCamera /> : <FaVideo />}
                Add Media
                <input type="file" accept="image/*,video/*" onChange={handleMediaChange} style={{ display: 'none' }} />
              </label>
            </div>
            {mediaUrl && form.mediaType && form.mediaType.startsWith('image') && (
              <img src={mediaUrl} alt="preview" style={{ maxWidth: 150, borderRadius: 12, margin: '0 auto', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
            )}
            {mediaUrl && form.mediaType && form.mediaType.startsWith('video') && (
              <video src={mediaUrl} controls style={{ maxWidth: 200, borderRadius: 12, margin: '0 auto', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
            )}
            <button type="submit" disabled={loading} style={{ 
              background: loading ? '#ccc' : 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 12, 
              padding: '16px 0', 
              fontSize: 20, 
              fontWeight: 700, 
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 12,
              boxShadow: '0 4px 16px rgba(0,123,255,0.3)',
              transition: 'all 0.3s ease'
            }}>
              {loading ? 'Posting...' : '🏆 Post Record'}
            </button>
            {feedback && <div style={{ 
              color: feedback.includes('Error') ? '#dc3545' : '#28a745', 
              fontWeight: 700, 
              marginTop: 12, 
              textAlign: 'center',
              padding: '16px',
              borderRadius: 12,
              background: feedback.includes('Error') ? '#fef2f2' : '#d4edda',
              border: feedback.includes('Error') ? '2px solid #fecaca' : '2px solid #c3e6cb',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>{feedback}</div>}
          </form>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <select value={region} onChange={e => setRegion(e.target.value)} style={{ 
          padding: '12px 20px', 
          fontSize: 18, 
          borderRadius: 12, 
          border: '2px solid #ddd', 
          color: '#333', 
          fontWeight: 600,
          background: '#fff'
        }}>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8 }}>
          {cubeTypes.map(c => (
            <button
              key={c.key}
              onClick={() => setCubeType(c.key)}
              style={{ 
                padding: '12px 20px', 
                fontSize: 18, 
                borderRadius: 12, 
                border: cubeType === c.key ? '2px solid #007bff' : '2px solid #ddd', 
                background: cubeType === c.key ? '#007bff' : '#fff', 
                color: cubeType === c.key ? '#fff' : '#333', 
                fontWeight: 600, 
                cursor: 'pointer'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ 
        width: '100%', 
        maxWidth: 900, 
        background: 'rgba(255,255,255,0.95)', 
        borderRadius: 20, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)', 
        padding: '2rem', 
        overflowX: 'auto',
        backdropFilter: 'blur(10px)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)' }}>
              <th style={{ padding: 16, fontSize: 18, color: '#007bff', textAlign: 'left', fontWeight: 700 }}>Rank</th>
              <th style={{ padding: 16, fontSize: 18, color: '#007bff', textAlign: 'left', fontWeight: 700 }}>Avatar</th>
              <th style={{ padding: 16, fontSize: 18, color: '#007bff', textAlign: 'left', fontWeight: 700 }}>Name</th>
              <th style={{ padding: 16, fontSize: 18, color: '#007bff', textAlign: 'left', fontWeight: 700 }}>Region</th>
              <th style={{ padding: 16, fontSize: 18, color: '#007bff', textAlign: 'left', fontWeight: 700 }}>Cube</th>
              <th style={{ padding: 16, fontSize: 18, color: '#007bff', textAlign: 'left', fontWeight: 700 }}>Record</th>
              <th style={{ padding: 16, fontSize: 18, color: '#007bff', textAlign: 'left', fontWeight: 700 }}>Media</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} style={{ color: '#666', textAlign: 'center', fontSize: 18, padding: '2rem' }}>Loading records...</td></tr>
            )}
            {!loading && feedback.includes('Error') && (
              <tr><td colSpan={7} style={{ 
                color: '#dc3545', 
                textAlign: 'center', 
                fontSize: 18, 
                padding: '2rem',
                background: '#fef2f2',
                border: '2px solid #fecaca',
                borderRadius: 8
              }}>❌ {feedback}</td></tr>
            )}
            {!loading && !feedback.includes('Error') && filtered.length === 0 && (
              <tr><td colSpan={7} style={{ color: '#888', textAlign: 'center', fontSize: 18, padding: '2rem' }}>No records yet for this category.</td></tr>
            )}
            {filtered.map((r, i) => (
              <tr key={r.id || i} style={{ 
                borderBottom: '1px solid #eee',
                background: i % 2 === 0 ? '#fff' : '#f8f9fa'
              }}>
                <td style={{ padding: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {getRankIcon(i + 1)}
                  <span style={{ fontSize: 18 }}>{i + 1}</span>
                </td>
                <td style={{ padding: 16 }}>
                  <img src={r.avatar} alt="avatar" style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%',
                    border: '3px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} />
                </td>
                <td style={{ padding: 16, fontSize: 16, fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: 16 }}>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #e6f0ff 0%, #f0f8ff 100%)', 
                    color: '#007bff', 
                    padding: '4px 12px', 
                    borderRadius: 6, 
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    {r.region}
                  </span>
                </td>
                <td style={{ padding: 16, fontWeight: 600 }}>{r.cubeType}</td>
                <td style={{ padding: 16, fontSize: 18, fontWeight: 700, color: '#007bff' }}>
                  {formatRecord({ min: r.min, sec: r.sec, ms: r.ms })}
                </td>
                <td style={{ padding: 16 }}>
                  {r.image && (
                    <img src={r.image} alt="media" style={{ 
                      maxWidth: 60, 
                      borderRadius: 8,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }} />
                  )}
                  {r.video && (
                    <video src={r.video} controls style={{ 
                      maxWidth: 80, 
                      borderRadius: 8,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage; 