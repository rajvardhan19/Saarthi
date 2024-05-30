import React from "react";
import RecentlyHeard from "./RecentlyHeard";
import RecentlyHeardLeft from "./RecentlyHeardLeft";
import ChapterCardAudiobook from "./ChapterCardAudiobook";

const AudioBook = () => {
  return (
    <div className="main-content-audiobook">
      <div className="chapters-audiobook">
        <div className="section-header-audiobook">
          <h2>Chapters</h2>
          <button>View all</button>
        </div>
        <div className="chapter-list-audiobook">
          <ChapterCardAudiobook
            title="Chapter 1"
            imageSrc="chapter1.jpeg"
            chapterId={1}
          />
          <ChapterCardAudiobook
            title="Chapter 2"
            imageSrc="chapter2.jpeg"
            chapterId={2}
          />
          <ChapterCardAudiobook
            title="Chapter 3"
            imageSrc="chapter3.jpeg"
            chapterId={3}
          />
          <ChapterCardAudiobook
            title="Chapter 4"
            imageSrc="chapter4.jpeg"
            chapterId={4}
          />
          <ChapterCardAudiobook
            title="Chapter 5"
            imageSrc="chapter5.jpeg"
            chapterId={5}
          />
          <ChapterCardAudiobook
            title="Chapter 6"
            imageSrc="chapter6.jpeg"
            chapterId={6}
          />
        </div>
      </div>
      <div className="recently-heard-section">
        <div className="section-header-audiobook">
          <h2>Recently Heard</h2>
          <button>View all</button>
        </div>
        <div className="recently-heard-list">
          <div className="recently-heard-left">
            <RecentlyHeardLeft
              title="Shlok 4"
              chapter="Chapter 3"
              imageSrc="chapter3.jpeg"
            />
          </div>
          <div className="recently-heard-right">
            <RecentlyHeard
              title="Shlok 17"
              chapter="Chapter 12"
              imageSrc="chapter2.jpeg"
            />
            <RecentlyHeard
              title="Shlok 18"
              chapter="Chapter 13"
              imageSrc="chapter3.jpeg"
            />
          </div>
          <div className="recently-heard-right">
            <RecentlyHeard
              title="Shlok 17"
              chapter="Chapter 12"
              imageSrc="chapter2.jpeg"
            />
            <RecentlyHeard
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

export default AudioBook;
