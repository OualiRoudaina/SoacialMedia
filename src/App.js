import React from "react";
import Register from "./components/auth/register"; // Corrected to Register
import Login from "./components/auth/login"; // Corrected to Login
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtpVerification from "./components/auth/otpVerif"; // Corrected to OTPVerif
import ResetPassword from "./components/auth/resetPassword"; // Corrected to ResetPassword

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
      </Routes>
    </Router>
  );
};

export default App;
