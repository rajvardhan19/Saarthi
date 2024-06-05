import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "./supabaseClient";

const PdfViewer = ({ selectedLanguage, userId }) => {
  const { chapterId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      const filename =
        selectedLanguage === "english"
          ? `chapter${chapterId}.pdf`
          : `${selectedLanguage}chapter${chapterId}.pdf`;

      const { data, error } = await supabase.storage
        .from("books")
        .getPublicUrl(filename);

      if (error) {
        console.error("Error fetching PDF URL:", error);
      } else {
        setPdfUrl(data.publicUrl);
      }
    };

    fetchPdfUrl();
  }, [chapterId, selectedLanguage]);

  useEffect(() => {
    const markAsRead = async (userId, chapterId) => {
      try {
        const { data: recentReadData, error: recentReadError } = await supabase
          .from("recently_read")
          .select("*")
          .eq("user_id", userId)
          .order("last_read", { ascending: false })
          .limit(1);

        if (recentReadError) {
          console.error("Error checking recently read:", recentReadError);
          return;
        }

        if (
          recentReadData.length > 0 &&
          recentReadData[0].chapter_id === chapterId
        ) {
          return;
        }

        const { data, error } = await supabase
          .from("recently_read")
          .insert([{ user_id: userId, chapter_id: chapterId }], {
            onConflict: ["user_id", "chapter_id"],
          });

        if (error) {
          if (error.code === "23505") {
            // Unique constraint violation error
            console.log("Chapter already marked as read.");
          } else {
            console.error("Error marking as read:", error);
          }
        }
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    };

    if (userId && chapterId) {
      markAsRead(userId, chapterId);
    }
  }, [userId, chapterId]);

  if (!pdfUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pdf-viewer">
      <iframe src={pdfUrl} width="80%" height="600px" />
    </div>
  );
};

export default PdfViewer;
