import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReelCard.css';

export default function ReelCard({ reel }) {
  const navigate = useNavigate();

  return (
    <div className="reel-card" onClick={() => navigate(`/reel/${reel.id}`)}>
      <div className="reel-card__thumbnail">
        {reel.thumbnailUrl ? (
          <img src={reel.thumbnailUrl} alt={reel.title} />
        ) : (
          <div className="reel-card__placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
        )}
        <div className="reel-card__play-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
      </div>
      <div className="reel-card__info">
        <h3 className="reel-card__title">{reel.title || 'Untitled Reel'}</h3>
      </div>
    </div>
  );
}
