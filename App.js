import Navbar from './components/navbar'
import Home from './Pages/Home';
import About from './Pages/About';
import Login from './Pages/Login';
import Calendar from './Pages/Calendar';
import Profile from './Pages/Profile'
import Record from './Pages/Record';
import ErrorPage from './Pages/ErrorPage';
import Register from './components/register';
import Logout from './components/logout';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

export default function App() {
  
  const [isLoggedIn, setIsLoggedIn] = React.useState("false");
  const changeLoginToTrue = () => {
    setIsLoggedIn('true');
  }

  const changeLoginToFalse  = () => {
    setIsLoggedIn('false');
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} changeLoginToFalse={changeLoginToFalse}/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/About" element={<About/>}/>
        <Route path="/Login" element={<Login changeLoginToTrue={changeLoginToTrue} changeLoginToFalse={changeLoginToFalse}/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path="/Logout" element={<Logout/>}/>
        <Route path="/Calendar" element={<Calendar/>}/>
        <Route path="/Record" element={<Record/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </Router>
  );
}