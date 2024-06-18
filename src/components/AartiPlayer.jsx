import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import supabase from "./supabaseClient";

const AartiPlayer = ({ selectedLanguage }) => {
  const { aartiId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aarti, setAarti] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [aartis, setAartis] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Determine the table name based on selected language
  const getTableName = () => {
    switch (selectedLanguage) {
      case "hindi":
        return "hindi_aartis";
      case "marathi":
        return "marathi_aartis";
      default:
        return "aartis";
    }
  };

  // Fetch aartis based on selected language
  useEffect(() => {
    const fetchAartis = async () => {
      const tableName = getTableName();

      const { data, error } = await supabase.from(tableName).select("*");
      if (error) {
        console.error("Error fetching aartis:", error);
      } else {
        setAartis(data);
      }
    };

    fetchAartis();
  }, [selectedLanguage]);

  // Fetch specific aarti based on aartiId and selected language
  useEffect(() => {
    const fetchAarti = async () => {
      if (!aartis.length) return;

      const tableName = getTableName();

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", aartiId)
        .single();
      if (error) {
        console.error("Error fetching aarti:", error);
      } else {
        setAarti(data);
        setAudioUrl(data.aarti_url);

        const index = aartis.findIndex((a) => a.id === data.id);
        setCurrentIndex(index);
      }
    };

    fetchAarti();
  }, [aartiId, aartis, selectedLanguage]);

  // Update audio source when audioUrl changes
  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  // Control play/pause state of audio
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
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

  const handleSeek = (event) => {
    const newTime = (event.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const previousAarti = aartis[currentIndex - 1];
      navigate(`/aarti/${previousAarti.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < aartis.length - 1) {
      const nextAarti = aartis[currentIndex + 1];
      navigate(`/aarti/${nextAarti.id}`);
    }
  };

  if (!audioUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div className="audio-player">
      <img
        src={aarti?.aarti_image_url}
        alt={aarti?.title}
        className="aarti-image-audio-player"
      />
      <h2>
        <center>{aarti?.title}</center>
      </h2>
      <audio ref={audioRef} />
      <div className="controls">
        <button onClick={handlePrevious} disabled={currentIndex <= 0}>
          <FaStepBackward size={30} />
        </button>
        <button onClick={handlePlayPause}>
          {isPlaying ? <FaPause size={30} /> : <FaPlay size={30} />}
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= aartis.length - 1}
        >
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

export default AartiPlayer;
