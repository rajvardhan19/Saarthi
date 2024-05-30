import React from "react";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  return (
    <div className="header">
      <input
        className="header-search"
        type="text"
        placeholder="Search..."
      ></input>
      <div className="header-user">
        <CgProfile size={35} />
      </div>
    </div>
  );
};

export default Header;
