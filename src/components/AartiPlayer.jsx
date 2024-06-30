import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import supabase from "./supabaseClient";
import Loader from "./Loader";

const AartiPlayer = ({ userId }) => {
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

  useEffect(() => {
    const fetchAartis = async () => {
      const { data, error } = await supabase.from("aartis").select("*");
      if (error) {
        console.error("Error fetching aartis:", error);
      } else {
        setAartis(data);
      }
    };
    fetchAartis();
  }, []);

  useEffect(() => {
    const fetchAarti = async () => {
      console.log("Fetching aarti with id:", aartiId);
      const { data, error } = await supabase
        .from("aartis")
        .select("*")
        .eq("id", aartiId)
        .single();
      if (error) {
        console.error("Error fetching aarti:", error);
      } else {
        console.log("Fetched aarti:", data);
        setAarti(data);
        const publicUrl = data.aarti_url;
        console.log("Fetched audio URL:", publicUrl);
        setAudioUrl(publicUrl);

        // Set currentIndex based on fetched aarti
        const index = aartis.findIndex((aarti) => aarti.id === data.id);
        setCurrentIndex(index);
      }
    };
    fetchAarti();
  }, [aartiId, aartis]);

  useEffect(() => {
    if (audioUrl) {
      console.log("Setting audio URL:", audioUrl);
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

  useEffect(() => {
    if ("mediaSession" in navigator && aarti?.aarti_image_url) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: aarti?.title,
        artist: "Artist Name",
        album: "Album Name",
        artwork: [
          { src: aarti.aarti_image_url, sizes: "96x96", type: "image/png" },
          { src: aarti.aarti_image_url, sizes: "128x128", type: "image/png" },
          { src: aarti.aarti_image_url, sizes: "192x192", type: "image/png" },
          { src: aarti.aarti_image_url, sizes: "256x256", type: "image/png" },
          { src: aarti.aarti_image_url, sizes: "384x384", type: "image/png" },
          { src: aarti.aarti_image_url, sizes: "512x512", type: "image/png" },
        ],
      });

      navigator.mediaSession.setActionHandler("play", handlePlayPause);
      navigator.mediaSession.setActionHandler("pause", handlePlayPause);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrevious);
      navigator.mediaSession.setActionHandler("nexttrack", handleNext);
    }
  }, [aarti]);

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
      navigate(`/aartis/${previousAarti.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < aartis.length - 1) {
      const nextAarti = aartis[currentIndex + 1];
      navigate(`/aartis/${nextAarti.id}`);
    }
  };

  if (!audioUrl) {
    return (
      <div>
        <Loader />
      </div>
    );
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
