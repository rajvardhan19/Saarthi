import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";

const AudioPlayer = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const title = `Chapter ${chapterId}`;
  const audioFile = `/chapter${chapterId}.mp3`;
  const imageSrc = `/chapter${chapterId}.jpeg`;

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextChapterId = parseInt(chapterId) + 1;
    navigate(`/audio/${nextChapterId}`);
  };

  const handlePrevious = () => {
    const prevChapterId = parseInt(chapterId) - 1;
    if (prevChapterId > 0) {
      navigate(`/audio/${prevChapterId}`);
    }
  };

  return (
    <div className="audio-player">
      <img src={imageSrc} alt={title} className="chapter-image-audio-player" />
      <h2>
        <center>{title}</center>
      </h2>
      <audio ref={audioRef} src={audioFile} />
      <div className="controls">
        <button onClick={handlePrevious}>
          <FaStepBackward size={30} />
        </button>
        <button onClick={handlePlayPause}>
          {isPlaying ? <FaPause size={30} /> : <FaPlay size={30} />}
        </button>
        <button onClick={handleNext}>
          <FaStepForward size={30} />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
