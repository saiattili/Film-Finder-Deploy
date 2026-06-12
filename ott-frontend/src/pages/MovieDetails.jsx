import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Heart, Calendar, Globe, Film, ArrowLeft } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data);

        if (user) {
          const favRes = await api.get(`/watchlist/check/${id}`);
          setIsFavorite(favRes.data);
        }
      } catch (err) {
        console.error("Failed to load movie details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user]);

  const handleWatchlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setWatchlistLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/watchlist/${id}`);
        setIsFavorite(false);
      } else {
        await api.post('/watchlist', {
          tmdbMovieId: movie.id,
          movieTitle: movie.title,
          posterPath: movie.posterPath,
          category: movie.sourceType
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Watchlist action failed:", err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        fontSize: '1.2rem',
        color: 'hsl(var(--text-secondary))'
      }}>
        Loading movie catalog profiles...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Movie Details Not Found</h2>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ marginTop: '20px' }}>
          <ArrowLeft size={16} /> Go Back Home
        </button>
      </div>
    );
  }

  const category = movie.sourceType;

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Back button */}
      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '20px' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-secondary" 
          style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Backdrop Section */}
      <div style={{
        position: 'relative',
        height: '420px',
        backgroundImage: `linear-gradient(to top, hsl(var(--bg-primary)) 10%, rgba(10, 15, 30, 0.4) 60%, rgba(10, 15, 30, 0.7)), url(${movie.backdropPath || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&auto=format&fit=crop'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginTop: '-72px', // Pull under sticky header
        zIndex: 1
      }} />

      {/* Content Section */}
      <div className="container" style={{ position: 'relative', zIndex: 10, marginTop: '-200px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '40px',
          alignItems: 'flex-start'
        }} className="movie-details-flex">
          
          {/* Poster Column */}
          <div style={{
            flexShrink: 0,
            width: '300px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }} className="movie-details-poster">
            <img 
              src={movie.posterPath || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop'} 
              alt={movie.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Details Column */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <span className={`badge ${category === 'THEATER' ? 'badge-purple' : 'badge-pink'}`}>
                  {category === 'THEATER' ? 'In Theaters' : 'OTT Upcoming'}
                </span>
                {movie.genres && movie.genres.map(genre => (
                  <span key={genre} className="badge badge-cyan">{genre}</span>
                ))}
              </div>
              <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.1 }}>{movie.title}</h1>
            </div>

            {/* Metrics */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              color: 'hsl(var(--text-secondary))',
              fontSize: '0.95rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={18} style={{ color: 'hsl(var(--accent-purple))' }} />
                <span>Released: {movie.releaseDate || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={18} style={{ color: 'hsl(var(--accent-pink))' }} />
                <span style={{ textTransform: 'capitalize' }}>Language: {movie.language || 'English'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={18} fill="#eab308" style={{ color: '#eab308' }} />
                <span style={{ color: '#fff', fontWeight: 600 }}>{movie.voteAverage ? movie.voteAverage.toFixed(1) : '7.5'} Rating</span>
              </div>
            </div>

            {/* Actions */}
            <div>
              <button
                onClick={handleWatchlistToggle}
                disabled={watchlistLoading}
                className="btn-primary"
                style={{
                  background: isFavorite ? 'rgba(239, 68, 68, 0.15)' : undefined,
                  border: isFavorite ? '1px solid rgba(239, 68, 68, 0.4)' : undefined,
                  color: isFavorite ? '#ef4444' : undefined,
                  boxShadow: isFavorite ? 'none' : undefined,
                }}
              >
                <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} />
                <span>{isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            {/* Overview */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Synopsis</h3>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.05rem', lineHeight: '1.6' }}>
                {movie.overview || 'No description available.'}
              </p>
            </div>

            {/* Streaming Providers */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px' }}>Where to Watch</h3>
              {movie.watchProviders && movie.watchProviders.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {movie.watchProviders.map((provider) => (
                    <div 
                      key={provider.providerName}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <img 
                        src={provider.logoUrl} 
                        alt={provider.providerName}
                        style={{ width: '24px', height: '24px', borderRadius: '6px' }}
                      />
                      <span>{provider.providerName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--text-muted))' }}>
                  <Film size={18} />
                  <span>
                    {category === 'THEATER' 
                      ? 'Exclusively playing in theaters. Check local cinema listings.' 
                      : 'Digital release schedule is pending confirmation.'}
                  </span>
                </div>
              )}
            </div>

            {/* Cast Grid */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Starring Cast</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {movie.cast.map((actor) => (
                    <span 
                      key={actor}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .movie-details-flex {
            flex-direction: column !important;
            align-items: center !important;
          }
          .movie-details-poster {
            width: 240px !important;
            margin-bottom: 20px;
          }
          .movie-details-flex h1 {
            text-align: center;
            font-size: 2.2rem !important;
          }
          .movie-details-flex div {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MovieDetails;
