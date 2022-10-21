import React, { Component } from "react";
import './navbar.css';

// Media
import graphic from "../../media/logo.png";

const Navbar = () => {
    const logout = () => {
        fetch("/logout",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
          })       
        .then((response) => response.json())
        .then(() => {
          
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
                <a href = "/contact">Contact Us</a>
            </li>
            <li>
                <a href = "/faq">FAQs</a>
            </li>
            <li>
                <a href = "/profile">Account Info</a>
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
export default Navbar