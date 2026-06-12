import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { Search, Compass, SlidersHorizontal, AlertCircle } from 'lucide-react';

const Home = () => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Hardcoded hero movie details mapped to our mock movie ID 102 (Oppenheimer)
  const heroMovie = {
    id: 102,
    title: "Oppenheimer",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop",
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. Winner of 7 Academy Awards.",
    releaseDate: "2023-07-21",
    voteAverage: 8.9,
    category: "THEATER"
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const npRes = await api.get('/movies/now-playing');
        setNowPlaying(npRes.data);

        const upRes = await api.get('/movies/upcoming');
        setUpcoming(upRes.data);
      } catch (err) {
        console.error("Error fetching homepage movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 1) {
      setIsSearching(true);
      try {
        const res = await api.get(`/movies/search?query=${query}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search query failed", err);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const getGenresList = () => {
    const allMovies = [...nowPlaying, ...upcoming];
    const genres = new Set();
    allMovies.forEach(m => {
      if (m.genres) {
        m.genres.forEach(g => genres.add(g));
      }
    });
    return ['All', ...Array.from(genres)];
  };

  const filterByGenre = (moviesList) => {
    if (selectedGenre === 'All') return moviesList;
    return moviesList.filter(m => m.genres && m.genres.includes(selectedGenre));
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* 1. Hero Showcase Banner */}
      {!isSearching && (
        <div style={{
          position: 'relative',
          height: '500px',
          backgroundImage: `linear-gradient(to top, hsl(var(--bg-primary)) 10%, rgba(10, 15, 30, 0.4) 60%, rgba(10, 15, 30, 0.7)), url(${heroMovie.backdrop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '0 0 24px 24px',
          overflow: 'hidden',
          marginBottom: '40px'
        }}>
          <div className="container" style={{ width: '100%' }}>
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span className="badge badge-purple">In Theaters</span>
                <span className="badge badge-pink" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308', borderColor: 'rgba(234,179,8,0.3)' }}>
                  ★ {heroMovie.voteAverage} Rating
                </span>
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1 }} className="glow-text">
                {heroMovie.title}
              </h1>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.05rem', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                {heroMovie.overview}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <Link to={`/movie/${heroMovie.id}`} className="btn-primary">
                  Explore Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Global Search Bar Section */}
      <div className="container" style={{ marginTop: isSearching ? '40px' : '0' }}>
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <input 
                type="text"
                placeholder="Search movies by title, actors, or keywords..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
              />
              <Search size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-muted))'
              }} />
            </div>
          </div>

          {/* Genre Filters Quick bar */}
          {!isSearching && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                <SlidersHorizontal size={14} />
                <span>Genres:</span>
              </div>
              {getGenresList().map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedGenre === genre ? 'hsl(var(--accent-purple))' : 'rgba(255,255,255,0.06)',
                    background: selectedGenre === genre ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.02)',
                    color: selectedGenre === genre ? 'hsl(var(--accent-purple))' : 'hsl(var(--text-secondary))',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Search Results State */}
        {isSearching ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Compass size={22} style={{ color: 'hsl(var(--accent-purple))' }} />
              <h2>Search Results for "{searchQuery}"</h2>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid-movies">
                {searchResults.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0',
                gap: '12px'
              }}>
                <AlertCircle size={40} style={{ color: 'hsl(var(--text-muted))' }} />
                <p style={{ color: 'hsl(var(--text-secondary))' }}>No movies found matching your search term.</p>
              </div>
            )}
          </div>
        ) : (
          /* 4. Default Categorized Showcase Lists */
          <div>
            {/* Now Playing Section */}
            <div style={{ marginBottom: '50px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>In Theaters</h2>
                  <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '2px' }}>
                    Currently running in cinemas near you
                  </p>
                </div>
                <Link to="/now-playing" style={{
                  color: 'hsl(var(--accent-purple))',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  View All &rarr;
                </Link>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading cinema movies...</div>
              ) : filterByGenre(nowPlaying).length > 0 ? (
                <div className="grid-movies">
                  {filterByGenre(nowPlaying).slice(0, 4).map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <p style={{ color: 'hsl(var(--text-muted))' }}>No matching movies found in this genre.</p>
              )}
            </div>

            {/* Upcoming OTT Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Upcoming on OTT</h2>
                  <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '2px' }}>
                    Expected releases on Netflix, Prime, Disney+ and more
                  </p>
                </div>
                <Link to="/upcoming-ott" style={{
                  color: 'hsl(var(--accent-purple))',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  View All &rarr;
                </Link>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading OTT movies...</div>
              ) : filterByGenre(upcoming).length > 0 ? (
                <div className="grid-movies">
                  {filterByGenre(upcoming).slice(0, 4).map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <p style={{ color: 'hsl(var(--text-muted))' }}>No matching movies found in this genre.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
