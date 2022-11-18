import React, { useState, useEffect } from "react";

function FriendButton(props) {
  const [isFriend, setIsFriend] = useState(null);

  function fetchIsFriend() {
    fetch("/is_friend/" + props.friendID)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsFriend(data.isFriend);
      });
  }

  function addfriend(e) {
    e.preventDefault();
    fetch("/add_friend/" + props.friendID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.friendID),
    })
      .then((res) => {
        if (res.status == 200) {
          if (props.callback) props.callback();
          else fetchIsFriend();
        } else {
          alert("An error has occurred. Please inform the devs.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function unfriend(e) {
    e.preventDefault();
    fetch("/remove_friend/" + props.friendID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.friendID),
    })
      .then((res) => {
        if (res.status == 200) {
          if (props.callback) props.callback();
          else fetchIsFriend();
        } else {
          alert("An error has occurred. Please inform the devs.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchIsFriend();
  });

  return (
    <>
      <button
        className="btn btn-primary"
        disabled={isFriend === null}
        onClick={isFriend ? unfriend : addfriend}
      >
        {isFriend === null
          ? "Can't friend yourself!"
          : isFriend
          ? "Unfriend"
          : "Add as friend"}
      </button>
    </>
  );
}

export default FriendButton;
