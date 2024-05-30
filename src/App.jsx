import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Chatbot from "./components/Chatbot";
import AudioBook from "./components/AudioBook";
import PdfViewer from "./components/PdfViewer";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Header />
          <Routes>
            <Route path="/read-chapters" element={<MainContent />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/audiobook" element={<AudioBook />} />
            <Route path="/chapter/:chapterId" element={<PdfViewer />} />
            <Route path="/" element={<MainContent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
