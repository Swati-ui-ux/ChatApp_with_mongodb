import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/axiosInstence"
import socket from '../../utils/socket'
const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const response = await api.post("/users/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      socket.emit("join", response.data.user._id);
    //   setIsLoggedIn(true);
        console.log(response)
      toast.success(response.data.message);

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white w-100 p-8 rounded-lg shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-3 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded p-3 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded cursor-pointer"
          >
            {loading ? "Logging..." : "Login"}
          </button>

        </form>

        <div className="mt-4 flex justify-between text-sm">

          <Link
            to="/signup"
            className="text-blue-600"
          >
            Create Account
          </Link>

          <Link
            to="/forgot-password"
            className="text-blue-600"
          >
            Forgot Password?
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Login;