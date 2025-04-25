// src/pages/profile/ProfileRoutes.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PersonalInfo from './PersonalInfo';
import WorkSettings from './WorkSettings';
//import Contact from './Contact';
//import Referral from './Referral';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const ProfileRoutes = () => {
  return (
    <Routes>
      <Route path="/personal" element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>} />
      <Route path="/work" element={<ProtectedRoute><WorkSettings /></ProtectedRoute>} />
      {/* <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} /> */}
    </Routes>
  );
};

export default ProfileRoutes;
