import React, { Component } from "react";
import { Link } from "react-router-dom";

class Account_information extends Component {
    state = { message: "", messages: [] };
  
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
        <div className="container mt-3 mb-3">
          <h1>Account information</h1>
          <p>
            <Link to="/home">Return to home</Link>
          </p>
          <h2>Fist Name</h2>
          <ul className="list-group">
            {this.state.messages.map((msg) => (
              <li className="list-group-item" key={msg.firstName}>
                {msg.firstName }
              </li>
            ))}
          </ul>
          <h2>Last Name</h2>
          <ul className="list-group">
            {this.state.messages.map((msg) => (
              <li className="list-group-item" key={msg.lastName}>
                {msg.lastName }
              </li>
            ))}
          </ul>
          <h2>Email</h2>
          <ul className="list-group">
            {this.state.messages.map((msg) => (
              <li className="list-group-item" key={msg.email}>
                {msg.email }
              </li>
            ))}
          </ul>
          <h2>Address</h2>
          <ul className="list-group">
            {this.state.messages.map((msg) => (
              <li className="list-group-item" key={msg.address}>
                {msg.address }
              </li>
            ))}
          </ul>
          <h2>Groups</h2>
          <ul className="list-group">
            {this.state.messages.map((msg) => (
              <li className="list-group-item" key={msg.groups}>
                {msg.groups}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
  
  export default Account_information;
  