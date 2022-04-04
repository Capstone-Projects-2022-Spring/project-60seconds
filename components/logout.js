import React from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function logout(){


  axios.get('https://api.60seconds.io/api/logout');

  return(
      <p>User successfully logged out!</p>
  )
}
