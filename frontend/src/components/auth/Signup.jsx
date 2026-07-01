import React, { useState } from "react";
import api from "../../utils/axiosInstence"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"

const Signup = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    };
    let handleForm = async(e) => {
        e.preventDefault()
        try {
              const { name, email, password } = formData;
        if (!name || !email || !password) {
            return alert("All fields are required");
        }

            const res = await api.post('/users/register', formData)
            toast.success(res.message)
            alert("sign up success")
             console.log(res)
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                })
         } catch (error) {
            console.log(error)
         }
        
    }

 return (
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 transition-colors duration-300 dark:bg-slate-950">

    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">

      <h2 className="mb-8 text-center text-3xl font-bold text-slate-800 dark:text-white">
        Create Account 🚀
      </h2>

      <form onSubmit={handleForm} className="space-y-5">

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700 active:scale-95"
        >
          Create Account
        </button>

       </form>
       <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
  Already have an account?{" "}
  <Link
    to="/login"
    className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
  >
    Login
  </Link>
</div>

    </div>

  </div>
);
};

export default Signup;