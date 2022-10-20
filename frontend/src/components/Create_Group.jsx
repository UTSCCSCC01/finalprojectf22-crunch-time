import React, {Component, useState, useEffect, useInsertionEffect,} from 'react';
import { Link } from "react-router-dom";
import Chat from './Chat';
class Create_Group extends Component {
    state = {
        value: 1,
      };

    
    fetchMsgs = () =>{
        const data = { username: 'example' };
        fetch("/Create_Group",{
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })       
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
           
        })
        .catch((error) => {
            console.error('Error:', error);
        },[]);
    }
  render() {
    return (
        // <div> {this.fetchMsgs()}
        //     data['messages'] 
        // </div>
        <div class="bg-image position-relative"  Style="background: #E4A11B; height: 100vh" >
            <Link to="/chat" state={{props: this.state.value}} >
                <button type="button" onClick = {this.fetchMsgs} class="btn btn-primary position-relative top-50 start-50">Create Group</button>
            </Link>  {this.state.value}
        </div>
    );
  }
}



export default Create_Group