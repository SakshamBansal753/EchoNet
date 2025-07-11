import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const location = useLocation();
  const userData = location.state;

  const [formdata, setformdata] = useState({
    postdata: '',
    posturl: ''
  });
  const [Bio, setBio] = useState(false);
  const [Bio_Content, setBio_Content] = useState('');
  const [Edit, setEdit] = useState(false);
  const [Prof, setProf] = useState('');
  const [user, setUser] = useState(userData || {});
  const [posts, setPosts] = useState(userData?.Posts || []);
  const [likes, setLikes] = useState({});
  const [Quote, setQuote] = useState("")
  const fetchUserData = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/${userData.UserName}`);
      const data = await res.json();
      setUser(data);
      setPosts(data.Posts);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    Get_quote();
    const interval = setInterval(fetchUserData, 1000);
    return () => clearInterval(interval);
  }, []);

  const add_post = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/${user.UserName}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formdata)
      });

      if (!response.ok) throw new Error('Failed to add post');
      setPosts([...posts, formdata]);
      setformdata({ postdata: '', posturl: '' });
    } catch (e) {
      console.error(e);
    }
  };

  const delete_post = async (i, username) => {
    try {
      const URL = `http://127.0.0.1:5000/api/${username}/${i}/delete`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error('Invalid');
      setPosts(prev => prev.filter((_, index) => index !== i));
    } catch (e) {
      console.log(e);
    }
  };
  const Get_quote=async()=>{
    try{
      const response =await fetch ("http://127.0.0.1:5000/api/getquote")
      const data=await response.json()
      if(!response.ok){
        throw new Error("Soory No quote available yet")
      }
      
      setQuote(data.q)

    }catch(e){
      console.log(e)
    }
  }
  const EditPic = async () => {
    try {
      await fetch(`http://127.0.0.1:5000/api/editpic/${user.UserName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Prof)
      });
    } catch (e) {
      console.log(e);
    }
  };

  const Edit_BIO = async () => {
    try {
      await fetch(`http://127.0.0.1:5000/api/editbio/${user.UserName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Bio_Content)
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen text-white p-10 bg-gradient-to-br from-black via-gray-800 to-black">
      <section className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-[400px] min-h-screen bg-gray-900 p-8 space-y-5 rounded-xl shadow-lg">
          <img
            src={user.Profile}
            alt="Profile"
            className="w-[220px] h-[220px] object-cover rounded-xl border-4 border-gray-700"
          />
          <button
            className="mt-3 ml-4 p-4 font-medium text-xl bg-gradient-to-r from-purple-700 via-blue-600 to-gray-800 rounded-md"
            onClick={() => setEdit(!Edit)}
          >
            Edit Profile Pic
          </button>
          {Edit && (
            <div className="flex ml-[-30px] space-x-2">
              <input
                type="text"
                placeholder="Enter URL"
                className="p-5 text-xl font-mono rounded bg-gray-700 text-white"
                value={Prof}
                onChange={(e) => setProf(e.target.value)}
              />
              <button
                className="p-4 bg-gradient-to-r from-purple-700 to-blue-600 rounded text-white"
                onClick={EditPic}
              >
                Add
              </button>
            </div>
          )}
         <div className="mt-10 p-6 bg-gradient-to-br from-indigo-800 via-gray-900 to-blue-800 rounded-2xl shadow-2xl border border-blue-600">
  <h2 className="text-2xl font-bold text-white mb-4 tracking-wide text-center">
    Quote of the Day
  </h2>
  <div className="relative">
    <p className="italic text-gray-200 leading-relaxed text-lg border-l-4 border-cyan-400 pl-6">
      “{Quote}”
    </p>
    <div className="absolute -left-3 top-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
  </div>
</div>
          <div>
       <button className="relative top-[200px] text-2xl p-4 font-semibold bg-gradient-to-r from-teal-400 via-emerald-500 to-green-600 text-white rounded-xl w-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
  To Home
</button>

          </div>
        </div>

        {/* Content Area */}
        <div className="text-2xl space-y-6 w-full">
          <p className="text-3xl font-bold">@{user.UserName}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={formdata.posturl}
              onChange={(e) => setformdata({ ...formdata, posturl: e.target.value })}
              placeholder="Post Image URL"
              className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded w-full"
            />
            <input
              type="text"
              value={formdata.postdata}
              onChange={(e) => setformdata({ ...formdata, postdata: e.target.value })}
              placeholder="Post Content"
              className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded w-full"
            />
            <button
              onClick={add_post}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              Add Post
            </button>
          </div>

          <div className="flex gap-8 text-lg text-gray-300">
            <p>Liked By: {user.Total_Likes}</p>
            <p>Liked To: {user.Total_Liked_TO}</p>
          </div>

          <div className="flex justify-between">
            <div>
              <strong>Bio:</strong>
              <div className="text-gray-300">{user.Bio}</div>
            </div>
            <div className="flex">
              {Bio && (
                <div>
                  <input
                    type="text"
                    placeholder="Bio"
                    className="p-5 bg-gray-700"
                    value={Bio_Content}
                    onChange={(e) => setBio_Content(e.target.value)}
                  />
                  <button
                    className="bg-gray-700 p-5 border-l hover:scale-105 hover:bg-gray-950"
                    onClick={Edit_BIO}
                  >
                    Add
                  </button>
                </div>
              )}
              <button
                onClick={() => setBio(!Bio)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
              >
                Edit <br /> Bio
              </button>
            </div>
          </div>

          <div>
            <strong className="text-xl">Posts:</strong>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <li
                    key={index}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl border border-gray-800 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="bg-gray-800 px-4 py-2 flex justify-between text-sm text-gray-400">
                      <span>{post.date}</span>
                      <span>{post.time}</span>
                    </div>

                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-[300px] object-cover rounded-t-xl border-b border-gray-700"
                    />

                    <div className="p-5 space-y-4 text-white font-sans">
                      <p className="text-lg font-semibold tracking-wide leading-relaxed text-gray-200">
                        {post.content}
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <button
                          onClick={() => delete_post(index, user.UserName)}
                          className="text-sm px-4 py-1 bg-red-600 hover:bg-red-700 rounded-full font-semibold transition-all"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setLikes({ ...likes, [index]: !likes[index] })}
                          className="text-xl transition-transform transform hover:scale-125"
                        >
                          {likes[index] ? '❤️' : '🤍'}{post.Likes}
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No posts yet.</p>
              )}
            </ul>
          </div>
        </div>

        <div>
          <h1 className="fonticon flex fixed z-20 bottom-0 text-3xl right-3">
            <img src="Echo.PNG" className="w-[320px]" alt="Echo Logo" />
          </h1>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
