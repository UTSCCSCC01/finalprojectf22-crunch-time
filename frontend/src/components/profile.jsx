import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./navbar/navbar-logged-in.jsx";
import FriendButton from "./friendButton.jsx";

function Profile(props) {
  const [name, setName] = useState("");
  const [friendCount, setFriendCount] = useState(0);
  const [interests, setInterests] = useState([]);
  const [mutuals, setMutuals] = useState([]);
  let { userID } = useParams();

  function fetchInfo() {
    fetch("/profile_info/" + userID)
      .then((res) => res.json())
      .then((data) => {
        setName(data.firstName + " " + data.lastName);
        setFriendCount(data.friendCount);
        setInterests(data.interests);
        setMutuals(data.mutualFriends);
      });
  }

  useEffect(fetchInfo, []);

  return (
    <div className="root">
      <Navbar />
      <div className="container mt-3 mb-3">
        <h1>{name}</h1>
        <p>
          {friendCount} friend{friendCount == 1 ? "" : "s"}
        </p>

        <h2>Interests</h2>
        {interests.length == 0 ? (
          <p>None.</p>
        ) : (
          <ul>
            {interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        )}

        <h2>Mutual friends</h2>
        {mutuals.length == 0 ? (
          <p>None.</p>
        ) : (
          <ul>
            {mutuals.map((user) => (
              <li key={user.userID}>
                <Link reloadDocument to={"/profile/" + user.userID}>
                  {user.firstName + " " + user.lastName}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <FriendButton friendID={userID} />
      </div>
    </div>
  );
}

export default Profile;
