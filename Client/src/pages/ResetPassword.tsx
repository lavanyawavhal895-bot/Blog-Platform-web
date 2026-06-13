import { useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../apiClient";

const ResetPassword = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage("Password reset successful!");
    } catch (error) {
      setMessage("Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-6 border rounded-lg w-96"
      >
        <h2 className="text-2xl mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2"
        >
          Reset Password
        </button>

        {message && (
          <p className="mt-3">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;