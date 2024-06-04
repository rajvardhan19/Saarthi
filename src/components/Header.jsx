import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import AuthModal from "./AuthModal";
import supabase from "./supabaseClient";

const Header = ({ selectedLanguage, setSelectedLanguage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showLanguageDropdown = ["/audiobook", "/read-chapters", "/"].includes(
    location.pathname
  );

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSearchClick = () => {
    if (session) {
      if (location.pathname === "/audiobook") {
        navigate("/search-audiobook");
      } else {
        navigate("/search");
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const closeModal = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const languageOptions =
    location.pathname === "/read-chapters" ? (
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
    );

  return (
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
            {languageOptions}
          </select>
        )}
        {!session ? (
          <>
            <button className="signup-button" onClick={handleAuthClick}>
              Sign Up
            </button>
            <button className="login-button" onClick={handleAuthClick}>
              Login
            </button>
          </>
        ) : (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
      {showAuthModal && <AuthModal onClose={closeModal} />}
    </div>
  );
};

export default Header;
