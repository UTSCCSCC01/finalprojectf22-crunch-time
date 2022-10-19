import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from './navbar/navbar-logged-in.jsx';

class Search extends Component {
  state = { message: "", messages: [] };

  fetchMsgs() {
    console.log('fetch');
    fetch("/search")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  }

  sendMsg = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("message", this.state.message);
    fetch("/search", {
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
      <div className = "root">
        <Navbar/>
        <div className="container mt-3 mb-3">
          <h1>Search page</h1>
          <p>
            <Link to="/">Return to home</Link>
          </p>
          <form onSubmit={this.sendMsg} className="mb-3">
            <div className="form-group mb-3">
              <label htmlFor="msg">Group:</label>
              <input
                type="text"
                id="msg"
                className="form-control"
                name="message"
                value={this.state.message}
                onChange={this.handleChange}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Find
            </button>
          </form>
          <h2>List of found groups:</h2>
          <ul className="list-group">
            {this.state.messages.map((msg) => (
              <li className="list-group-item" key={msg.group_id}>
                {msg.group_name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Search;
