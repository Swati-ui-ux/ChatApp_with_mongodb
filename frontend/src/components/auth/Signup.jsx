import React, { useState } from "react";
import api from "../../utils/axiosInstence"
import { toast } from "react-toastify"

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-100">

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleForm}>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4 outline-none"
          />

          <button
            className="w-full bg-blue-600 text-white p-3 rounded"
          >
            Sign Up
          </button>

        </form>

      </div>

    </div>
  );
};

export default Signup;