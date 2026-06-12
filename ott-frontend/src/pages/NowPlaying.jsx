import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { SlidersHorizontal, Grid, Star } from 'lucide-react';

const NowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('none');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies/now-playing');
        setMovies(res.data);
        setFilteredMovies(res.data);
      } catch (err) {
        console.error("Error fetching now playing movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Handle Filtering & Sorting
  useEffect(() => {
    let result = [...movies];

    // Language Filter
    if (selectedLanguage !== 'All') {
      result = result.filter(m => m.language === selectedLanguage);
    }

    // Genre Filter
    if (selectedGenre !== 'All') {
      result = result.filter(m => m.genres && m.genres.includes(selectedGenre));
    }

    // Sort By Rating
    if (sortBy === 'rating-desc') {
      result.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0));
    } else if (sortBy === 'rating-asc') {
      result.sort((a, b) => (a.voteAverage || 0) - (b.voteAverage || 0));
    }

    setFilteredMovies(result);
  }, [selectedLanguage, selectedGenre, sortBy, movies]);

  const getLanguages = () => {
    const langs = new Set();
    movies.forEach(m => {
      if (m.language) langs.add(m.language);
    });
    return ['All', ...Array.from(langs)];
  };

  const getGenres = () => {
    const genres = new Set();
    movies.forEach(m => {
      if (m.genres) {
        m.genres.forEach(g => genres.add(g));
      }
    });
    return ['All', ...Array.from(genres)];
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>In Theaters</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>
            Browse films playing on big screens. Add them to your watchlist to track when they release on streaming platforms.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
            <SlidersHorizontal size={18} style={{ color: 'hsl(var(--accent-purple))' }} />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Filters:</span>
          </div>

          {/* Language filter */}
          <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
            <label className="form-label" style={{ marginBottom: '4px', fontSize: '0.75rem' }}>Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="glass-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              {getLanguages().map(lang => (
                <option key={lang} value={lang} style={{ background: 'hsl(var(--bg-secondary))' }}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Genre filter */}
          <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
            <label className="form-label" style={{ marginBottom: '4px', fontSize: '0.75rem' }}>Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="glass-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              {getGenres().map(genre => (
                <option key={genre} value={genre} style={{ background: 'hsl(var(--bg-secondary))' }}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selection */}
          <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
            <label className="form-label" style={{ marginBottom: '4px', fontSize: '0.75rem' }}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="none" style={{ background: 'hsl(var(--bg-secondary))' }}>Default</option>
              <option value="rating-desc" style={{ background: 'hsl(var(--bg-secondary))' }}>Rating: High to Low</option>
              <option value="rating-asc" style={{ background: 'hsl(var(--bg-secondary))' }}>Rating: Low to High</option>
            </select>
          </div>

          {/* Film Count counter */}
          <div style={{ marginLeft: 'auto', color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>
            Showing <strong>{filteredMovies.length}</strong> movies
          </div>
        </div>

        {/* Results grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '1.2rem', color: 'hsl(var(--text-secondary))' }}>
            Loading theater catalog...
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid-movies">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{
            padding: '40px',
            textAlign: 'center',
            borderRadius: '16px',
            color: 'hsl(var(--text-secondary))'
          }}>
            No theater releases found matching your search options. Try clearing filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default NowPlaying;
