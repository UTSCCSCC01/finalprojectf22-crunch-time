import React, { Component } from "react";
import { Link } from "react-router-dom";

class Example extends Component {
  state = { message: "", messages: [] };

  fetchMsgs() {
    console.log('fetch');
    fetch("/example")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  }

  sendMsg = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("message", this.state.message);
    fetch("/example", {
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
      <div className="container mt-3 mb-3">
        <h1>Example page</h1>
        <p>
          <Link to="/">Return to home</Link>
        </p>
        <form onSubmit={this.sendMsg} className="mb-3">
          <div className="form-group mb-3">
            <label htmlFor="msg">Message:</label>
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
            Send
          </button>
        </form>
        <h2>List of messages so far:</h2>
        <ul className="list-group">
          {this.state.messages.map((msg) => (
            <li className="list-group-item" key={msg.id}>
              {"id " + msg.id + ": " + msg.contents}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Example;
