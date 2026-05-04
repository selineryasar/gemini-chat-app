// src/hooks/useChat.js
import { useState, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiApi';
import { saveToLocalStorage, getFromLocalStorage } from '../services/localStorage';
import { simulateTyping } from '../utils/typingSimulator';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Uygulama yüklendiğinde sohbetleri localStorage'dan geri yükle
  useEffect(() => {
    const savedConversations = getFromLocalStorage('conversations');
    if (savedConversations) {
      setConversations(savedConversations);
    }
  }, []);

  // Sohbet listesini localStorage'a kaydetme fonksiyonu
  const updateAndSaveConversations = (updatedConversations) => {
    setConversations(updatedConversations);
    saveToLocalStorage('conversations', updatedConversations);
  };

  // Mesaj gönderme fonksiyonu
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      id: Date.now()
    };
    
    const currentInput = input.trim();
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true); // Gemini cevabı yüklenirken yazıyor efektini başlat

    try {
      const geminiAnswer = await getGeminiResponse(currentInput);
      
      // Yazma efektini simüle et
      await simulateTyping(geminiAnswer, (responseText) => {
        const geminiMessage = {
          text: responseText,
          sender: 'gemini',
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          id: Date.now() + 1
        };
        setMessages(prev => [...prev, geminiMessage]);
      });

    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      const errorMessage = {
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        sender: 'system',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false); // Yazma efektini bitir
    }
  };

  // Yeni sohbet başlatma fonksiyonu
  const handleNewChat = () => {
    if (messages.length > 0) {
      const userMessages = messages.filter(m => m.sender === 'user');
      const title = userMessages.length > 0 
        ? userMessages[0].text.slice(0, 30) + (userMessages[0].text.length > 30 ? '...' : '')
        : 'Yeni Sohbet';
      
      const updated = [...conversations, { 
        title, 
        history: messages, 
        id: Date.now(),
        createdAt: new Date().toISOString()
      }];
      updateAndSaveConversations(updated);
    }
    setMessages([]);
    setActiveChatIndex(null);
  };

  // Geçmiş bir sohbeti yükleme fonksiyonu
  const loadConversation = (index) => {
    if (conversations[index] && conversations[index].history) {
      setMessages(conversations[index].history);
      setActiveChatIndex(index);
    }
  };

  // Bir sohbeti silme fonksiyonu
  const deleteConversation = (index) => {
    const updated = conversations.filter((_, i) => i !== index);
    updateAndSaveConversations(updated);
    
    if (activeChatIndex === index) {
      setMessages([]);
      setActiveChatIndex(null);
    } else if (activeChatIndex > index) {
      setActiveChatIndex(activeChatIndex - 1);
    }
  };

  // Sohbet başlığını düzenleme fonksiyonu
  const editConversationTitle = (index, newTitle) => {
    if (newTitle.trim() && conversations[index]) {
      const updated = [...conversations];
      updated[index].title = newTitle.trim();
      updated[index].updatedAt = new Date().toISOString();
      updateAndSaveConversations(updated);
    }
  };

  return {
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
    editConversationTitle
  };
};
