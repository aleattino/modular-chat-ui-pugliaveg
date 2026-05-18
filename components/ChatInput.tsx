import React, { useState, useRef } from 'react';
import SendIcon from './icons/SendIcon';
import { t } from '../i18n';
import { Language } from '../types';


interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  language: Language;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, language }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const submit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="flex-shrink-0 p-2 sm:p-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
      <form onSubmit={handleSubmit} className="flex items-end gap-2 w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-1.5 sm:p-2 border border-gray-200 dark:border-gray-700 focus-within:border-[#b5c589] focus-within:ring-2 focus-within:ring-[#b5c589]/20 transition-colors duration-150">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={handleInput}
          placeholder={t('askAssistant', language)}
          disabled={isLoading}
          className="flex-1 w-full px-3 py-2 sm:py-2.5 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none disabled:opacity-60 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none max-h-32 overflow-y-auto text-sm sm:text-base"
          style={{ lineHeight: '1.4rem' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex-shrink-0 p-2.5 sm:p-3 bg-[#465E32] text-white rounded-lg hover:bg-[#3a4f28] focus:outline-none focus:ring-2 focus:ring-[#465E32]/30 transition-colors duration-150 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          aria-label={t('sendMessage', language)}
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
