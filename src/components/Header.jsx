import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { IoIosHeart } from "react-icons/io";
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
  const showLanguageDropdown = [
    "/audiobook",
    "/read-chapters",
    "/",
    "/aartis",
  ].includes(location.pathname);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkTheme);
  }, [isDarkTheme]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSearchClick = () => {
    if (location.pathname === "/audiobook") {
      navigate("/search-audiobook");
    } else if (location.pathname === "/aartis") {
      navigate("/search-aarti");
    } else {
      navigate("/search");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleBackClick = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  const handleLikeClick = () => {
    navigate("/liked");
  };

  return (
    <div className="main-header">
      <div className="header">
        <div className="header-left">
          <button onClick={handleBackClick} className="custom-class">
            <IoChevronBack size={30} />
          </button>
          {showLanguageDropdown && (
            <button onClick={handleSearchClick} className="custom-class">
              <FaSearch size={25} />
            </button>
          )}
        </div>
        <div className="header-user">
          {session ? (
            <>
              <button className="custom-class" onClick={handleLikeClick}>
                <IoIosHeart className="iosheart" size={30} />
              </button>
              <button onClick={toggleDropdown} className="custom-class">
                <FaUser size={30} className="profile" />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="theme">
                    <p>Theme:</p>
                    <button onClick={toggleTheme} className="theme-button">
                      {isDarkTheme ? "Dark" : "Light"}
                    </button>
                  </div>
                  <div className="language-dpd">
                    <p>Language:</p>
                    <select
                      className="dropdown"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                    >
                      {location.pathname === "/aartis" ? (
                        <>
                          <option value="hindi">Hindi</option>
                          <option value="gujarati">Gujarati</option>
                          <option value="marathi">Marathi</option>
                        </>
                      ) : location.pathname === "/read-chapters" ? (
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
                  </div>
                  <div className="logout">
                    <button onClick={onLogout} className="logout-button">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button className="login-button" onClick={onProtectedAction}>
              <h3>Login</h3>
            </button>
          )}
        </div>
      </div>
      <div className="second-line">
        {["/read-chapters", "/", "/audiobook"].includes(location.pathname) && (
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
