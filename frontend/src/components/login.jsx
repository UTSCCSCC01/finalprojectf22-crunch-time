import React, { Component, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import './login.css';

// Media
import graphic from "../media/logo.png";

class Login extends Component {
 state = {
    Email: '',
    Password: ''
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
  //Checks if user is already loggined in
  async  componentDidMount(){
    try{
    if(ReactSession.get("firstName")== undefined){
    }
    else{
      window.location.replace("/home")
    }
  }
  catch(e){
    window.location.replace("/")
  }

 }
  // For loggin in
  fetchMsgs = (e) =>{
    e.preventDefault();
    const data = this.state;
    fetch("/login",{
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })       
    .then((response) => response.json())
    .then((data) => {
      ReactSession.set("firstName", data['firstName']);
      ReactSession.set("lastName", data['lastName']);
      ReactSession.set("email", data['email']);
      ReactSession.set("password", data['password']);
      ReactSession.set("address", data['address']);
      ReactSession.set("user_id", data['user_id']);
      //console.log(getGroup())
      //ReactSession.set("messages", [])
      ReactSession.set("Group_Members",[])
      //ReactSession.set("groupInfo",{})

      window.location.replace("/home");
      
    })  
    .catch((error) => {
      console.log(error);
        alert('Error:', error);
        window.location.reload()


    },[]);
  }




  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };
  
  render() {

    return (
        <div class = "login-content"><center>
          <div class = "nav-logo">
            <a href = "/home">
              <img class = "graphic" alt = "logo" src = {graphic}/>
            </a>
          </div>
          <br/>
          <form id="login-form" class = "login-form">
            <h1>Welcome back!</h1>
            <br/>
            <label for="email">Email</label>
            <br/>
            <input type="text" id="email" name="email" class="loginLabel" onChange={evt => this.updateEmail(evt)}/>
            <br/><br/>
                        
            <label for="Password">Password</label>
            <br/>
            <input type="password" id="password" name="password" class="loginLabel" onChange={evt => this.updatePassword(evt)}/>
            <br/>

            <button onClick = {this.fetchMsgs} type= "login" class = "login-bttn">Login</button>
            <h6>Don't have an account yet? <Link to="/register">Sign up.</Link></h6>
          </form></center>
        </div>
    );
  }
}

export default Login;
