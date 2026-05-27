import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReel, deleteReel, getCategories, updateReel } from '../db';
import Modal from '../components/Modal';
import './ReelDetail.css';

export default function ReelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reel, setReel] = useState(null);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const r = await getReel(Number(id));
      if (!r) {
        navigate('/');
        return;
      }
      setReel(r);
      setEditData(r);
      const cats = await getCategories();
      setCategories(cats);
      if (r.categoryId) {
        setCategory(cats.find((c) => c.id === r.categoryId) || null);
      }
      setLoading(false);
    }
    load();
  }, [id, navigate]);

  async function handleDelete() {
    if (confirm('Delete this reel?')) {
      await deleteReel(Number(id));
      navigate('/');
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    await updateReel(Number(id), {
      title: editData.title,
      author: editData.author,
      notes: editData.notes,
      categoryId: editData.categoryId ? Number(editData.categoryId) : null,
      thumbnailUrl: editData.thumbnailUrl,
    });
    const updated = await getReel(Number(id));
    setReel(updated);
    const cats = await getCategories();
    setCategory(updated.categoryId ? cats.find((c) => c.id === updated.categoryId) : null);
    setShowEdit(false);
  }

  function openInInstagram() {
    window.open(reel.url, '_blank', 'noopener');
  }

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="reel-detail">
      <header className="reel-detail__header">
        <button className="reel-detail__back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <div className="reel-detail__actions">
          <button className="reel-detail__action" onClick={() => setShowEdit(true)} aria-label="Edit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className="reel-detail__action reel-detail__action--danger" onClick={handleDelete} aria-label="Delete">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
            </svg>
          </button>
        </div>
      </header>

      <div className="reel-detail__thumbnail" onClick={openInInstagram}>
        {reel.thumbnailUrl ? (
          <img src={reel.thumbnailUrl} alt={reel.title} />
        ) : (
          <div className="reel-detail__placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            <span>Tap to open in Instagram</span>
          </div>
        )}
        <div className="reel-detail__play-overlay">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
      </div>

      <div className="reel-detail__info">
        <h1 className="reel-detail__title">{reel.title || 'Untitled Reel'}</h1>

        {reel.author && (
          <p className="reel-detail__author">@{reel.author}</p>
        )}

        {category && (
          <div className="reel-detail__category">
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </div>
        )}

        {reel.notes && (
          <div className="reel-detail__notes">
            <h3>Notes</h3>
            <p>{reel.notes}</p>
          </div>
        )}

        <div className="reel-detail__meta">
          <span>Saved {new Date(reel.createdAt).toLocaleDateString()}</span>
        </div>

        <button className="btn-primary btn-full reel-detail__open-btn" onClick={openInInstagram}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="5"/>
            <circle cx="18" cy="6" r="1.5"/>
          </svg>
          Open in Instagram
        </button>
      </div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Reel">
        <form onSubmit={handleSaveEdit} className="category-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={editData.title || ''}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              value={editData.author || ''}
              onChange={(e) => setEditData({ ...editData, author: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Thumbnail URL</label>
            <input
              type="url"
              value={editData.thumbnailUrl || ''}
              onChange={(e) => setEditData({ ...editData, thumbnailUrl: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Collection</label>
            <select
              value={editData.categoryId || ''}
              onChange={(e) => setEditData({ ...editData, categoryId: e.target.value })}
            >
              <option value="">No collection</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={editData.notes || ''}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <button type="submit" className="btn-primary btn-full">Save Changes</button>
        </form>
      </Modal>
    </div>
  );
}
