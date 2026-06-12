import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, User as UserIcon, LogOut, Heart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '16px 0',
      borderBottom: '1px solid var(--border-glass)',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            background: 'linear-gradient(135deg, hsl(var(--accent-purple)), hsl(var(--accent-pink)))',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
          }}>
            <Film size={22} color="#fff" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            Film<span style={{ color: 'hsl(var(--accent-pink))' }}>Finder</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="desktop-nav">
          <Link to="/" style={{
            fontWeight: 500,
            color: isActive('/') ? 'hsl(var(--accent-purple))' : 'hsl(var(--text-secondary))',
            transition: 'color 0.2s',
          }}>
            Browse
          </Link>
          <Link to="/now-playing" style={{
            fontWeight: 500,
            color: isActive('/now-playing') ? 'hsl(var(--accent-purple))' : 'hsl(var(--text-secondary))',
            transition: 'color 0.2s',
          }}>
            In Theaters
          </Link>
          <Link to="/upcoming-ott" style={{
            fontWeight: 500,
            color: isActive('/upcoming-ott') ? 'hsl(var(--accent-purple))' : 'hsl(var(--text-secondary))',
            transition: 'color 0.2s',
          }}>
            OTT Releases
          </Link>
          {user && (
            <Link to="/watchlist" style={{
              fontWeight: 500,
              color: isActive('/watchlist') ? 'hsl(var(--accent-purple))' : 'hsl(var(--text-secondary))',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Heart size={16} />
              Watchlist
            </Link>
          )}
          {user && user.role === 'ROLE_ADMIN' && (
            <Link to="/admin" style={{
              fontWeight: 500,
              color: isActive('/admin') ? 'hsl(var(--accent-purple))' : 'hsl(var(--text-secondary))',
              transition: 'color 0.2s',
            }}>
              Admin Panel
            </Link>
          )}
        </div>

        {/* Auth / Profile Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="desktop-auth">
          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '30px',
                  padding: '6px 14px',
                  cursor: 'pointer'
                }}
              >
                <img 
                  src={user.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`} 
                  alt="avatar" 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }}
                />
                <span style={{ fontWeight: 500 }}>{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  width: '180px',
                  borderRadius: '12px',
                  padding: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <Link 
                    to="/profile" 
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <UserIcon size={16} />
                    <span>My Profile</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                Log In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu buttons */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          className="mobile-toggle-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          borderWidth: '0 0 1px 0',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
          zIndex: 40
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: isActive('/') ? 'hsl(var(--accent-purple))' : 'inherit' }}>Browse</Link>
          <Link to="/now-playing" onClick={() => setMobileMenuOpen(false)} style={{ color: isActive('/now-playing') ? 'hsl(var(--accent-purple))' : 'inherit' }}>In Theaters</Link>
          <Link to="/upcoming-ott" onClick={() => setMobileMenuOpen(false)} style={{ color: isActive('/upcoming-ott') ? 'hsl(var(--accent-purple))' : 'inherit' }}>OTT Releases</Link>
          {user && (
            <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)} style={{
              color: isActive('/watchlist') ? 'hsl(var(--accent-purple))' : 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Heart size={16} />
              Watchlist
            </Link>
          )}
          {user && user.role === 'ROLE_ADMIN' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: isActive('/admin') ? 'hsl(var(--accent-purple))' : 'inherit' }}>Admin Panel</Link>
          )}
          <hr style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserIcon size={16} />
                <span>My Profile ({user.name})</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn-secondary" 
                style={{ justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary" style={{ justifyContent: 'center' }}>
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ justifyContent: 'center' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive Inline CSS overrides */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-auth {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
