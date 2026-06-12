import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { SlidersHorizontal, PlayCircle } from 'lucide-react';

const UpcomingOtt = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [sortBy, setSortBy] = useState('date-asc'); // Default soonest first

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies/upcoming');
        setMovies(res.data);
        setFilteredMovies(res.data);
      } catch (err) {
        console.error("Error fetching upcoming OTT movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Filter and Sort Effect
  useEffect(() => {
    let result = [...movies];

    // Language Filter
    if (selectedLanguage !== 'All') {
      result = result.filter(m => m.language === selectedLanguage);
    }

    // Provider Filter
    if (selectedProvider !== 'All') {
      result = result.filter(m => {
        if (!m.watchProviders) return false;
        return m.watchProviders.some(p => p.providerName === selectedProvider);
      });
    }

    // Sort By Release Date
    if (sortBy === 'date-asc') {
      result.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    } else if (sortBy === 'date-desc') {
      result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }

    setFilteredMovies(result);
  }, [selectedLanguage, selectedProvider, sortBy, movies]);

  const getLanguages = () => {
    const langs = new Set();
    movies.forEach(m => {
      if (m.language) langs.add(m.language);
    });
    return ['All', ...Array.from(langs)];
  };

  const getProviders = () => {
    const providers = new Set();
    movies.forEach(m => {
      if (m.watchProviders) {
        m.watchProviders.forEach(p => providers.add(p.providerName));
      }
    });
    return ['All', ...Array.from(providers)];
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>OTT Releases</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>
            Discover upcoming digital premieres. Filter by platform and schedule your calendar so you never miss a home release.
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

          {/* Provider filter */}
          <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
            <label className="form-label" style={{ marginBottom: '4px', fontSize: '0.75rem' }}>Platform</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="glass-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              {getProviders().map(p => (
                <option key={p} value={p} style={{ background: 'hsl(var(--bg-secondary))' }}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selection */}
          <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
            <label className="form-label" style={{ marginBottom: '4px', fontSize: '0.75rem' }}>Release Timeline</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="date-asc" style={{ background: 'hsl(var(--bg-secondary))' }}>Earliest First</option>
              <option value="date-desc" style={{ background: 'hsl(var(--bg-secondary))' }}>Latest First</option>
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
            Loading upcoming OTT releases...
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
            No upcoming releases found on the selected platform. Try clearing filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingOtt;
