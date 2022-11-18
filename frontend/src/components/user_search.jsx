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
    }

    sendTracking = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.set("activity_id", this.state.activity_id);
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
        try {
            if (ReactSession.get("firstName") === undefined) {
                window.location.replace("/")
            } else {
                this.setState({user_id: parseInt(ReactSession.get("user_id"))});
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
        console.log('fetch');
        fetch("/get_tracked")
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
                                <li key={item.id}><input type="checkbox" id={item.id} value={[option.id, option.name]} /><label for={item.id}>{item.name}</label></li>
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

                </div>
            </div>
        );
    }
    /*
                    <h2>List of found groups:</h2>
                    <ul className="list-group">
                        {this.state.messages.map((msg) => (
                            <li className="list-group-item" key={msg.group_id}>
                                <Link to={"/view_group/" + msg.group_id}>{msg.group_name}</Link>
                                <span style={{ float: 'right' }}><JoinGroupButton groupID={msg.group_id} /></span> <br />
                                Activity: {msg.activity_name}
                            </li>
                        ))}
                    </ul>*/
}

export default User_search;
