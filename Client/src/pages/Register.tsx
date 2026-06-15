import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ShaderBackground from "../components/ui/ShaderBackground";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("register");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");

  const validatePassword = (password: string) => {
    return (
      password.length >= 8 &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      alert(
        "Password must be 8+ characters, include a number, and a special character."
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://blog-platform-web-gqdd.onrender.com/api/auth/register",
        formData
      );

      console.log(response.data);

      alert("OTP sent successfully");
      setStep("otp");
    } catch (error: any) {
      console.error("Register Error:", error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Sending:", {
        email: formData.email,
        otp,
      });

      const response = await axios.post(
        "https://blog-platform-web-gqdd.onrender.com/api/auth/verify-otp",
        {
          email: formData.email,
          otp,
        }
      );

      console.log(response.data);

      alert("Registration Successful!");
      navigate("/login");
    } catch (error: any) {
      console.error("Server says:", error.response?.data);
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <ShaderBackground />

      <div className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        {step === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Create Account
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value,
                })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold"
            >
              Register
            </button>
            <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Login
            </Link>
</div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Verify OTP
            </h2>

            <p className="text-center text-slate-200">
              A code has been sent to
            </p>

            <p className="text-center text-white font-bold break-all">
              {formData.email}
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              maxLength={6}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-widest"
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold"
            >
              Verify & Finish
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;