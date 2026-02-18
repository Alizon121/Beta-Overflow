import React, { useState } from "react";
import "./ChatWidget.css";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message
        })
      });

      const data = await res.json();
      setResponse(data.response);

    } catch (err) {
      setResponse("Error contacting AI.");
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setMessage("");
    setResponse("");
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chat-button" onClick={toggleChat}>
        💬
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">

          <div className="chat-header">
            Climbing AI Assistant
            <button onClick={handleCancel}>✕</button>
          </div>

          <div className="chat-body">

            {response && (
              <div className="chat-response">
                {response}
              </div>
            )}

            {loading && <div>Thinking...</div>}

          </div>

          <div className="chat-footer">

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a climbing question..."
            />

            <div className="chat-actions">
              <button onClick={handleSubmit}>
                Ask
              </button>

              <button onClick={handleCancel}>
                Cancel
              </button>
            </div>

          </div>

        </div>
      )}
    </>
  );
}