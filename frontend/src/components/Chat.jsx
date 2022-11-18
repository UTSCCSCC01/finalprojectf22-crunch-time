import React, { useState, useEffect,Component, useRef } from "react";
import { useLocation } from 'react-router-dom'
import io from "socket.io-client";
import Navbar from './navbar/navbar-logged-in.jsx';
import Sidebar from './sidebar/sidebar.jsx';
import { ReactSession } from 'react-client-session';
import {useParams} from "react-router-dom"
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import ringer from "../media/DiscordEnter.mp3";
let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);
const Chat = () => {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const userName= (ReactSession.get("firstName") + " " + ReactSession.get("lastName"))
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const audio = new Audio(ringer);
  let { groupID } = useParams();
  const [isShown, setIsShown] = useState(false);
 
  //Show or hide navbar
  const handleClick = event => {
    // 👇️ toggle shown state
    setIsShown(current => !current);

    // 👇️ or simply set it to true
    // setIsShown(true);
  };
  // gets message history from database
  const fetchMessages = () => {
    let message_info = {
      'user_id':ReactSession.get("user_id"), 
      'groupID': groupID
    };
    fetch("/getGroupInfo",{
      method: 'POST', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(message_info),
    })       
    .then((response) => response.json())
    .then((data) => {
      setMessages(data)
    })
    .catch((error) => {
        console.error('Error:', error);
    },[]);
  }

  useEffect(() => {
    try{
      if(ReactSession.get("firstName")== undefined){
        window.location.replace("/")
      }
      socket.emit("join", {userName:userName, groupID:groupID })
      fetchMessages()

  }
  catch(e){
    window.location.replace("/")
  }


  }, []);
  
  useEffect(() => {  
    getMessages();
  }, [messages.length]);

  //Plays join audio everytime new group memebers joins the chat
  useEffect(() => {
    audio.play()

  }, [ReactSession.get("Group_Members").length]);

  const getMessages = () => {

    socket.on("message", msg => {
      
        // let allMessages = messages;
        // allMessages.push(msg);
        // setMessages(allMessages);

        if("username" in msg){
             ReactSession.set("Group_Members", msg['username'])

      }
        else{
            console.log(msg)
            setMessages([...messages, msg['user']])
            }

      });

  


    

  };
  

  //gets date message sent
  const getDate = () =>{
    let date = new Date()
    let result = "  " + date.toLocaleDateString() + " at "
    let temp = date.toLocaleTimeString().split(/(:|\s)/)
    for(let i = 0; i < temp.length; i++ ){
      if(i != (temp.length -3) &&  i != (temp.length -4) ){
          result += temp[i]
      }
    }
    return result
  };

  
  // On Change
  const onChange = e => {
    setMessage(e.target.value);
  };

  // On Click
  const onClick = () => {

    if (message !== "") {
      let date = getDate()
      socket.emit("message",  {user:[userName, message, date, ReactSession.get("user_id")], groupID:groupID});
      setMessage("");
      //getMessages();
    } else {
      alert("Please Add A Message");
    }
  };
  const handleKeyDown = (event) => {
      if (message !== "" && event.key === 'Enter') {
        let date = getDate()
        socket.emit("message",  {user:[userName, message, date, ReactSession.get("user_id")], groupID:groupID});

        setMessage("");
      } 
      
      else if(message == "" && event.key === 'Enter' ) {
        alert("Please Add A Message");
      }
  };
  
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
    }
      
  }

  return (
    
    <div>
      <Navbar/>
      <MDBContainer fluid className="py-5" style={{ backgroundColor: ""} }>
        <MDBRow>
          <MDBCol md="5" lg="4" xl="3" className="mb-4 mb-md-0">
            <h5 className="font-weight-bold mb-3 text-center text-lg-start">
              Online Members
            </h5>
            <MDBCard style={{}}>
              <MDBCardBody>
                <MDBTypography listUnStyled className="mb-0">
                  {ReactSession.get("Group_Members").length > 0 &&
                  ReactSession.get("Group_Members").map(User => (
                    <li className="p-2 border-bottom">
                    <a href="#!" className="d-flex justify-content-between">
                      <div className="d-flex flex-row">
                        {/* <img
                          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                        /> */}
                        <div className="pt-1">
                          <p className="fw-bold mb-0">{User}</p>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
                </MDBTypography>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="5" lg="4" xl="3">
            <MDBTypography listUnStyled>
              {messages.length > 0 &&
                  messages.map(msg => (
              <li className="d-flex justify-content-between mb-4">
                <MDBCard  >
                  <MDBCardHeader className="d-flex justify-content-between p-3">
                  {/* <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt="avatar"
                  className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                  width="40"
                /> */}
                    <h6 className="fw-bold mb-0">{msg[0]}       </h6> <h6 className="text-secondary"> &nbsp;{msg[2]}</h6>
                    <h6 className="text-muted small mb-0">
                    </h6>
                  </MDBCardHeader>
                  <MDBCardBody>
                    <p className="mb-0">
                    {msg[1]}
                    </p>
                  </MDBCardBody>
                </MDBCard>
              </li>
                ))}
              <li className="bg-white mb-3">
                <MDBTextArea  value={message} name="message" onKeyDown={handleKeyDown} onChange={e => onChange(e)}   id="textAreaExample" rows={4} />
              </li>
              <button type="button" class="btn btn-primary" onClick={() => onClick()} >Send</button>
            </MDBTypography>
          </MDBCol>
          
          <MDBCol md="1" lg="1" xl="1">
          </MDBCol>
            <MDBCol md="2" lg="2" xl="2">
            <div className=" sticky" style={{transform: "translateZ(0px)",  top:"0", position: "sticky"}}>

              <button className="btn btn-secondary" onClick={handleClick}>Member List</button>

              {/* 👇️ show elements on click */}
              {isShown && (
                <div>
                </div>
              )}

              {/* 👇️ show component on click */}
              {isShown && <Sidebar />}
              </div>
              <br/>
              <button className="btn btn-secondary" onClick={(e)=> leaveGroup(e, groupID)}>Leave group</button>
            </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};
export default Chat;


