import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [Post_data, setPost_data] = useState(null);
  const [error, seterror] = useState('');
  const [Loading, setLoading] = useState(true);
  const location = useLocation();
  const userdata = location.state;

  const handleLike = async (owner, index, id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/${userdata.Username}/${owner}/${id}`, {
        method: 'POST',
      });
      const result = await response.json();

      setPost_data(prev =>
        prev.map(post =>
          post.id === id ? { ...post, Likes: result.likes } : post
        )
      );
    } catch (err) {
      console.error('Failed to like/unlike post:', err);
    }
  };

  useEffect(() => {
    const get_post = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:5000/api/getpost');
        const data = await response.json();
        const orderedPosts = Object.values(data);
        setPost_data(orderedPosts);
      } catch (e) {
        console.error(e);
        seterror('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    get_post();
  }, []);

  if (Loading)
    return (
      <div className="text-center mt-20 text-lg text-gray-400 animate-pulse">
        Loading posts...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-20 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        
        {Post_data?.map((post, index) => (
          <div
            key={post.id}
            className="bg-gradient-to-br from-[#222831] to-[#0f0f0f] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden transition duration-300 hover:scale-[1.015]"
          >
            {/* Profile Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-800">
              <img
                src={post.Profile}
                alt="User"
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-700 shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-white font-semibold text-lg">{post.UserName}</span>
                <span className="text-sm text-gray-500">{post.date} · {post.time}</span>
              </div>
            </div>

            {/* Post Image */}
            <div className="bg-black p-4 flex items-center justify-center">
              <img
                src={post.image}
                alt="Post"
                className="w-full max-h-[500px] object-contain rounded-xl border border-gray-800 shadow"
              />
            </div>

           {/* Content & Like Button */}
<div className="relative z-10 px-6 pb-6 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
  <div className="relative text-gray-200 max-w-2xl text-[15px] leading-relaxed tracking-wide font-light">
    <div className="absolute inset-0 rounded-xl bg-gradient-radial from-white/5 via-transparent to-transparent pointer-events-none blur-md" />
    <p className="relative z-10">
      <span className="block text-[16px] text-white font-medium mb-1">
        Post Description:
      </span>
      <span className="text-gray-300 leading-snug whitespace-pre-wrap">
        {post.content}
      </span>
    </p>
  </div>

  <button
    onClick={() => handleLike(post.UserName, index, post.id)}
    className="relative px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-md shadow-blue-800/30 group"
  >
    <div className="flex items-center gap-2">
      <span className="transition-transform group-hover:scale-110">❤️</span>
      <span>{post.Likes}</span>
    </div>
    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Like post
    </div>
  </button>
</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
