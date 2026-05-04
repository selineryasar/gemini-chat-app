// components/ChatWindow.jsx
import "./styles/chatwindow.css";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  User,
  Volume2,
} from "lucide-react";

// ChatWindow Component
function ChatWindow({
  messages,
  input,
  setInput,
  sendMessage,
  isLoading,
  isTyping,
  darkMode,
  toggleSidebar,
}) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const speakMessage = (text) => {
    if ("speechSynthesis" in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "tr-TR";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    } else {
      alert("Tarayıcınız ses sentezini desteklemiyor.");
    }
  };

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "tr-TR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Ses kaydı başladı...");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Ses tanıma hatası:", event.error);
      };

      recognition.start();
    } else {
      alert("Tarayıcınız ses tanımayı desteklemiyor.");
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-left">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <MessageSquare size={20} />
          </button>
          <div className="chat-info">
            <div className="ai-avatar">
              <Bot size={20} />
            </div>
            <div className="ai-details">
              <h2 className="ai-name"> AI Assistant</h2>
              <p className="ai-status">
                {isLoading
                  ? "Yazıyor..."
                  : isTyping
                  ? "Düşünüyor..."
                  : "Çevrimiçi"}
              </p>
            </div>
          </div>
        </div>
        <div className="status-badge">Aktif</div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <Sparkles size={48} />
            </div>
            <h3 className="welcome-title">Merhaba! 👋</h3>
            <p className="welcome-text">
              Ben AI asistanınızım. Size nasıl yardımcı olabilirim?
            </p>
            <div className="welcome-suggestions">
              <button
                className="suggestion-btn"
                onClick={() => setInput("Merhaba! Kendini tanıtır mısın?")}
              >
                Kendini tanıt
              </button>
              <button
                className="suggestion-btn"
                onClick={() => setInput("Bana nasıl yardımcı olabilirsin?")}
              >
                Nasıl yardım edebilirsin?
              </button>
              <button
                className="suggestion-btn"
                onClick={() => setInput("Bugün hava nasıl?")}
              >
                Hava durumu
              </button>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
                <div className="message-bubble">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-footer">
                    <span className="message-timestamp">{msg.timestamp}</span>
                    {msg.sender === "gemini" && (
                      <button
                        className="tts-btn"
                        onClick={() => speakMessage(msg.text)}
                        title="Sesli oku"
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper ai">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-bubble loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="loading-text">AI düşünüyor...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="message-input"
            disabled={isLoading}
            rows="1"
            maxLength={4000}
          />
          <div className="input-actions">
            <button
              className="mic-btn"
              onClick={startVoiceInput}
              disabled={isLoading}
              title="Sesli mesaj"
            >
              <Mic size={18} />
            </button>
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              title="Gönder"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        {input.length > 3800 && (
          <div className="character-count">{input.length}/4000</div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
