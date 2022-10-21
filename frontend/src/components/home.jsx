import React, { Component, useEffect } from "react";
import Navbar from './navbar/navbar-logged-in.jsx';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'
export default function Home() {
  
 
 

  return (
  <div className = "root">
    <Navbar/>

    <div className="container mt-3 mb-3">
      
      <h1>Welcome {"aa"}</h1>
      <Link to="/example">Link to example route</Link><br/>
      <Link to="/search">Link to group search</Link><br/>
      <Link to="/Create_Group">Link to Create_Group</Link><br/>
      <Link to="/join_group">Join a group</Link><br/>
      <Link to="/account_information">Link to Account_information</Link>
    </div>;
  </div>
  )
}
