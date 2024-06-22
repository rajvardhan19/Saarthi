import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import ChapterCard from "./ChapterCard";
import RecentlyRead from "./RecentlyRead";

const MainContent = ({ onProtectedAction, userId, selectedLanguage }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [likedChapters, setLikedChapters] = useState({});
  const [recentlyRead, setRecentlyRead] = useState([]);
  const [chapterImages, setChapterImages] = useState({});

  useEffect(() => {
    const fetchChapters = async () => {
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("chapters")
        .select("*");

      if (chaptersError) {
        console.error("Error fetching chapters:", chaptersError);
      } else {
        setChapters(chaptersData);

        const { data: likes, error: likesError } = await supabase
          .from("liked_chapters")
          .select("*")
          .eq("user_id", userId);

        if (likesError) {
          console.error("Error fetching liked chapters:", likesError);
        } else {
          const liked = {};
          likes.forEach((like) => {
            liked[like.chapter_id] = true;
          });
          setLikedChapters(liked);
        }

        const { data: recentReads, error: recentReadsError } = await supabase
          .from("recently_read")
          .select("chapter_id, last_read")
          .eq("user_id", userId)
          .order("last_read", { ascending: false })
          .limit(5);

        if (recentReadsError) {
          console.error(
            "Error fetching recently read chapters:",
            recentReadsError
          );
        } else {
          setRecentlyRead(recentReads);
        }
      }
      setLoading(false);
    };

    fetchChapters();
  }, [userId]);

  useEffect(() => {
    const fetchChapterImages = async () => {
      const newChapterImages = {};

      for (const chapter of chapters) {
        const language = selectedLanguage === "english" ? "" : selectedLanguage;
        const filename = `${language}chapter${chapter.id}.png`;

        const { data, error } = await supabase.storage
          .from("images")
          .getPublicUrl(filename);

        if (error) {
          console.error(`Error fetching image URL for ${filename}:`, error);
        } else {
          newChapterImages[chapter.id] = data.publicUrl;
        }
      }

      setChapterImages(newChapterImages);
    };

    if (chapters.length > 0) {
      fetchChapterImages();
    }
  }, [chapters, selectedLanguage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const visibleChapters = viewAll ? chapters : chapters.slice(0, 5);

  const handleViewAllClick = () => {
    setViewAll(!viewAll);
  };

  return (
    <div>
      <div className="main-content">
        <div className="chapters">
          <div className="section-header">
            <h2>Chapters</h2>
            <button onClick={handleViewAllClick} className="view-all">
              {viewAll ? "Show Less" : "View All"}
            </button>
          </div>
          <div className="chapter-list">
            {visibleChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                title={chapter.title}
                imageSrc={chapterImages[chapter.id]}
                chapterId={chapter.id}
                userId={userId}
                initialIsLiked={likedChapters[chapter.id]}
                onProtectedAction={onProtectedAction}
              />
            ))}
          </div>
        </div>
      </div>
      {!viewAll && (
        <div className="recently-read-section">
          <div className="section-header">
            <h2>Recently Read</h2>
          </div>
          <div className="recently-read-list">
            {recentlyRead.map((read) => (
              <RecentlyRead
                key={read.chapter_id}
                title={`Chapter ${read.chapter_id}`}
                imageSrc={chapterImages[read.chapter_id]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
