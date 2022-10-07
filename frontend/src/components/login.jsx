import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  state = { message: "", messages: [] };

  fetchMsgs() {
    console.log('fetch');
    fetch("/")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
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

  componentDidMount() {
    this.fetchMsgs();
  }

  handleChange = (event) => {
    this.setState({ message: event.target.value });
  };

  render() {
    return (
        <div class = "content"><center>
            <h1>Welcome back!</h1>
            <form action="http://127.0.0.1:5000/login" method = "post" id="login-form">
                <label for="username">Username</label>
                <input type="text" id="Utorid" name="Utorid" class="loginLabel"></input>
                <br/>
                        
                <label for="Password">Password</label>
                <input type="text" id="password" name="Password" class="loginLabel"></input>
                <br/>

                <button type="login" class = "login-bttn">Login</button>
                <h5>Don't have an account yet? <Link to="/register">Register</Link></h5>
            </form></center>
        </div>
    );
  }
}

export default Login;
