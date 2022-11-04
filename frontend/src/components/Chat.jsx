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
import ringer from "../media/DiscordEnter.mp3";
let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);
const Chat = () => {
  //const location = useLocation()
  // const {props} = location.state
  // const roomId  = props;
  const [messages, setMessages] = useState(ReactSession.get("messages"));
  const [test, setTest] = useState("");
  const [message, setMessage] = useState("");
  const userName= (ReactSession.get("firstName") + " " + ReactSession.get("lastName"))
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const MINUTE_MS = 4000;
  const audio = new Audio(ringer);
  useEffect(() => {
    try{
      if(ReactSession.get("firstName")== undefined){
        window.location.replace("/")
      }
      socket.emit("join", {userName:userName, id:1 })

  }
  catch(e){
    window.location.replace("/")
  }


  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {  
  //     socket.emit("join", {userName:userName, id:1 })
  // }, MINUTE_MS);
  
  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, [])
  
  useEffect(() => {

    if(ReactSession.get("Group_Members")  == undefined || ReactSession.get("Group_Members").length < 1){
      window.location.replace("/Create_Group")
    }

    
    getMessages();
    ReactSession.set("messages", messages)


  }, [messages.length]);

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
    console.log(result)
    return result
  };

  
  // On Change
  const onChange = e => {
    setMessage(e.target.value);
  };

  // On Click
  const onClick = () => {

    if (message !== "") {

      socket.emit("message",  {user:[userName, message, getDate()]});
      setMessage("");
      //getMessages();
    } else {
      alert("Please Add A Message");
    }
  };
  const handleKeyDown = (event) => {
      if (message !== "" && event.key === 'Enter') {
        socket.emit("message",  {user:[userName, message,""]});

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
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="avatar"
                className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                width="40"
              />
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
      </MDBRow>
    </MDBContainer>

      {/* <input value={message} name="message" onKeyDown={handleKeyDown} onChange={e => onChange(e) } /> */}
      {/* <button  >Send Message</button> */}
    </div>
  );
};
export default Chat;

