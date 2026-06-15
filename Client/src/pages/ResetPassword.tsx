import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ShaderBackground from "../components/ui/ShaderBackground";
import apiClient from "../apiClient";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage("✅ Password reset successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage("❌ Reset failed. Link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <ShaderBackground />

      <div className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <h2 className="text-2xl font-bold text-white mb-2">
          Reset Password
        </h2>

        <p className="text-slate-300 text-sm mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-purple-300">
            {message}
          </p>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;