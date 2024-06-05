import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import supabase from "./supabaseClient";

const AudioPlayer = ({ selectedLanguage, userId }) => {
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
    const fetchAudioUrl = async () => {
      const filename =
        selectedLanguage === "english"
          ? `chapter${chapterId}.mp3`
          : `${selectedLanguage}chapter${chapterId}.mp3`;

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
  }, [chapterId, selectedLanguage]);

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
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    const markAsHeard = async (userId, chapterId) => {
      try {
        const { data: recentHeardData, error: recentHeardError } =
          await supabase
            .from("recently_heard")
            .select("*")
            .eq("user_id", userId)
            .order("last_heard", { ascending: false })
            .limit(1);

        if (recentHeardError) {
          console.error("Error checking recently heard:", recentHeardError);
          return;
        }

        if (
          recentHeardData.length > 0 &&
          recentHeardData[0].chapter_id === chapterId
        ) {
          return;
        }

        const { data, error } = await supabase
          .from("recently_heard")
          .insert([{ user_id: userId, chapter_id: chapterId }], {
            onConflict: ["user_id", "chapter_id"],
          });

        if (error) {
          if (error.code === "23505") {
            // Unique constraint violation error
            console.log("Chapter already marked as heard.");
          } else {
            console.error("Error marking as heard:", error);
          }
        }
      } catch (error) {
        console.error("Error marking as heard:", error);
      }
    };

    if (userId && chapterId) {
      markAsHeard(userId, chapterId);
    }
  }, [userId, chapterId]);

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
      <audio ref={audioRef}></audio>
      <button onClick={handlePrevious}>
        <FaStepBackward />
      </button>
      <button onClick={handlePlayPause}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button onClick={handleNext}>
        <FaStepForward />
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={(currentTime / duration) * 100}
        onChange={handleSeek}
      />
    </div>
  );
};

export default AudioPlayer;
