import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import supabase from "./supabaseClient";

const ChapterCardAudiobook = ({
  title,
  imageSrc,
  chapterId,
  userId,
  initialIsLiked,
  onProtectedAction,
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(initialIsLiked);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("liked_audio_chapters")
        .select("chapter_id")
        .eq("user_id", userId)
        .eq("chapter_id", chapterId)
        .single();

      if (error) {
        console.error("Error fetching liked status:", error);
      } else if (data) {
        setLiked(true);
      }
    };

    fetchLikedStatus();
  }, [userId, chapterId]);

  const handleCardClick = () => {
    navigate(`/audio/${chapterId}`);
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!onProtectedAction()) {
      return;
    }

    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    if (newLikedStatus) {
      const { error } = await supabase
        .from("liked_audio_chapters")
        .insert({ user_id: userId, chapter_id: chapterId });

      if (error) {
        console.error("Error liking audiobook chapter:", error);
        setLiked(!newLikedStatus);
      }
    } else {
      const { error } = await supabase
        .from("liked_audio_chapters")
        .delete()
        .eq("user_id", userId)
        .eq("chapter_id", chapterId);

      if (error) {
        console.error("Error unliking audiobook chapter:", error);
        setLiked(!newLikedStatus);
      }
    }
  };

  return (
    <div className="chapter-card-audiobook" onClick={handleCardClick}>
      <img src={imageSrc} alt={title} className="chapter-image-audiobook" />
      <div className="chapter-info-audiobook">
        <div className="chapter-controls-audiobook">
          <div className="chapter-title-audiobook">{title}</div>
          <span className="favorite-audiobook" onClick={handleLikeClick}>
            {liked ? <FaHeart /> : <CiHeart />}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChapterCardAudiobook;
