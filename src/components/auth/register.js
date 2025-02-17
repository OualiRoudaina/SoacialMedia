import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();



  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/auth/register", inputs);
      setSuccessMessage("Registration successful! Redirecting to OTP verification...");
      setErr(null);
      localStorage.setItem("otpToken", response.data.token); // Stocker le token temporaire

      setTimeout(() => {
        navigate("/verify-otp"); // Redirect to OTP verification page after 2 seconds
      }, 2000);
    } catch (err) {
      setErr(err.response ? err.response.data : "An error occurred");
      setSuccessMessage(null);

    }
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span className="text-sm">Do you have an account?</span>
          <Link to="/">
            <button className="w-1/2 px-4 py-2 bg-white text-purple-800 font-bold rounded-md hover:bg-gray-200 transition">
              Login
            </button>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col gap-12 justify-center p-12">
          <h1 className="text-gray-700 text-3xl font-bold">Register</h1>
          <form className="flex flex-col gap-8">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="border-b border-gray-300 py-3 px-2 focus:outline-none focus:border-indigo-500"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border-b border-gray-300 py-3 px-2 focus:outline-none focus:border-indigo-500"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border-b border-gray-300 py-3 px-2 focus:outline-none focus:border-indigo-500"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-b border-gray-300 py-3 px-2 focus:outline-none focus:border-indigo-500"
              onChange={handleChange}
              required
            />
            {err && <p className="text-red-500 text-sm">{err.msg || "An error occurred"}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>} {/* Display success message */}
            <button
              onClick={handleClick}
              className="w-1/2 py-3 bg-indigo-500 text-white font-bold rounded-md hover:bg-indigo-600 transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
