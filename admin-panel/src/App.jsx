import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Users from './pages/Users';
import Login from './pages/Login';
import HomeManagement from './pages/HomeManagement';
import Categories from './pages/Categories';
import PaymentSettings from './pages/PaymentSettings';

const ProtectedRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<Navigate to="/orders" replace />} />
        
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/admin/products" element={<Navigate to="/products" replace />} />
        
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<Navigate to="/categories" replace />} />
        
        <Route path="/payments" element={<ProtectedRoute><PaymentSettings /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<Navigate to="/payments" replace />} />
        
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/admin/users" element={<Navigate to="/users" replace />} />
        
        <Route path="/cms" element={<ProtectedRoute><HomeManagement /></ProtectedRoute>} />
        <Route path="/admin/cms" element={<Navigate to="/cms" replace />} />

        {/* Catch-all to prevent blank screens */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
