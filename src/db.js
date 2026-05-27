import { openDB } from 'idb';

const DB_NAME = 'reels-vault';
const DB_VERSION = 1;

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Reels store
      if (!db.objectStoreNames.contains('reels')) {
        const reelsStore = db.createObjectStore('reels', {
          keyPath: 'id',
          autoIncrement: true,
        });
        reelsStore.createIndex('categoryId', 'categoryId');
        reelsStore.createIndex('createdAt', 'createdAt');
      }

      // Categories store
      if (!db.objectStoreNames.contains('categories')) {
        const catStore = db.createObjectStore('categories', {
          keyPath: 'id',
          autoIncrement: true,
        });
        catStore.createIndex('name', 'name', { unique: true });
      }
    },
  });
}

// --- Categories ---

export async function getCategories() {
  const db = await getDB();
  return db.getAll('categories');
}

export async function addCategory(name, color = '#e8804c', icon = '📁') {
  const db = await getDB();
  return db.add('categories', {
    name,
    color,
    icon,
    createdAt: Date.now(),
  });
}

export async function updateCategory(id, updates) {
  const db = await getDB();
  const category = await db.get('categories', id);
  if (!category) return;
  const updated = { ...category, ...updates };
  return db.put('categories', updated);
}

export async function deleteCategory(id) {
  const db = await getDB();
  // Also delete all reels in this category
  const tx = db.transaction(['categories', 'reels'], 'readwrite');
  const reelsIndex = tx.objectStore('reels').index('categoryId');
  let cursor = await reelsIndex.openCursor(id);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.objectStore('categories').delete(id);
  await tx.done;
}

// --- Reels ---

export async function getReels(categoryId = null) {
  const db = await getDB();
  if (categoryId) {
    return db.getAllFromIndex('reels', 'categoryId', categoryId);
  }
  return db.getAll('reels');
}

export async function getReel(id) {
  const db = await getDB();
  return db.get('reels', id);
}

export async function addReel(reel) {
  const db = await getDB();
  return db.add('reels', {
    ...reel,
    createdAt: Date.now(),
  });
}

export async function updateReel(id, updates) {
  const db = await getDB();
  const reel = await db.get('reels', id);
  if (!reel) return;
  const updated = { ...reel, ...updates };
  return db.put('reels', updated);
}

export async function deleteReel(id) {
  const db = await getDB();
  return db.delete('reels', id);
}

export async function getReelCount(categoryId = null) {
  const db = await getDB();
  if (categoryId) {
    return (await db.getAllFromIndex('reels', 'categoryId', categoryId)).length;
  }
  return (await db.getAll('reels')).length;
}
