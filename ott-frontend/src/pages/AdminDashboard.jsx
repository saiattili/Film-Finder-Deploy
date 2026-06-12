import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, Activity, Trash2, ShieldAlert, FileText, CheckCircle, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);

      const actRes = await api.get('/admin/activities');
      setActivities(actRes.data);
    } catch (err) {
      console.error("Failed to load admin logs", err);
      setErrorMsg("Failed to retrieve admin details. Make sure you are authenticated as an Admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === currentUser.email) {
      setErrorMsg("You cannot delete your own administration account.");
      return;
    }

    if (!window.confirm(`Are you absolutely sure you want to permanently delete user account: ${userEmail}? This will clear all their watchlist bookmarks.`)) {
      return;
    }

    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccessMsg(`User ${userEmail} has been deleted successfully.`);
      // Refresh
      loadData();
      
      // Auto clear message
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg("Failed to delete user account.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        fontSize: '1.2rem',
        color: 'hsl(var(--text-secondary))'
      }}>
        Loading admin console dashboard...
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={32} style={{ color: 'hsl(var(--accent-pink))' }} />
              Admin Dashboard
            </h1>
            <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>
              System audit panel for monitoring user activity tracking and account administration
            </p>
          </div>
          <button 
            onClick={loadData} 
            className="btn-secondary" 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            Refresh Logs
          </button>
        </div>

        {/* Banners */}
        {successMsg && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: 'hsl(var(--accent-green))',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
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
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '16px', borderRadius: '12px', color: 'hsl(var(--accent-purple))' }}>
              <Users size={28} />
            </div>
            <div>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Registered Users</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{users.length}</h3>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.15)', padding: '16px', borderRadius: '12px', color: 'hsl(var(--accent-pink))' }}>
              <Activity size={28} />
            </div>
            <div>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Total System Actions Logged</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{activities.length}</h3>
            </div>
          </div>
        </div>

        {/* Main Columns: Left (Users), Right (Activities) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '32px'
        }} className="admin-grid-layout">
          
          {/* User management */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: 'hsl(var(--accent-purple))' }} />
              User Directory
            </h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '450px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 8px' }}>Name</th>
                  <th style={{ padding: '12px 8px' }}>Email</th>
                  <th style={{ padding: '12px 8px' }}>Role</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.95rem' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: '16px 8px', color: 'hsl(var(--text-secondary))' }}>{u.email}</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-pink' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        disabled={actionLoading || u.email === currentUser.email}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: u.email === currentUser.email ? 'hsl(var(--text-muted))' : '#ef4444',
                          cursor: u.email === currentUser.email ? 'not-allowed' : 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (u.email !== currentUser.email) e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          if (u.email !== currentUser.email) e.target.style.background = 'transparent';
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activities log feed */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} style={{ color: 'hsl(var(--accent-pink))' }} />
              Live Activity Audit
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              maxHeight: '480px',
              overflowY: 'auto',
              paddingRight: '6px'
            }}>
              {activities.length > 0 ? (
                activities.map(act => (
                  <div 
                    key={act.id} 
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${
                        act.actionType === 'LOGIN' ? 'badge-green' : 
                        act.actionType === 'REGISTER' ? 'badge-cyan' : 
                        act.actionType === 'ADD_WATCHLIST' ? 'badge-purple' : 
                        'badge-pink'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {act.actionType}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                        {act.createdAt ? new Date(act.createdAt).toLocaleTimeString() : 'Recent'}
                      </span>
                    </div>
                    
                    <p style={{ fontWeight: 500, color: '#fff' }}>{act.details}</p>
                    
                    {act.email && (
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                        Triggered by: {act.email}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'hsl(var(--text-muted))' }}>
                  No activities recorded yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .admin-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
