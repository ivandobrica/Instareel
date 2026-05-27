import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReels, getCategories } from '../db';
import ReelCard from '../components/ReelCard';
import './Home.css';

export default function Home() {
  const [reels, setReels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [r, c] = await Promise.all([getReels(), getCategories()]);
      setReels(r.sort((a, b) => b.createdAt - a.createdAt));
      setCategories(c);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Reels Vault</h1>
        <p className="home__subtitle">{reels.length} saved reel{reels.length !== 1 ? 's' : ''}</p>
      </header>

      {reels.length === 0 ? (
        <div className="home__empty">
          <div className="home__empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="18" cy="6" r="1.5"/>
            </svg>
          </div>
          <h2>No reels saved yet</h2>
          <p>Tap the + button to save your first Instagram Reel</p>
          <Link to="/add" className="home__empty-btn">Save a Reel</Link>
        </div>
      ) : (
        <>
          {categories.length > 0 && (
            <section className="home__categories">
              <div className="home__section-header">
                <h2>Collections</h2>
                <Link to="/categories" className="home__see-all">See all</Link>
              </div>
              <div className="home__categories-scroll">
                {categories.slice(0, 5).map((cat) => (
                  <Link key={cat.id} to={`/category/${cat.id}`} className="home__cat-chip" style={{ '--chip-color': cat.color }}>
                    <span className="home__cat-icon">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="home__reels">
            <div className="home__section-header">
              <h2>Recent</h2>
            </div>
            <div className="home__reels-grid">
              {reels.map((reel) => (
                <ReelCard key={reel.id} reel={reel} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
