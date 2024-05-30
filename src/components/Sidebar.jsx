import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Saarthi</h1>
        <hr />
      </div>
      <div className="sidebar-item-container">
        <NavLink
          to="/read-chapters"
          className="sidebar-item"
          activeClassName="active"
        >
          Read Chapters
        </NavLink>
        <NavLink
          to="/chatbot"
          className="sidebar-item"
          activeClassName="active"
        >
          Saarthi Chatbot
        </NavLink>
        <div className="sidebar-item">Audiobook</div>
        <div className="sidebar-item">Shlok of the day</div>
        <div className="sidebar-item">Settings</div>
      </div>
    </div>
  );
};

export default Sidebar;
