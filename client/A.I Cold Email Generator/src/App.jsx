import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout';
import Login from './pages/login';
import Signup from './pages/signUp';
import VerifyOtp from './pages/verifyOTP';
import Dashboard from './pages/dashboard';
import History from './pages/history';
import Analytics from './pages/analytics';
import LandingPage from './pages/landingPage';
import ForgotPassword from './pages/forgotPassword';
import NotFound from './pages/notFound';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;