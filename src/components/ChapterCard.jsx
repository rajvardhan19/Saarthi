import React from "react";

const ChapterCard = ({ title }) => {
  return (
    <div className="chapter-card">
      <div className="chapter-title">{title}</div>
      <div className="chapter-controls">
        <span className="favorite">♥</span>
        <span className="more-options">⋮</span>
      </div>
    </div>
  );
};

export default ChapterCard;
