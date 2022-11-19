import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import JoinGroupButton from "./joinGroupButton.jsx";
import Navbar from './navbar/navbar-logged-in.jsx';
import { ReactSession } from 'react-client-session';

class User_search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],  activities: [], activity_id: 0, activity_name: "NULL", tracked_activities: []
        };
        this.handleTrackingChange = this.handleTrackingChange.bind(this);
        this.handleActivityChange = this.handleActivityChange.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.addTracked = this.addTracked.bind(this);
        this.removeTracked = this.removeTracked.bind(this);
        this.sendTracking = this.sendTracking.bind(this);
    }

    componentDidMount() {
        try {
            if (ReactSession.get("firstName") === undefined | ReactSession.get("user_id") === undefined) {
                window.location.replace("/")
            } 
        }
        catch (e) {
            window.location.replace("/")
        }
        this.fetchTracked();
        this.fetchActs();
        this.fetchUsers(0);
        console.log(this.state.tracked_activities)
    }

    fetchActs() {
        console.log('fetch acts');
        fetch("/get_acts")
            .then((res) => res.json())
            .then((data) => {
                this.setState({ ...data });
            });
    }

    sendTracking = (event) => {
        event.preventDefault();
        var list = [];
        this.state.tracked_activities.forEach(element => {
            list.push(element.activity_id);
        });
        const data = {
            tracked_activities: list
        };
        console.log(JSON.stringify(data));
        fetch("/tracking/" + ReactSession.get("user_id"), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(data)
        }).then((res) => res.json())
    };

    fetchTracked() {
        fetch("/tracking/" + ReactSession.get("user_id"))
            .then((res) => res.json())
            .then((data) => {
                this.setState({ ...data });
            });
    }

    fetchUsers(act_id) {
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
        this.setState({
            activity_id: id,
            activity_name: name
        });
        this.fetchUsers(id);
    }

    handleTrackingChange(event) {
        const target = event.target;
        const value = parseInt(target.value);
        const has = this.state.tracked_activities.some(v => v.activity_id == value)
        if(has) {
            this.removeTracked(value);
        } else {
            this.addTracked(value);
        }
    }

    addTracked(value) {
        this.setState(previousState => ({
            tracked_activities: [...previousState.tracked_activities, {activity_id: value}]
        }));
      }
    
    removeTracked(value) {
        this.setState({tracked_activities: this.state.tracked_activities.filter(function(act) { 
            return act.activity_id !== value
        })});
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
                            <ul class="checkbox" id="tracked_activities">
                            {this.state.activities.map((item) => {
                                return (
                                <li key={item.activity_id}><input type="checkbox" onChange={this.handleTrackingChange} id={item.activity_id}
                                    value={item.activity_id} checked={this.state.tracked_activities.some(v => v.activity_id == item.activity_id)}/><label for={item.activity_id}>{item.name}</label></li>
                                );
                            })}
                            </ul>
                            <button className="btn btn-primary" type="submit">
                                Save
                            </button>
                        </div>
                    </form>
                    <select id="activities" name="activities" onChange={this.handleActivityChange}>
                        <option key={0} value={"0,NULL"}> All activities </option>
                        {this.state.activities.map((option) => {
                            return (
                                <option key={option.activity_id} value={[option.activity_id, option.name]}>
                                    {option.name}
                                </option>
                            );
                        })}
                    </select>
                    <h2>List of found users:</h2>
                    <ul className="list-group">
                        {this.state.users.map((user) => (
                            <li className="list-group-item" key={[user.user_id, user.activity_name]}>
                                User: {user.firstName} {user.lastName}<br/>
                                Activity: {user.activity_name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default User_search;
