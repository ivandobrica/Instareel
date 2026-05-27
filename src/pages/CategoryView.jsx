import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReels, getCategories } from '../db';
import ReelCard from '../components/ReelCard';
import './CategoryView.css';

export default function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cats = await getCategories();
      const cat = cats.find((c) => c.id === Number(id));
      if (!cat) {
        navigate('/categories');
        return;
      }
      setCategory(cat);
      const r = await getReels(Number(id));
      setReels(r.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    }
    load();
  }, [id, navigate]);

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="category-view">
      <header className="category-view__header">
        <button className="category-view__back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <div className="category-view__title-group">
          <span className="category-view__icon">{category.icon}</span>
          <h1>{category.name}</h1>
        </div>
        <span className="category-view__count">{reels.length} reel{reels.length !== 1 ? 's' : ''}</span>
      </header>

      {reels.length === 0 ? (
        <div className="category-view__empty">
          <p>No reels in this collection yet.</p>
        </div>
      ) : (
        <div className="category-view__grid">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      )}
    </div>
  );
}
