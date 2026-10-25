import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./context/ThemeContext"; // ADDED THIS
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute"; 
import ClaimsList from "./pages/claims/ClaimsList";
import ClaimForm from "./pages/claims/ClaimForm";
import ClaimDetails from "./pages/claims/ClaimDetails";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import CreateOfficer from "./pages/dashboard/CreateOfficer";
import FloatingBackground from "./components/ui/FloatingBackground"; 

function App() {
  return (
    <ThemeProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--tw-colors-slate-900)',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          },
        }} 
      />
      
      <FloatingBackground />
      
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<ClaimsList />} />
            <Route path="claims" element={<ClaimsList />} />
            <Route path="claims/:id" element={<ClaimDetails />} />
            <Route path="claims/new" element={<ProtectedRoute allowedRoles={["policyholder"]}><ClaimForm /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="create-officer" element={<ProtectedRoute allowedRoles={["admin"]}><CreateOfficer /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;