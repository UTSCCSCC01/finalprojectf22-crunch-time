import React, { useState, useEffect,Component, useRef } from "react";
import {useParams} from "react-router-dom"
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const sidebar = () => {
  const [groupName, setGroupName] = useState('');
  const [skillLevel, setSkillLevel] = useState(-1);
  const [allMembers, setMembers] = useState([]);
  let { groupID } = useParams();
  //Get group information
  function fetchInfo() {
    fetch("/view_group/" + groupID)
      .then((res) => res.json())
      .then((data) => {
        setGroupName(data.group_name);
        setSkillLevel(data.skill_level);
        setMembers(data.members);
      });
  }
  
  useEffect(fetchInfo, []);
  console.log(allMembers)
  return (
    <div style={{ display: 'flex', height: '50vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" class="btn btn-dark">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            Groups Members
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
          {allMembers.map((user) => (
                        <NavLink exact to="/" activeClassName="activeClicked">

            <li key={user.user_id}>
            <CDBSidebarMenuItem icon="columns">{user.firstName + ' ' + user.lastName}</CDBSidebarMenuItem>
            </li>
            </NavLink>

          ))}
          </CDBSidebarMenu>
        </CDBSidebarContent>

      </CDBSidebar>
    </div>
  );
};

export default sidebar;