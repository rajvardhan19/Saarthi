import React from "react";

const Chatbot = () => {
  return (
    <div className="chatbot">
      <div className="chatbot-messages">
        {/* Messages will be displayed here */}
      </div>
      <div className="chatbot-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
