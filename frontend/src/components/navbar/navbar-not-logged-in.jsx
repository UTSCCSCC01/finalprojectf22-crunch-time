import React, { Component } from "react";
import './navbar.css';

const Navbar = () => {
    return (<nav className = "nav">
        <a href = "/home" className = "site-name"> DropIN</a>

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
                <a href = "/">Login</a>
            </li>
        </ul>
    </nav>)
}
export default Navbar