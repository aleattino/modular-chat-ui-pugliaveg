import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Settings, UserProfile } from '../types';

const SETTINGS_KEY = 'chatbot-settings';
const PROFILE_KEY = 'chatbot-profile';

const defaultSettings: Settings = {
  theme: 'light',
  language: 'it',
  textSize: 'base',
  userName: '',
  userPronoun: 'n',
  userAvatar: 'avocado',
};

const defaultProfile: UserProfile = {
  preferredZones: [],
  favoriteCuisines: [],
  dietaryNeeds: [],
  conversationTone: 'balanced',
  visitedVenues: [],
  lastSessionDate: null,
  lastSessionSummary: '',
  interactionCount: 0,
};

interface SettingsContextType {
  settings: Settings;
  profile: UserProfile;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  exportProfile: (format: 'txt' | 'json') => void;
  importProfile: (data: string, format: 'txt' | 'json') => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      }
      return defaultSettings;
    } catch (error) {
      console.error('Errore caricamento impostazioni:', error);
      return defaultSettings;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_KEY);
      if (savedProfile) {
        return { ...defaultProfile, ...JSON.parse(savedProfile) };
      }
      return defaultProfile;
    } catch (error) {
      console.error('Errore caricamento profilo:', error);
      return defaultProfile;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Errore salvataggio impostazioni:', error);
    }
    
    const html = window.document.documentElement;
    const body = window.document.body;
    
    html.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    html.classList.add(settings.theme);
    body.classList.add(settings.theme);

    const sizeMap: Record<string, string> = { sm: '14px', base: '16px', lg: '18px' };
    html.style.fontSize = sizeMap[settings.textSize] || '16px';
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Errore salvataggio profilo:', error);
    }
  }, [profile]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updateProfile = useCallback((newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  }, []);

  const exportProfile = useCallback((format: 'txt' | 'json') => {
    const data = { settings, profile };
    
    if (format === 'json') {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profilo-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const txtContent = `PROFILO UTENTE
Esportato il: ${new Date().toLocaleString('it-IT')}

IMPOSTAZIONI PERSONALI
Nome: ${settings.userName || 'Non impostato'}
Pronome: ${settings.userPronoun === 'm' ? 'Maschile' : settings.userPronoun === 'f' ? 'Femminile' : 'Neutro'}
Lingua: ${settings.language === 'it' ? 'Italiano' : 'English'}
Tema: ${settings.theme === 'light' ? 'Chiaro' : 'Scuro'}
Dimensione testo: ${settings.textSize === 'sm' ? 'Piccolo' : settings.textSize === 'base' ? 'Medio' : 'Grande'}
Avatar: ${settings.userAvatar}

PREFERENZE CONVERSAZIONE
Tono conversazione: ${profile.conversationTone === 'casual' ? 'Informale' : profile.conversationTone === 'formal' ? 'Formale' : 'Bilanciato'}
Zone di interesse: ${profile.preferredZones.length > 0 ? profile.preferredZones.join(', ') : 'Nessuna'}
Cucine e cibi preferiti: ${profile.favoriteCuisines.length > 0 ? profile.favoriteCuisines.join(', ') : 'Nessuno'}
Esigenze alimentari: ${profile.dietaryNeeds.length > 0 ? profile.dietaryNeeds.join(', ') : 'Nessuna'}

STATISTICHE
Interazioni totali: ${profile.interactionCount}
Locali visitati: ${profile.visitedVenues.length}
Ultima sessione: ${profile.lastSessionDate ? new Date(profile.lastSessionDate).toLocaleString('it-IT') : 'Mai'}
${profile.lastSessionSummary ? `Ultima conversazione: ${profile.lastSessionSummary}` : ''}

Per importare questo profilo usa la funzione "Importa profilo" nelle impostazioni.
      `.trim();
      
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profilo-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [settings, profile]);

  const importProfile = useCallback((data: string, format: 'txt' | 'json'): boolean => {
    try {
      if (format === 'json') {
        const parsed = JSON.parse(data);
        if (parsed.settings) {
          setSettings(prev => ({ ...prev, ...parsed.settings }));
        }
        if (parsed.profile) {
          setProfile(prev => ({ ...prev, ...parsed.profile }));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Errore importazione profilo:', error);
      return false;
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, profile, updateSettings, updateProfile, exportProfile, importProfile }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

