import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaImage, FaTimes, FaUser, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
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
  const { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingToComment, setReplyingToComment] = useState(null);
  const [viewingSinglePost, setViewingSinglePost] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [nestedReplyTo, setNestedReplyTo] = useState(null);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  // Debug posts state changes
  useEffect(() => {
    console.log('Posts state changed:', posts);
  }, [posts]);

  // Handle single post viewing
  useEffect(() => {
    if (postId) {
      setViewingSinglePost(true);
      // Find the specific post and scroll to it
      const targetPost = posts.find(post => post.id.toString() === postId);
      if (targetPost) {
        // Scroll to the post after a short delay
        setTimeout(() => {
          const postElement = document.getElementById(`post-${postId}`);
          if (postElement) {
            postElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }
  }, [postId, posts]);

  const fetchPosts = async () => {
    console.log('=== FETCHING POSTS DEBUG ===');
    try {
      // Try to fetch from Supabase
      console.log('Fetching from Supabase...');
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Supabase fetch error:', error);
        // Fallback to localStorage posts
        const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
        console.log('Using localStorage posts:', localPosts);
        setPosts(localPosts);
      } else if (data) {
        // Combine Supabase posts with localStorage posts
        const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
        console.log('Supabase posts:', data);
        console.log('Local posts:', localPosts);
        const allPosts = [...data, ...localPosts];
        // Sort by timestamp (newest first)
        allPosts.sort((a, b) => b.timestamp - a.timestamp);
        console.log('Combined posts:', allPosts);
        setPosts(allPosts);
      } else {
        console.log('No Supabase data, using localStorage only');
        const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
        setPosts(localPosts);
      }
    } catch (err) {
      console.error('Fetch posts error:', err);
      // Fallback to localStorage posts
      const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
      console.log('Error fallback - using localStorage posts:', localPosts);
      setPosts(localPosts);
    }
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
    
    console.log('=== POSTING DEBUG ===');
    console.log('User:', user);
    console.log('Content:', content);
    console.log('Media:', media);
    console.log('Media URL:', mediaUrl);
    
    try {
      console.log('Attempting to post to Supabase...');
      const postData = {
        user: user?.username || 'You',
        avatar: user?.avatar || avatars[0],
        content,
        media: mediaUrl,
        mediaType: media ? media.type : '',
        timestamp: Date.now(),
        likes: [],
        comments: [],
        shares: 0
      };
      console.log('Post data:', postData);
      
      // Insert into Supabase
      const { data, error } = await supabase.from('posts').insert([postData]);
      
      if (error) {
        console.error('Supabase error:', error);
        setFeedback('Error submitting post: ' + error.message);
        
        // Fallback: save to localStorage if Supabase fails
        console.log('Saving to localStorage as fallback...');
        const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
        const newPost = {
          id: Date.now(),
          user: user?.username || 'You',
          avatar: user?.avatar || avatars[0],
          content,
          media: mediaUrl,
          mediaType: media ? media.type : '',
          timestamp: Date.now(),
          likes: [],
          comments: [],
          shares: 0
        };
        localPosts.unshift(newPost);
        localStorage.setItem('localPosts', JSON.stringify(localPosts));
        console.log('Saved to localStorage:', newPost);
        console.log('Total local posts:', localPosts.length);
        setFeedback('Post saved locally (Supabase unavailable)');
        
        // Immediately update the posts state
        setPosts(prevPosts => [newPost, ...prevPosts]);
      } else {
        console.log('Post submitted successfully to Supabase:', data);
        setFeedback('Post submitted!');
        fetchPosts();
      }
    } catch (err) {
      console.error('Post error:', err);
      setFeedback('Error submitting post: ' + err.message);
    }
    
    setContent('');
    setMedia(null);
    setMediaUrl('');
    setFileName('');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleLike = (postId) => {
    if (!user) {
      setFeedback('Please log in to like posts');
      return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes?.includes(user.username);
          const newLikes = isLiked 
            ? post.likes?.filter(username => username !== user.username) || []
            : [...(post.likes || []), user.username];
          
          return { ...post, likes: newLikes };
        }
        return post;
      })
    );

    // Update localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const updatedLocalPosts = localPosts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes?.includes(user.username);
        const newLikes = isLiked 
          ? post.likes?.filter(username => username !== user.username) || []
          : [...(post.likes || []), user.username];
        
        return { ...post, likes: newLikes };
      }
      return post;
    });
    localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));
  };

  const handleComment = (postId) => {
    if (!commentText.trim()) return;
    if (!user) {
      setFeedback('Please log in to comment');
      return;
    }

    const newComment = {
      id: Date.now(),
      user: user.username,
      avatar: user.avatar || avatars[0],
      content: commentText,
      timestamp: Date.now(),
      likes: [],
      replies: []
    };

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return { 
            ...post, 
            comments: [...(post.comments || []), newComment] 
          };
        }
        return post;
      })
    );

    // Update localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const updatedLocalPosts = localPosts.map(post => {
      if (post.id === postId) {
        return { 
          ...post, 
          comments: [...(post.comments || []), newComment] 
        };
      }
      return post;
    });
    localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));

    setCommentText('');
    setReplyingTo(null);
  };

  const handleCommentLike = (postId, commentId) => {
    if (!user) {
      setFeedback('Please log in to like comments');
      return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                const likes = comment.likes || [];
                const userLiked = likes.includes(user.username);
                
                if (userLiked) {
                  return { ...comment, likes: likes.filter(u => u !== user.username) };
                } else {
                  return { ...comment, likes: [...likes, user.username] };
                }
              }
              return comment;
            })
          };
        }
        return post;
      })
    );

    // Update localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const updatedLocalPosts = localPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              const likes = comment.likes || [];
              const userLiked = likes.includes(user.username);
              
              if (userLiked) {
                return { ...comment, likes: likes.filter(u => u !== user.username) };
              } else {
                return { ...comment, likes: [...likes, user.username] };
              }
            }
            return comment;
          })
        };
      }
      return post;
    });
    localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));
  };

  const handleCommentReply = (postId, commentId) => {
    if (!replyText.trim()) return;
    if (!user) {
      setFeedback('Please log in to reply');
      return;
    }

    const newReply = {
      id: Date.now(),
      user: user.username,
      avatar: user.avatar || avatars[0],
      content: replyText,
      timestamp: Date.now(),
      likes: [],
      replies: []
    };

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newReply]
                };
              }
              return comment;
            })
          };
        }
        return post;
      })
    );

    // Update localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const updatedLocalPosts = localPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
              };
            }
            return comment;
          })
        };
      }
      return post;
    });
    localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));

    setReplyText('');
    setReplyingToComment(null);
  };

  const handleNestedReply = (postId, commentId, replyId) => {
    if (!replyText.trim()) return;
    if (!user) {
      setFeedback('Please log in to reply');
      return;
    }

    const newNestedReply = {
      id: Date.now(),
      user: user.username,
      avatar: user.avatar || avatars[0],
      content: replyText,
      timestamp: Date.now(),
      likes: []
    };

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: comment.replies.map(reply => {
                    if (reply.id === replyId) {
                      return {
                        ...reply,
                        replies: [...(reply.replies || []), newNestedReply]
                      };
                    }
                    return reply;
                  })
                };
              }
              return comment;
            })
          };
        }
        return post;
      })
    );

    // Update localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const updatedLocalPosts = localPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.map(reply => {
                  if (reply.id === replyId) {
                    return {
                      ...reply,
                      replies: [...(reply.replies || []), newNestedReply]
                    };
                  }
                  return reply;
                })
              };
            }
            return comment;
          })
        };
      }
      return post;
    });
    localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));

    setReplyText('');
    setNestedReplyTo(null);
  };

  const handleReplyLike = (postId, commentId, replyId) => {
    if (!user) {
      setFeedback('Please log in to like replies');
      return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: comment.replies.map(reply => {
                    if (reply.id === replyId) {
                      const likes = reply.likes || [];
                      const userLiked = likes.includes(user.username);
                      
                      if (userLiked) {
                        return { ...reply, likes: likes.filter(u => u !== user.username) };
                      } else {
                        return { ...reply, likes: [...likes, user.username] };
                      }
                    }
                    return reply;
                  })
                };
              }
              return comment;
            })
          };
        }
        return post;
      })
    );

    // Update localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const updatedLocalPosts = localPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.map(reply => {
                  if (reply.id === replyId) {
                    const likes = reply.likes || [];
                    const userLiked = likes.includes(user.username);
                    
                    if (userLiked) {
                      return { ...reply, likes: likes.filter(u => u !== user.username) };
                    } else {
                      return { ...reply, likes: [...likes, user.username] };
                    }
                  }
                  return reply;
                })
              };
            }
            return comment;
          })
        };
      }
      return post;
    });
    localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));
  };

  const handleDeletePost = (postId) => {
    if (!user) {
      setFeedback('Please log in to delete posts');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.user !== user.username) {
      setFeedback('You can only delete your own posts');
      return;
    }

    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    
    // Update localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const updatedLocalPosts = localPosts.filter(post => post.id !== postId);
    localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));
    
    setFeedback('Post deleted successfully');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleDeleteComment = (postId, commentId) => {
    if (!user) {
      setFeedback('Please log in to delete comments');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.user !== user.username) {
      setFeedback('You can only delete your own comments');
      return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment.id !== commentId)
          };
        }
        return post;
      })
    );

    // Update localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const updatedLocalPosts = localPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(comment => comment.id !== commentId)
        };
      }
      return post;
    });
    localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));
    
    setFeedback('Comment deleted successfully');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleDeleteReply = (postId, commentId, replyId) => {
    if (!user) {
      setFeedback('Please log in to delete replies');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    const reply = comment.replies.find(r => r.id === replyId);
    if (!reply) return;

    if (reply.user !== user.username) {
      setFeedback('You can only delete your own replies');
      return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: comment.replies.filter(reply => reply.id !== replyId)
                };
              }
              return comment;
            })
          };
        }
        return post;
      })
    );

    // Update localStorage
    const localPosts = JSON.parse(localStorage.getItem('localPosts') || '[]');
    const updatedLocalPosts = localPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== replyId)
              };
            }
            return comment;
          })
        };
      }
      return post;
    });
    localStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));
    
    setFeedback('Reply deleted successfully');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleShare = (post) => {
    const shareText = `${post.user}: ${post.content}`;
    
    // Create a descriptive slug from the post content
    const createSlug = (text) => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .substring(0, 50) // Limit length
        .replace(/-+$/, ''); // Remove trailing hyphens
    };
    
    const postSlug = createSlug(post.content) || 'post';
    const shareUrl = `${window.location.origin}/community/post/${post.id}/${postSlug}`;
    
    try {
      // Try native Web Share API first
      if (navigator.share && navigator.canShare) {
        navigator.share({
          title: 'Check out this post from Cuchco Community',
          text: shareText,
          url: shareUrl
        }).then(() => {
          // Increment share count on successful share
          setPosts(prevPosts => 
            prevPosts.map(p => {
              if (p.id === post.id) {
                return { ...p, shares: (p.shares || 0) + 1 };
              }
              return p;
            })
          );
        }).catch((error) => {
          console.log('Share failed:', error);
          // Fallback to clipboard
          copyToClipboard(`${shareText}\n\n${shareUrl}`, post);
        });
      } else {
        // Fallback to clipboard
        copyToClipboard(`${shareText}\n\n${shareUrl}`, post);
      }
    } catch (error) {
      console.error('Share error:', error);
      // Final fallback to clipboard
      copyToClipboard(`${shareText}\n\n${shareUrl}`, post);
    }
  };

  const copyToClipboard = async (text, post) => {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('Post link copied to clipboard!');
      setTimeout(() => setFeedback(''), 2000);
      
      // Increment share count
      setPosts(prevPosts => 
        prevPosts.map(p => {
          if (p.id === post.id) {
            return { ...p, shares: (p.shares || 0) + 1 };
          }
          return p;
        })
      );
    } catch (error) {
      console.error('Clipboard error:', error);
      // Last resort: show text in alert
      alert(`Share this post:\n\n${text}`);
    }
  };

  return (
    <div className="community-page" style={{ minHeight: '100vh', background: '#f7f9fb', padding: '2rem 0' }}>
      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onClick={() => setFullscreenImage(null)}
        >
          <img 
            src={fullscreenImage} 
            alt="fullscreen" 
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 8
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              width: 40,
              height: 40,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
      )}
      
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 10 }}>
          <label htmlFor="media-upload" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            cursor: 'pointer',
            color: '#007bff',
            fontSize: '0.875rem'
          }}>
            <FaImage />
            Add Image
          </label>
          <input 
            id="media-upload"
            type="file" 
            accept="image/*" 
            onChange={handleMediaChange} 
            style={{ display: 'none' }} 
          />
          {fileName && (
            <span style={{ fontSize: '0.75rem', color: '#666' }}>
              {fileName}
            </span>
          )}
        </div>
        {mediaUrl && (
          <img src={mediaUrl} alt="preview" style={{ maxWidth: 120, borderRadius: 8, margin: '0.5rem 0', display: 'block' }} />
        )}
        <button type="submit" className="community-post-btn" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 18, fontWeight: 700, width: '100%', marginTop: 8 }}>Post</button>
        {feedback && <div style={{ color: feedback.includes('Error') ? '#d00' : '#28a745', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>{feedback}</div>}
      </form>
      <div className="community-posts-feed" style={{ maxWidth: 600, margin: '0 auto' }}>
        {console.log('Posts to display:', posts)}
        
        {posts.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>No posts yet.</div>}
        {posts.map(post => (
          <div 
            key={post.id} 
            id={`post-${post.id}`}
            className="community-post-card" 
            style={{ 
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)', 
              borderRadius: 20, 
              padding: '2rem', 
              marginBottom: '2rem', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #e9ecef',
              display: 'flex',
              gap: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
              ...(postId && post.id.toString() === postId && {
                border: '2px solid #007bff',
                boxShadow: '0 12px 40px rgba(0,123,255,0.2)',
                transform: 'translateY(-2px)'
              })
            }}
          >
            {/* Decorative accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #007bff, #0056b3, #007bff)',
              borderRadius: '20px 20px 0 0'
            }} />
            <img 
              src={post.avatar} 
              alt="avatar" 
              className="community-post-avatar" 
              style={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '4px solid #fff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                flexShrink: 0,
                position: 'relative',
                zIndex: 1
              }} 
            />
            <div className="community-post-main" style={{ flex: 1, minWidth: 0 }}>
              <div className="community-post-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '0.75rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="community-post-user" style={{ 
                    fontWeight: 700, 
                    color: '#1a1a1a', 
                    fontSize: '1.1rem',
                    lineHeight: 1.2
                  }}>{post.user}</span>
                  <span style={{ 
                    color: '#666', 
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>•</span>
                  <span className="community-post-date" style={{ 
                    color: '#888', 
                    fontSize: '0.875rem',
                    fontWeight: 400
                  }}>{new Date(post.timestamp).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                {user && post.user === user.username && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete post"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
              
              <div className="community-post-content" style={{ 
                color: '#1a1a1a', 
                fontSize: '1.1rem', 
                lineHeight: 1.7,
                marginBottom: '1.5rem',
                fontWeight: 400,
                wordWrap: 'break-word',
                textShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>{post.content}</div>
              
              {post.media && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <img 
                    src={post.media} 
                    alt="media" 
                    className="community-post-media" 
                    style={{ 
                      maxWidth: '100%', 
                      borderRadius: 16, 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      border: '1px solid #e9ecef',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => setFullscreenImage(post.media)}
                  />
                </div>
              )}
              
              {/* Action buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '2rem', 
                marginTop: '1.5rem', 
                paddingTop: '1.5rem',
                borderTop: '2px solid #f8f9fa'
              }}>
                <button 
                  onClick={() => handleLike(post.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: post.likes?.includes(user?.username) ? '#e74c3c' : '#666',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    ...(post.likes?.includes(user?.username) && {
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fce4e4 100%)',
                      color: '#e74c3c',
                      boxShadow: '0 2px 8px rgba(231,76,60,0.2)'
                    })
                  }}
                >
                  {post.likes?.includes(user?.username) ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                  <span>{post.likes?.length || 0}</span>
                </button>
                
                <button 
                  onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#666',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    ...(replyingTo === post.id && {
                      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
                      color: '#007bff',
                      boxShadow: '0 2px 8px rgba(0,123,255,0.2)'
                    })
                  }}
                >
                  <FaComment size={18} />
                  <span>{post.comments?.length || 0}</span>
                </button>
                
                <button 
                  onClick={() => handleShare(post)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#666',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '0.75rem 1rem',
                    borderRadius: 12
                  }}
                >
                  <FaShare size={18} />
                  <span>{post.shares || 0}</span>
                </button>
              </div>

              {/* Comment input */}
              {replyingTo === post.id && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: 12,
                  border: '1px solid #e9ecef'
                }}>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    style={{
                      width: '100%',
                      minHeight: 80,
                      padding: '0.75rem',
                      border: '1px solid #dee2e6',
                      borderRadius: 8,
                      fontSize: '0.9rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <button
                      onClick={() => handleComment(post.id)}
                      style={{
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaComment size={14} />
                      Comment
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setCommentText('');
                      }}
                      style={{
                        background: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaTimes size={14} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Comments display */}
              {post.comments && post.comments.length > 0 && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: 12,
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 600, 
                    color: '#495057',
                    marginBottom: '0.75rem'
                  }}>
                    Comments ({post.comments.length})
                  </div>
                  {post.comments.map(comment => (
                    <div key={comment.id} style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      marginBottom: '0.75rem',
                      padding: '0.75rem',
                      background: '#fff',
                      borderRadius: 8,
                      border: '1px solid #e9ecef'
                    }}>
                      <img 
                        src={comment.avatar} 
                        alt="avatar" 
                        style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          border: '2px solid #f8f9fa',
                          flexShrink: 0
                        }} 
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '0.25rem'
                        }}>
                          <span style={{ 
                            fontWeight: 600, 
                            color: '#1a1a1a', 
                            fontSize: '0.875rem' 
                          }}>{comment.user}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ 
                              color: '#888', 
                              fontSize: '0.75rem' 
                            }}>{new Date(comment.timestamp).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                            {user && comment.user === user.username && (
                              <button
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#dc3545',
                                  cursor: 'pointer',
                                  padding: '0.125rem',
                                  borderRadius: 3,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                title="Delete comment"
                              >
                                <FaTrash size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div style={{ 
                          color: '#2c2c2c', 
                          fontSize: '0.875rem',
                          lineHeight: 1.4,
                          marginBottom: '0.5rem'
                        }}>{comment.content}</div>
                        
                        {/* Comment actions */}
                        <div style={{ 
                          display: 'flex', 
                          gap: '1rem', 
                          fontSize: '0.75rem',
                          color: '#666'
                        }}>
                          <button 
                            onClick={() => handleCommentLike(post.id, comment.id)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: comment.likes?.includes(user?.username) ? '#e74c3c' : '#666',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              padding: '0.25rem 0.5rem',
                              borderRadius: 4,
                              ...(comment.likes?.includes(user?.username) && {
                                background: '#fef2f2',
                                color: '#e74c3c'
                              })
                            }}
                          >
                            {comment.likes?.includes(user?.username) ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                            <span>{comment.likes?.length || 0}</span>
                          </button>
                          
                          <button 
                            onClick={() => setReplyingToComment(replyingToComment === comment.id ? null : comment.id)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#666',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              padding: '0.25rem 0.5rem',
                              borderRadius: 4,
                              ...(replyingToComment === comment.id && {
                                background: '#f0f8ff',
                                color: '#007bff'
                              })
                            }}
                          >
                            <FaComment size={12} />
                            Reply
                          </button>
                        </div>

                        {/* Reply input */}
                        {replyingToComment === comment.id && (
                          <div style={{ 
                            marginTop: '0.75rem', 
                            padding: '0.75rem',
                            background: '#f8f9fa',
                            borderRadius: 8,
                            border: '1px solid #e9ecef'
                          }}>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              style={{
                                width: '100%',
                                minHeight: 60,
                                padding: '0.5rem',
                                border: '1px solid #dee2e6',
                                borderRadius: 6,
                                fontSize: '0.8rem',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                outline: 'none',
                                transition: 'border-color 0.2s ease'
                              }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <button
                                onClick={() => handleCommentReply(post.id, comment.id)}
                                style={{
                                  background: '#007bff',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 6,
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <FaComment size={10} />
                                Reply
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingToComment(null);
                                  setReplyText('');
                                }}
                                style={{
                                  background: '#6c757d',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 6,
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <FaTimes size={10} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                                                {/* Replies display */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div style={{ 
                            marginTop: '0.75rem',
                            paddingLeft: '1.5rem',
                            borderLeft: '3px solid #e9ecef'
                          }}>
                            {comment.replies.map(reply => (
                              <div key={reply.id} style={{ 
                                display: 'flex', 
                                gap: '0.75rem', 
                                marginBottom: '0.75rem',
                                padding: '0.75rem',
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%)',
                                borderRadius: 12,
                                border: '1px solid #e9ecef',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                              }}>
                                <img 
                                  src={reply.avatar} 
                                  alt="avatar" 
                                  style={{ 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: '50%', 
                                    objectFit: 'cover',
                                    border: '2px solid #fff',
                                    flexShrink: 0
                                  }} 
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '0.25rem'
                                  }}>
                                    <span style={{ 
                                      fontWeight: 600, 
                                      color: '#1a1a1a', 
                                      fontSize: '0.875rem' 
                                    }}>{reply.user}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ 
                                        color: '#888', 
                                        fontSize: '0.75rem' 
                                      }}>{new Date(reply.timestamp).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}</span>
                                      {user && reply.user === user.username && (
                                        <button
                                          onClick={() => handleDeleteReply(post.id, comment.id, reply.id)}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#dc3545',
                                            cursor: 'pointer',
                                            padding: '0.125rem',
                                            borderRadius: 4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                          }}
                                          title="Delete reply"
                                        >
                                          <FaTrash size={10} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div style={{ 
                                    color: '#2c2c2c', 
                                    fontSize: '0.875rem',
                                    lineHeight: 1.4,
                                    marginBottom: '0.5rem'
                                  }}>{reply.content}</div>
                                  
                                  {/* Reply actions */}
                                  <div style={{ 
                                    display: 'flex', 
                                    gap: '1rem', 
                                    fontSize: '0.75rem',
                                    color: '#666'
                                  }}>
                                    {/* Reply like button */}
                                    <button 
                                      onClick={() => handleReplyLike(post.id, comment.id, reply.id)}
                                      style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: reply.likes?.includes(user?.username) ? '#e74c3c' : '#666',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: 6,
                                        ...(reply.likes?.includes(user?.username) && {
                                          background: '#fef2f2',
                                          color: '#e74c3c'
                                        })
                                      }}
                                    >
                                      {reply.likes?.includes(user?.username) ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                                      <span>{reply.likes?.length || 0}</span>
                                    </button>
                                    
                                    {/* Nested reply button */}
                                    <button 
                                      onClick={() => setNestedReplyTo(nestedReplyTo === reply.id ? null : reply.id)}
                                      style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: '#666',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: 6,
                                        ...(nestedReplyTo === reply.id && {
                                          background: '#f0f8ff',
                                          color: '#007bff'
                                        })
                                      }}
                                    >
                                      <FaComment size={12} />
                                      Reply
                                    </button>
                                  </div>

                                  {/* Nested reply input */}
                                  {nestedReplyTo === reply.id && (
                                    <div style={{ 
                                      marginTop: '0.75rem', 
                                      padding: '0.75rem',
                                      background: '#fff',
                                      borderRadius: 8,
                                      border: '1px solid #e9ecef'
                                    }}>
                                      <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write a reply..."
                                        style={{
                                          width: '100%',
                                          minHeight: 60,
                                          padding: '0.5rem',
                                          border: '1px solid #dee2e6',
                                          borderRadius: 6,
                                          fontSize: '0.8rem',
                                          resize: 'vertical',
                                          fontFamily: 'inherit',
                                          outline: 'none'
                                        }}
                                      />
                                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button
                                          onClick={() => handleNestedReply(post.id, comment.id, reply.id)}
                                          style={{
                                            background: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            padding: '0.25rem 0.75rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                          }}
                                        >
                                          <FaComment size={10} />
                                          Reply
                                        </button>
                                        <button
                                          onClick={() => {
                                            setNestedReplyTo(null);
                                            setReplyText('');
                                          }}
                                          style={{
                                            background: '#6c757d',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            padding: '0.25rem 0.75rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                          }}
                                        >
                                          <FaTimes size={10} />
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Nested replies display */}
                                  {reply.replies && reply.replies.length > 0 && (
                                    <div style={{ 
                                      marginTop: '0.75rem',
                                      paddingLeft: '1rem',
                                      borderLeft: '2px solid #dee2e6'
                                    }}>
                                      {reply.replies.map(nestedReply => (
                                        <div key={nestedReply.id} style={{ 
                                          display: 'flex', 
                                          gap: '0.75rem', 
                                          marginBottom: '0.75rem',
                                          padding: '0.75rem',
                                          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                                          borderRadius: 12,
                                          border: '1px solid #e9ecef',
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }}>
                                          <img 
                                            src={nestedReply.avatar} 
                                            alt="avatar" 
                                            style={{ 
                                              width: 32, 
                                              height: 32, 
                                              borderRadius: '50%', 
                                              objectFit: 'cover',
                                              border: '2px solid #fff',
                                              flexShrink: 0
                                            }} 
                                          />
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ 
                                              display: 'flex', 
                                              justifyContent: 'space-between', 
                                              alignItems: 'center',
                                              marginBottom: '0.25rem'
                                            }}>
                                              <span style={{ 
                                                fontWeight: 600, 
                                                color: '#1a1a1a', 
                                                fontSize: '0.875rem' 
                                              }}>{nestedReply.user}</span>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ 
                                                  color: '#888', 
                                                  fontSize: '0.75rem' 
                                                }}>{new Date(nestedReply.timestamp).toLocaleDateString('en-US', { 
                                                  month: 'short', 
                                                  day: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })}</span>
                                                {user && nestedReply.user === user.username && (
                                                  <button
                                                    onClick={() => handleDeleteReply(post.id, comment.id, nestedReply.id)}
                                                    style={{
                                                      background: 'none',
                                                      border: 'none',
                                                      color: '#dc3545',
                                                      cursor: 'pointer',
                                                      padding: '0.125rem',
                                                      borderRadius: 4,
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center'
                                                    }}
                                                    title="Delete reply"
                                                  >
                                                    <FaTrash size={10} />
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                            <div style={{ 
                                              color: '#2c2c2c', 
                                              fontSize: '0.875rem',
                                              lineHeight: 1.4,
                                              marginBottom: '0.5rem'
                                            }}>{nestedReply.content}</div>
                                            
                                            {/* Nested reply like button */}
                                            <button 
                                              onClick={() => handleReplyLike(post.id, comment.id, nestedReply.id)}
                                              style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                color: nestedReply.likes?.includes(user?.username) ? '#e74c3c' : '#666',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: 6,
                                                ...(nestedReply.likes?.includes(user?.username) && {
                                                  background: '#fef2f2',
                                                  color: '#e74c3c'
                                                })
                                              }}
                                            >
                                              {nestedReply.likes?.includes(user?.username) ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                                              <span>{nestedReply.likes?.length || 0}</span>
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage; 