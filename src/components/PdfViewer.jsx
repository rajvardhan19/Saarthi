import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "./supabaseClient";

const PdfViewer = () => {
  const { chapterId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("pdf_url")
        .eq("id", chapterId)
        .single();

      if (error) {
        console.error("Error fetching PDF URL:", error);
      } else {
        setPdfUrl(data.pdf_url);
      }
    };

    fetchPdfUrl();
  }, [chapterId]);

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
