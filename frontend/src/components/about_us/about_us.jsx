import React from "react";
import { Link } from "react-router-dom";
import './about_us.css';
import Navbar from '../navbar/navbar-not-logged-in.jsx';

// Media
import graphic from "../../media/magnifier.png";
import shaahid from "../../media/Shaahid.png";
import sharon from "../../media/Sharon.png";
import justin from "../../media/Justin.png";
import denis from "../../media/Denis.png";
import jesse from "../../media/Jesse.png";
import iangola from "../../media/Iangola.png";

// Background colour
document.body.style = 'background: #F1F3FE;';



export default function About_Us() {
    return <div className = "about-content">
      <Navbar/>
      <div className = "about-title">
        <h1>About Us</h1>
      </div>
      <br></br>
      <div className="about-paragraph"> 
        <span style = {{color: '#0C3ADE'}}>DropIN</span> is a platform that aims to bring like-minded individuals together to organize and participate 
        in activites of their choosing. Through the use of an advanced search feature, users can join groups based on their
        hobbies and even location. Can't find a group for you? Users can create their own groups for activities of their choosing 
        and set the skill level of the group to ensure they are interacting with those on a similar level.
        <h4>Sounds fun? It sure is! <span style = {{color: '#0C3ADE'}}>DropIN</span> today!</h4>
      </div>
      <br></br>
      <br></br>
      <div className="team-header">
        <h4>Our Team</h4>
      </div>
      <div class="row">
        <div class="column">
            <div class="card">
            <img class = "logo" src = {denis} ></img>
            <div class="container">
                <h2>Denis D.</h2>
                <p class="title">Developer</p>
                <p>4th Year Computer Science Major</p>
                <p><a href="https://www.linkedin.com/in/denis-dekhtyarenko-522a90210/?originalSubdomain=ca"><button class = "button">Contact</button></a></p>
            </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
            <img class = "logo" src = {iangola}></img>
            <div class="container">
                <h2>Iangola A.</h2>
                <p class="title">Developer</p>
                <p>4th Year Neuroscience Specialist & Computer Science Minor.</p>   
                <p><a href="https://github.com/IangolaAndri"><button class = "button">Contact</button></a></p>
            </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
            <img class = "logo" src = {jesse}></img>
            <div class="container">
                <h2>Jesse Y.</h2>
                <p class="title">Developer</p>
                <p>4th Year Computer Science Major</p>
                <p><a href="https://github.com/jesseyao89"><button class = "button">Contact</button></a></p>
            </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="column">
            <div class="card">
            <img class = "logo" src = {justin}></img>
            <div class="container">
                <h2>Justin D.</h2>
                <p class="title">Developer</p>
                <p>4th Year Double Major Computer Science & Stats</p>
                <p><a href="https://www.linkedin.com/in/justin-ding-b332091b1/?originalSubdomain=ca"><button class = "button">Contact</button></a></p>
            </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
            <img class = "logo" src = {shaahid}></img>
            <div class="container">
                <h2>Shaahid K.</h2>
                <p class="title">Developer</p>
                <p>4th Year Management & IT Specialist + Applied Stats Minor</p>
                <p><a href="https://ca.linkedin.com/in/shaahid-khan-a32ab9198?trk=public_profile_browsemap_profile-result-card_result-card_full-click&original_referer=https%3A%2F%2Fwww.google.com%2F"><button class = "button">Contact</button></a></p>
            </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
            <img class = "logo" src = {sharon}></img>
            <div class="container">
                <h2>Sharon X.</h2>
                <p class="title">Developer</p>
                <p>4th Year Management & IT Specialist + Applied Stats Minor</p>
                <p><a href="https://www.linkedin.com/in/sharxiao/?originalSubdomain=ca"><button class = "button">Contact</button></a></p>
            </div>
            </div>
        </div>
    </div>
</div>;
  }