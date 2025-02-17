import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Add Link import

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("otpToken"); // Retrieve the token from local storage or wherever it's stored
     
      if (!token) {
        alert("Aucun token trouvé. Veuillez vous inscrire à nouveau.");
        return;
    }
     
      const response = await axios.post(
        'http://localhost:8000/api/auth/verify-otp',
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }  // Send the token in the Authorization header
      );

      alert('Account verified successfully');
      localStorage.setItem("userToken", response.data.token); // Stocke le token dans localStorage
      
      localStorage.removeItem("otpToken"); // Supprime le token temporaire

      navigate('/'); // Redirect to home page after successful verification
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data);
        setErrorMessage(error.response.data.msg || 'Invalid OTP');
      } else {
        console.error('Error Message:', error.message);
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="h-screen bg-indigo-200 flex items-center justify-center">
      <div className="w-1/2 flex flex-row-reverse bg-white rounded-lg min-h-[600px] overflow-hidden shadow-lg">
        
        {/* Left Side */}
        <div
          className="flex-1 bg-cover bg-center text-white flex flex-col gap-8 p-12"
          style={{
            backgroundImage:
              "linear-gradient(rgba(39, 11, 96, 0.5), rgba(39, 11, 96, 0.5)), url('https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          }}
        >
          <h1 className="text-[60px] leading-[100px] font-bold">EXPRIMO.</h1>
          <p className="text-sm">
            Please enter the OTP sent to your email to verify your account.
          </p>
          <span className="text-sm">Already verified?</span>
          <Link to="/">
            <button className="w-1/2 px-4 py-2 bg-white text-purple-800 font-bold rounded-md hover:bg-gray-200 transition">
              Login
            </button>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col gap-12 justify-center p-12">
          <h1 className="text-gray-700 text-3xl font-bold">Verify OTP</h1>
          <form className="flex flex-col gap-8">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="border-b border-gray-300 py-3 px-2 focus:outline-none focus:border-indigo-500"
              onChange={handleChange} // Use the handleChange function here
              required
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>} {/* Use errorMessage */}
            <button
              onClick={handleOTPVerification} // Corrected function name
              className="w-1/2 py-3 bg-indigo-500 text-white font-bold rounded-md hover:bg-indigo-600 transition"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
