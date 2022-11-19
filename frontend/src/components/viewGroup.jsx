import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import JoinGroupButton from "./joinGroupButton";
import Navbar from './navbar/navbar-logged-in.jsx';
import FriendButton from "./friendButton";
import './viewGroup.css';

const skill_levels = {
  '-1': '',
  '0': 'Beginner',
  '1': 'Intermediate',
  '2': 'Advanced'
};

function ViewGroup(props) {
  const [groupName, setGroupName] = useState('');
  const [skillLevel, setSkillLevel] = useState(-1);
  const [members, setMembers] = useState([]);
  const [size, setSize] = useState(0);
  let { groupID } = useParams();

  function fetchInfo() {
    fetch("/view_group/" + groupID)
      .then((res) => res.json())
      .then((data) => {
        setGroupName(data.group_name);
        setSkillLevel(data.skill_level);
        setMembers(data.members);
        setSize(data.size);
      });
  }
  

  function leaveGroup(e, group_id) {
    e.preventDefault();
    fetch("/leave_group/" + group_id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if(window.confirm('Are you sure you want to leave this group?')) {
      window.location.replace("/home")
    }}

  /*function addfriend(e, friendID){
    e.preventDefault();
    fetch("/add_friend/" + friendID,{
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(friendID),
    })
    alert("Add friend")
      window.location.reload()
   } */
  
  useEffect(fetchInfo, []);

  return (
    <div className="root">
      <Navbar />
      <div className="container mt-3 mb-3">
        <h1 >{groupName + ' - ' + skill_levels[skillLevel]}</h1>
        <h2>Members ({members.length}/{size})</h2>
        <ul>
          {members.map((user) => (
            <li key={user.user_id}>
              <Link to={"/profile/" + user.user_id}>{
                user.firstName + ' ' + user.lastName}
              </Link>
              {/*<button onClick={(e)=> addfriend(e, user.user_id)}>Add friend</button>*/}
              <FriendButton friendID={user.user_id} />
            </li>
          ))}
        </ul>
        <h2>Actions</h2>
        <JoinGroupButton groupID={groupID} callback={fetchInfo} />
        {members.map((user) => (
        <ul className = "leave-list">
          <li key={user.user_id}>
            {user.user_id == ReactSession.get("user_id") ? <button className = "leave-bttn" onClick={(e)=> leaveGroup(e, groupID)}>Leave Group</button> : null}
          </li>
        </ul>
        ))}
      </div>
    </div>
  );

}

export default ViewGroup;
