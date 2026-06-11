import { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
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
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert("Registration Successful!");
      console.log(res.data);

      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <h1>Blog CMS</h1>
        <p>Create Your Account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;