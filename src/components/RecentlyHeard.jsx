import React from "react";

const RecentlyHeard = ({ title, chapter, imageSrc }) => {
  return (
    <div className="recently-heard-card">
      <img src={imageSrc} alt={title} className="recently-heard-image" />
      <div className="recently-heard-info">
        <div className="recently-heard-title">{title}</div>
        <div className="recently-heard-chapter">{chapter}</div>
      </div>
    </div>
  );
};

export default RecentlyHeard;
