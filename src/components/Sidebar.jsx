import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ setActiveClassName }) => {
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
          onClick={() => setActiveClassName("read-chapters")}
        >
          Read Chapters
        </NavLink>
        <NavLink
          to="/chatbot"
          className="sidebar-item"
          activeClassName="active"
          onClick={() => setActiveClassName("chatbot")}
        >
          Saarthi Chatbot
        </NavLink>
        <NavLink
          to="/audiobook"
          className="sidebar-item"
          activeClassName="active"
          onClick={() => setActiveClassName("audiobook")}
        >
          Audiobook
        </NavLink>
        <div className="sidebar-item">Aartis</div>
        <div className="sidebar-item">Mythology Stories</div>
      </div>
    </div>
  );
};

export default Sidebar;
