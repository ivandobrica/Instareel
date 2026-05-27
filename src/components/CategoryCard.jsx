import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

export default function CategoryCard({ category, reelCount = 0 }) {
  const navigate = useNavigate();

  return (
    <div
      className="category-card"
      onClick={() => navigate(`/category/${category.id}`)}
      style={{ '--cat-color': category.color || '#e8804c' }}
    >
      <div className="category-card__icon">{category.icon || '📁'}</div>
      <div className="category-card__info">
        <h3 className="category-card__name">{category.name}</h3>
        <p className="category-card__count">{reelCount} reel{reelCount !== 1 ? 's' : ''}</p>
      </div>
      <div className="category-card__accent" />
    </div>
  );
}
