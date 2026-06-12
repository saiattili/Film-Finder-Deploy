import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { Heart, Film, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // ALL, THEATER, OTT

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await api.get('/watchlist');
        setItems(res.data);
        setFilteredItems(res.data);
      } catch (err) {
        console.error("Failed to load watchlist items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  // Filter effect when categoryFilter or items change
  useEffect(() => {
    if (categoryFilter === 'ALL') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === categoryFilter));
    }
  }, [categoryFilter, items]);

  const handleWatchlistChange = (removedMovieId, isAdded) => {
    // Watchlist page only cares about removals
    if (!isAdded) {
      setItems(prevItems => prevItems.filter(item => (item.tmdbMovieId || item.id) !== removedMovieId));
    }
  };

  return (
    <div style={{ padding: '40px 0', minHeight: '65vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={32} fill="hsl(var(--accent-pink))" style={{ color: 'hsl(var(--accent-pink))' }} />
              My Watchlist
            </h1>
            <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>
              Your collection of tracked theater releases and upcoming OTT premieres
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="glass-panel" style={{ display: 'flex', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setCategoryFilter('ALL')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: categoryFilter === 'ALL' ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: categoryFilter === 'ALL' ? '#fff' : 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setCategoryFilter('THEATER')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: categoryFilter === 'THEATER' ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: categoryFilter === 'THEATER' ? '#fff' : 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Theaters ({items.filter(i => i.category === 'THEATER').length})
            </button>
            <button
              onClick={() => setCategoryFilter('OTT')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: categoryFilter === 'OTT' ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: categoryFilter === 'OTT' ? '#fff' : 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              OTT Releases ({items.filter(i => i.category === 'OTT').length})
            </button>
          </div>
        </div>

        {/* List grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '1.2rem', color: 'hsl(var(--text-secondary))' }}>
            Loading watchlist items...
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid-movies">
            {filteredItems.map(item => (
              <MovieCard 
                key={item.id} 
                movie={item} 
                onWatchlistChange={handleWatchlistChange} 
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{
            padding: '60px 24px',
            textAlign: 'center',
            borderRadius: '24px',
            maxWidth: '500px',
            margin: '40px auto 0'
          }}>
            <Film size={48} style={{ color: 'hsl(var(--text-muted))', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Your watchlist is empty</h3>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', marginBottom: '24px' }}>
              {categoryFilter === 'ALL' 
                ? "Start browsing movies in theaters or upcoming streaming releases to add items here."
                : `You don't have any items under the ${categoryFilter} category.`}
            </p>
            <Link to="/" className="btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
              Browse Catalog <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
