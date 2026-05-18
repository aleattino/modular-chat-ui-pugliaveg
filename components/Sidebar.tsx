import React, { useState, useEffect, useRef } from 'react';
import type { ChatSession } from '../types';
import AppHeader from './AppHeader';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import SettingsIcon from './icons/SettingsIcon';
import InfoIcon from './icons/InfoIcon';
import ConfirmDialog from './ConfirmDialog';
import { useSettings } from '../hooks/useSettings';
import { t } from '../i18n';

interface SidebarProps {
  chats: ChatSession[];
  activeChatId: string | null;
  editingChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onStartRename: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  chats, 
  activeChatId, 
  editingChatId,
  onNewChat, 
  onSelectChat, 
  onStartRename,
  onRenameChat,
  onDeleteChat,
  isOpen, 
  setIsOpen,
  onOpenSettings,
  onOpenInfo,
}) => {
  const { settings } = useSettings();
  const language = settings.language;
  const [tempTitle, setTempTitle] = useState('');
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingChatId && inputRef.current) {
      const chat = chats.find(c => c.id === editingChatId);
      setTempTitle(chat?.title || '');
      inputRef.current.focus();
    }
  }, [editingChatId, chats]);

  const handleSelectChat = (id: string) => {
    if (editingChatId !== id) {
      onSelectChat(id);
      setIsOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setChatToDelete(chatId);
  };
  
  const handleConfirmDelete = () => {
    if (chatToDelete) {
      onDeleteChat(chatToDelete);
      setChatToDelete(null);
    }
  };

  const handleRenameSubmit = (id: string) => {
    if (tempTitle.trim()) {
      onRenameChat(id, tempTitle.trim());
    }
    onStartRename('');
  };
  
  const handleStartRename = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onStartRename(chatId);
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/60 z-10 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={`fixed lg:static top-0 left-0 h-full w-72 bg-gradient-to-b from-[#6a7f4a] to-[#5a6f3a] dark:from-gray-800 dark:to-gray-900 text-white flex flex-col transition-transform duration-150 ease-out z-20 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-white/10 dark:border-white/5">
          <AppHeader onInfoClick={onOpenInfo} />
        </div>
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium bg-[#465E32] text-white hover:bg-[#3a4f28] transition-colors duration-150 shadow-sm border border-[#3a4f28]/30"
          >
            <PlusIcon />
            {t('newChat', language)}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20">
          {chats.map(chat => (
            <div 
                key={chat.id}
                className={`group flex items-center justify-between p-3 rounded-xl transition-colors duration-100 text-left text-sm w-full ${
                  activeChatId === chat.id 
                    ? 'bg-[#b5c589] text-black font-semibold shadow-sm border border-[#a5b579]' 
                    : 'hover:bg-white/10 dark:hover:bg-white/5 border border-transparent'
                }`}
            >
              {editingChatId === chat.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => handleRenameSubmit(chat.id)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit(chat.id);
                    if (e.key === 'Escape') onStartRename('');
                  }}
                  className="w-full bg-white/20 dark:bg-white/10 text-white focus:outline-none rounded-xl px-2 py-1 font-medium"
                />
              ) : (
                <>
                  <div
                    onClick={() => handleSelectChat(chat.id)}
                    className="flex-1 truncate cursor-pointer py-1"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectChat(chat.id) }}
                  >
                    {chat.title}
                  </div>
                  <div className="flex items-center flex-shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                    <button
                        onClick={(e) => handleStartRename(e, chat.id)}
                        className="p-1.5 rounded-md hover:bg-white/20 dark:hover:bg-white/10 transition-colors duration-150"
                        aria-label={t('renameChat', language)}
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => handleDelete(e, chat.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/20 transition-colors duration-150"
                        aria-label={t('deleteChat', language)}
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 dark:border-white/5">
            <button
                onClick={onOpenSettings}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-150 border border-transparent hover:border-white/20"
            >
                <SettingsIcon />
                {t('settings', language)}
            </button>
        </div>
      </aside>
      
      <ConfirmDialog
        isOpen={chatToDelete !== null}
        title={t('deleteSingleChatTitle', language)}
        message={t('deleteSingleChatConfirmation', language)}
        confirmLabel={t('delete', language)}
        cancelLabel={t('cancel', language)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setChatToDelete(null)}
        variant="danger"
      />
    </>
  );
};

export default Sidebar;