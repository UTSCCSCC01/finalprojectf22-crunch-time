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
            
            <label for="First Name">First Name</label> 
            <input type="text" id="First Name" name="First Name" class="loginLabel"></input>
            <br/>
            <br/>

            <label for="Last Name">Last Name</label>
            <input type="text" id="Last Name" name="Last Name" class="loginLabel"></input>
            <br/>
            <br/>

            <label for="Email">Email</label>
            <input type="text" id="Email" name="Email" class="loginLabel"></input>
            <br/>
            <br/>
            
            <label for="Password">Password</label>
            <input type="text" id="password" name="Password" class="loginLabel"></input>
            <br/>
            <br/>

            <label for="Address">Address</label>
            <input type="text" id="Address" name="Address" class="loginLabel"></input>
            <br/>
            <br/>

            <button type="register" class="login-bttn">Register</button>
            <h6>Already have an account? <Link to="/">Login</Link></h6>
            </center>
        </div>
      
    );
  }
}

export default Register;
