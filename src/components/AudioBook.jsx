import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import RecentlyHeard from "./RecentlyHeard";
import RecentlyHeardLeft from "./RecentlyHeardLeft";
import ChapterCardAudiobook from "./ChapterCardAudiobook";

const AudioBook = ({ selectedLanguage }) => {
  const [chapters, setChapters] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await supabase.from("chapters").select("*");
      if (error) {
        console.error("Error fetching chapters:", error);
      } else {
        console.log("Fetched chapters:", data);
        setChapters(data);
      }
    };

    fetchChapters();
  }, []);

  const visibleChapters = viewAll ? chapters : chapters.slice(0, 6);

  return (
    <div className="main-content-audiobook">
      <div className="chapters-audiobook">
        <div className="section-header-audiobook">
          <h2>Chapters</h2>
          <button onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "Show Less" : "View All"}
          </button>
        </div>
        <div className="chapter-list-audiobook">
          {visibleChapters.length === 0 ? (
            <p>No chapters found</p>
          ) : (
            visibleChapters.map((chapter) => (
              <ChapterCardAudiobook
                key={chapter.id}
                title={chapter.title}
                imageSrc={chapter.image_url}
                chapterId={chapter.id}
                selectedLanguage={selectedLanguage}
              />
            ))
          )}
        </div>
      </div>
      {!viewAll && (
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
      )}
    </div>
  );
};

export default AudioBook;
