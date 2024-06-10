import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import LikedButton from "./LikedButton";

const Header = ({
  selectedLanguage,
  setSelectedLanguage,
  onProtectedAction,
  session,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showLanguageDropdown = ["/audiobook", "/read-chapters", "/"].includes(
    location.pathname
  );

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSearchClick = () => {
    if (location.pathname === "/audiobook") {
      navigate("/search-audiobook");
    } else {
      navigate("/search");
    }
  };

  return (
    <div className="main-header">
      <div className="header">
        {showLanguageDropdown && (
          <FaSearch size={25} onClick={handleSearchClick} />
        )}
        <div className="header-user">
          {showLanguageDropdown && (
            <select
              className="dropdown"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {location.pathname === "/read-chapters" ? (
                <>
                  <option value="english">English</option>
                  <option value="assamese">Assamese</option>
                  <option value="bengali">Bengali</option>
                  <option value="gujarati">Gujarati</option>
                  <option value="hindi">Hindi</option>
                  <option value="kannad">Kannada</option>
                  <option value="malayalam">Malayalam</option>
                  <option value="marathi">Marathi</option>
                  <option value="oriya">Oriya</option>
                  <option value="punjabi">Punjabi</option>
                  <option value="sanskrit">Sanskrit</option>
                  <option value="sindhi">Sindhi</option>
                  <option value="tamil">Tamil</option>
                  <option value="telugu">Telugu</option>
                </>
              ) : (
                <>
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
                </>
              )}
            </select>
          )}
          {session ? (
            <button className="login-button" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="login-button" onClick={onProtectedAction}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
      <div className="second-line">
        {["/read-chapters", "/"].includes(location.pathname) && (
          <div className="header-title">Welcome Back</div>
        )}
      </div>
      <div>
        {["/read-chapters", "/audiobook", "/"].includes(location.pathname) && (
          <LikedButton />
        )}
      </div>
    </div>
  );
};

export default Header;
