import React from "react";
import { useNavigate } from "react-router-dom";

const LikedButton = ({ onProtectedAction }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onProtectedAction()) {
      navigate("/liked");
    }
  };

  return (
    <button className="button" onClick={handleClick}>
      <div className="img-container">
        <img alt="Liked" loading="lazy" decoding="async" src="liked.png" />
      </div>
      <p className="text">Liked Chapters</p>
      <div className="icon-container">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 384 512"
          className="text-black"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
        </svg>
      </div>
    </button>
  );
};

export default LikedButton;
