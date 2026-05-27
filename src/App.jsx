import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import AddReel from './pages/AddReel';
import ReelDetail from './pages/ReelDetail';
import Categories from './pages/Categories';
import Search from './pages/Search';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="category/:id" element={<CategoryView />} />
          <Route path="add" element={<AddReel />} />
          <Route path="reel/:id" element={<ReelDetail />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
