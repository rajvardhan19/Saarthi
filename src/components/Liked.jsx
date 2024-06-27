import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import ChapterCard from "./ChapterCard";
import ChapterCardAudiobook from "./ChapterCardAudiobook";
import Loader from "./Loader";

const Liked = ({ onProtectedAction, userId, selectedLanguage }) => {
  const [likedChapters, setLikedChapters] = useState([]);
  const [likedAudiobookChapters, setLikedAudiobookChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterImages, setChapterImages] = useState({});
  const [audiobookChapterImages, setAudiobookChapterImages] = useState({});

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

  useEffect(() => {
    const fetchChapterImages = async () => {
      const newChapterImages = {};
      const newAudiobookChapterImages = {};

      for (const chapter of likedChapters) {
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

      for (const chapter of likedAudiobookChapters) {
        const language = selectedLanguage === "english" ? "" : selectedLanguage;
        const filename = `${language}chapter${chapter.id}.png`;

        const { data, error } = await supabase.storage
          .from("audiobook_images")
          .getPublicUrl(filename);

        if (error) {
          console.error(`Error fetching image URL for ${filename}:`, error);
        } else {
          newAudiobookChapterImages[chapter.id] = data.publicUrl;
        }
      }

      setChapterImages(newChapterImages);
      setAudiobookChapterImages(newAudiobookChapterImages);
    };

    if (likedChapters.length > 0 || likedAudiobookChapters.length > 0) {
      fetchChapterImages();
    }
  }, [likedChapters, likedAudiobookChapters, selectedLanguage]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
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
              imageSrc={chapterImages[chapter.id]}
              chapterId={chapter.id}
              userId={userId}
              initialIsLiked={true}
              onProtectedAction={onProtectedAction}
            />
          ))}
        </div>
      ) : (
        <div>
          <Loader />
        </div>
      )}
      <h2>Liked Audiobook Chapters</h2>
      {likedAudiobookChapters.length > 0 ? (
        <div className="chapter-list-audiobook">
          {likedAudiobookChapters.map((chapter) => (
            <ChapterCardAudiobook
              key={chapter.id}
              title={chapter.title}
              imageSrc={audiobookChapterImages[chapter.id]}
              chapterId={chapter.id}
              userId={userId}
              initialIsLiked={true}
              onProtectedAction={onProtectedAction}
            />
          ))}
        </div>
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Liked;
