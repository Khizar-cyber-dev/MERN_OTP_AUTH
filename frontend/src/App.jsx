import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Auth from './components/Auth'
import Home from './components/Home';
import { useAuth } from './context/useAuth';
import Navbar from './components/Navbar';
import VerifyAccount from './components/VerifyAccount';
import ResetPassword from './components/ResetPassword';
import Loader from './components/Loader';
import { useEffect } from 'react';
import { ProtectedRoute, PublicRoute } from './lib/utils';

function App() {
  const { getProfile, authChecked } = useAuth();
  useEffect(() => {
    getProfile();
  }, []);
  if(!authChecked){
    return (<div className='w-full h-screen flex items-center justify-center'>
      <Loader />
    </div>)
  }

  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<PublicRoute><Auth /></PublicRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/verify-account" element={<ProtectedRoute><VerifyAccount /></ProtectedRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        </Routes>
    </Router>
  )
}

export default App
