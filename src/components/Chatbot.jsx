import React, { useState, useEffect } from "react";
import axios from "axios";
import Speech from "speak-tts";
import { marked } from "marked";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [isSpeechActive, setIsSpeechActive] = useState(true); // New state for toggling speech

  const speech = new Speech();
  useEffect(() => {
    if (speech.hasBrowserSupport()) {
      speech
        .init({
          volume: 1,
          lang: "en-IN",
          rate: 1,
          pitch: 1,
          voice: "Google UK English Female", // Adjust the voice name to an Indian English option if available
          splitSentences: true,
        })
        .then((data) => {
          console.log("Speech is ready", data);
          // You may need to find the exact name of the Indian English voice available in the browser
          const voices = speech.voices();
          const indianVoice = voices.find(
            (voice) => voice.name.includes("Google UK English Female") // Adjust as needed
          );
          if (indianVoice) {
            speech.setVoice(indianVoice.name);
          }
        })
        .catch((e) => {
          console.error("An error occurred while initializing: ", e);
        });
    }
  }, []);

  const handleSendMessage = async (messageText) => {
    const text = messageText || input;
    if (text.trim() === "") return;

    // Add the user's message to the message list
    const userMessage = { sender: "user", text: text };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Trigger ripple effect
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 4000); // Adjust timing to match animation duration

    // Hide the card container
    setShowCards(false);

    // Prepare the message to be sent to Gemini
    const enhancedMessage =
      text +
      "\n" +
      " Give me an answer based on the teachings of Bhagvat Geeta. If you were my guru what would you tell me? Also discuss some strategy to navigate through this problem.";

    // Define the request payload
    const payload = {
      contents: [{ parts: [{ text: enhancedMessage }] }],
    };

    // Make a request to Gemini
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
        // Add Gemini's response to the message list
        setMessages((prevMessages) => [...prevMessages, geminiMessage]);
        // Read the response aloud if speech is active
        if (isSpeechActive) {
          speech.speak({ text: geminiMessage.text });
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
      // Read the error message aloud if speech is active
      if (isSpeechActive) {
        speech.speak({ text: errorMessage });
      }
    }
    setGeneratingAnswer(false);
    // Clear the input field
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
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={generatingAnswer}
        />
        <button onClick={() => handleSendMessage()} disabled={generatingAnswer}>
          {generatingAnswer ? "Sending..." : "Send"}
        </button>
        <button onClick={toggleSpeech}>
          {isSpeechActive ? "Stop Listening" : "Start Listening"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
