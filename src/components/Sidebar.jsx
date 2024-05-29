import React from "react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Saarthi</h1>
        <hr />
      </div>
      <div className="sidebar-item-container">
        <div className="sidebar-item active">Read Chapters</div>
        <div className="sidebar-item">Saarthi Chatbot</div>
        <div className="sidebar-item">Audiobook</div>
        <div className="sidebar-item">Shlok of the day</div>
        <div className="sidebar-item">Settings</div>
      </div>
      <div className="sidebar-item logout">Log out</div>
    </div>
  );
};

export default Sidebar;
