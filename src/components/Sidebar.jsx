import "./styles/sidebar.css";
import React, { useState } from "react";
import {
  Sparkles,
  Sun,
  Moon,
  Plus,
  MessageSquare,
  Edit3,
  Trash2,
} from "lucide-react";

function Sidebar({
  conversations,
  onNewChat,
  onSelect,
  onDelete,
  onEdit,
  activeIndex,
  darkMode,
  setDarkMode,
  isOpen,
  toggleSidebar,
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const handleEditSubmit = (index) => {
    if (newTitle.trim()) {
      onEdit(index, newTitle.trim());
    }
    setEditIndex(null);
    setNewTitle("");
  };

  const startEdit = (index, e) => {
    e.stopPropagation();
    setEditIndex(index);
    setNewTitle(conversations[index].title);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEditSubmit(editIndex);
    } else if (e.key === "Escape") {
      setEditIndex(null);
      setNewTitle("");
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="sidebar-content">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <Sparkles size={20} />
            </div>
            <h1 className="brand-title">AI Chat</h1>
          </div>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* New Chat Button */}
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={16} />
          Yeni Sohbet
        </button>

        {/* Conversations List */}
        <div className="conversations-container">
          {conversations.map((conv, index) => (
            <div
              key={index}
              className={`conversation-item ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => onSelect(index)}
            >
              {editIndex === index ? (
                <div
                  className="edit-section"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="edit-input"
                    placeholder="Sohbet başlığı..."
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSubmit(index)}
                    className="save-btn"
                  >
                    Kaydet
                  </button>
                </div>
              ) : (
                <div className="conversation-content">
                  <div className="conversation-main">
                    <MessageSquare size={16} className="conversation-icon" />
                    <span className="conversation-title">{conv.title}</span>
                  </div>
                  <div className="conversation-actions">
                    <button
                      onClick={(e) => startEdit(index, e)}
                      className="action-btn edit-btn"
                      title="Düzenle"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(index);
                      }}
                      className="action-btn delete-btn"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="empty-conversations">
              <p>Henüz sohbet yok</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
