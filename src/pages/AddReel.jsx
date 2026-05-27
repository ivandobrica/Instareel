import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addReel, getCategories, addCategory } from '../db';
import './AddReel.css';

export default function AddReel() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  function extractInfoFromUrl(inputUrl) {
    // Try to extract username from Instagram URL
    const match = inputUrl.match(/instagram\.com\/(?:reel|reels)\/([^/?]+)/);
    if (match) {
      return { shortcode: match[1] };
    }
    return null;
  }

  function handleUrlChange(e) {
    const val = e.target.value;
    setUrl(val);
    const info = extractInfoFromUrl(val);
    if (info && !title) {
      setTitle(`Reel ${info.shortcode}`);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;

    setSaving(true);
    try {
      await addReel({
        url: url.trim(),
        title: title.trim() || 'Untitled Reel',
        author: author.trim(),
        notes: notes.trim(),
        categoryId: categoryId ? Number(categoryId) : null,
        thumbnailUrl: thumbnailUrl.trim(),
      });
      navigate('/');
    } catch (err) {
      console.error('Failed to save reel:', err);
      setSaving(false);
    }
  }

  return (
    <div className="add-reel">
      <header className="add-reel__header">
        <button className="add-reel__back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <h1>Save Reel</h1>
      </header>

      <form onSubmit={handleSubmit} className="add-reel__form">
        <div className="form-group">
          <label>Instagram URL *</label>
          <input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://www.instagram.com/reel/..."
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a name..."
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="@username"
          />
        </div>

        <div className="form-group">
          <label>Thumbnail URL</label>
          <input
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://... (optional cover image)"
          />
        </div>

        <div className="form-group">
          <label>Collection</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">No collection</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Why did you save this? Any thoughts..."
            rows={3}
          />
        </div>

        {thumbnailUrl && (
          <div className="add-reel__preview">
            <img src={thumbnailUrl} alt="Thumbnail preview" />
          </div>
        )}

        <button type="submit" className="btn-primary btn-full" disabled={saving}>
          {saving ? 'Saving...' : 'Save Reel'}
        </button>
      </form>
    </div>
  );
}
