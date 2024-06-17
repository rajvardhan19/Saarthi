import React from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import {
  IoChatboxEllipses,
  IoChatboxEllipsesOutline,
  IoHome,
  IoHomeOutline,
  IoReader,
  IoReaderOutline,
} from "react-icons/io5";
import { MdAudiotrack, MdOutlineAudiotrack } from "react-icons/md";
import { PiHandsPraying, PiHandsPrayingBold } from "react-icons/pi";
import { NavLink } from "react-router-dom";

const Sidebar = ({ onProtectedAction }) => {
  const handleProtectedClick = (event) => {
    if (!onProtectedAction()) {
      event.preventDefault();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Saarthi</h1>
      </div>
      <div className="sidebar-item-container">
        <div className="sidebar-items">
          <NavLink
            exact
            to="/"
            className="sidebar-item"
            activeClassName="active"
          >
            <IoHomeOutline className="sidebar-icon default" />
            <IoHome className="sidebar-icon active-icon" />
            Home
          </NavLink>

          <NavLink
            to="/read-chapters"
            className="sidebar-item hide-on-mobile"
            activeClassName="active"
          >
            <IoReaderOutline className="sidebar-icon default" />
            <IoReader className="sidebar-icon active-icon" />
            Read Chapters
          </NavLink>

          <NavLink
            to="/audiobook"
            className="sidebar-item hide-on-mobile"
            activeClassName="active"
          >
            <MdOutlineAudiotrack className="sidebar-icon default" />
            <MdAudiotrack className="sidebar-icon active-icon" />
            Audiobook
          </NavLink>

          <NavLink
            to="/chatbot"
            className="sidebar-item"
            activeClassName="active"
            onClick={handleProtectedClick}
          >
            <IoChatboxEllipsesOutline className="sidebar-icon default" />
            <IoChatboxEllipses className="sidebar-icon active-icon" />
            Saarthi Chatbot
          </NavLink>

          <NavLink
            to="/aartis"
            className="sidebar-item"
            activeClassName="active"
          >
            <PiHandsPraying className="sidebar-icon default" />
            <PiHandsPrayingBold className="sidebar-icon active-icon" />
            Aartis
          </NavLink>

          <NavLink
            to="/liked"
            className="sidebar-item"
            activeClassName="active"
            onClick={handleProtectedClick}
          >
            <IoIosHeartEmpty className="sidebar-icon default" />
            <IoIosHeart className="sidebar-icon active-icon" />
            Liked
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
