// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductFormPage from './pages/ProductFormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/products/:id/edit" element={<ProductFormPage />} />
        <Route path="*" element={<ProductListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;