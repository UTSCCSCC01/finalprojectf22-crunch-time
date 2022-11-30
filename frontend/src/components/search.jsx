import React, { Component } from "react";
import { Link } from "react-router-dom";
import JoinGroupButton from "./joinGroupButton.jsx";
import Navbar from './navbar/navbar-logged-in.jsx';
import { ReactSession } from 'react-client-session';

class Search extends Component {
  

  //state = { groupName: "d", messages: [], lat: 0.0, long: 0.0, dist: 0.0 };
  constructor(props) {
    super(props);
    this.state = {
      groupName: "", messages: [], loc: false, lat: 0.0, long: 0.0, dist: 0.0, activities: [], activity_id: 0, activity_name: "NULL"
    };

    this.handleChange = this.handleChange.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.handleLoc = this.handleLoc.bind(this);
    this.handleActivityChange = this.handleActivityChange.bind(this);
  }
  
  fetchMsgs() {
    console.log('fetch');
    fetch("/search")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  }

  sendMsg = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("groupName", this.state.groupName);
    formData.set("loc", this.state.loc);
    formData.set("activity_id", this.state.activity_id);
    if (this.state.loc) {
      formData.set("lat", this.state.lat);
      formData.set("long", this.state.long);
      formData.set("dist", this.state.dist);
    }
    console.log(this.state.groupName, this.state.loc, this.state.lat, this.state.long, this.state.dist);
    fetch("/search", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  };

  componentDidMount() {
    document.title = "Group Search";
    try{
      if(ReactSession.get("firstName")===undefined){
        window.location.replace("/")
      }
    }
    catch(e){
      window.location.replace("/")
    }
    this.fetchActs();
    this.fetchMsgs();
  }

  fetchActs() {
    console.log('fetch acts');
    fetch("/get_acts")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...data });
      });
  }

  handleActivityChange = (event) => { 
    const target = event.target;
    const value = target.value.split(",");
    this.setState({
      activity_id: parseInt(value[0]),
      activity_name: value[1]
    }); 
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleLoc() {
    this.setState({
      loc: !this.state.loc
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.setState({ lat : pos.coords.latitude, long : pos.coords.longitude});
      });
    } 
  }

  
  render() {
    return (

      <div className = "root" class="row d-flex justify-content-center">
        <Navbar/>
        
        <div class="container mt-3 mb-3 ce col-md-6 ">
          <p><Link to="/home">Return to home</Link></p>
          <form onSubmit={this.sendMsg} className="mb-3">
          <div className="form-group mb-3">
          <label htmlFor="activities">Activity:</label>
            <select class="mx-1 px-2" id="activities" name="activities" onChange={this.handleActivityChange}>
                <option key={0} value={"0,NULL"}>Any Activity</option>
              {this.state.activities.map((option) => {
                return (
                  <option key={option.id} value={[option.id, option.name]}>
                    {option.name}
                  </option>
                );
              })}
            </select>
            </div>
            <div className="form-group my-4">
              <label htmlFor="msg">Group name:</label>
              <input
                type="text"
                className="form-control"
                name="groupName"
                value={this.state.groupName}
                onChange={this.handleChange}
              />
            
            <input type="checkbox" name="loc" id="loc" checked={this.state.loc} onChange={this.handleLoc} />
            <label class="px-1 my-1" htmlFor="loc"> Filter By distance</label>

            { this.state.loc?
            <div class="mb-3" >
              <div class="container col-md-8">
              <div className="form-group mb-3">
                <label htmlFor="lat">Latitude:</label>
                <input
                  type="number"
                  className="form-control"
                  name="lat"
                  value={this.state.lat}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="long">Longitude:</label>
                <input
                  type="number"
                  className="form-control"
                  name="long"
                  value={this.state.long}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="dist">Maximum distance (Km):</label>
                <input
                  type="number"
                  className="form-control"
                  name="dist"
                  value={this.state.dist}
                  onChange={this.handleChange}
                />
              </div>
              </div>
            <button type="button" className="btn btn-primary" onClick={this.getLocation}>
              Use My Location
            </button>
            </div>
            :
            <div></div>
            }
            <button className="btn btn-primary" type="submit">
              Find
            </button>
            </div>
            <Link to={"/chat/"+ 1}></Link>
          </form>
          
          <h2>List of found groups:</h2>
          <ul className="list-group">
            {this.state.messages.map((msg) => (
              <li className="list-group-item" key={msg.group_id}>
                <Link to={"/view_group/"+ msg.group_id}>{msg.group_name}</Link>
                <span style={{float:'right'}}><JoinGroupButton groupID={msg.group_id}/></span> <br/>
                Activity: {msg.activity_name}
              </li>
            ))}
          </ul>
      </div>
     </div>
    );
  }
}

export default Search;
