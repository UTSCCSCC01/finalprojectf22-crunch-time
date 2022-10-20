import React, { Component, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  //const fetchMsgs() {
     
    
    const logout = () => {
      fetch("/logout",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        })       
      .then((response) => response.json())
      .then(() => {
        
        window.location.replace("/login")
        
          
      })  
      .catch((error) => {
        console.log(error)
  
  
      },[]);
    };
  return <div className="container mt-3 mb-3">
    <h1>Home Page</h1>
    <p>This is a test page.</p>
    <Link to="/example">Link to example route</Link><br/>
    <Link to="/search">Link to group search</Link><br/>
    <Link to="/Create_Group">Link to Create_Group</Link>
    <button onClick={() => logout()} type="login" class = "login-bttn">Logout</button>
  </div>;
}
