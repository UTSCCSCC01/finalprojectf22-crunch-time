import React, { Component } from "react";
import './navbar.css';
import { ReactSession } from 'react-client-session';

// Media
import graphic from "../../media/logo.png";

const Navbar_Login = () => {
    const logout = () => {
        fetch("/logout",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },            
          body: JSON.stringify({'username': ReactSession.get("firstName") + " " + ReactSession.get("lastName")}),

          })       
        .then((response) => response.json())
        .then(() => {
            ReactSession.remove("firstName");
            ReactSession.remove("lastName" );
            ReactSession.remove("email");
            ReactSession.remove("password");
            ReactSession.remove("messages")
            ReactSession.remove("Group_Members")
            ReactSession.remove("GroupName")
            window.location.replace("/")
            
        })  
        .catch((error) => {
          console.log(error)
    
    
    
    
        },[]);
      };
    return (<nav className = "nav">
        <a href = "/home">
            <img alt = "logo" src = {graphic}></img>
        </a>

        <ul>
            <li>
                <a href = "/about">About Us</a>
            </li>
            <li>
                <a href = "/contact_us">Contact Us</a>
            </li>
            <li>
                <a href = "/faq">FAQs</a>
            </li>
            <li>
                <a href = "/Account_information">Account Info</a>

            </li>
            <li>
                <a href = "/search">Search</a>
            </li>
            <li>
                <a href  onClick={() => logout()}>Logout</a>
            </li>
        </ul>
    </nav>)
}
export default Navbar_Login

