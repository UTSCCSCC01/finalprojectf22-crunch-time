import React, { Component } from "react";
import { Link } from "react-router-dom";
import JoinGroupButton from "./joinGroupButton.jsx";
import Navbar from './navbar/navbar-logged-in.jsx';
import { ReactSession } from 'react-client-session';

class User_search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: 0, users: [], tracked_activities: [], activities: [], activity_id: 0, activity_name: "NULL"
        };
        
        this.handleTrackingChange = this.handleTrackingChange.bind(this);
        this.handleActivityChange = this.handleActivityChange.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
    }

    sendTracking = (event) => {
        const formData = new FormData();
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
        try {
            if (ReactSession.get("firstName") === undefined | ReactSession.get("user_id") === undefined) {
                window.location.replace("/")
            } 
        }
        catch (e) {
            window.location.replace("/")
        }
        this.fetchActs();
        this.fetchTracked();
    }

    fetchActs() {
        console.log('fetch acts');
        fetch("/get_acts")
            .then((res) => res.json())
            .then((data) => {
                this.setState({ ...data });
            });
    }

    fetchTracked() {
        console.log('fetch tracking/' + ReactSession.get("user_id"));
        fetch("/tracking/" + ReactSession.get("user_id"))
            .then((res) => res.json())
            .then((data) => {
                this.setState({ ...data });
            });
    }

    fetchUsers(act_id) {
        console.log('fetch users');
        fetch("/get_matching_users/" + act_id + "/" + ReactSession.get("user_id"))
            .then((res) => res.json())
            .then((data) => {
                this.setState({ ...data });
            });
    }

    handleActivityChange (event) {
        const target = event.target;
        const value = target.value.split(",");
        const id = parseInt(value[0])
        const name = value[1]
        console.log("setting act ", id)
        this.setState({
            activity_id: id,
            activity_name: name
        });
        this.fetchUsers(id);
    }

    handleTrackingChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className="root">
                <Navbar />
                <div className="container mt-3 mb-3">
                    <h1>Search page</h1>
                    <p><Link to="/home">Return to home</Link></p>
                    <form onSubmit={this.sendTracking} className="mb-3">
                        <div className="form-group mb-3">
                            <label htmlFor="tracked_activities">Activity</label>
                            <ul class="checkbox" id="tracked_activities" name="tracked_activities" onChange={this.handleTrackingChange}>
                            {this.state.activities.map((item) => {
                                return (
                                <li key={item.id}><input type="checkbox" id={item.id} value={item.activity_id} /><label for={item.id}>{item.name}</label></li>
                                );
                            })}
                            </ul>
                            <button className="btn btn-primary" type="submit">
                                Save
                            </button>
                        </div>
                    </form>
                    <select id="activities" name="activities" onChange={this.handleActivityChange}>
                        <option key={0} value={"0,NULL"}> Select an Activity </option>
                        {this.state.activities.map((option) => {
                            return (
                                <option key={option.id} value={[option.id, option.name]}>
                                    {option.name}
                                </option>
                            );
                        })}
                    </select>
                    <h2>List of found users:</h2>
                    <ul className="list-group">
                        {this.state.users.map((user) => (
                            <li className="list-group-item" key={user.user_id}>
                                User: {user.firstName} {user.lastName}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    /*<ul className="list-group">
                        {this.state.users.map((user) => (
                            <li className="list-group-item" key={msg.group_id}>
                                <Link to={"/view_group/" + msg.group_id}>{msg.group_name}</Link>
                                <span style={{ float: 'right' }}><JoinGroupButton groupID={msg.group_id} /></span> <br />
                                Activity: {msg.activity_name}
                            </li>
                        ))}
                    </ul>
                    */
}

export default User_search;
