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
      const { data, error } = await supabase
        .from("aartis")
        .select("*")
        .eq("id", aartiId)
        .single();
      if (error) {
        console.error("Error fetching aarti:", error);
      } else {
        setAarti(data);
        const publicUrl = data.aarti_url;
        setAudioUrl(publicUrl);
        const index = aartis.findIndex((aarti) => aarti.id === data.id);
        setCurrentIndex(index);
      }
    };
    fetchAarti();
  }, [aartiId, aartis]);

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
      setIsPlaying(false);
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
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });
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

  useEffect(() => {
    // Register service worker for background playback
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

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
