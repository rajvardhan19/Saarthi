import React from "react";
import ChapterCard from "./ChapterCard";
import RecentlyRead from "./RecentlyRead";

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="chapters">
        <div className="section-header">
          <h2>Chapters</h2>
          <button>View all</button>
        </div>
        <div className="chapter-list">
          <ChapterCard title="Chapter 1" />
          <ChapterCard title="Chapter 2" />
          <ChapterCard title="Chapter 3" />
        </div>
      </div>
      <div className="recently-read-section">
        <div className="section-header">
          <h2>Recently Read</h2>
          <button>View all</button>
        </div>
        <div className="recently-read-list">
          <RecentlyRead title="Shlok 4" chapter="Chapter 3" />
          <RecentlyRead title="Shlok 17" chapter="Chapter 12" />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
