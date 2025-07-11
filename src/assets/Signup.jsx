import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [NewUser, setNewUser] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [Message, setMessage] = useState("");

  const create = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(NewUser)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setMessage("Account created successfully!");
      navigate("/");
    } catch (e) {
      console.error(e);
      setMessage("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">
       <div className='fixed top-[15%]'>
        <img src='Echo.PNG' className='w-[180px]'/>
      </div>
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-gray-700 rounded-3xl shadow-[0_4px_60px_rgba(0,0,0,0.6)] px-8 py-10 text-white space-y-8 transition-all">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Create Account</h1>
          <p className="text-sm text-gray-400">Join us — it takes less than a minute.</p>
        </div>

        <form onSubmit={create} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text"
              placeholder="e.g. johndoe"
              value={NewUser.username}
              onChange={(e) => setNewUser({ ...NewUser, username: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-all"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={NewUser.email}
              onChange={(e) => setNewUser({ ...NewUser, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={NewUser.password}
              onChange={(e) => setNewUser({ ...NewUser, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            Sign Up
          </button>

          {/* Message */}
          {Message && (
            <div className="mt-3 bg-yellow-500/10 border border-yellow-500 text-yellow-300 px-4 py-2 rounded-lg text-center text-sm">
              {Message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
