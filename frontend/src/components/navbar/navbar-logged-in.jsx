import React, { Component } from "react";
import './navbar.css';

// Media
import graphic from "../../media/logo.png";

const Navbar = () => {
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
                <a href = "/account_info_authentification">Account Info</a>
            </li>
            <li>
                <a href = "/search">Search</a>
            </li>
            <li>
                <a href = "/logout">Logout</a>
            </li>
        </ul>
    </nav>)
}
export default Navbar
