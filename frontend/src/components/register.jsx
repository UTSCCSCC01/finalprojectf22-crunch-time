import React, { Component } from "react";
import { Link } from "react-router-dom";

class Register extends Component {
  state = { message: "", messages: [] };

  fetchMsgs() {
    console.log('fetch');
    fetch("/register")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  }

  sendMsg = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("message", this.state.message);
    fetch("/register", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  };

  componentDidMount() {
    this.fetchMsgs();
  }

  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };

  render() {
    return (
        <div class = "content"> <center>
            <h1>Register</h1>
            <h5>Glad you’re joining DropIN! Please enter your information below.</h5><br/>
            <form action="http://localhost:3000/register" method = "POST" id="register-form">
            
              <label for="firstName">First Name</label> 
              <input type="text" id="firstName" name="firstName" class="loginLabel"></input>
              <br/>
              <br/>

              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" class="loginLabel"></input>
              <br/>
              <br/>

              <label for="email">Email</label>
              <input type="text" id="email" name="email" class="loginLabel"></input>
              <br/>
              <br/>
              
              <label for="password">Password</label>
              <input type="text" id="password" name="password" class="loginLabel"></input>
              <br/>
              <br/>

              <label for="address">Address</label>
              <input type="text" id="address" name="address" class="loginLabel"></input>
              <br/>
              <br/>

              <button type="register" class="login-bttn"><Link to="/home">Register</Link></button>
              <h6>Already have an account? <Link to="/">Login</Link></h6>
            </form></center>
        </div>
      
    );
  }
}

export default Register;
