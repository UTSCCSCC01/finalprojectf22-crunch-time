import React, { Component, useEffect } from "react";
import Navbar from './navbar/navbar-logged-in.jsx';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import { ReactSession } from 'react-client-session';
import './home.css';

export default function Home() {
  useEffect(() => {
    try{
      console.log(ReactSession.get("firstName") + " " + ReactSession.get("lastName"))
    if(ReactSession.get("firstName")== undefined){
      window.location.replace("/")
    }
  }
  catch(e){
    window.location.replace("/")
  }


  }, []);

  return (
    <div className = "logged-in-content">
      <div className = "root">
        <Navbar/>

        <div className="container mt-3 mb-3">
          
          <div className = "logged-in-intro">
            <h1><b>Welcome, {ReactSession.get("firstName")}!</b></h1>
          </div>
          <div className = "home-container">
            <div className = "profile-box">
              <h2>Profile</h2>
              <br/>
              <button type = "view" class = "profile-view-bttn"><Link to={"/profile/"+ReactSession.get("user_id")}>View</Link></button>
            </div>
            <div className = "friend-box">
              <h2>Friend list</h2>
              <br/>
              <button type = "view" class = "friend-view-bttn"><Link to={"/friend_list/"+ReactSession.get("user_id")}>View</Link></button>
            </div>
          </div>
          <div className = "home-container">
            <h3>Quick access</h3>
            <div className = "redirect-box">
              <h2>Create group</h2>
              <br/>
              <button type = "view" class = "view-bttn"><Link to="/Create_Group">View</Link></button>
            </div>
            <div className = "redirect-box">
              <h2>Search for group</h2>
              <br/>
              <button type = "view" class = "view-bttn"><Link to="/search">View</Link></button>
            </div>
            <div className = "redirect-box">
              <h2>Search for user</h2>
              <br/>
              <button type = "view" class = "view-bttn"><Link to="/faq">View</Link></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
