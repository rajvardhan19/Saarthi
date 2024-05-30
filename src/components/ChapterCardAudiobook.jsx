import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const ChapterCardAudiobook = ({ title, imageSrc, chapterId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/audio/${chapterId}`);
  };

  return (
    <div className="chapter-card-audiobook" onClick={handleCardClick}>
      <img src={imageSrc} alt={title} className="chapter-image-audiobook" />
      <div className="chapter-info-audiobook">
        <div className="chapter-controls-audiobook">
          <div className="chapter-title-audiobook">{title}</div>
          <span className="favorite-audiobook">
            <FaHeart />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChapterCardAudiobook;
