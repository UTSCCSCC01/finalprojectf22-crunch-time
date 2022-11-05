import React, { Component } from "react";
import { Link } from "react-router-dom";
import JoinGroupButton from "./joinGroupButton";

class JoinGroup extends Component {
  state = { user_id: 1, groups: [], users: [] };

  fetchInfo() {
    fetch("/join_group")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  }

  joinGroupCallback = () => {
    this.fetchInfo();
  };

  componentDidMount() {
    this.fetchInfo();
  }

  handleUserChange = (event) => {
    this.setState({ user_id: parseInt(event.target.value) });
  };

  render() {
    return (
      <div className="container mt-3 mb-3">
        <h1>Join Group</h1>
        <p>
          <Link to="/home">Return to home</Link>
        </p>
        <p>This is a temporary/test page.</p>
        {/*
        <label htmlFor="user-select">Act as user:</label>
        <select name="user-select" id="user-select" onChange={this.handleUserChange}>
          {this.state.users.map((user) => (
            <option value={user.user_id} key={user.user_id}>
              {user.email}
            </option>
          ))}
          </select>*/}
        <h2>List of groups:</h2>
        <ul>
          {this.state.groups.map((group) => (
            <li key={group.group_id}>
              {group.group_name}
              <JoinGroupButton groupID={group.group_id} callback={this.joinGroupCallback} />
              <ul>
                {group.users.map((user) => (
                  <li key={user.user_id}>
                    {user.email}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default JoinGroup;
