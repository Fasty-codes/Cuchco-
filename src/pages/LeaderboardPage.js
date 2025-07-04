import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';

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

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [region, setRegion] = useState('All');
  const [cubeType, setCubeType] = useState('3x3');
  const [records, setRecords] = useState([]); // Supabase records
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
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setRecords(data);
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
    setFeedback('');
    // Insert into Supabase
    const { data, error } = await supabase.from('leaderboard').insert([
      {
        name: user?.username || form.name,
        avatar: user?.avatar || form.avatar,
        region: user?.region || form.region,
        cubeType: form.cubeType,
        min: form.record.min,
        sec: form.record.sec,
        ms: form.record.ms,
        image: form.mediaType && form.mediaType.startsWith('image') ? mediaUrl : '',
        video: form.mediaType && form.mediaType.startsWith('video') ? mediaUrl : '',
      }
    ]);
    if (!error) {
      setFeedback('Record posted!');
      fetchRecords();
    } else {
      setFeedback('Error posting record.');
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
    setTimeout(() => setFeedback(''), 2000);
  };

  const filtered = records.filter(
    r => (region === 'All' || r.region === region) && r.cubeType === cubeType
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24 }}>Leaderboard</h1>
      <div style={{ width: '100%', maxWidth: 700, marginBottom: 32 }}>
        <h2 style={{ color: '#222', fontSize: 24, marginBottom: 16, textAlign: 'center', letterSpacing: 1 }}>Post a New Record</h2>
        {!user ? (
          <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', textAlign: 'center', color: '#888', fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            Please log in to post a record.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.5rem 1rem', width: '100%', maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginBottom: 8 }}>
              <img src={user.avatar || avatars[5]} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #007bff', background: '#eee' }} />
              <span style={{ fontWeight: 600, color: '#007bff', fontSize: 18 }}>{user.username}</span>
              <span style={{ color: '#888', fontSize: 16, background: '#e6f0ff', borderRadius: 6, padding: '4px 12px' }}>{user.region}</span>
              <select value={form.cubeType} onChange={e => handleFormChange('cubeType', e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, fontSize: 16 }}>
                {cubeTypes.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <input type="number" placeholder="Min" min="0" value={form.record.min} onChange={e => handleRecordChange('min', e.target.value)} style={{ width: 60, padding: '8px', borderRadius: 6, fontSize: 16 }} />
              <input type="number" placeholder="Sec" min="0" max="59" value={form.record.sec} onChange={e => handleRecordChange('sec', e.target.value)} style={{ width: 60, padding: '8px', borderRadius: 6, fontSize: 16 }} />
              <input type="number" placeholder="Ms" min="0" max="99" value={form.record.ms} onChange={e => handleRecordChange('ms', e.target.value)} style={{ width: 60, padding: '8px', borderRadius: 6, fontSize: 16 }} />
              <input type="file" accept="image/*,video/*" onChange={handleMediaChange} style={{ fontSize: 16 }} />
            </div>
            {mediaUrl && form.mediaType && form.mediaType.startsWith('image') && (
              <img src={mediaUrl} alt="preview" style={{ maxWidth: 120, borderRadius: 8, margin: '0 auto' }} />
            )}
            {mediaUrl && form.mediaType && form.mediaType.startsWith('video') && (
              <video src={mediaUrl} controls style={{ maxWidth: 180, borderRadius: 8, margin: '0 auto' }} />
            )}
            <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 20, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>Post Record</button>
            {feedback && <div style={{ color: feedback.includes('updated') ? '#28a745' : '#d00', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>{feedback}</div>}
          </form>
        )}
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <select value={region} onChange={e => setRegion(e.target.value)} style={{ padding: '8px 18px', fontSize: 18, borderRadius: 8, border: '1px solid #bbb', color: '#007bff', fontWeight: 600 }}>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8 }}>
          {cubeTypes.map(c => (
            <button
              key={c.key}
              onClick={() => setCubeType(c.key)}
              style={{ padding: '8px 18px', fontSize: 18, borderRadius: 8, border: cubeType === c.key ? '2px solid #007bff' : '1px solid #bbb', background: cubeType === c.key ? '#e6f0ff' : '#fff', color: '#007bff', fontWeight: 600, cursor: 'pointer' }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: 700, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2rem 1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f4ff' }}>
              <th style={{ padding: 12, fontSize: 18, color: '#007bff', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: 12, fontSize: 18, color: '#007bff', textAlign: 'left' }}>Avatar</th>
              <th style={{ padding: 12, fontSize: 18, color: '#007bff', textAlign: 'left' }}>Name</th>
              <th style={{ padding: 12, fontSize: 18, color: '#007bff', textAlign: 'left' }}>Region</th>
              <th style={{ padding: 12, fontSize: 18, color: '#007bff', textAlign: 'left' }}>Cube</th>
              <th style={{ padding: 12, fontSize: 18, color: '#007bff', textAlign: 'left' }}>Record</th>
              <th style={{ padding: 12, fontSize: 18, color: '#007bff', textAlign: 'left' }}>Media</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ color: '#888', textAlign: 'center', fontSize: 18 }}>No records yet.</td></tr>
            )}
            {filtered.map((r, i) => (
              <tr key={r.id || i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 10, fontWeight: 700 }}>{i + 1}</td>
                <td style={{ padding: 10 }}><img src={r.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%' }} /></td>
                <td style={{ padding: 10 }}>{r.name}</td>
                <td style={{ padding: 10 }}>{r.region}</td>
                <td style={{ padding: 10 }}>{r.cubeType}</td>
                <td style={{ padding: 10 }}>{formatRecord({ min: r.min, sec: r.sec, ms: r.ms })}</td>
                <td style={{ padding: 10 }}>
                  {r.image && <img src={r.image} alt="media" style={{ maxWidth: 40, borderRadius: 4 }} />}
                  {r.video && <video src={r.video} controls style={{ maxWidth: 60, borderRadius: 4 }} />}
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