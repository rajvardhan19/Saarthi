import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import ChapterCard from "./ChapterCard";
import ChapterCardAudiobook from "./ChapterCardAudiobook";
import AartiCard from "./AartiCard";
import Loader from "./Loader";

const Liked = ({ onProtectedAction, userId, selectedLanguage }) => {
  const [likedChapters, setLikedChapters] = useState([]);
  const [likedAudiobookChapters, setLikedAudiobookChapters] = useState([]);
  const [likedAartis, setLikedAartis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterImages, setChapterImages] = useState({});
  const [audiobookChapterImages, setAudiobookChapterImages] = useState({});
  const [aartiImages, setAartiImages] = useState({});

  useEffect(() => {
    const fetchLikedItems = async () => {
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

      // Fetch liked aartis
      const { data: aartiData, error: aartiError } = await supabase
        .from("liked_aartis")
        .select("aarti_id, aartis(id, aarti, aarti_image_url)")
        .eq("user_id", userId);

      if (aartiError) {
        console.error("Error fetching liked aartis:", aartiError);
      } else {
        setLikedAartis(aartiData.map((item) => item.aartis));
      }

      setLoading(false);
    };

    fetchLikedItems();
  }, [onProtectedAction, userId]);

  useEffect(() => {
    const fetchImages = async () => {
      const newChapterImages = {};
      const newAudiobookChapterImages = {};
      const newAartiImages = {};

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

      for (const aarti of likedAartis) {
        const filename = `${aarti.id}.png`;

        const { data, error } = await supabase.storage
          .from("aarti_images")
          .getPublicUrl(filename);

        if (error) {
          console.error(`Error fetching image URL for ${filename}:`, error);
        } else {
          newAartiImages[aarti.id] = data.publicUrl;
        }
      }

      setChapterImages(newChapterImages);
      setAudiobookChapterImages(newAudiobookChapterImages);
      setAartiImages(newAartiImages);
    };

    if (
      likedChapters.length > 0 ||
      likedAudiobookChapters.length > 0 ||
      likedAartis.length > 0
    ) {
      fetchImages();
    }
  }, [likedChapters, likedAudiobookChapters, likedAartis, selectedLanguage]);

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
      <h2>Liked Aartis</h2>
      {likedAartis.length > 0 ? (
        <div className="aarti-list">
          {likedAartis.map((aarti) => (
            <AartiCard
              key={aarti.id}
              id={aarti.id}
              title={aarti.aarti}
              imageSrc={aarti.aarti_image_url}
              userId={userId}
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
