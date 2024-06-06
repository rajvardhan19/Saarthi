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
  const [isMarkedAsHeard, setIsMarkedAsHeard] = useState(false);

  useEffect(() => {
    const fetchChapter = async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", chapterId)
        .single();
      if (error) {
        console.error("Error fetching chapter:", error);
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

  useEffect(() => {
    const markAsHeard = async (userId, chapterId) => {
      try {
        console.log(`Marking chapter ${chapterId} as heard for user ${userId}`);

        // Check if the entry already exists
        const { data: existingEntries, error: fetchError } = await supabase
          .from("recently_heard")
          .select("*")
          .eq("user_id", userId)
          .order("last_heard", { ascending: false })
          .limit(1);

        if (fetchError) {
          console.error("Error fetching existing entries:", fetchError);
          return;
        }

        if (existingEntries.length > 0) {
          const lastEntry = existingEntries[0];
          if (lastEntry.chapter_id === parseInt(chapterId)) {
            console.log(
              "Current entry is the same as the previous one. No update needed."
            );
            return;
          }

          // Delete the existing entry
          const { error: deleteError } = await supabase
            .from("recently_heard")
            .delete()
            .eq("user_id", userId)
            .eq("chapter_id", lastEntry.chapter_id);

          if (deleteError) {
            console.error("Error deleting existing entry:", deleteError);
            return;
          }
        }

        // Insert the new entry with timestamp
        const { data: newData, error: insertError } = await supabase
          .from("recently_heard")
          .insert([
            {
              user_id: userId,
              chapter_id: chapterId,
              last_heard: new Date().toISOString(), // current timestamp
            },
          ]);

        if (insertError) {
          console.error("Error inserting new entry:", insertError);
        } else {
          console.log("Successfully marked as heard:", newData);
          setIsMarkedAsHeard(true); // Update state after successful marking
        }
      } catch (error) {
        console.error("Error marking as heard:", error);
      }
    };

    if (userId && chapterId && !isMarkedAsHeard) {
      markAsHeard(userId, chapterId);
    }
  }, [userId, chapterId, isMarkedAsHeard]);

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
