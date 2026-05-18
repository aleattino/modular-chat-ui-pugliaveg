import React from 'react';
import type { ChatSession, Language } from '../types';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import QuickSuggestions from './QuickSuggestions';
import MenuIcon from './icons/MenuIcon';
import { t } from '../i18n';

interface ChatViewProps {
  chat: ChatSession | null;
  onSend: (message: string) => void;
  isLoading: boolean;
  onMenuClick: () => void;
  language: Language;
}

const ChatView: React.FC<ChatViewProps> = ({ chat, onSend, isLoading, onMenuClick, language }) => {
  return (
    <main className="flex-1 flex flex-col bg-[#f4f3ee] dark:bg-gray-900 overflow-hidden">
      <header className="flex-shrink-0 flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <button 
          onClick={onMenuClick} 
          className="p-2 text-[#6a7f4a] dark:text-[#b5c589] lg:hidden rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label={t('menuToggle', language)}
        >
          <MenuIcon />
        </button>

        <div className="flex items-center gap-2 flex-1 justify-center lg:justify-start px-2 min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#465E32] dark:text-[#b5c589] truncate">
            {chat?.title || t('assistantName', language)}
          </h1>
          {isLoading && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#465E32]/10 text-[#465E32] dark:text-[#b5c589]">
              ...
            </span>
          )}
        </div>
        <div className="w-10 lg:hidden"></div>
      </header>

      {chat ? (
        <>
          {chat.messages.length === 0 ? (
            <div className="flex-1 overflow-y-auto">
              <QuickSuggestions onSuggestionClick={onSend} language={language} />
            </div>
          ) : (
            <ChatWindow messages={chat.messages} isLoading={isLoading} />
          )}
          <ChatInput onSend={onSend} isLoading={isLoading} language={language} />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">{t('selectOrCreateChat', language)}</p>
        </div>
      )}
    </main>
  );
};

export default ChatView;
