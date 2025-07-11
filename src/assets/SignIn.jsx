import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
    const navigate=useNavigate()
    const move=useNavigate()
    const [Pic, setPic] = useState('')
    const [NewUser, setNewUser] = useState({
        "username":'',
        "email":"",
        "password":""
    })
    const [message,setmessage]=useState('')
    const Get_user=async(e)=>{
        e.preventDefault()
        try{
            const response=await fetch ("http://127.0.0.1:5000/api/signin",{method:"POST", headers: {
          "Content-Type": "application/json"
        },
    body:JSON.stringify(NewUser)})
    if(!response.ok){
     throw new Error("False")
    }
    const data=await response.json()
    
    navigate('/home',{state:{Username:NewUser.username,Pass:NewUser.password,image:data.Prof}})

        }catch(e){
            console.log(e)
        }
    }
    const new_one=()=>{
        move("/signin")
    }
  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black  p-4">
      <div className='fixed top-[15%]'>
        <img src='Echo.PNG' className='w-[180px]'/>
      </div>
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">Sign In</h1>
          <p className="text-sm text-gray-400">Join the community and share your posts.</p>
        </div>
        <form className="space-y-4" onSubmit={Get_user}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. johndoe"
              value={NewUser.username}
              onChange={(e) => setNewUser({ ...NewUser, username: e.target.value })}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={NewUser.email}
              onChange={(e) => setNewUser({ ...NewUser, email: e.target.value })}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={NewUser.password}
              onChange={(e) => setNewUser({ ...NewUser, password: e.target.value })}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            Sign In
          </button>

         
        </form>
        <button onClick={new_one}>Create New user</button>
      </div>
    </div>
  )
}

export default SignIn