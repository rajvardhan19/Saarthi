import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ onProtectedAction, session }) => {
  const handleProtectedClick = (event) => {
    if (!onProtectedAction()) {
      event.preventDefault();
    }
  };

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
          onClick={handleProtectedClick}
        >
          Saarthi Chatbot
        </NavLink>
        <NavLink
          to="/audiobook"
          className="sidebar-item"
          activeClassName="active"
        >
          Audiobook
        </NavLink>
        <div className="sidebar-item">Aartis</div>
        <NavLink
          to="/liked"
          className="sidebar-item"
          activeClassName="active"
          onClick={handleProtectedClick}
        >
          Liked
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
