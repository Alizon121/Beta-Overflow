import { useState } from "react";
import "./ChatWidget.css";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  
  const toggleChat = () => {
      setIsOpen(!isOpen);
    };
    
  const handleSubmit = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");

    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          conversation_id: conversationId
        })
      });

      const data = await res.json();
      setConversationId(data.conversation_id);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.reply
        }
      ]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error contacting AI." }
      ]);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setMessage("");
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
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={
                        msg.role === "user"
                        ? "chat-bubble user"
                        : "chat-bubble assistant"
                    }
                    >
                    {msg.content}
                </div>
            ))}
            {loading && <div className="chat-bubble assistant">Thinking...</div>}
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