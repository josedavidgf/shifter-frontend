import ShiftsAssistant from './pages/Chats/ShiftsAssistant';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import SimpleLayout from './components/SimpleLayout';
import Calendar from './pages/Calendar/CalendarPage';
import MySwaps from './pages/Swaps/MySwaps';
import HospitalShifts from './pages/Shifts/HospitalShifts';
import ChatsList from './pages/Chats/ChatList';
import CreateShift from './pages/Shifts/CreateShift';
import ProposeSwap from './pages/Swaps/ProposeSwap';
import VerifyEmail from './pages/VerifyEmail';
//import Verified from './components/Verified';
import SwapDetail from './pages/Swaps/SwapDetail';
import OnboardingCode from './pages/onboarding/OnboardingCode';
import OnboardingConfirm from './pages/onboarding/OnboardingConfirm';
import OnboardingSpeciality from './pages/onboarding/OnboardingSpeciality';
import OnboardingName from './pages/onboarding/OnboardingName';
import OnboardingPhone from './pages/onboarding/OnboardingPhone';
import OnboardingSuccess from './pages/onboarding/OnboardingSuccess';
import ChatPage from './pages/Chats/ChatPage';
import ProfileMenu from './pages/Profile/ProfileMenu';
import PersonalInfo from './pages/Profile/PersonalInfo';
import WorkSettings from './pages/Profile/WorkSettings';
import ProfilePreferences from './pages/Profile/ProfilePreferences';
import ButtonDemo from './components/ui/Button/ButtonDemo';
import GlobalUI from './components/ui/GlobalUI/GlobalUI';
import AuthCallback from './pages/AuthCallback.jsx'


function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/button-demo" element={<ButtonDemo />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Rutas privadas: agrupadas bajo el nuevo layout */}
        <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
  <Route path="calendar" element={<Calendar />} />
  <Route path="my-swaps" element={<MySwaps />} />
  <Route path="shifts/hospital" element={<HospitalShifts />} />
  <Route path="chats" element={<ChatsList />} />
  <Route path="chat-turnos" element={<ShiftsAssistant />} /> {/* ✅ RUTA AÑADIDA */}
  <Route path="profile" element={<ProfileMenu />} />
</Route>

        <Route element={<SimpleLayout />}>
          <Route path="/profile/personal" element={<PrivateRoute><PersonalInfo /></PrivateRoute>} />
          <Route path="/profile/work" element={<PrivateRoute><WorkSettings /></PrivateRoute>} />
          <Route path="profile/preferences" element={<PrivateRoute><ProfilePreferences /></PrivateRoute>} />
          <Route path="/chats/:swapId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/shifts/create" element={<PrivateRoute><CreateShift /></PrivateRoute>} />
          <Route path="/propose-swap/:shift_id" element={<PrivateRoute><ProposeSwap /></PrivateRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          {/* <Route path="/verified" element={<Verified />} /> */}
          <Route path="/swaps/:id" element={<PrivateRoute><SwapDetail /></PrivateRoute>} />
          <Route path="/onboarding/code" element={<PrivateRoute><OnboardingCode /></PrivateRoute>} />
          <Route path="/onboarding/confirm" element={<PrivateRoute><OnboardingConfirm /></PrivateRoute>} />
          <Route path="/onboarding/speciality" element={<PrivateRoute><OnboardingSpeciality /></PrivateRoute>} />
          <Route path="/onboarding/name" element={<PrivateRoute><OnboardingName /></PrivateRoute>} />
          <Route path="/onboarding/phone" element={<PrivateRoute><OnboardingPhone /></PrivateRoute>} />
          <Route path="/onboarding/success" element={<PrivateRoute><OnboardingSuccess /></PrivateRoute>} />
        </Route>
      </Routes>
      <GlobalUI />
    </>
  );
}

export default App;
