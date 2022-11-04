import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import Navbar from './navbar/navbar-logged-in.jsx';

class Account_information extends Component {

  
  state = {
    firstName: ReactSession.get("firstName"), lastName: ReactSession.get("lastName"), email:  ReactSession.get("email"), password_input: "",
     address: ReactSession.get("address"), user_id: ReactSession.get("user_id")
  };


  
  async  componentDidMount(){
    
    try{
      if(ReactSession.get("firstName")== undefined){
        window.location.replace("/")
      }
    }
    catch(e){
      window.location.replace("/")
    }
  }
  

  
  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    console.log("aa")
  };

  applyChanges = (e) => {
    e.preventDefault();
    const data = this.state;
    fetch("/updateAccount",{
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(data),
    })       
    .then((response) => response.json())
    .then((data) => {
      ReactSession.set("firstName", this.state.firstName)
      ReactSession.set("lastName", this.state.lastName)
      ReactSession.set("address", this.state.address)
      alert("Account information updated")
      window.location.reload()
    })  
    .catch((error) => {

        alert('Error:', error);
        window.location.reload()


    },[]);

  }

  deleteAccount = (e) => {
    e.preventDefault();
    const data = this.state;
    if(this.state.password_input != ReactSession.get("password")){
      alert("Wrong Password!")
    }
    else{
      fetch("/deleteAccount",{
          method: 'DELETE', // or 'PUT'
          headers: {
              'Content-Type': 'application/json',
          },
          
          body: JSON.stringify(data),
      })       
      .then((response) => response.json())
      .then((data) => {
        alert("Account Deleted")
        ReactSession.remove("firstName");
        ReactSession.remove("lastName" );
        ReactSession.remove("email");
        ReactSession.remove("password");
        ReactSession.remove("messages")
        ReactSession.remove("Group_Members")
        ReactSession.remove("GroupName")
        ReactSession.remove("user_id");

        window.location.replace("/")
      })  
      .catch((error) => {

          alert('Error:', error);
          window.location.reload()


      },[]);
    }
  }

    render() {
      return (
        <div className = "root">
        <Navbar/>
        <div className="container mt-3 mb-3">
          <h1>Account information</h1>
          <p>
            <Link to="/home">Return to home</Link>
          </p>
          <form onSubmit={this.sendMsg} className="mb-3">

            

            <div className="form-group mb-3">
                <h2>First Name</h2>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleChange}
                />
            </div>

            <div className="form-group mb-3">
                <h2>Last Name</h2>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleChange}
                />
            </div>

            <div className="form-group mb-3">
                <h2>Email</h2>
                <input className="form-control" value={ReactSession.get("email")} />
            </div>

            <div className="form-group mb-3">
                <h2>Password</h2>
                <input className="form-control" value={ReactSession.get("password")} type={"password"} />
   
                  
               
            </div>

            <div className="form-group mb-3">
                <h2>Address</h2>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={this.state.address}
                  onChange={this.handleChange}
                />
            </div>

            <div className="form-group mb-3">
                <h2>Groups</h2>
                <input className="form-control" value={ReactSession.get("groupName")}/>
            </div>
            <button className="btn btn-primary" type="submit" onClick={this.applyChanges}>
                Apply Changes
            </button>
          </form>

          <h1>Delete Account</h1>
          <form onSubmit={this.sendMsg} className="mb-3">

            <div className="form-group mb-3">
                <h2>Email</h2>
                <input className="form-control" value={ReactSession.get("email")} />
            </div>

            <div className="form-group mb-3">
                <h2>Password</h2>
                <input
                  type="text"
                  className="form-control"
                  name="password_input"
                  value={this.state.password_input}
                  onChange={this.handleChange}
                />
            </div>
            <button className="btn btn-danger" type="submit" onClick={this.deleteAccount}>
                Delete Account
            </button>
          </form>         
        </div>
        
      );
    }
  }
  
  export default Account_information;
  