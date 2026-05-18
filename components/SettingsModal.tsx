import React, { useState, useEffect, useRef } from 'react';
import { t } from '../i18n';
import CloseIcon from './icons/CloseIcon';
import TrashIcon from './icons/TrashIcon';
import { Download, Upload } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { useSettings } from '../hooks/useSettings';
import { UserAvatar as UserAvatarType, Settings, UserProfile, ConversationTone } from '../types';
import UserAvatar from './UserAvatar';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onDelete }) => {
  const { settings, profile, updateSettings, updateProfile, exportProfile, importProfile } = useSettings();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'data'>('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSettings(settings);
    setLocalProfile(profile);
  }, [isOpen, settings, profile]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setImportMessage(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    const isMobile = window.innerWidth < 640;
    setTimeout(() => {
      onClose();
    }, isMobile ? 200 : 120);
  };

  const trapRef = useFocusTrap(isOpen && !isClosing, handleClose);

  if (!isOpen && !isClosing) return null;
  
  const handleSave = () => {
    updateSettings(localSettings);
    updateProfile(localProfile);
    handleClose();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const format = file.name.endsWith('.json') ? 'json' : 'txt';
      
      if (format === 'json') {
        const success = importProfile(content, format);
        if (success) {
          setImportMessage({ type: 'success', text: t('profileImported', lang) });
          setTimeout(() => setImportMessage(null), 3000);
        } else {
          setImportMessage({ type: 'error', text: t('profileImportError', lang) });
          setTimeout(() => setImportMessage(null), 3000);
        }
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    handleClose();
  };

  const lang = localSettings.language;
  const avatarOptions: UserAvatarType[] = ['avocado', 'coffee', 'sloth', 'breaking'];

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center sm:p-4 transition-none" 
      onClick={handleClose}
      style={{ 
        animation: isClosing ? 'fadeOut 80ms ease-out' : 'fadeIn 80ms ease-out',
        opacity: isClosing ? 0 : 1
      }}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('settings', lang)}
        className={`bg-[#f4f3ee] dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl flex flex-col h-[92vh] sm:h-[600px] sm:max-h-[95vh] ${isClosing ? 'modal-panel-closing' : 'modal-panel'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 relative p-4 sm:p-5 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="sm:hidden w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-3" />
          <button 
            onClick={handleClose} 
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition-colors duration-150"
            aria-label={t('close', lang)}
          >
            <CloseIcon />
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#465E32] dark:text-[#b5c589] mb-1">{t('settings', lang)}</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('settingsSubtitle', lang)}</p>
        </div>

        <div className="md:hidden flex-shrink-0 bg-gray-50/60 dark:bg-gray-900/30">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-2.5 px-3 text-xs font-medium rounded-lg transition-colors duration-100 ${
                activeTab === 'personal'
                  ? 'bg-white dark:bg-gray-800 text-[#465E32] dark:text-[#b5c589] shadow-sm ring-1 ring-[#465E32]/20 dark:ring-[#b5c589]/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
              }`}
            >
              {t('tabPersonal', lang)}
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 py-2.5 px-3 text-xs font-medium rounded-lg transition-colors duration-100 ${
                activeTab === 'preferences'
                  ? 'bg-white dark:bg-gray-800 text-[#465E32] dark:text-[#b5c589] shadow-sm ring-1 ring-[#465E32]/20 dark:ring-[#b5c589]/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
              }`}
            >
              {t('tabPreferences', lang)}
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 py-2.5 px-3 text-xs font-medium rounded-lg transition-colors duration-100 ${
                activeTab === 'data'
                  ? 'bg-white dark:bg-gray-800 text-[#465E32] dark:text-[#b5c589] shadow-sm ring-1 ring-[#465E32]/20 dark:ring-[#b5c589]/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
              }`}
            >
              {t('tabData', lang)}
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:flex w-48 flex-shrink-0 flex-col gap-2 p-4 bg-gray-50/50 dark:bg-gray-900/20 border-r border-gray-200/30 dark:border-gray-700/30">
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full text-left py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-100 ${
                activeTab === 'personal'
                  ? 'bg-white dark:bg-gray-800 text-[#465E32] dark:text-[#b5c589] shadow-sm ring-1 ring-[#465E32]/20 dark:ring-[#b5c589]/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/50'
              }`}
            >
              {t('tabPersonal', lang)}
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full text-left py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-100 ${
                activeTab === 'preferences'
                  ? 'bg-white dark:bg-gray-800 text-[#465E32] dark:text-[#b5c589] shadow-sm ring-1 ring-[#465E32]/20 dark:ring-[#b5c589]/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/50'
              }`}
            >
              {t('tabPreferences', lang)}
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`w-full text-left py-3 px-4 text-sm font-medium rounded-lg transition-colors duration-100 ${
                activeTab === 'data'
                  ? 'bg-white dark:bg-gray-800 text-[#465E32] dark:text-[#b5c589] shadow-sm ring-1 ring-[#465E32]/20 dark:ring-[#b5c589]/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/50'
              }`}
            >
              {t('tabData', lang)}
            </button>
          </div>
        
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {activeTab === 'personal' && (
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-sm sm:text-base font-semibold text-[#6a7f4a] dark:text-[#b5c589] mb-3 uppercase tracking-wide">{t('personalization', lang)}</h3>
              <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('yourName', lang)}</label>
                  <input
                      type="text"
                      value={localSettings.userName}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, userName: e.target.value }))}
                      placeholder={t('userNamePlaceholder', lang)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-[#b5c589] focus:ring-2 focus:ring-[#b5c589]/20 transition-colors duration-100 placeholder:text-gray-400 text-sm"
                  />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{t('yourPronoun', lang)}</label>
                <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                  {(['m', 'f', 'n'] as const).map((pronoun) => (
                    <button 
                      key={pronoun}
                      onClick={() => setLocalSettings(prev => ({...prev, userPronoun: pronoun}))} 
                      className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-100 ${
                        localSettings.userPronoun === pronoun 
                          ? 'bg-[#b5c589] text-black shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {t(`pronoun${pronoun.toUpperCase()}`, lang)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{t('yourAvatar', lang)}</label>
                <div className="grid grid-cols-4 gap-2">
                  {avatarOptions.map(avatar => (
            <button
              key={avatar}
              onClick={() => setLocalSettings(prev => ({...prev, userAvatar: avatar}))}
              className={`aspect-square flex items-center justify-center rounded-lg transition-colors duration-100 p-2 sm:p-3 ${
                localSettings.userAvatar === avatar
                  ? 'bg-[#465E32] ring-2 ring-[#465E32]/40'
                  : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
            >
                      <UserAvatar avatar={avatar} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm sm:text-base font-semibold text-[#6a7f4a] dark:text-[#b5c589] mb-3 uppercase tracking-wide">{t('generalSettings', lang)}</h3>
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('language', lang)}</label>
                <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                  <button 
                    onClick={() => setLocalSettings(prev => ({...prev, language: 'it'}))} 
                    className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-100 ${
                      localSettings.language === 'it' 
                        ? 'bg-[#b5c589] text-black shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Italiano
                  </button>
                  <button 
                    onClick={() => setLocalSettings(prev => ({...prev, language: 'en'}))} 
                    className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-100 ${
                      localSettings.language === 'en' 
                        ? 'bg-[#b5c589] text-black shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('theme', lang)}</label>
                <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                  <button 
                    onClick={() => setLocalSettings(prev => ({...prev, theme: 'light'}))} 
                    className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-100 ${
                      localSettings.theme === 'light' 
                        ? 'bg-[#b5c589] text-black shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('light', lang)}
                  </button>
                  <button 
                    onClick={() => setLocalSettings(prev => ({...prev, theme: 'dark'}))} 
                    className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-100 ${
                      localSettings.theme === 'dark' 
                        ? 'bg-[#b5c589] text-black shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('dark', lang)}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('textSize', lang)}</label>
                <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                  {(['sm', 'base', 'lg'] as const).map((size) => (
                    <button 
                      key={size}
                      onClick={() => setLocalSettings(prev => ({...prev, textSize: size}))} 
                      className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-100 ${
                        localSettings.textSize === size 
                          ? 'bg-[#b5c589] text-black shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {size === 'sm' && t('small', lang)}
                      {size === 'base' && t('medium', lang)}
                      {size === 'lg' && t('large', lang)}
                    </button>
                  ))}
                </div>
              </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-sm sm:text-base font-semibold text-[#6a7f4a] dark:text-[#b5c589] mb-3 uppercase tracking-wide">{t('conversationPreferences', lang)}</h3>
            
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('conversationTone', lang)}</label>
              <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                {(['casual', 'balanced', 'formal'] as ConversationTone[]).map((tone) => (
                  <button 
                    key={tone}
                    onClick={() => setLocalProfile(prev => ({...prev, conversationTone: tone}))} 
                    className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-100 ${
                      localProfile.conversationTone === tone 
                        ? 'bg-[#b5c589] text-black shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t(`tone${tone.charAt(0).toUpperCase() + tone.slice(1)}`, lang)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('preferredZones', lang)}</label>
              <input
                type="text"
                value={localProfile.preferredZones.join(', ')}
                onChange={(e) => setLocalProfile(prev => ({ 
                  ...prev, 
                  preferredZones: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))}
                placeholder={t('preferredZonesPlaceholder', lang)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-[#b5c589] focus:ring-2 focus:ring-[#b5c589]/20 transition-colors duration-100 placeholder:text-gray-400 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('favoriteCuisines', lang)}</label>
              <input
                type="text"
                value={localProfile.favoriteCuisines.join(', ')}
                onChange={(e) => setLocalProfile(prev => ({ 
                  ...prev, 
                  favoriteCuisines: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))}
                placeholder={t('favoriteCuisinesPlaceholder', lang)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-[#b5c589] focus:ring-2 focus:ring-[#b5c589]/20 transition-colors duration-100 placeholder:text-gray-400 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{t('dietaryNeeds', lang)}</label>
              <input
                type="text"
                value={localProfile.dietaryNeeds.join(', ')}
                onChange={(e) => setLocalProfile(prev => ({ 
                  ...prev, 
                  dietaryNeeds: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))}
                placeholder={t('dietaryNeedsPlaceholder', lang)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-[#b5c589] focus:ring-2 focus:ring-[#b5c589]/20 transition-colors duration-100 placeholder:text-gray-400 text-sm"
              />
            </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#6a7f4a] dark:text-[#b5c589] mb-3 uppercase tracking-wide">{t('profileManagement', lang)}</h3>
              
                {importMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    importMessage.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700' 
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                  }`}>
                    {importMessage.text}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button 
                    onClick={() => exportProfile('txt')} 
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-100 text-xs sm:text-sm font-medium"
                  >
                    <Download className="h-4 w-4" strokeWidth={2} />
                    TXT
                  </button>
                  <button 
                    onClick={() => exportProfile('json')} 
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-100 text-xs sm:text-sm font-medium"
                  >
                    <Download className="h-4 w-4" strokeWidth={2} />
                    JSON
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-100 text-sm font-medium mt-2"
                >
                  <Upload className="h-4 w-4" strokeWidth={2} />
                  {t('importProfile', lang)}
                </button>
              </div>
            
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm sm:text-base font-semibold text-[#6a7f4a] dark:text-[#b5c589] mb-3 uppercase tracking-wide">{t('dataManagement', lang)}</h3>
                <button 
                  onClick={handleDeleteClick} 
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-100 text-sm font-medium group"
                >
                  <TrashIcon className="h-4 w-4" />
                  {t('deleteHistory', lang)}
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleClose} 
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-100"
            >
                {t('cancel', lang)}
            </button>
            <button 
              onClick={handleSave} 
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-[#465E32] hover:bg-[#3a4f28] text-white font-semibold text-sm sm:text-base rounded-xl shadow-sm transition-colors duration-150"
            >
                {t('saveChanges', lang)}
            </button>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={t('deleteHistoryTitle', lang)}
        message={t('deleteConfirmation', lang)}
        confirmLabel={t('delete', lang)}
        cancelLabel={t('cancel', lang)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </div>
  );
};

export default SettingsModal;