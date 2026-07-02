import React, { useState } from "react";
import api from "../../utils/axiosInstence"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const navigate = useNavigate();
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
          const data = new FormData();

          data.append("name", formData.name);
          data.append("email", formData.email);
          data.append("password", formData.password);

          if(profilePic){
              data.append("profilePic", profilePic);
          }
          console.log("Form Data:", data);
            const res = await api.post('/users/register', data)
            toast.success(res.message)
            navigate("/login")
             console.log(res)
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                })
         } catch (error) {
             toast.error(
      error.response?.data?.message);
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
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all focus:text-white focus:placeholder:text-slate-400 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
           className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none   transition-all dark:focus:text-white dark:focus:placeholder:text-slate-400 dark:border-slate-700 dark:focus:border-blue-500 dark:text-white
dark:bg-slate-800 dark:placeholder:text-slate-500 "
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Profile Picture
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:cursor-pointer hover:file:bg-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:file:bg-blue-500 dark:hover:file:bg-blue-600"
          />

          {profilePic && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Selected: {profilePic.name}
            </p>
          )}
        </div>
       
         <div className="relative flex justify-between rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all focus:text-black focus:placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500">
          <input
          type={isShowingPassword ? "text" : "password"}
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          className="  outline-none transition-all dark:focus:text-black placeholder:text-slate-400 focus:border-blue-500  dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
           />
           <span onClick={()=>setIsShowingPassword(!isShowingPassword)}>{isShowingPassword ? 'Hide' : 'Show'}</span>
         </div>
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