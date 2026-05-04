// App.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

// Kendi oluşturduğumuz custom hook'ları içeri aktarıyoruz
import { useChat } from "./hooks/useChat";
import { useTheme } from "./hooks/useTheme";
import { useResponsive } from "./hooks/useResponsive";

function App() {
  // Tüm chat mantığı tek bir hook'tan geliyor
  const {
    messages,
    input,
    setInput,
    isLoading,
    isTyping,
    conversations,
    activeChatIndex,
    sendMessage,
    handleNewChat,
    loadConversation,
    deleteConversation,
    editConversationTitle,
  } = useChat();

  // Tema yönetimi tek bir hook'tan geliyor
  const { darkMode, toggleTheme } = useTheme();

  // Duyarlı (responsive) tasarım mantığı tek bir hook'tan geliyor
  const { sidebarOpen, toggleSidebar } = useResponsive();

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        onNewChat={handleNewChat}
        onSelect={loadConversation}
        onDelete={deleteConversation}
        onEdit={editConversationTitle}
        activeIndex={activeChatIndex}
        darkMode={darkMode}
        setDarkMode={toggleTheme}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <ChatWindow
        messages={messages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        isLoading={isLoading}
        isTyping={isTyping}
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
      />
    </div>
  );
}

export default App;
