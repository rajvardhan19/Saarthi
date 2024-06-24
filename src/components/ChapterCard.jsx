import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import supabase from "./supabaseClient";

const ChapterCard = ({
  title,
  imageSrc,
  chapterId,
  userId,
  initialIsLiked,
  onProtectedAction,
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(initialIsLiked);

  const handleCardClick = () => {
    navigate(`/chapter/${chapterId}`);
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
        .from("liked_chapters")
        .insert({ user_id: userId, chapter_id: chapterId });

      if (error) {
        console.error("Error liking chapter:", error);
        setLiked(!newLikedStatus);
      }
    } else {
      const { error } = await supabase
        .from("liked_chapters")
        .delete()
        .eq("user_id", userId)
        .eq("chapter_id", chapterId);

      if (error) {
        console.error("Error unliking chapter:", error);
        setLiked(!newLikedStatus);
      }
    }
  };

  return (
    <div className="chapter-card" onClick={handleCardClick}>
      <img src={imageSrc} alt={title} className="chapter-image" />
      <div className="chapter-info">
        <div className="chapter-controls">
          <div className="chapter-title">{title}</div>
          <span className="favorite" onClick={handleLikeClick}>
            {liked ? (
              <FaHeart className="faheart" size={20} />
            ) : (
              <CiHeart className="ciheart" size={24} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;
