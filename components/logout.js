import React from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function logout(props){



  axios.get('https://api.60seconds.io/api/logout');

  localStorage.clear();

  props.getLoginState(localStorage.getItem('username'));

  return(
      <p>User successfully logged out!{setTimeout(function(){
        window.location.href = '/';
     }, 3000)}</p>
  )
  
}
