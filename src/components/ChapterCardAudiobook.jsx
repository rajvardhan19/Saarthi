import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import supabase from "./supabaseClient";

const ChapterCardAudiobook = ({
  title,
  imageSrc,
  chapterId,
  selectedLanguage,
  userId,
  initialIsLiked,
  onProtectedAction,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/audio/${chapterId}?language=${selectedLanguage}`);
  };

  const handleLikeToggle = async (event) => {
    event.stopPropagation();
    if (!onProtectedAction()) return;

    if (isLiked) {
      const { error } = await supabase
        .from("liked_chapters")
        .delete()
        .eq("user_id", userId)
        .eq("chapter_id", chapterId)
        .eq("type", "audiobook");

      if (error) {
        console.error("Error unliking audiobook chapter:", error);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabase
        .from("liked_chapters")
        .insert([
          { user_id: userId, chapter_id: chapterId, type: "audiobook" },
        ]);

      if (error) {
        console.error("Error liking audiobook chapter:", error);
      } else {
        setIsLiked(true);
      }
    }
  };

  return (
    <div className="chapter-card-audiobook" onClick={handleCardClick}>
      <img src={imageSrc} alt={title} className="chapter-image-audiobook" />
      <div className="chapter-info-audiobook">
        <div className="chapter-controls-audiobook">
          <div className="chapter-title-audiobook">{title}</div>
          <span className="favorite-audiobook" onClick={handleLikeToggle}>
            {isLiked ? <FaHeart /> : <CiHeart />}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChapterCardAudiobook;
