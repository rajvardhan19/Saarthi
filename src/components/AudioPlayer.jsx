import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import supabase from "./supabaseClient";

const AudioPlayer = ({ selectedLanguage }) => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chapter, setChapter] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);

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
    if (chapter) {
      const fetchAudioUrl = async () => {
        const language =
          new URLSearchParams(location.search).get("language") ||
          selectedLanguage;
        const filename =
          language === "english"
            ? `chapter${chapterId}.mp3`
            : `${language}chapter${chapterId}.mp3`;

        const { data, error } = await supabase.storage
          .from("audiobooks")
          .getPublicUrl(filename);

        if (error) {
          console.error("Error fetching audio URL:", error);
        } else {
          setAudioUrl(data.publicUrl);
        }
      };
      fetchAudioUrl();
    }
  }, [chapter, chapterId, location.search, selectedLanguage]);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      handleNext();
    };

    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextChapterId = parseInt(chapterId) + 1;
    navigate(`/audio/${nextChapterId}?language=${selectedLanguage}`);
  };

  const handlePrevious = () => {
    const prevChapterId = parseInt(chapterId) - 1;
    if (prevChapterId > 0) {
      navigate(`/audio/${prevChapterId}?language=${selectedLanguage}`);
    }
  };

  const handleSeek = (event) => {
    const newTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!audioUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div className="audio-player">
      <img
        src={chapter?.image_url}
        alt={chapter?.title}
        className="chapter-image-audio-player"
      />
      <h2>
        <center>{chapter?.title}</center>
      </h2>
      <audio ref={audioRef} />
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
      <input
        type="range"
        min="0"
        max="100"
        value={(currentTime / duration) * 100}
        onChange={handleSeek}
        className="seekbar"
      />
      <div className="time">
        <span className="current-time">
          {Math.floor(currentTime / 60)}:
          {("0" + Math.floor(currentTime % 60)).slice(-2)}
        </span>
        <span className="total-time">
          {Math.floor(duration / 60)}:
          {("0" + Math.floor(duration % 60)).slice(-2)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
