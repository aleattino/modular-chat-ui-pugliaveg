import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { ChatSession, Message } from './types';
import { sendMessage, generateChatTitle, extractProfileUpdates } from './services/mistralService';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import SettingsModal from './components/SettingsModal';
import InfoModal from './components/InfoModal';
import { useSettings } from './hooks/useSettings';
import { t } from './i18n';

function maskIncompleteTag(text: string): { display: string; pendingCard: boolean } {
  const tags = ['[MAPS_PREVIEW]', '[COMPARISON]'];
  for (const tag of tags) {
    const tagStart = text.lastIndexOf(tag);
    if (tagStart === -1) continue;
    const afterTag = text.indexOf('{', tagStart + tag.length);
    if (afterTag === -1) return { display: text.substring(0, tagStart), pendingCard: true };
    let braces = 0;
    let inString = false;
    let escape = false;
    for (let i = afterTag; i < text.length; i++) {
      const c = text[i];
      if (escape) { escape = false; continue; }
      if (c === '\\') { escape = true; continue; }
      if (c === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (c === '{') braces++;
      else if (c === '}') { braces--; if (braces === 0) { braces = -1; break; } }
    }
    if (braces !== -1) return { display: text.substring(0, tagStart), pendingCard: true };
  }
  return { display: text, pendingCard: false };
}

const App: React.FC = () => {
  const { settings, profile, updateProfile } = useSettings();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('chatbot-chats');
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        if (Array.isArray(parsedChats) && parsedChats.length > 0) {
          setChats(parsedChats);
          setActiveChatId(parsedChats[0].id);
        } else {
          handleNewChat(true);
        }
      } else {
        handleNewChat(true);
      }
    } catch (error) {
      console.error("Errore caricamento chat:", error);
      handleNewChat(true);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem('chatbot-chats', JSON.stringify(chats));
    }
  }, [chats, isInitializing]);
  
  const activeChat = useMemo(() => {
    return chats.find(chat => chat.id === activeChatId) || null;
  }, [chats, activeChatId]);

  const activeChatIdRef = useRef(activeChatId);
  activeChatIdRef.current = activeChatId;

  const handleNewChat = useCallback((isInitial = false) => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: t('newChatTitle', settings.language),
      messages: [],
    };
    setChats(prev => [newChat, ...(isInitial ? [] : prev)]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
  }, [settings.language]);

  const handleDeleteChats = () => {
    setChats([]);
    setActiveChatId(null);
    setTimeout(() => handleNewChat(true), 0);
  };
  
  const handleDeleteSingleChat = (chatIdToDelete: string) => {
    const chatToDeleteIndex = chats.findIndex(c => c.id === chatIdToDelete);
    if (chatToDeleteIndex === -1) return;

    const newChats = chats.filter(c => c.id !== chatIdToDelete);
    setChats(newChats);

    if (activeChatId === chatIdToDelete) {
      if (newChats.length > 0) {
        const newIndex = Math.min(chatToDeleteIndex, newChats.length - 1);
        setActiveChatId(newChats[newIndex].id);
      } else {
        setTimeout(() => handleNewChat(true), 0);
      }
    }
  };


  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, title: newTitle } : chat));
    setEditingChatId(null);
  };

  const handleSend = async (input: string) => {
    if (!input.trim() || isLoading || !activeChatId || !activeChat) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    };

    const isFirstUserMessage = activeChat.messages.filter(m => m.role === 'user').length === 0;

    const updatedMessages = [...activeChat.messages, userMessage];
    const updatedChat = { ...activeChat, messages: updatedMessages };

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId ? updatedChat : chat
      )
    );
    setIsLoading(true);

    if (isFirstUserMessage) {
      const chatIdAtSend = activeChatId;
      generateChatTitle(input, settings.language).then(title => {
        if (activeChatIdRef.current === chatIdAtSend) {
          setChats(prev =>
            prev.map(chat =>
              chat.id === chatIdAtSend ? { ...chat, title } : chat
            )
          );
        }
      });
    }
    
    const modelMessageId = `model-${Date.now()}`;
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, { id: modelMessageId, role: 'model', content: '' }] }
          : chat
      )
    );

    try {
      const profileUpdates = extractProfileUpdates(input, profile);
      updateProfile({
        ...profileUpdates,
        interactionCount: profile.interactionCount + 1,
        lastSessionDate: new Date().toISOString(),
      });

      const stream = await sendMessage(updatedMessages, input, settings, profile);
      const reader = stream.getReader();
      
      let content = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        content += value;

        const { display, pendingCard } = maskIncompleteTag(content);
        setChats(prev =>
          prev.map(c =>
            c.id === activeChatId
              ? {
                  ...c,
                  messages: c.messages.map(msg =>
                    msg.id === modelMessageId ? { ...msg, content: display, pendingCard } : msg
                  ),
                }
              : c
          )
        );
      }
      setChats(prev =>
        prev.map(c =>
          c.id === activeChatId
            ? {
                ...c,
                messages: c.messages.map(msg =>
                  msg.id === modelMessageId ? { ...msg, content, pendingCard: false } : msg
                ),
              }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      const errorMessage = t('errorMessage', settings.language);
       setChats(prev =>
          prev.map(c =>
            c.id === activeChatId
              ? {
                  ...c,
                  messages: c.messages.map(msg =>
                    msg.id === modelMessageId ? { ...msg, content: errorMessage } : msg
                  ),
                }
              : c
          )
        );
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#f4f3ee] dark:bg-gray-800"></div>;
  }

  return (
    <div className="h-screen w-screen text-[#333] flex font-sans overflow-hidden dark:text-gray-100">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        editingChatId={editingChatId}
        onNewChat={() => handleNewChat(false)}
        onSelectChat={setActiveChatId}
        onStartRename={setEditingChatId}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteSingleChat}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenInfo={() => setIsInfoModalOpen(true)}
      />
      <ChatView
        chat={activeChat}
        onSend={handleSend}
        isLoading={isLoading}
        onMenuClick={() => setSidebarOpen(prev => !prev)}
        language={settings.language}
      />
      {isSettingsModalOpen && (
        <SettingsModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            onDelete={handleDeleteChats}
        />
      )}
      {isInfoModalOpen && (
        <InfoModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            language={settings.language}
        />
      )}
    </div>
  );
};

export default App;