import Navbar from './components/navbar'
import Home from './Pages/Home';
import About from './Pages/About';
import Login from './Pages/Login';
import Calendar from './Pages/Calendar';
import Profile from './Pages/Profile'
import Record from './Pages/Record';
import ErrorPage from './Pages/ErrorPage';
import RegisterPage from './Pages/RegisterPage';
import Logout from './components/logout';
import {HashRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

export default function App() {
  
  const [loginState, setLoginState] = React.useState(null);
  const getLoginState = (value) =>{
    setLoginState(value);
  }

  return (
    <Router>
      <Navbar loginState={loginState}/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/About" element={<About/>}/>
        <Route path="/Login" element={<Login getLoginState={getLoginState} />}/>
        <Route path="/Register" element={<RegisterPage/>}/>
        <Route path="/Logout" element={<Logout getLoginState={getLoginState}/>}/>
        <Route path="/Calendar" element={<Calendar/>}/>
        <Route path="/Record" element={<Record/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </Router>
  );
}