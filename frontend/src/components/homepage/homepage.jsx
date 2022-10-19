import React from "react";
import { Link } from "react-router-dom";
import './homepage.css';

// Background colour
document.body.style = 'background: #F1F3FE;';

export default function Homepage() {
  return <div className = "content">
    <h1><b>Find other <span style = {{color: '#0C3ADE'}}>players</span>.<br/>Whenever, wherever.</b></h1>
    <p>This is a test page.</p>
    <Link to="/example">Link to example route</Link><br/>
    <Link to="/search">Link to group search</Link><br/>
    <Link to="/Create_Group">Link to Create_Group</Link>
  </div>;
}