import React, { useState } from "react";
import axios from "axios";
const App = () => {
    const [formData, setFormData] = useState({
        username: "", email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/users/register",
                formData);
            setMessage(response.data.msg);
        } catch (error) {
            setMessage(error.response?.data?.msg || "Une erreur est survenue");
        }
    };
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded
        shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Inscription</h2>
                Username:
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />

                Email:
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                Password:
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />

                <button type="submit" className="w-full bg-blue-500 text-white p-2
rounded">
                    S'inscrire
                </button>
                {message && <p className="mt-2 text-center text-red500">{message}</p>}
            </form>
        </div>
    );
};
export default App;