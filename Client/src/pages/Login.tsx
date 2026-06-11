import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4">
      <div className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl top-20 left-20"></div>
      <div className="absolute w-96 h-96 bg-blue-600/30 rounded-full blur-3xl bottom-20 right-20"></div>

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Welcome Back 👋
        </h1>

        <p className="text-slate-300 text-center mb-8">
          Login to continue your blogging journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-purple-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-slate-300 mt-6">
          Don't have an account?
          <Link
            to="/register"
            className="text-purple-400 ml-2 hover:text-purple-300"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;