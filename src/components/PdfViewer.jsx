import React from "react";
import { useParams } from "react-router-dom";

const PDFViewer = () => {
  const { chapterId } = useParams();
  const pdfFile = `/chapter${chapterId}.pdf`;

  return (
    <div>
      <iframe src={pdfFile} width="80%" height="600px" />
    </div>
  );
};

export default PDFViewer;
