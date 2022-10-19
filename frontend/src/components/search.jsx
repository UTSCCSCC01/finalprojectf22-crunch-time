import React, { Component } from "react";
import { Link } from "react-router-dom";

class Search extends Component {
  //state = { message: "d", messages: [], lat: 0.0, long: 0.0, dist: 0.0 };
  constructor(props) {
    super(props);
    this.state = {
      message: "", messages: [], lat: 0.0, long: 0.0, dist: 0.0 
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

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
    formData.set("lat", this.state.lat);
    formData.set("long", this.state.long);
    formData.set("dist", this.state.dist);
    console.log(this.state.message, this.state.lat, this.state.long, this.state.dist);
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

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
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
              className="form-control"
              name="message"
              value={this.state.message}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="lat">Latitude:</label>
            <input
              type="number"
              className="form-control"
              name="lat"
              value={this.state.lat}
              defaultValue={0}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="long">Longitude:</label>
            <input
              type="number"
              className="form-control"
              name="long"
              //value={this.state.long}
              //defaultValue={0}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="dist">Maximum distance (Km):</label>
            <input
              type="number"
              className="form-control"
              name="dist"
              value={this.state.dist}
              //defaultValue={0}
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
    );
  }
}

export default Search;
