import React, { useState, useEffect } from "react";
import axios from "axios";
import Speech from "speak-tts";
import { marked } from "marked";
import { useLocation } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [isSpeechActive, setIsSpeechActive] = useState(true);

  const location = useLocation();
  const speech = new Speech();

  useEffect(() => {
    const initializeSpeech = async () => {
      if (speech.hasBrowserSupport()) {
        try {
          await speech.init({
            volume: 1,
            lang: "en-IN",
            rate: 1,
            pitch: 1,
            voice: "Google UK English Female",
            splitSentences: true,
          });

          const voices = speech.voices();
          const indianVoice = voices.find((voice) =>
            voice.name.includes("Google UK English Female")
          );
          if (indianVoice) {
            speech.setVoice(indianVoice.name);
          }
          console.log("Speech is ready");
        } catch (error) {
          console.error("An error occurred while initializing speech: ", error);
        }
      }
    };

    if (location.pathname === "/chatbot") {
      initializeSpeech();
      setIsSpeechActive(true);
    } else {
      speech.cancel();
      setIsSpeechActive(false);
    }

    return () => {
      speech.cancel();
      setIsSpeechActive(false);
    };
  }, [location]);

  const cleanText = (text) => {
    return text.replace(/[*_~`]/g, "");
  };

  const handleSendMessage = async (messageText) => {
    const text = messageText || input;
    if (text.trim() === "") return;

    const userMessage = { sender: "user", text: text };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 4000);

    setShowCards(false);

    const enhancedMessage =
      text +
      "\n" +
      " Give me an answer based on the teachings of Bhagvat Geeta. If you were my guru what would you tell me? Also discuss some strategy to navigate through this problem.";

    const payload = {
      contents: [{ parts: [{ text: enhancedMessage }] }],
    };

    setGeneratingAnswer(true);
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD8RnAEmM92lIXKzeYUPI5Lol-IFNqFtDQ`,
        method: "post",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates.length > 0
      ) {
        const geminiMessage = {
          sender: "gemini",
          text: response.data.candidates[0].content.parts[0].text,
        };
        setMessages((prevMessages) => [...prevMessages, geminiMessage]);
        if (isSpeechActive) {
          speech.speak({ text: cleanText(geminiMessage.text) });
        }
      } else {
        throw new Error("No response from Gemini");
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage = "Sorry - Something went wrong. Please try again!";
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "gemini",
          text: errorMessage,
        },
      ]);
      if (isSpeechActive) {
        speech.speak({ text: cleanText(errorMessage) });
      }
    }
    setGeneratingAnswer(false);
    setInput("");
  };

  const handleCardClick = (text) => {
    setInput(text);
    handleSendMessage(text);
  };

  const toggleSpeech = () => {
    setIsSpeechActive(!isSpeechActive);
    if (isSpeechActive) {
      speech.cancel();
    }
  };

  const cardData = [
    "How can I find inner peace?",
    "What is the path to success?",
    "How to deal with failure?",
    "How can I develop resilience?",
  ];

  return (
    <div className="chatbot">
      {rippleActive && <div className="ripple"></div>}
      <div className="chatbot-messages">
        {showCards && (
          <div className="card-container">
            {cardData.map((cardText, index) => (
              <div
                key={index}
                className="card"
                onClick={() => handleCardClick(cardText)}
              >
                <p className="card-text">{cardText}</p>
              </div>
            ))}
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}`}
            dangerouslySetInnerHTML={{
              __html: marked(message.text),
            }}
          ></div>
        ))}
      </div>
      <div className="chatbot-input">
        <div className="textbox">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={generatingAnswer}
          />
        </div>
        <div className="button-container">
          <button
            onClick={() => handleSendMessage()}
            disabled={generatingAnswer}
          >
            {generatingAnswer ? "Sending..." : "Send"}
          </button>
          <button onClick={toggleSpeech}>
            {isSpeechActive ? "Stop Listening" : "Start Listening"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
