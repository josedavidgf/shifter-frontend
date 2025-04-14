import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OnboardingStep1 from './pages/OnboardingStep1';
import OnboardingStep2 from './pages/OnboardingStep2';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Profile from './pages/Profile';
import CreateShift from './pages/CreateShift';
import MyShifts from './pages/MyShifts';
import EditShift from './pages/EditShift';
import HospitalShifts from './pages/HospitalShifts';
import ProposeSwap from './pages/ProposeSwap';
import MySwaps from './pages/MySwaps';
import VerifyEmail from './pages/VerifyEmail';
import CommunicationPreferences from './components/CommunicationPreferences';
import Verified from './components/Verified';


function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/onboarding" element={<PrivateRoute><OnboardingStep1 /></PrivateRoute>} />
      <Route path="/onboarding/step-2" element={<PrivateRoute><OnboardingStep2 /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/shifts/create" element={<PrivateRoute><CreateShift /></PrivateRoute>} />
      <Route path="/shifts/my" element={<PrivateRoute><MyShifts /></PrivateRoute>} />
      <Route path="/shifts/edit/:id" element={<EditShift />} />
      <Route path="/shifts/hospital" element={<PrivateRoute><HospitalShifts /></PrivateRoute>} />
      <Route path="/propose-swap/:shift_id" element={<PrivateRoute><ProposeSwap /></PrivateRoute>} />
      <Route path="/my-swaps" element={<PrivateRoute><MySwaps /></PrivateRoute>} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/preferences" element={<PrivateRoute><CommunicationPreferences /></PrivateRoute>} />
      <Route path="/verified" element={<Verified />} />
    </Routes>
  );
}

export default App;
