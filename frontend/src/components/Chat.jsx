import React, { useState, useEffect,Component } from "react";
import { useLocation } from 'react-router-dom'
import io from "socket.io-client";
import Navbar from './navbar/navbar-logged-in.jsx';
import { ReactSession } from 'react-client-session';
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

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);
const Chat = () => {
  const location = useLocation()
  const {props} = location.state
  const roomId  = props;
  const [messages, setMessages] = useState(ReactSession.get("messages"));
  const [message, setMessage] = useState("");
  const userName= (ReactSession.get("firstName") + " " + ReactSession.get("lastName"))
 
  
  useEffect(() => {
    if(ReactSession.get("Group_Members")  == undefined || ReactSession.get("Group_Members").length < 1){
      window.location.replace("/Create_Group")
    }

    socket.emit("join", {userName:userName, id:roomId })
    
    getMessages();
    ReactSession.set("messages", messages)


  }, [messages.length]);//
  
  const getMessages = () => {

    socket.on("message", msg => {
        // let allMessages = messages;
        // allMessages.push(msg);
        // setMessages(allMessages);
        //console.log(messages)
        console.log(msg)
        if("userName" in msg){
          if(ReactSession.get("Group_Members").includes(msg['userName']) == false){
             let temp = ReactSession.get("Group_Members")
             temp.push(msg['userName'])
             ReactSession.set("Group_Members", temp)
          }
      }
        else{
            setMessages([...messages, msg['user']]);
            }
          //console.log(ReactSession.get("messages"), [...temp, msg['user']])

    });

  


    

  };


  
  // On Change
  const onChange = e => {
    setMessage(e.target.value);
  };

  // On Click
  const onClick = () => {

    if (message !== "") {

      socket.emit("message",  {user:[userName, message]});
      setMessage("");
      //getMessages();
    } else {
      alert("Please Add A Message");
    }
  };
  const handleKeyDown = (event) => {
      if (message !== "" && event.key === 'Enter') {
        socket.emit("message",  {user:[userName, message]});

        setMessage("");
      } 
      
      else if(message == "" && event.key === 'Enter' ) {
        alert("Please Add A Message");
      }
  };
  
  

  return (
    
    <div>
      <Navbar/>
      <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee"} }>
      <MDBRow>
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
          <h5 className="font-weight-bold mb-3 text-center text-lg-start">
            Members
          </h5>

          <MDBCard style={{}}>
            <MDBCardBody>
              <MDBTypography listUnStyled className="mb-0">
                
                {ReactSession.get("Group_Members").length > 0 &&
                 ReactSession.get("Group_Members").map(User => (
                  <li className="p-2 border-bottom">
                  <a href="#!" className="d-flex justify-content-between">
                    <div className="d-flex flex-row">
                      <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        alt="avatar"
                        className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                        width="60"
                      />
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

        <MDBCol md="6" lg="7" xl="8">
          <MDBTypography listUnStyled>
          {messages.length > 0 &&
              messages.map(msg => (
           <li className="d-flex justify-content-between mb-4">
              
              <MDBCard  >
                <MDBCardHeader className="d-flex justify-content-between p-3">
                <img
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                alt="avatar"
                className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                width="30"
              />
                  <p className="fw-bold mb-0">{msg[0]}</p>
                  <p className="text-muted small mb-0">
                  </p>
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
      </MDBRow>
    </MDBContainer>

      {/* <input value={message} name="message" onKeyDown={handleKeyDown} onChange={e => onChange(e) } /> */}
      {/* <button  >Send Message</button> */}
    </div>
  );
};
export default Chat;

