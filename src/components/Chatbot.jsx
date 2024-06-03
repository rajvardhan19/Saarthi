import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Add the user's message to the message list
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    // Prepare the message to be sent to Gemini
    const enhancedMessage =
      input +
      "\n" +
      " Give me an answer based on the teachings of Bhagvat Geeta. If you were my guru what would you tell me?";

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
      } else {
        throw new Error("No response from Gemini");
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "gemini",
          text: "Sorry - Something went wrong. Please try again!",
        },
      ]);
    }
    setGeneratingAnswer(false);
    // Clear the input field
    setInput("");
  };

  return (
    <div className="chatbot">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
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
        <button onClick={handleSendMessage} disabled={generatingAnswer}>
          {generatingAnswer ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
