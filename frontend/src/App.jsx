import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ClaimsList from './pages/claims/ClaimsList';
import ClaimForm from './pages/claims/ClaimForm';
import ClaimDetails from './pages/claims/ClaimDetails';
import AdminDashboard from './pages/dashboard/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Application Routes */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          {/* Default redirect based on role is handled inside DashboardLayout or we can default to list */}
          <Route index element={<ClaimsList />} />
          
          {/* Claims Workflow */}
          <Route path="claims" element={<ClaimsList />} />
          <Route path="claims/:id" element={<ClaimDetails />} />
          <Route 
            path="claims/new" 
            element={
              <ProtectedRoute allowedRoles={['policyholder']}>
                <ClaimForm />
              </ProtectedRoute>
            } 
          />

          {/* Admin Workflow */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;