import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import ChapterCard from "./ChapterCard";
import RecentlyRead from "./RecentlyRead";
import RecentlyReadLeft from "./RecentlyReadLeft";

const MainContent = ({ onProtectedAction, userId }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [likedChapters, setLikedChapters] = useState({});
  const [recentlyRead, setRecentlyRead] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await supabase.from("chapters").select("*");
      if (error) {
        console.error("Error fetching chapters:", error);
      } else {
        setChapters(data);

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
          .select("*")
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

  if (loading) {
    return <div>Loading...</div>;
  }

  const visibleChapters = viewAll ? chapters : chapters.slice(0, 6);

  const handleViewAllClick = () => {
    setViewAll(!viewAll);
  };

  return (
    <div>
      <div className="main-content">
        <div className="chapters">
          <div className="section-header">
            <h2>Chapters</h2>
            <button onClick={handleViewAllClick}>
              {viewAll ? "Show Less" : "View All"}
            </button>
          </div>
          <div className="chapter-list">
            {visibleChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                title={chapter.title}
                imageSrc={chapter.image_url}
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
            <button onClick={handleViewAllClick}>View all</button>
          </div>
          <div className="recently-read-list">
            {recentlyRead.map((read) => (
              <RecentlyRead
                key={read.id}
                title={`Chapter ${read.chapter_id}`}
                imageSrc={`chapter${read.chapter_id}.jpeg`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
