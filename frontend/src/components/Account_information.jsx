import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import Navbar from './navbar/navbar-logged-in.jsx';

class Account_information extends Component {
    state = { message: "", messages: [] };
  
    updatePassword(evt) {
      const val = evt.target.value;
      this.setState({
        Password: val
      });
    }

    fetchMsgs() {
      console.log('fetch');
      fetch("/account_information")
        .then((res) => res.json())
        .then((data) => {
          this.setState({ ...data });
        });
    }
  
    sendMsg = (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.set("message", this.state.message);
      fetch("/account_information", {
        method: "GET",
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
        <div className = "root">
        <Navbar/>
        <div className="container mt-3 mb-3">
          <h1>Account information</h1>
          <p>
            <Link to="/home">Return to home</Link>
          </p>
          <h2>Fist Name</h2>
          <li> {ReactSession.get("firstName")}</li>
          <ul className="list-group">
          </ul>
          <h2>Last Name</h2>
          <li> {ReactSession.get("lastName")}</li>
          <ul className="list-group">
          </ul>
          <h2>Email</h2>
          <li>{ReactSession.get("email")}</li>
          <ul className="list-group">
          </ul>
          <h2>Address</h2>
          <li>{ReactSession.get("address")}</li>
          <ul className="list-group">
          </ul>
          <h2>Groups</h2>
            {this.state.messages.map((msg) => (
              <li>{msg.groups}</li>
            ))}
            <ul className="list-group"></ul>
          <Link to="/edit_info" className="btn btn-primary">Edit account</Link>
        </div>
        </div>
      );
    }
  }
  
  export default Account_information;
  