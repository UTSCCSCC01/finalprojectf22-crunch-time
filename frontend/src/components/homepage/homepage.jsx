import React from "react";
import { Link } from "react-router-dom";
import './homepage.css';
import Navbar from '../navbar/navbar-not-logged-in.jsx';

// Media
import graphic from "../../media/magnifier.png";

// Background colour
document.body.style = 'background: #F1F3FE;';

export default function Homepage() {
  return <div className = "home-content">
    <Navbar/>
    <div className = "home-intro">
      <div className = "home-intro-text">
        <h1><b>Find other <span style = {{color: '#0C3ADE'}}>players</span>.<br/>Whenever, wherever.</b></h1>
        <br/>
        <h2>Let us know where you are and what you’re <br/>interested in. We’ll take care of the rest.</h2>
        <br/>
        <button type="search" class = "home-bttn"><Link to="/register">Start your search</Link></button>
      </div>
      <img src = {graphic} className = "magnifier" alt = "magnifier graphic"/>
    </div>
    <div className = "home-description">
      <h4>
        <span style = {{color: '#0C3ADE'}}>DropIN</span> is a platform for like-minded individuals to find each other and organize activities.
        Users can search and join groups based on interests and location proximity, 
        after which they can chat with others in the group to organize activities together such as sports or board games.
      </h4>
      <div className = "container">
        <h3>How It Works</h3>
        <br/>
        <p>In just a few easy steps you can get started with DropIN. </p>
        <div className = "box">
          <h2><span style = {{color: '#FFC773'}}>1. Make your profile</span><br/><br/> Let others know your interests and skill level.</h2>
        </div>
        <div className = "box">
          <h2><span style = {{color: '#FFC773'}}>2. Join or create groups</span><br/><br/> Find others who share your hobbies.</h2>
        </div>
        <div className = "box">
          <h2><span style = {{color: '#FFC773'}}>3. Set a time and date</span><br/><br/> Coordinate with your group and have fun!</h2>
        </div>
      </div>
    </div>
    <div className = "home-contact">
      <h2>Interested in getting started? Create an account today.</h2>
      <br/>
      <button type="register" class = "home-bttn"><Link to="/register">Get started</Link></button>
    </div>
  </div>;
}