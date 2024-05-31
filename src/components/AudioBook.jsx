import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import RecentlyHeard from "./RecentlyHeard";
import RecentlyHeardLeft from "./RecentlyHeardLeft";
import ChapterCardAudiobook from "./ChapterCardAudiobook";

const AudioBook = () => {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await supabase.from("chapters").select("*");
      if (error) {
        console.error(error);
      } else {
        setChapters(data);
      }
    };

    fetchChapters();
  }, []);

  return (
    <div className="main-content-audiobook">
      <div className="chapters-audiobook">
        <div className="section-header-audiobook">
          <h2>Chapters</h2>
          <button>View all</button>
        </div>
        <div className="chapter-list-audiobook">
          {chapters.map((chapter) => (
            <ChapterCardAudiobook
              key={chapter.id}
              title={chapter.title}
              imageSrc={chapter.image_url}
              chapterId={chapter.id}
            />
          ))}
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
