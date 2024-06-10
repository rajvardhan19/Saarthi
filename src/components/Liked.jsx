import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import ChapterCard from "./ChapterCard";
import ChapterCardAudiobook from "./ChapterCardAudiobook";

const Liked = ({ onProtectedAction, userId }) => {
  const [likedChapters, setLikedChapters] = useState([]);
  const [likedAudiobookChapters, setLikedAudiobookChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedChapters = async () => {
      if (!onProtectedAction()) return;

      // Fetch liked text chapters
      const { data: textData, error: textError } = await supabase
        .from("liked_chapters")
        .select("chapter_id, chapters(*)")
        .eq("user_id", userId);

      if (textError) {
        console.error("Error fetching liked text chapters:", textError);
      } else {
        setLikedChapters(textData.map((item) => item.chapters));
      }

      // Fetch liked audiobook chapters
      const { data: audioData, error: audioError } = await supabase
        .from("liked_audio_chapters")
        .select("chapter_id, chapters(*)")
        .eq("user_id", userId);

      if (audioError) {
        console.error("Error fetching liked audiobook chapters:", audioError);
      } else {
        setLikedAudiobookChapters(audioData.map((item) => item.chapters));
      }

      setLoading(false);
    };

    fetchLikedChapters();
  }, [onProtectedAction, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="liked-container">
      <h2>Liked Chapters</h2>
      {likedChapters.length > 0 ? (
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
      ) : (
        <div>You haven't liked any text chapters yet.</div>
      )}
      <h2>Liked Audiobook Chapters</h2>
      {likedAudiobookChapters.length > 0 ? (
        <div className="chapter-list-audiobook">
          {likedAudiobookChapters.map((chapter) => (
            <ChapterCardAudiobook
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
      ) : (
        <div>You haven't liked any audiobook chapters yet.</div>
      )}
    </div>
  );
};

export default Liked;
