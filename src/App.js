import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
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
import SwapDetail from './pages/SwapDetail';
import ShiftDetail from './pages/ShiftDetail';
import Calendar from './pages/Calendar';
import OnboardingCode from './pages/onboarding/OnboardingCode';
import OnboardingConfirm from './pages/onboarding/OnboardingConfirm';
import OnboardingSpeciality from './pages/onboarding/OnboardingSpeciality';
import OnboardingName from './pages/onboarding/OnboardingName';
import OnboardingPhone from './pages/onboarding/OnboardingPhone';
import OnboardingSuccess from './pages/onboarding/OnboardingSuccess';



function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
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
      <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
      <Route path="/swaps/:id" element={<PrivateRoute><SwapDetail /></PrivateRoute>} />
      <Route path="/shifts/:id" element={<PrivateRoute><ShiftDetail /></PrivateRoute>} />
      <Route path="/onboarding/code" element={<PrivateRoute><OnboardingCode /></PrivateRoute>} />
      <Route path="/onboarding/confirm" element={<PrivateRoute><OnboardingConfirm /></PrivateRoute>} />
      <Route path="/onboarding/speciality" element={<PrivateRoute><OnboardingSpeciality /></PrivateRoute>} />
      <Route path="/onboarding/name" element={<PrivateRoute><OnboardingName /></PrivateRoute>} />
      <Route path="/onboarding/phone" element={<PrivateRoute><OnboardingPhone /></PrivateRoute>} />
      <Route path="/onboarding/success" element={<PrivateRoute><OnboardingSuccess /></PrivateRoute>} />
      
    </Routes >
  );
}

export default App;
