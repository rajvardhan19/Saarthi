import React from "react";
import { useNavigate } from "react-router-dom";

const AartiCard = ({ id, title, imageSrc }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the AartiPlayer component with the aarti ID
    navigate(`/aarti/${id}`);
  };

  return (
    <div className="aarti-card" onClick={handleCardClick}>
      <img src={imageSrc} alt={title} className="aarti-image" />
      <div className="aarti-info">
        <div className="aarti-controls">
          <div className="aarti-title">{title}</div>
        </div>
      </div>
    </div>
  );
};

export default AartiCard;
