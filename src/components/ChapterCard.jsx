import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const ChapterCard = ({ title, imageSrc, chapterId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/chapter/${chapterId}`);
  };
  return (
    <div className="chapter-card" onClick={handleCardClick}>
      <img src={imageSrc} alt={title} className="chapter-image" />
      <div className="chapter-info">
        <div className="chapter-controls">
          <div className="chapter-title">{title}</div>
          <span className="favorite">
            <FaHeart />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;
