import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import Navbar from './navbar/navbar-logged-in.jsx';

class Edit_info extends Component {

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

      fetchMsgs = (e) =>{
        e.preventDefault();
        const data = this.state;
        console.log('state: ', data);
        fetch("/edit_info",{
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
            window.location.replace("/account_information");
            alert('Success:', data);
        })  
        .catch((error) => {
    
            alert('Error:', error);
            window.location.reload()
    
    
        },[]);
      }
  
    render() {
      return (
        <div className = "root">
        <Navbar/>
        <div class = "content">
            <h1>Edit account</h1>
            <h5>Please enter the fields you wish to modify</h5><br/>
            <form>
            
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

              <button type="submit" class="login-bttn" onClick = {this.fetchMsgs}>submit</button>

            </form>
        </div>
        </div>
      );
    }
  }
  
  export default Edit_info;
  