import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import ChapterCard from "./ChapterCard";

const Liked = ({ onProtectedAction, userId }) => {
  const [likedChapters, setLikedChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedChapters = async () => {
      if (!onProtectedAction()) return;

      const { data, error } = await supabase
        .from("liked_chapters")
        .select("chapter_id, chapters(*)")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching liked chapters:", error);
      } else {
        setLikedChapters(data.map((item) => item.chapters));
      }
      setLoading(false);
    };

    fetchLikedChapters();
  }, [onProtectedAction, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!likedChapters.length) {
    return <div>You haven't liked any chapters yet.</div>;
  }

  return (
    <div>
      <h2>Liked Chapters</h2>
      <div className="chapter-list">
        {likedChapters.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            title={chapter.title}
            imageSrc={chapter.image_url}
            chapterId={chapter.id}
            userId={userId}
            initialIsLiked={true}
            onProtectedAction={onProtectedAction}
          />
        ))}
      </div>
    </div>
  );
};

export default Liked;
