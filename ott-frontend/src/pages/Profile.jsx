import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, MapPin, Globe, Edit, CheckCircle, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.profile?.bio || '');
      setLocation(user.profile?.location || 'Not Specified');
      setPreferredLanguage(user.profile?.preferredLanguage || 'English');
      setAvatarUrl(user.profile?.avatarUrl || '');

      // Load watchlist count
      api.get('/watchlist')
        .then(res => setWatchlistCount(res.data.length))
        .catch(err => console.error("Could not fetch watchlist size", err));
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile({
        bio,
        location,
        preferredLanguage,
        avatarUrl
      });
      setSuccessMsg("Profile preferences saved successfully!");
      setIsEditing(false);
      
      // Auto clear alert
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg("Failed to update profile settings.");
    } finally {
      setLoading(false);
    }
  };

  const randomizeAvatar = () => {
    const seed = Math.floor(Math.random() * 10000);
    setAvatarUrl(`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`);
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Access Denied</h2>
        <p>Please log in to manage your profile.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0', minHeight: '65vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Alerts */}
        {successMsg && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: 'hsl(var(--accent-green))',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            marginBottom: '24px'
          }}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            marginBottom: '24px'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="glass-panel" style={{
          padding: '40px 32px',
          borderRadius: '24px',
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          marginBottom: '32px'
        }} className="profile-header-flex">
          {/* Avatar Area */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid hsl(var(--accent-purple))',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}>
              <img 
                src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`} 
                alt="avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {isEditing && (
              <button 
                type="button" 
                onClick={randomizeAvatar}
                className="btn-secondary" 
                style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '15px' }}
              >
                Randomize
              </button>
            )}
          </div>

          {/* User Details info */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>{user.name}</h1>
                <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem' }}>{user.email}</p>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Edit size={14} /> Edit Profile
                </button>
              )}
            </div>

            <p style={{ color: 'hsl(var(--text-secondary))', fontStyle: 'italic', margin: '6px 0', borderLeft: '3px solid hsl(var(--accent-pink))', paddingLeft: '12px' }}>
              "{bio || "No biography written yet."}"
            </p>

            {/* Quick Metadata Stats list */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              marginTop: '10px',
              fontSize: '0.85rem',
              color: 'hsl(var(--text-muted))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} />
                <span>{location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={16} />
                <span>Lang: {preferredLanguage}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'hsl(var(--text-primary))' }}>
                <span>Watchlist Count: <strong>{watchlistCount}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings form */}
        {isEditing && (
          <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Update Profile Settings</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Profile Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="glass-input"
                  rows={3}
                  placeholder="Share something about your movie taste..."
                  style={{ width: '100%', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '24px'
              }} className="profile-form-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Location / Country</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="glass-input"
                    placeholder="e.g. New York, USA"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preferred Movie Language</label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', padding: '12px 16px', boxSizing: 'border-box' }}
                  >
                    <option value="English" style={{ background: 'hsl(var(--bg-secondary))' }}>English</option>
                    <option value="Telugu" style={{ background: 'hsl(var(--bg-secondary))' }}>Telugu</option>
                    <option value="Hindi" style={{ background: 'hsl(var(--bg-secondary))' }}>Hindi</option>
                    <option value="Spanish" style={{ background: 'hsl(var(--bg-secondary))' }}>Spanish</option>
                    <option value="Korean" style={{ background: 'hsl(var(--bg-secondary))' }}>Korean</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    // Reset fields
                    setBio(user.profile?.bio || '');
                    setLocation(user.profile?.location || 'Not Specified');
                    setPreferredLanguage(user.profile?.preferredLanguage || 'English');
                    setAvatarUrl(user.profile?.avatarUrl || '');
                  }} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving Settings...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
      <style>{`
        @media (max-width: 600px) {
          .profile-header-flex {
            flex-direction: column !important;
            text-align: center !important;
          }
          .profile-form-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
