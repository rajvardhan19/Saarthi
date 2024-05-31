import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import supabase from "./supabaseClient";

const AudioPlayer = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", chapterId)
        .single();
      if (error) {
        console.error(error);
      } else {
        setChapter(data);
      }
    };

    fetchChapter();
  }, [chapterId]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, chapter]);

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

  if (!chapter) {
    return <div>Loading...</div>;
  }

  return (
    <div className="audio-player">
      <img
        src={chapter.image_url}
        alt={chapter.title}
        className="chapter-image-audio-player"
      />
      <h2>
        <center>{chapter.title}</center>
      </h2>
      <audio ref={audioRef} src={chapter.audio_url} />
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
