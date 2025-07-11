import React, { useState } from 'react'
import Sidebar from './assets/Sidebar.jsx'
import Home from './assets/Home.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Browser from './Browserb.jsx';
import ProfilePage from './assets/ProfilePage.jsx';


import SignIn from './assets/SignIn.jsx';
import SignUpPage from './assets/Signup.jsx';

const App = () => {
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/home' element={<Browser/>}/>
      <Route  path='/profile' element={<ProfilePage/>}/>
      <Route path='/signin' element={<SignUpPage/>}/>
      <Route path="/" element={<SignIn/>}/>
      </Routes></BrowserRouter>
    
  )
}

export default App