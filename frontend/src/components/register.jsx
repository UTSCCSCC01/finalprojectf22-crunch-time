import React, { Component } from "react";
import { Link } from "react-router-dom";
import {withRouter} from 'react-router-dom';

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
  
  fetchMsgs = () =>{
    const data = this.state;
    fetch("/register",{
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(data),
    })       
    .then((response) => response.json())
    .then((data) => {
      window.location.replace("/")
        alert('Success:', data);
    })  
    .catch((error) => {

        alert('Error:', error);
        window.location.reload()


    },[]);
  }


  render() {
    return (
        <div class = "content"> <center>
            <h1>Register</h1>
            <h5>Glad you’re joining DropIN! Please enter your information below.</h5><br/>
            <form action="http://localhost:3000/register" method = "POST" id="register-form">
            
              <label for="firstName">First Name</label> 
              <input type="text" id="firstName" name="firstName" class="loginLabel" onChange={evt => this.updateFirstName(evt)}></input>
              <br/>
              <br/>

              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" class="loginLabel" onChange={evt => this.updateLastName(evt)}></input>
              <br/>
              <br/>

              <label for="email">Email</label>
              <input type="text" id="email" name="email" class="loginLabel" onChange={evt => this.updateEmail(evt)}></input>
              <br/>
              <br/>
              
              <label for="password">Password</label>
              <input type="text" id="password" name="password" class="loginLabel" onChange={evt => this.updatePassword(evt)}></input>
              <br/>
              <br/>

              <label for="address">Address</label>
              <input type="text" id="address" name="address" class="loginLabel" onChange={evt => this.updateAddress(evt)}></input>
              <br/>
              <br/>

              <button type="register" class="login-bttn" onClick = {this.fetchMsgs}>Register</button>
              <h6>Already have an account? <Link to="/">Login</Link></h6>
            </form></center>
        </div>
      
    );
  }
}

export default Register;
