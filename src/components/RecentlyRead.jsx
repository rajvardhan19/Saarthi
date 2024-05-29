import React from "react";

const RecentlyRead = ({ title, chapter }) => {
  return (
    <div className="recently-read">
      <div className="recently-read-title">{title}</div>
      <div className="recently-read-chapter">{chapter}</div>
    </div>
  );
};

export default RecentlyRead;
