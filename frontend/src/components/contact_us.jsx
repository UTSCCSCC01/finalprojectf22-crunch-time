import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import Navbar from './navbar/navbar-logged-in.jsx';

class Contact_us extends Component {

    state = {
        FirstName: '',
        LastName: '',
        Email: '',
        Message: '',
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
    
      updateMessage(evt) {
        const val = evt.target.value;
        this.setState({
          Message: val
        });
      }
    
      fetchMsgs = (e) =>{
        e.preventDefault();
        const data = this.state;
        console.log('state: ', data);
        fetch("/contact_us",{
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(data),
        })       
        .then((response) => response.json())
        .then((data) => {

            alert('Success:', data);
            window.location.reload()
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
        <div 
        class = "content"><center>
            <h1>Contact us</h1>
            <h5>Have any questions or issues? Reach out to our team!</h5><br/>
            <form>
            
              <label for="firstName">First Name</label> 
              <br/>
              <input type="text" id="firstName" name="firstName" class="e-input" onChange={evt => this.updateFirstName(evt)}></input>
              <br/>
              <br/>

              <label for="lastName">Last Name</label>
              <br/>
              <input type="text" id="lastName" name="lastName" class="e-input" onChange={evt => this.updateLastName(evt)}></input>
              <br/>
              <br/>

              <label for="email">Email</label>
              <br/>
              <input type="text" id="email" name="email" class="e-input" onChange={evt => this.updateEmail(evt)}></input>
              <br/>
              <br/>
              
              <label for="message">Your message</label>
              <br/>
              <input type="text" id="message" name="message" class="e-input" style={{width: 200, height: 100}} onChange={evt => this.updateMessage(evt)}></input>
              <br/>
              <br/>

              <button type="submit" class="login-bttn" style = {{backgroundColor: '#0C3ADE', padding: 5, borderRadius: 10, color: 'white'}} onClick = {this.fetchMsgs}>SEND MESSAGE</button>

            </form></center>
        </div>
        </div>
      );
    }
  }
  
  export default Contact_us;