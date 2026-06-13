import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ShaderBackground from "../components/ui/ShaderBackground";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      console.log("Login Response:", res.data);

      login(res.data.user, res.data.token);

      alert("Login Successful!");

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        alert("Please verify your email first.");
      } else {
        alert(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <ShaderBackground />

      <div className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">

        <form onSubmit={handleLogin} className="space-y-6">

          <h2 className="text-3xl font-bold text-white text-center">
            Welcome Back
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-300"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
          >
            Login
          </button>

          <div className="flex flex-col items-center gap-3 mt-4 text-sm">
            <Link
              to="/forgot-password"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>

            <p className="text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-purple-400 font-bold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;