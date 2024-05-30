// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import PdfViewer from "./components/PdfViewer";
import AudioBook from "./components/AudioBook";
import Chatbot from "./components/Chatbot";
import AudioPlayer from "./components/AudioPlayer";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Header />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/read-chapters" element={<MainContent />} />
            <Route path="/chapter/:chapterId" element={<PdfViewer />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/audiobook" element={<AudioBook />} />
            <Route path="/audio/:chapterId" element={<AudioPlayer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
