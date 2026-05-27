import React, { useEffect, useState, useMemo } from 'react';
import { getReels } from '../db';
import ReelCard from '../components/ReelCard';
import './Search.css';

export default function Search() {
  const [reels, setReels] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getReels().then(setReels);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return reels.filter(
      (r) =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q))
    );
  }, [query, reels]);

  return (
    <div className="search-page">
      <header className="search-page__header">
        <h1>Search</h1>
      </header>

      <div className="search-page__input-wrap">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or notes..."
          autoFocus
        />
        {query && (
          <button className="search-page__clear" onClick={() => setQuery('')} aria-label="Clear search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {query.trim() && (
        <p className="search-page__results-count">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {query.trim() && filtered.length === 0 && (
        <div className="search-page__empty">
          <p>No reels found matching "{query}"</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="search-page__grid">
          {filtered.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      )}

      {!query.trim() && (
        <div className="search-page__hint">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>Search through your saved reels</p>
        </div>
      )}
    </div>
  );
}
