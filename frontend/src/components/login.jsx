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
            <form action="http://localhost:3000/login" method = "POST" id="login-form">
                <label for="email">Email</label>
                <input type="text" id="email" name="email" class="loginLabel"/>
                <br/>
                        
                <label for="Password">Password</label>
                <input type="text" id="password" name="password" class="loginLabel"/>
                <br/>

                <button type="login" class = "login-bttn"><Link to="/home">Login</Link></button>
                <h5>Don't have an account yet? <Link to="/register">Register</Link></h5>
            </form></center>
        </div>
    );
  }
}

export default Login;
