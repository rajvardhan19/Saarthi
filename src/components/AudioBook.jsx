import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import RecentlyHeard from "./RecentlyHeard";
import ChapterCardAudiobook from "./ChapterCardAudiobook";
import Loader from "./Loader";

const AudioBook = ({ selectedLanguage, userId, onProtectedAction }) => {
  const [chapters, setChapters] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [likedChapters, setLikedChapters] = useState([]);
  const [recentlyHeard, setRecentlyHeard] = useState([]);
  const [chapterImages, setChapterImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await supabase.from("chapters").select("*");
      if (error) {
        console.error("Error fetching chapters:", error);
      } else {
        setChapters(data);
      }
      setLoading(false);
    };

    fetchChapters();
  }, []);

  useEffect(() => {
    const fetchLikedChapters = async () => {
      if (!onProtectedAction()) return;

      const { data, error } = await supabase
        .from("liked_chapters")
        .select("chapter_id, type")
        .eq("user_id", userId)
        .eq("type", "audiobook");

      if (error) {
        console.error("Error fetching liked audiobook chapters:", error);
      } else {
        setLikedChapters(data.map((item) => item.chapter_id));
      }
    };

    const fetchRecentlyHeard = async () => {
      if (!onProtectedAction()) return;

      const { data, error } = await supabase
        .from("recently_heard")
        .select("*")
        .eq("user_id", userId)
        .order("last_heard", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching recently heard chapters:", error);
      } else {
        setRecentlyHeard(data);
      }
    };

    fetchLikedChapters();
    fetchRecentlyHeard();
  }, [userId]);

  useEffect(() => {
    const fetchChapterImages = async () => {
      const newChapterImages = {};

      for (const chapter of chapters) {
        const language = selectedLanguage === "english" ? "" : selectedLanguage;
        const filename = `${language}chapter${chapter.id}.png`;

        const { data, error } = await supabase.storage
          .from("audiobook_images")
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

  const visibleChapters = viewAll ? chapters : chapters.slice(0, 5);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="main-content-audiobook">
      <div className="chapters-audiobook">
        <div className="section-header-audiobook">
          <h2>Chapters</h2>
          <button onClick={() => setViewAll(!viewAll)} className="view-all">
            {viewAll ? "Show Less" : "View All"}
          </button>
        </div>
        <div className="chapter-list-audiobook">
          {visibleChapters.length === 0 ? (
            <div>
              <Loader />
            </div>
          ) : (
            visibleChapters.map((chapter) => (
              <ChapterCardAudiobook
                key={chapter.id}
                title={chapter.title}
                imageSrc={chapterImages[chapter.id]}
                chapterId={chapter.id}
                selectedLanguage={selectedLanguage}
                userId={userId}
                initialIsLiked={likedChapters.includes(chapter.id)}
                onProtectedAction={onProtectedAction}
              />
            ))
          )}
        </div>
      </div>
      {!viewAll && (
        <div className="recently-heard-section">
          <div className="section-header-audiobook">
            <h2>Recently Heard</h2>
          </div>
          <div className="recently-heard-list">
            {recentlyHeard.map((heard) => (
              <RecentlyHeard
                key={heard.id}
                title={`Chapter ${heard.chapter_id}`}
                imageSrc={chapterImages[heard.chapter_id]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioBook;
