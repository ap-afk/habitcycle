import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(
                "https://habitcycle.onrender.com/api/users/register",
                form,
                { withCredentials: true }
            );

            setMessage("Registered successfully!");
            setTimeout(() => navigate("/home"), 500); // Redirect to home
        } catch (err) {
            setMessage(err.response?.data?.error || "Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {message && <p className="text-red-500 mb-4 text-center">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="w-full border p-3 rounded"
                        onChange={handleChange}
                        required
                        minLength={3}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border p-3 rounded"
                        onChange={handleChange}
                        required
                        pattern=".+\@.+\..+"

                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border p-3 rounded"
                        onChange={handleChange}
                        required
                        minLength={6}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-4 text-center">
                    Already have an account?
                    <a href="/login" className="text-blue-600"> Login</a>
                </p>
            </div>
        </div>
    );
}
