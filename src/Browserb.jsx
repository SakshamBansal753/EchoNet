import React, { useState } from 'react';
import Sidebar from './assets/Sidebar.jsx';
import Home from './assets/Home.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const Browser = () => {
  const navigate = useNavigate();
  const [Name, setName] = useState('');
  const [Profile, setProfile] = useState(null);
  const [Pass, setPass] = useState('');
  const [Loading, setLoading] = useState(true);
   const location = useLocation();
    const userdata = location.state;

  const get_profile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/${Name}/${Pass}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Error');
      }
      setProfile(data);
      navigate('/profile', { state: data });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="flex min-h-screen w-screen overflow-x-hidden bg-black ">
        <div className="w-[300px] bg-white/5 backdrop-blur-md border border-white/10 fixed h-screen">
          <Sidebar />
        </div>

        <div className="flex-1 px-8">
          <div className="mt-10">
            <Home />
          </div>
        </div>

       
        {/* Login Box */}
        <div className="w-[350px] pr-16 pt-[180px]   right-0">
          <div className="fixed top-4 right-4 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
  <img 
    src={userdata.image} 
    alt="Profile" 
    className="w-10 h-10 rounded-full object-cover border border-white/30"
  />
  <button className="text-white font-medium">{userdata.Username}</button>
</div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm  fixed right-0 space-y-6">
            <h2 className="text-2xl text-white font-bold text-center">Login</h2>
            <input
              type="text"
              placeholder="Enter Name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={Pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={get_profile}
              className="w-full py-3 rounded-md text-white font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 transition-all duration-300 shadow-lg"
            >
              {Loading ? 'Loading...' : 'Go To Profile'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Browser;
