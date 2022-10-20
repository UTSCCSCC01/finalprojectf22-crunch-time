import React, {Component, useState, useEffect, useInsertionEffect} from 'react';
import { Link } from "react-router-dom";
import Navbar from './navbar/navbar-logged-in.jsx';

class Create_Group extends Component {
  state = {skillLevel: 0}
    
  sendReq = (event) => {
    event.preventDefault();
    const data = {
      username: 'example',
      skillLevel: this.state.skillLevel
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

  handleSkillLevelChange = (event) => {
    this.setState({ skillLevel: parseInt(event.target.value) });
  };

  render() {
    return (
        // <div> {this.fetchMsgs()}
        //     data['messages'] 
        // </div>

        <div className = "root">
            <Navbar/>
            <

           <div className="bg-image position-relative" Style="background: #E4A11B; height: 100vh" >
              <label htmlFor="skill-level">Skill level:</label>
              <select name="skill-level" id="skill-level" onChange={this.handleSkillLevelChange}>
                  <option value="0">Beginner</option>
                  <option value="1">Intermediate</option>
                  <option value="2">Advanced</option>
              </select>
              <button type="button" onClick = {this.sendReq} className="btn btn-primary position-relative top-50 start-50">Create Group</button>

        </div>
    );
  }
}

export default Create_Group;