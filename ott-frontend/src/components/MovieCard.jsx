import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Star, Heart, Calendar } from 'lucide-react';

const MovieCard = ({ movie, onWatchlistChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extract variables depending on TMDB structure or Watchlist structure
  const id = movie.tmdbMovieId || movie.id;
  const title = movie.movieTitle || movie.title;
  let rawPosterPath = movie.posterPath || movie.poster_path;
  let posterPath = rawPosterPath;
  if (rawPosterPath && !rawPosterPath.startsWith('http')) {
    posterPath = `https://image.tmdb.org/t/p/w500${rawPosterPath}`;
  }
  const voteAverage = movie.voteAverage || 7.5;
  const releaseDate = movie.releaseDate;
  const category = movie.category || movie.sourceType; // THEATER or OTT

  useEffect(() => {
    if (user && id) {
      // Check if movie is currently in watchlist
      api.get(`/watchlist/check/${id}`)
        .then((res) => {
          setIsFavorite(res.data);
        })
        .catch(() => {
          // Ignore
        });
    }
  }, [user, id]);

  const handleWatchlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/watchlist/${id}`);
        setIsFavorite(false);
        if (onWatchlistChange) {
          onWatchlistChange(id, false);
        }
      } else {
        await api.post('/watchlist', {
          tmdbMovieId: id,
          movieTitle: title,
          posterPath: posterPath,
          category: category
        });
        setIsFavorite(true);
        if (onWatchlistChange) {
          onWatchlistChange(id, true);
        }
      }
    } catch (err) {
      console.error("Watchlist toggle failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/movie/${id}`} className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative',
      height: '100%',
    }}>
      {/* Poster Image */}
      <div style={{ position: 'relative', paddingTop: '145%', overflow: 'hidden' }}>
        <img 
          src={posterPath || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop'} 
          alt={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="movie-poster-img"
        />
        
        {/* Category Badge overlay */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
          <span className={`badge ${category === 'THEATER' ? 'badge-purple' : 'badge-pink'}`}>
            {category === 'THEATER' ? 'In Theaters' : 'OTT Upcoming'}
          </span>
        </div>

        {/* Favorite Watchlist Heart Button */}
        <button
          onClick={handleWatchlistToggle}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            background: isFavorite ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 0, 0, 0.5)',
            border: isFavorite ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            color: isFavorite ? '#ef4444' : '#fff'
          }}
          onMouseEnter={(e) => {
            if (!isFavorite) e.target.style.background = 'rgba(168, 85, 247, 0.3)';
          }}
          onMouseLeave={(e) => {
            if (!isFavorite) e.target.style.background = 'rgba(0, 0, 0, 0.5)';
          }}
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Details Box */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 700,
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '2.6em'
        }}>
          {title}
        </h3>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          fontSize: '0.85rem',
          color: 'hsl(var(--text-secondary))'
        }}>
          {/* Release Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} style={{ color: 'hsl(var(--accent-purple))' }} />
            <span>{releaseDate ? releaseDate.split('-')[0] : 'N/A'}</span>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="currentColor" style={{ color: '#eab308' }} />
            <span style={{ fontWeight: 600, color: '#fff' }}>{voteAverage ? voteAverage.toFixed(1) : '7.5'}</span>
          </div>
        </div>
      </div>

      <style>{`
        .glass-card:hover .movie-poster-img {
          transform: scale(1.08);
        }
      `}</style>
    </Link>
  );
};

export default MovieCard;
