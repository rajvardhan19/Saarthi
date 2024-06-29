import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import supabase from "./supabaseClient";

const AartiCard = ({ id, title, imageSrc, userId }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      const { data, error } = await supabase
        .from("liked_aartis")
        .select("*")
        .eq("user_id", userId)
        .eq("aarti_id", id);
      if (error) {
        console.error("Error checking if aarti is liked:", error);
      } else {
        setIsLiked(data.length > 0);
      }
    };

    checkIfLiked();
  }, [userId, id]);

  const handleLikeToggle = async (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (isLiked) {
      // Remove like
      const { error } = await supabase
        .from("liked_aartis")
        .delete()
        .eq("user_id", userId)
        .eq("aarti_id", id);
      if (error) {
        console.error("Error removing like:", error);
      } else {
        setIsLiked(false);
      }
    } else {
      // Add like
      const { error } = await supabase.from("liked_aartis").insert([
        {
          user_id: userId,
          aarti_id: id,
        },
      ]);
      if (error) {
        console.error("Error adding like:", error);
      } else {
        setIsLiked(true);
      }
    }
  };

  const handleCardClick = () => {
    navigate(`/aarti/${id}`);
  };

  return (
    <div className="aarti-card" onClick={handleCardClick}>
      <img src={imageSrc} alt={title} className="aarti-image" />
      <div className="aarti-info">
        <div className="aarti-controls">
          <div className="aarti-title">{title}</div>
          <span className="favorite" onClick={handleLikeToggle}>
            {isLiked ? (
              <FaHeart size={20} className="faheart" />
            ) : (
              <CiHeart size={24} className="ciheart" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AartiCard;
