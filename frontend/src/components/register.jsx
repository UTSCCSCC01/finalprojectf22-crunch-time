import React, { Component } from "react";
import { Link } from "react-router-dom";
import {withRouter} from 'react-router-dom';
import './login.css';

// Media
import graphic from "../media/logo.png";

class Register extends Component {
 
  state = {
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    Address: ''
  };

  updateFirstName(evt) {
    const val = evt.target.value;
    this.setState({
      FirstName: val
    });
  }

  updateLastName(evt) {
    const val = evt.target.value;
    this.setState({
      LastName: val
    });
  }

  updateEmail(evt) {
    const val = evt.target.value;
    this.setState({
      Email: val
    });
  }

  updatePassword(evt) {
    const val = evt.target.value;
    this.setState({
      Password: val
    });
  }

  updateAddress(evt) {
    const val = evt.target.value;
    this.setState({
      Address: val
    });
  }

  // componentDidMount() {
  //   const reloadCount = sessionStorage.getItem('reloadCount');
  //   if(reloadCount < 2) {
  //     sessionStorage.setItem('reloadCount', String(reloadCount + 1));
  //     window.location.reload();
  //   } else {
  //     sessionStorage.removeItem('reloadCount');
  //   }
  // }
  
  fetchMsgs = (e) =>{
    e.preventDefault();
    const data = this.state;
    console.log('state: ', data);
    fetch("/register",{
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(data),
    })       
    .then((response) => response.json())
    .then((data) => {
      window.location.replace("/");
        alert('Success:', data);
    })  
    .catch((error) => {

        alert('Error:', error);
        window.location.reload()


    },[]);
  }


 // <form action="http://localhost:3000/register" method = "POST" id="register-form">

  render() {
    return (
        <div class = "login-content"> <center>
          <div class = "nav-logo">
            <a href = "/home">
              <img class = "graphic" alt = "logo" src = {graphic}/>
            </a>
          </div>
            <h1>Register</h1>
            <h5>Glad you’re joining DropIN! Please enter your information below.</h5>
            <br/>
            <form id="register-form">
            
              <label for="firstName">First Name</label> 
              <br/>
              <input type="text" id="firstName" name="firstName" class="loginLabel" onChange={evt => this.updateFirstName(evt)}></input>
              <br/>
              <br/>

              <label for="lastName">Last Name</label>
              <br/>
              <input type="text" id="lastName" name="lastName" class="loginLabel" onChange={evt => this.updateLastName(evt)}></input>
              <br/>
              <br/>

              <label for="email">Email</label>
              <br/>
              <input type="text" id="email" name="email" class="loginLabel" onChange={evt => this.updateEmail(evt)}></input>
              <br/>
              <br/>
              
              <label for="password">Password</label>
              <br/>
              <input type="text" id="password" name="password" class="loginLabel" onChange={evt => this.updatePassword(evt)}></input>
              <br/>
              <br/>

              <label for="address">Address</label>
              <br/>
              <input type="text" id="address" name="address" class="loginLabel" onChange={evt => this.updateAddress(evt)}></input>
              <br/>

              <button type="register" class="login-bttn" onClick = {this.fetchMsgs}>Register</button>
              <h6>Already have an account? <Link to="/login">Login</Link></h6>

            </form></center>
        </div>
    );
  }
}

export default Register;
