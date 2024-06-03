import React from "react";
import { useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

const Header = ({ selectedLanguage, setSelectedLanguage }) => {
  const location = useLocation();
  const showLanguageDropdown = ["/audiobook", "/read-chapters"].includes(
    location.pathname
  );

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div className="header">
      <input className="header-search" type="text" placeholder="Search..." />
      <div className="header-user">
        {showLanguageDropdown && (
          <select value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="bengali">Bengali</option>
            <option value="urdu">Urdu</option>
            <option value="german">German</option>
            <option value="gujarati">Gujarati</option>
            <option value="marathi">Marathi</option>
            <option value="telugu">Telugu</option>
            <option value="tamil">Tamil</option>
            <option value="kannada">Kannada</option>
            <option value="malayalam">Malayalam</option>
            <option value="punjabi">Punjabi</option>
            <option value="sanskrit">Sanskrit</option>
          </select>
        )}
        <CgProfile size={35} />
      </div>
    </div>
  );
};

export default Header;
