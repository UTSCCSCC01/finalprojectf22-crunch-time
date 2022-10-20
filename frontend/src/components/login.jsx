import React, { Component, useEffect } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.reset();
  }
  
  reset() {
    // Always set the initial state in its own function, so that
    // you can trivially reset your components at any point.
    this.state = {
      Email: '',
      Password: ''
    };
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
  // For verifying login authentication
  fetchMsgs = () =>{
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
        //console.log('Success:', data);
       
    })
    .catch((error) => {
        console.error('Error:', error);
    },[]);
  }

  sendMsg = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("message", this.state.message);
    fetch("/", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  };


  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };
  
  render() {

    return (
        <div class = "content"><center>
            <h1>Welcome back!</h1>
            <form action="http://localhost:3000/login" method = "POST" id="login-form">
                <label for="email">Email</label>
                <input type="text" id="email" name="email" class="loginLabel" onChange={evt => this.updateEmail(evt)}/>
                <br/>
                        
                <label for="Password">Password</label>
                <input type="text" id="password" name="password" class="loginLabel" onChange={evt => this.updatePassword(evt)}/>
                <br/>

                <button onClick = {this.fetchMsgs} type="login" class = "login-bttn">Login</button>
                <h5>Don't have an account yet? <Link to="/register">Register</Link></h5>
            </form></center>
        </div>
    );
  }
}

export default Login;
