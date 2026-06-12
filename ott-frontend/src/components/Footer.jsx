import React from 'react';
import { Film } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '40px 0',
      marginTop: 'auto',
      backgroundColor: 'rgba(5, 7, 15, 0.4)',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, hsl(var(--accent-purple)), hsl(var(--accent-pink)))',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Film size={16} color="#fff" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Film<span style={{ color: 'hsl(var(--accent-pink))' }}>Finder</span>
          </span>
        </div>
        
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', maxWidth: '500px' }}>
          Your ultimate destination to find movie releases in theaters and streaming on popular OTT platforms. Build watchlists and track release timelines in one premium dashboard.
        </p>
        
        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.8rem', marginTop: '10px' }}>
          &copy; {new Date().getFullYear()} FilmFinder. Developed from scratch with React, Spring Boot, and JWT.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
