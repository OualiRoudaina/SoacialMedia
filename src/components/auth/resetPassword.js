import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setMessage('');
    try {
      await axios.post('http://localhost:8000/api/auth/forgot-password', { email });
      setMessage('OTP sent to your email');
    } catch (error) {
      setErrorMessage('Error occurred. Please try again');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Reset Password</h2>
        <form onSubmit={handleResetRequest} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Request OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
