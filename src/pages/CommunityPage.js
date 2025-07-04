import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import './CommunityPage.css';

const avatars = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Steve',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Cube',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Speed',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pro',
];

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setPosts(data);
  };

  const handleMediaChange = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image')) {
      setMedia(file);
      setMediaUrl(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handlePost = async e => {
    e.preventDefault();
    if (!content.trim()) return;
    // Insert into Supabase
    const { data, error } = await supabase.from('posts').insert([
      {
        user: user?.username || 'You',
        avatar: user?.avatar || avatars[0],
        content,
        media: mediaUrl,
        mediaType: media ? media.type : '',
        timestamp: Date.now(),
      }
    ]);
    if (!error) {
      setFeedback('Post submitted!');
      fetchPosts();
    } else {
      setFeedback('Error submitting post: ' + JSON.stringify(error));
    }
    setContent('');
    setMedia(null);
    setMediaUrl('');
    setFileName('');
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <div className="community-page" style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem 0' }}>
      <h1 style={{ color: '#007bff', fontSize: 36, marginBottom: 24, textAlign: 'center' }}>Community</h1>
      <form onSubmit={handlePost} className="community-form" style={{ maxWidth: 600, margin: '0 auto 32px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem 1.5rem' }}>
        <div className="community-form-header" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <img src={user?.avatar || avatars[0]} alt="avatar" className="community-avatar" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f0f4ff', background: '#eee' }} />
          <span className="community-username" style={{ fontWeight: 600, color: '#007bff', fontSize: 18 }}>{user?.username || 'You'}</span>
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share something with the community..."
          className="community-textarea"
          style={{ width: '100%', minHeight: 70, fontSize: 18, borderRadius: 8, border: '1px solid #e0e4ea', padding: 12, marginBottom: 12, resize: 'vertical' }}
        />
        <input type="file" accept="image/*" onChange={handleMediaChange} style={{ marginBottom: 10 }} />
        {mediaUrl && (
          <img src={mediaUrl} alt="preview" style={{ maxWidth: 120, borderRadius: 8, margin: '0.5rem 0', display: 'block' }} />
        )}
        <button type="submit" className="community-post-btn" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 18, fontWeight: 700, width: '100%', marginTop: 8 }}>Post</button>
        {feedback && <div style={{ color: feedback.includes('Error') ? '#d00' : '#28a745', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>{feedback}</div>}
      </form>
      <div className="community-posts-feed">
        {posts.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>No posts yet.</div>}
        {posts.map(post => (
          <div key={post.id} className="community-post-card">
            <img src={post.avatar} alt="avatar" className="community-post-avatar" />
            <div className="community-post-main">
              <div className="community-post-header">
                <span className="community-post-user">{post.user}</span>
                <span className="community-post-date">{new Date(post.timestamp).toLocaleString()}</span>
              </div>
              <div className="community-post-content">{post.content}</div>
              {post.media && (
                <img src={post.media} alt="media" className="community-post-media" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage; 