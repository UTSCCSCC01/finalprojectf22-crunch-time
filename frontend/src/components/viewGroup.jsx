import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import JoinGroupButton from "./joinGroupButton";
import Navbar from "./navbar/navbar-logged-in.jsx";
import FriendButton from "./friendButton";
import defaultPic from "../media/default_group_pic.png";

const skill_levels = {
  "-1": "",
  "0": "Beginner",
  "1": "Intermediate",
  "2": "Advanced",
};

function ViewGroup(props) {
  const [groupName, setGroupName] = useState("");
  const [skillLevel, setSkillLevel] = useState(-1);
  const [members, setMembers] = useState([]);
  const [size, setSize] = useState(0);
  const [isCreator, setIsCreator] = useState(false);
  const [showChangePic, setShowChangePic] = useState(false);
  const [groupPic, setGroupPic] = useState();
  let { groupID } = useParams();
  const groupPicRef = useRef(null);

  function fetchInfo() {
    fetch("/view_group/" + groupID)
      .then((res) => res.json())
      .then((data) => {
        setGroupName(data.group_name);
        setSkillLevel(data.skill_level);
        setMembers(data.members);
        setSize(data.size);
      });
    fetch("/user_in_group/" + groupID)
      .then((res) => res.json())
      .then((data) => {
        setIsCreator(data.isCreator);
      });
  }

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

  function handleGroupPicChange(e) {
    setGroupPic(e.target.files[0]);
  }

  function updateGroupPic(e) {
    let formData = new FormData();
    formData.append('groupID', groupID);
    formData.append('groupPic', groupPic);
    fetch("/set_group_pic",{
      method: 'POST',
      body: formData,
    })       
    .then((res) => {
      if (res.status == 200) {
        window.location.reload();
      } else if (res.status == 400) {
        alert('An error has occurred. Did you select an image?');
      } else {
        alert('An error has occurred. Please inform the web devs.');
      }
    })
    .catch((error) => {
        console.error('Error:', error);
    },[]);
    }

  useEffect(fetchInfo, []);

  return (
    <div className="root">
      <Navbar />
      <div className="container mt-3 mb-3">
        <h1>{groupName + " - " + skill_levels[skillLevel]}</h1>
        <img
          src={"/group_pic/" + groupID}
          width="200"
          height="200"
          style={{'width': 200, 'height': 200,'object-fit': 'cover'}}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = defaultPic;
          }}
        />
        <h2>
          Members ({members.length}/{size})
        </h2>
        <ul>
          {members.map((user) => (
            <li key={user.user_id}>
              <Link to={"/profile/" + user.user_id}>
                {user.firstName + " " + user.lastName}
              </Link>
              {/*<button onClick={(e)=> addfriend(e, user.user_id)}>Add friend</button>*/}
              <FriendButton friendID={user.user_id} />
            </li>
          ))}
        </ul>
        <h2>Actions</h2>
        <JoinGroupButton groupID={groupID} callback={fetchInfo} />
        {!isCreator ? null : (
          <div>
            <a href="#group-pic"><button
              className="btn btn-primary mt-1"
              type="button"
              onClick={() => {
                setShowChangePic(!showChangePic);
                console.log(groupPicRef);
              }}
            >
              Change group picture
            </button></a>
            <div style={{display: showChangePic ? 'block' : 'none'}}>
              <label htmlFor="group-pic">Upload group picture (JPG, PNG, or GIF only): &ensp;</label>
              <input
                className="form-control"
                type="file"
                id="group-pic"
                name="group-pic"
                onChange={handleGroupPicChange}
              />
              <button
                className="btn btn-success mt-1"
                type="button"
                onClick={updateGroupPic}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewGroup;
