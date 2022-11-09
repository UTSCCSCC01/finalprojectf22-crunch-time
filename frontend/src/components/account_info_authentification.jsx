import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import Navbar from './navbar/navbar-logged-in.jsx';

class Account_info_authentification extends Component {

    state = {
        Password: '',
      };
    
      updatePassword(evt) {
        const val = evt.target.value;
        this.setState({
          Password: val
        });
      }

      fetchMsgs = (e) =>{
        e.preventDefault();
        const data = this.state;
        console.log('state: ', data);
        fetch("/account_info_authentification",{
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(data),
        })       
        .then((response) => response.json())
        .then((data) => {
            if (data['password']){
                window.location.replace("/account_information");
            }
            else {
              throw new Error()
            }
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
            <h5>Please enter your password</h5><br/>
            <form>

              <label for="password">Password</label>
              <input type="text" id="password" name="password" class="loginLabel" onChange={evt => this.updatePassword(evt)}></input>
              <br/>
              <br/>

              <button type="submit" class="login-bttn" onClick = {this.fetchMsgs}>submit</button>

            </form>
        </div>
        </div>
      );
    }
  }
  
  export default Account_info_authentification;
  