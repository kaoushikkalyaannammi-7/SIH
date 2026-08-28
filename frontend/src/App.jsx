import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import MiddlemanDashboard from './pages/middleman/MiddlemanDashboard';

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or a generic unauthorized page
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Farmer Routes */}
          <Route 
            path="/farmer/*" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Vendor Routes */}
          <Route 
            path="/vendor/*" 
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Middleman Routes */}
          <Route 
            path="/middleman/*" 
            element={
              <ProtectedRoute allowedRoles={['middleman']}>
                <MiddlemanDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
