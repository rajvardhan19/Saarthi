import React from "react";
import ChapterCard from "./ChapterCard";
import RecentlyRead from "./RecentlyRead";
import RecentlyReadLeft from "./RecentlyReadLeft";

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="chapters">
        <div className="section-header">
          <h2>Chapters</h2>
          <button>View all</button>
        </div>
        <div className="chapter-list">
          <ChapterCard
            title="Chapter 1"
            imageSrc="chapter1.jpeg"
            chapterId="1"
          />
          <ChapterCard
            title="Chapter 2"
            imageSrc="chapter2.jpeg"
            chapterId="2"
          />
          <ChapterCard
            title="Chapter 3"
            imageSrc="chapter3.jpeg"
            chapterId="3"
          />
          <ChapterCard
            title="Chapter 4"
            imageSrc="chapter4.jpeg"
            chapterId="4"
          />
          <ChapterCard
            title="Chapter 5"
            imageSrc="chapter5.jpeg"
            chapterId="5"
          />
          <ChapterCard
            title="Chapter 6"
            imageSrc="chapter6.jpeg"
            chapterId="6"
          />
        </div>
      </div>
      <div className="recently-read-section">
        <div className="section-header">
          <h2>Recently Read</h2>
          <button>View all</button>
        </div>
        <div className="recently-read-list">
          <div className="recently-read-left">
            <RecentlyReadLeft
              title="Shlok 4"
              chapter="Chapter 3"
              imageSrc="chapter3.jpeg"
            />
          </div>
          <div className="recently-read-right">
            <RecentlyRead
              title="Shlok 17"
              chapter="Chapter 12"
              imageSrc="chapter2.jpeg"
            />
            <RecentlyRead
              title="Shlok 18"
              chapter="Chapter 13"
              imageSrc="chapter3.jpeg"
            />
          </div>
          <div className="recently-read-right">
            <RecentlyRead
              title="Shlok 17"
              chapter="Chapter 12"
              imageSrc="chapter2.jpeg"
            />
            <RecentlyRead
              title="Shlok 18"
              chapter="Chapter 13"
              imageSrc="chapter3.jpeg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
