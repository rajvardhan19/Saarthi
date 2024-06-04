import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import PdfViewer from "./components/PdfViewer";
import AudioBook from "./components/AudioBook";
import Chatbot from "./components/Chatbot";
import AudioPlayer from "./components/AudioPlayer";
import SearchPage from "./components/SearchPage";
import SearchPageAudiobook from "./components/SearchPageAudiobook";
import "./App.css";

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Header
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/read-chapters" element={<MainContent />} />
            <Route
              path="/chapter/:chapterId"
              element={<PdfViewer selectedLanguage={selectedLanguage} />}
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route
              path="/audiobook"
              element={<AudioBook selectedLanguage={selectedLanguage} />}
            />
            <Route
              path="/audio/:chapterId"
              element={<AudioPlayer selectedLanguage={selectedLanguage} />}
            />
            <Route
              path="/search-audiobook"
              element={
                <SearchPageAudiobook selectedLanguage={selectedLanguage} />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
