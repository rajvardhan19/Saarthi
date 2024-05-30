import React from "react";

const RecentlyHeardLeft = ({ title, chapter, imageSrc }) => {
  return (
    <div className="recently-heard-left-card">
      <img src={imageSrc} alt={title} className="recently-heard-left-image" />
      <div className="recently-heard-left-info">
        <div className="recently-heard-left-controls">
          <div className="recently-heard-left-title">{title}</div>
          <div className="recently-heard-left-title">{chapter}</div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyHeardLeft;
