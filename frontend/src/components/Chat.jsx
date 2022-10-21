import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'
import io from "socket.io-client";

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);
const Chat = () => {
  const location = useLocation()
  const {props} = location.state
  const roomId  = props;
  const [messages, setMessages] = useState(["Username"]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMessages();
  }, [messages.length]);

  const getMessages = () => {
    socket.on("message", msg => {
        // let allMessages = messages;
        // allMessages.push(msg);
        // setMessages(allMessages);
      setMessages([...messages, msg]);
    });
  };

  // On Change
  const onChange = e => {
    setMessage(e.target.value);
  };

  // On Click
  const onClick = () => {
    if (message !== "") {
      socket.emit("message", message);
      setMessage("");
    } else {
      alert("Please Add A Message");
    }
  };
  const handleKeyDown = (event) => {
      if (message !== "" && event.key === 'Enter') {
        socket.emit("message", message);
        setMessage("");
      } 
      
      else if(message == "" && event.key === 'Enter' ) {
        alert("Please Add A Message");
      }
  };
  
  

  return (
    <div>
      <h1> Room {roomId}</h1>
      
      {messages.length > 0 &&
        messages.map(msg => (
          <ul>
            <li>{msg}</li>
          </ul>
        ))}
      <input value={message} name="message" onKeyDown={handleKeyDown} onChange={e => onChange(e) } />
      <button   onClick={() => onClick()}>Send Message</button>
    </div>
  );
};
export default Chat;