import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

import Navbar from './components/Common/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CollaborativeEditorPage from './pages/CollaborativeEditorPage.jsx'; // Import the new page

// Layout component to include Navbar for most pages
const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-900 text-gray-200">
    <Navbar />
    <main>{children}</main>
  </div>
);

// AuthLayout for pages that shouldn't have the main Navbar (like login/register)
// Or simply don't wrap them with MainLayout if they are full-screen designs
// For this example, LandingContent is full screen and doesn't need Navbar
// Login/Register pages are also designed as full-screen experiences

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} /> {/* Changed from LandingContent */}

      {/* Redirect authenticated users from login/register to dashboard */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path="/session/:sessionId" element={<CollaborativeEditorPage />} /> {/* No MainLayout for full-screen editor */}
        {/* Add other protected routes here */}
      </Route>

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
