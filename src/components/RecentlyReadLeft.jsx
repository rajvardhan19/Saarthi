import React from "react";

const RecentlyReadLeft = ({ title, chapter, imageSrc }) => {
  return (
    <div className="recently-read-left-card">
      <img src={imageSrc} alt={title} className="recently-read-left-image" />
      <div className="recently-read-left-info">
        <div className="recently-read-left-controls">
          <div className="recently-read-left-title">{title}</div>
          <div className="recently-read-left-title">{chapter}</div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyReadLeft;
