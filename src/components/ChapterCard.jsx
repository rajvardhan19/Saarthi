import React from "react";
import { FaHeart } from "react-icons/fa";
const ChapterCard = ({ title, imageSrc }) => {
  return (
    <div className="chapter-card">
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
