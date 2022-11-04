import React, { useState, useEffect } from "react";

function JoinGroupButton(props) {
  const [joined, setJoined] = useState(true);

  function fetchJoined() {
    fetch("/user_in_group/" + props.groupID)
      .then((res) => res.json())
      .then((data) => {
        setJoined(data.joined);
      });
  }

  function joinGroup(e) {
    e.preventDefault();
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
            fetchJoined();
            if (props.callback) props.callback();
          } else {
            alert('An error has occurred. Please inform the web devs.');
          }
        })
        .catch((err) => {console.log(err);});
    }
  }

  useEffect(() => {
    fetchJoined();
  });

  return (
    <>
      <button
        className="btn btn-primary"
        disabled={joined}
        onClick={joinGroup}
      >
        {joined ? 'Joined' : 'Join Group'}
      </button>
    </>
  );
}

export default JoinGroupButton;
