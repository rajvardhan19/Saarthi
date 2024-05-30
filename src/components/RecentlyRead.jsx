import React from "react";

const RecentlyRead = ({ title, chapter, imageSrc }) => {
  return (
    <div className="recently-read-card">
      <img src={imageSrc} alt={title} className="recently-read-image" />
      <div className="recently-read-info">
        <div className="recently-read-title">{title}</div>
        <div className="recently-read-chapter">{chapter}</div>
      </div>
    </div>
  );
};

export default RecentlyRead;
