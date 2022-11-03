import React, { Component } from "react";
import './navbar.css';

// Media
import graphic from "../../media/logo.png";

const Navbar = () => {
    return (<nav className = "nav">
        <a href = "/">
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
                <a href = "/login">Login</a>
            </li>
            <li>
                <a href = "/register">Register</a>
            </li>
        </ul>
    </nav>)
}
export default Navbar
