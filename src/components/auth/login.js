import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", inputs);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-200 to-purple-300 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden flex">
        {/* Left Side */}
        <div className=" md:flex md:w-1/2 bg-cover bg-center bg-[url('https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-opacity-50 text-white p-8 flex flex-col gap-8 justify-center">
          <h1 className="text-5xl font-bold mb-6">Hello World.</h1>
          <p className="text-lg mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum, alias totam numquam ipsa exercitationem dignissimos, error nam, consequatur.</p>
          <span className="text-sm">Don't have an account?</span>
          <Link to="/register">
            <button className="w-1/2 px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-200 transition duration-200">
              Register
            </button>
          </Link>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center gap-6">
          <h1 className="text-3xl font-semibold text-gray-900 text-center">Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              className="w-full p-3 border-b border-gray-300 focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              className="w-full p-3 border-b border-gray-300 focus:ring-2 focus:ring-indigo-500"
              required
            />
            {err && <p className="text-red-500 text-sm text-center">{err}</p>}
            <button
              type="submit"
              className="w-1/2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 mx-auto"
            >
              Login
            </button>
          </form>
          <Link to="/reset-password" className="text-sm text-indigo-600 hover:underline text-center mt-4">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
