import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import ChapterCard from "./ChapterCard";
import RecentlyRead from "./RecentlyRead";
import RecentlyReadLeft from "./RecentlyReadLeft";

const MainContent = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await supabase.from("chapters").select("*"); // Adjust this query to match your database schema

      if (error) {
        console.error("Error fetching chapters:", error);
      } else {
        setChapters(data);
      }
      setLoading(false);
    };

    fetchChapters();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="main-content">
        <div className="chapters">
          <div className="section-header">
            <h2>Chapters</h2>
            <button>View all</button>
          </div>
          <div className="chapter-list">
            {chapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                title={chapter.title}
                imageSrc={chapter.image_url} // Ensure this matches your schema
                chapterId={chapter.id}
              />
            ))}
          </div>
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
      <div />
      <div />
    </div>
  );
};

export default MainContent;
