import React, { useState } from "react";
import axios from "axios";
import Model from "./Model";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpeechSynthesis } from "react-speech-kit";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const { speak } = useSpeechSynthesis();

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Add the user's message to the message list
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    // Prepare the message to be sent to Gemini
    const enhancedMessage =
      input +
      "\n" +
      " Give me an answer based on the teachings of Bhagvat Geeta. If you were my guru what would you tell me? Please give response in paragraph form.";

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
        // Read the response aloud
        speak({ text: geminiMessage.text });
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
      // Read the error message aloud
      speak({ text: errorMessage });
    }
    setGeneratingAnswer(false);
    // Clear the input field
    setInput("");
  };

  return (
    <div className="chatbot">
      <div className="chatbot-messages">
        <div style={{ width: "20vw", height: "50vh" }}>
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <ambientLight intensity={2} />
            <directionalLight position={[0, 5, 5]} />
            <Model path="/Krishna.glb" />
            <OrbitControls minDistance={9} maxDistance={9} enableZoom={false} />
          </Canvas>
        </div>
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
