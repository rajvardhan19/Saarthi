import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import ChapterCard from "./ChapterCard";
import ChapterCardAudiobook from "./ChapterCardAudiobook";

const Homepage = ({ onProtectedAction, userId, selectedLanguage }) => {
  const [chapters, setChapters] = useState([]);
  const [audiobookChapters, setAudiobookChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterImages, setChapterImages] = useState({});
  const [audiobookChapterImages, setAudiobookChapterImages] = useState({});

  useEffect(() => {
    const fetchChapters = async () => {
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("chapters")
        .select("*");

      if (chaptersError) {
        console.error("Error fetching chapters:", chaptersError);
      } else {
        setChapters(chaptersData);
      }
    };

    const fetchAudiobookChapters = async () => {
      const { data: audiobookData, error: audiobookError } = await supabase
        .from("chapters")
        .select("*");

      if (audiobookError) {
        console.error("Error fetching audiobook chapters:", audiobookError);
      } else {
        setAudiobookChapters(audiobookData);
      }
    };

    fetchChapters();
    fetchAudiobookChapters();
    setLoading(false);
  }, []);

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

  useEffect(() => {
    const fetchAudiobookChapterImages = async () => {
      const newAudiobookChapterImages = {};

      for (const chapter of audiobookChapters) {
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

      setAudiobookChapterImages(newAudiobookChapterImages);
    };

    if (audiobookChapters.length > 0) {
      fetchAudiobookChapterImages();
    }
  }, [audiobookChapters, selectedLanguage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage-container">
      <h2>Chapters</h2>
      {chapters.length > 0 ? (
        <div className="chapter-list">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              title={chapter.title}
              imageSrc={chapterImages[chapter.id]}
              chapterId={chapter.id}
              userId={userId}
              initialIsLiked={false}
              onProtectedAction={onProtectedAction}
            />
          ))}
        </div>
      ) : (
        <div>No chapters found.</div>
      )}
      <h2>Audiobook Chapters</h2>
      {audiobookChapters.length > 0 ? (
        <div className="chapter-list-audiobook">
          {audiobookChapters.map((chapter) => (
            <ChapterCardAudiobook
              key={chapter.id}
              title={chapter.title}
              imageSrc={audiobookChapterImages[chapter.id]}
              chapterId={chapter.id}
              userId={userId}
              initialIsLiked={false}
              onProtectedAction={onProtectedAction}
            />
          ))}
        </div>
      ) : (
        <div>No audiobook chapters found.</div>
      )}
    </div>
  );
};

export default Homepage;
