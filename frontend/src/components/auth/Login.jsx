import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/axiosInstence"
import socket from '../../utils/socket'
import { FaEye, FaEyeSlash } from "react-icons/fa"
const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
   const [isShowingPassword, setIsShowingPassword] = useState(false);
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
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 transition-colors duration-300 dark:bg-slate-950">

    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">

      <h1 className="mb-8 text-center text-3xl font-bold text-slate-800 dark:text-white">
        Welcome Back 👋
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

       <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
      />

          <div className="flex items-center justify-between w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 transition-all focus-within:border-blue-500 dark:border-slate-700 dark:bg-slate-800">
  <input
    type={isShowingPassword ? "text" : "password"}
    name="password"
    placeholder="Enter your password"
    value={formData.password}
    onChange={handleChange}
    className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
  />

 <span
  type="button"
  onClick={() => setIsShowingPassword(!isShowingPassword)}
  className="ml-3 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
>
  {isShowingPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
</span>
</div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <div className="mt-6 flex items-center justify-between text-sm">

        <Link
          to="/signup"
          className="font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Create Account
        </Link>

        <Link
          to="/forgot-password"
          className="font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Forgot Password?
        </Link>

      </div>

    </div>

  </div>
);
};

export default Login;