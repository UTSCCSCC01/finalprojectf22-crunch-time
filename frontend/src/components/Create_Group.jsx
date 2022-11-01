import React, {Component, useState, useEffect, useInsertionEffect,} from 'react';
import { Link } from "react-router-dom";
//import Chat from './Chat';
import Navbar from './navbar/navbar-logged-in.jsx';

class Create_Group extends Component {
  state = {skillLevel: 0, group_name: "", loc: false, lat: 0.0, long: 0.0, value: 1, activities: [], activity: 0}
    
  sendReq = (event) => {
    event.preventDefault();
    const data = {
      username: 'example',
      skillLevel: this.state.skillLevel,
      group_name: this.state.group_name, 
      loc: this.state.loc, 
      lat: this.state.lat, 
      long: this.state.long,
      activity: this.state.activity
    };
    fetch("/Create_Group",{
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })       
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    },[]);
  }

  componentDidMount() {
    this.fetchActs();
  }

  fetchActs() {
    console.log('fetch');
    fetch("/Create_Group")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  }

  handleSkillLevelChange = (event) => {
    this.setState({ skillLevel: parseInt(event.target.value) });
  };

  handleChange = (event) => { // handles changes for multiple text input fields
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleLoc = () => { // handles the location checkbox
    this.setState({
      loc: !this.state.loc
    });
  }

  getLocation = () => { // retrieves the user's location on button press
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.setState({ lat : pos.coords.latitude, long : pos.coords.longitude});
      });
    } 
  }

  render() {
    return (
        // <div> {this.fetchMsgs()}
        //     data['messages'] 
        // </div>
        <div className = "root">
            <Navbar/>
        <div className="bg-image position-relative" /* Style="background: #E4A11B; height: 100vh" */>
        <form onSubmit={this.sendReq} className="mb-3">
          <div className="form-group mb-3">
            <label htmlFor="activities">Activities</label>
            <select id="activities" name="activities" onChange={this.handleChange}>
              {this.state.activities.map((option) => {
                return (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                );
              })}
            </select>
            <label htmlFor="msg">Group Name:</label>
            <input
              type="text"
              className="form-control"
              name="group_name"
              value={this.state.group_name}
              onChange={this.handleChange}
            />
          </div>
          <input type="checkbox" name="loc" id="loc" checked={this.state.loc} onChange={this.handleLoc} />
          <label htmlFor="loc"> Include Location</label>
          
          { this.state.loc?
          <div>
            <div className="form-group mb-3">
              <label htmlFor="lat">Latitude:</label>
              <input
                type="number"
                className="form-control"
                name="lat"
                value={this.state.lat}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="long">Longitude:</label>
              <input
                type="number"
                className="form-control"
                name="long"
                value={this.state.long}
                onChange={this.handleChange}
              />
            </div>
          <button type="button" className="btn btn-primary" onClick={this.getLocation}>
            Use My Location
          </button>
          </div>
          :
          <div></div>
          }
          <label htmlFor="skill-level">Skill level:</label>
            <select name="skill-level" id="skill-level" onChange={this.handleSkillLevelChange}>
                <option value="0">Beginner</option>
                <option value="1">Intermediate</option>
                <option value="2">Advanced</option>
            </select>
            <br/>
            <Link to="/chat" state={{props: this.state.value}} >
                <button type="submit" className="btn btn-primary "/*position-relative top-50 start-50"*/>Create Group</button>
            </Link>
        </form>
        </div>
        </div> 
    );
  }
}



export default Create_Group