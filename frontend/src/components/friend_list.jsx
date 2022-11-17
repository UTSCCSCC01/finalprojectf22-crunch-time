import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from './navbar/navbar-logged-in.jsx';
import './friend_list.css';

function friend_list(props) {
  const [friends, setFriends] = useState([]);
  //cconst [friendID, setFriendID] = useState('2');
  let { user_id } = useParams();

  function fetchInfo() {
    fetch("/friend_list/" + user_id)
      .then((res) => res.json())
      .then((data) => {
        setFriends(data.friends);
      });
  }
  
  function unfriend(e, friendID){
    e.preventDefault();
    fetch("/remove_friend/" + friendID,{
        method: 'DELETE', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(friendID),
    })
    alert("Removed friend")
      window.location.reload()
} 

  useEffect(fetchInfo, []);

  return (
    <div className="root">
      <Navbar />
      <div className="container mt-3 mb-3">
        <h1 >{'Friend list'}</h1>
        <div className='item-container'>
          {friends.map((friend) => (
             <li key={friend.user_id}>
               {friend.firstName + ' ' + friend.lastName}
               <button onClick={(e)=> unfriend(e, friend.user_id)}>Unfriend</button>
            </li>
          ))}
        </div>
      </div>
    </div>
  );

}
export default friend_list;
