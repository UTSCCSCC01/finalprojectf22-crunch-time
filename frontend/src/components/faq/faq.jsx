import React from "react";
import { Link } from "react-router-dom";
import './faq.css';
import Navbar from '../navbar/navbar-not-logged-in.jsx';

// Background colour
document.body.style = 'background: #F1F3FE;';

export default function FAQ() {
  return <div className = "faq-content">
    <Navbar/>
    <div className = "faq-intro">
      <h1>Frequently Asked Questions</h1>
    </div>
    <div className = "container">
      <div className = "faq-box">
        <h3>Question: Where will the activities take place?</h3>
        <p>
          The location for the activities will be mentioned in the group details and should be confirmed by members of the group.
          Some activities will take place online while others will be in-person.
        </p>
      </div>
      <div className = "faq-box">
        <h3>Question: What if there aren't any existing groups that match my interests?</h3>
        <p>
          Create a group! We encourage our users to start a new group if none of the existing ones match your needs
          so that they can find others who share their hobbies. You can create a new group from our 'Search' page in the top right corner.
        </p>
      </div>
      <div className = "faq-box">
        <h3>Question: How can other users join my group?</h3>
        <p>
          Users can either search the group and click 'Join' from their search results, or they can be invited by their friends to join a group.
          The owner of a group will have the ability to kick out certain users if they exhibit inappropriate behaviour.
        </p>
      </div>
    </div>
    <div className = "faq-contact">
      <h2>Interested in getting started? Create an account today.</h2>
      <br/>
      <button type="register" class = "home-bttn"><Link to="/register">Get started</Link></button>
    </div>
  </div>;
}