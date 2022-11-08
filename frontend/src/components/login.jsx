import React, { Component, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';

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
      ReactSession.set("messages", [])
      ReactSession.set("Group_Members",[])
      ReactSession.set("groupInfo",{})

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
        <div class = "content"><center>
            <h1>Welcome back!</h1>
            <form id="login-form">
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
