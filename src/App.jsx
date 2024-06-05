import React, { useState, useEffect } from "react";
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
import Liked from "./components/Liked";
import AuthModal from "./components/AuthModal";
import supabase from "./components/supabaseClient";
import "./App.css";

const markAsRead = async (userId, chapterId) => {
  const { error } = await supabase
    .from("recently_read")
    .insert([{ user_id: userId, chapter_id: chapterId }]);

  if (error) {
    console.error("Error marking as read:", error);
  }
};

const markAsHeard = async (userId, chapterId) => {
  const { error } = await supabase
    .from("recently_heard")
    .insert([{ user_id: userId, chapter_id: chapterId }]);

  if (error) {
    console.error("Error marking as heard:", error);
  }
};

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProtectedAction = () => {
    if (!session) {
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar onProtectedAction={handleProtectedAction} session={session} />
        <div className="main">
          <Header
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onProtectedAction={handleProtectedAction}
            session={session}
            onLogout={handleLogout}
          />
          <Routes>
            <Route
              path="/"
              element={
                <MainContent
                  onProtectedAction={handleProtectedAction}
                  userId={session?.user?.id}
                />
              }
            />
            <Route
              path="/read-chapters"
              element={
                <MainContent
                  onProtectedAction={handleProtectedAction}
                  userId={session?.user?.id}
                />
              }
            />
            <Route
              path="/chapter/:chapterId"
              element={
                <PdfViewer
                  selectedLanguage={selectedLanguage}
                  onProtectedAction={handleProtectedAction}
                  userId={session?.user?.id}
                  markAsRead={markAsRead}
                />
              }
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route
              path="/audiobook"
              element={
                <AudioBook
                  selectedLanguage={selectedLanguage}
                  onProtectedAction={handleProtectedAction}
                  userId={session?.user?.id}
                />
              }
            />
            <Route
              path="/audio/:chapterId"
              element={
                <AudioPlayer
                  selectedLanguage={selectedLanguage}
                  onProtectedAction={handleProtectedAction}
                  userId={session?.user?.id}
                  markAsHeard={markAsHeard}
                />
              }
            />
            <Route
              path="/search-audiobook"
              element={
                <SearchPageAudiobook
                  selectedLanguage={selectedLanguage}
                  onProtectedAction={handleProtectedAction}
                />
              }
            />
            <Route
              path="/liked"
              element={
                <Liked
                  onProtectedAction={handleProtectedAction}
                  userId={session?.user?.id}
                />
              }
            />
          </Routes>
        </div>
        {isAuthModalOpen && <AuthModal onClose={handleCloseModal} />}
      </div>
    </Router>
  );
};

export default App;
