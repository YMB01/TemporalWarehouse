// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductFormPage from './pages/ProductFormPage';
import LoginPage from './pages/LoginPage';       // ← import
import RegisterPage from './pages/RegisterPage'; // ← import
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth routes (public) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — will redirect if not logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<Layout><ProductListPage /></Layout>} />
            <Route path="/products/new" element={<Layout><ProductFormPage /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/products/:id/edit" element={<Layout><ProductFormPage /></Layout>} />
          </Route>

          {/* Default route */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;