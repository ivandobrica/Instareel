import React, { useEffect, useState } from 'react';
import { getCategories, addCategory, deleteCategory, getReelCount } from '../db';
import CategoryCard from '../components/CategoryCard';
import Modal from '../components/Modal';
import './Categories.css';

const CATEGORY_COLORS = ['#e8804c', '#5c8ee8', '#8c5ce8', '#e85c8c', '#5ce8a0', '#e8c85c', '#5ccde8'];
const CATEGORY_ICONS = ['📁', '🎬', '💡', '🎵', '😂', '🍳', '💪', '🎨', '✈️', '📚', '🛍️', '❤️', '🏠', '🐱', '🌿'];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [reelCounts, setReelCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0]);
  const [newIcon, setNewIcon] = useState(CATEGORY_ICONS[0]);

  async function load() {
    const cats = await getCategories();
    setCategories(cats);
    const counts = {};
    for (const cat of cats) {
      counts[cat.id] = await getReelCount(cat.id);
    }
    setReelCounts(counts);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    await addCategory(newName.trim(), newColor, newIcon);
    setNewName('');
    setNewColor(CATEGORY_COLORS[0]);
    setNewIcon(CATEGORY_ICONS[0]);
    setShowModal(false);
    load();
  }

  async function handleDelete(id) {
    if (confirm('Delete this collection and all its reels?')) {
      await deleteCategory(id);
      load();
    }
  }

  return (
    <div className="categories-page">
      <header className="categories-page__header">
        <h1>Collections</h1>
        <button className="categories-page__add-btn" onClick={() => setShowModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </header>

      {categories.length === 0 ? (
        <div className="categories-page__empty">
          <p>No collections yet. Create one to organize your reels.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Create Collection</button>
        </div>
      ) : (
        <div className="categories-page__list">
          {categories.map((cat) => (
            <div key={cat.id} className="categories-page__item">
              <CategoryCard category={cat} reelCount={reelCounts[cat.id] || 0} />
              <button
                className="categories-page__delete"
                onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                aria-label="Delete collection"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Collection">
        <form onSubmit={handleAdd} className="category-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Funny, Recipes, Fitness..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Icon</label>
            <div className="icon-picker">
              {CATEGORY_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-picker__item ${newIcon === icon ? 'active' : ''}`}
                  onClick={() => setNewIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-picker__item ${newColor === color ? 'active' : ''}`}
                  style={{ background: color }}
                  onClick={() => setNewColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full">Create Collection</button>
        </form>
      </Modal>
    </div>
  );
}
