import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "./supabaseClient";

const PdfViewer = ({ selectedLanguage }) => {
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
