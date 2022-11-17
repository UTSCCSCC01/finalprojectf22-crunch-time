import React, { useState, useEffect } from "react";

function JoinGroupButton(props) {
  const [joined, setJoined] = useState(true);
  const [full, setFull] = useState(true);

  function fetchJoined() {
    fetch("/user_in_group/" + props.groupID)
      .then((res) => res.json())
      .then((data) => {
        setJoined(data.joined);
        setFull(data.full);
      });
  }
  
  function joinGroup(e) {
    e.preventDefault();
    if (joined == true){
      //localStorage.setItem( props.groupID, props.groupID);
      window.location.replace("/chat/"+ props.groupID)
    }
    else{
      if (window.confirm('Are you sure you want to join this group?')) {
        const data = {
          group_id: props.groupID
        };
        fetch("/join_group", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
          .then((res) => {
            if (res.status == 200) {
              if (props.callback) props.callback();
              else fetchJoined();
            } else {
              alert('An error has occurred. Please inform the web devs.');
            }
          })
          .catch((err) => {console.log(err);});
      }
    }
  }

  function chat(e) {
    
  }

  useEffect(() => {
    fetchJoined();
  });

  return (
    <>
      <button
        className="btn btn-primary"

        disabled={full}
        onClick={joinGroup}
      >
        {joined ? 'Chat With Group' : (full ? 'Full' : 'Join Group')}
      </button>
    </>
  );
}

export default JoinGroupButton;
