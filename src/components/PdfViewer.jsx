import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "./supabaseClient";
import Loader from "./Loader";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = ({ selectedLanguage, userId }) => {
  const { chapterId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isMarkedAsRead, setIsMarkedAsRead] = useState(false);

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
        console.log(`Marking chapter ${chapterId} as read for user ${userId}`);

        const { data: existingEntries, error: fetchError } = await supabase
          .from("recently_read")
          .select("*")
          .eq("user_id", userId)
          .eq("chapter_id", chapterId);

        if (fetchError) {
          console.error("Error fetching existing entries:", fetchError);
          return;
        }

        if (existingEntries.length > 0) {
          const { error: deleteError } = await supabase
            .from("recently_read")
            .delete()
            .eq("user_id", userId)
            .eq("chapter_id", chapterId);

          if (deleteError) {
            console.error("Error deleting existing entry:", deleteError);
            return;
          }
        }

        const { data: newData, error: insertError } = await supabase
          .from("recently_read")
          .insert([
            {
              user_id: userId,
              chapter_id: chapterId,
              last_read: new Date().toISOString(),
            },
          ]);

        if (insertError) {
          console.error("Error inserting new entry:", insertError);
        } else {
          console.log("Successfully marked as read:", newData);
          setIsMarkedAsRead(true);
        }
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    };

    if (userId && chapterId && !isMarkedAsRead) {
      markAsRead(userId, chapterId);
    }
  }, [userId, chapterId, isMarkedAsRead]);

  if (!pdfUrl) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
      >
        <Viewer fileUrl={pdfUrl} />
      </Worker>
    </div>
  );
};

export default PdfViewer;
