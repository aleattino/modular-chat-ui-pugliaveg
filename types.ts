export type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
  pendingCard?: boolean;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

export type Language = 'it' | 'en';
export type Theme = 'light' | 'dark';
export type TextSize = 'sm' | 'base' | 'lg';
export type UserPronoun = 'm' | 'f' | 'n';
export type UserAvatar = 'avocado' | 'coffee' | 'sloth' | 'breaking';
export type ConversationTone = 'casual' | 'formal' | 'balanced';

export type Settings = {
  language: Language;
  theme: Theme;
  textSize: TextSize;
  userName: string;
  userPronoun: UserPronoun;
  userAvatar: UserAvatar;
};

export type UserProfile = {
  preferredZones: string[];
  favoriteCuisines: string[];
  dietaryNeeds: string[];
  conversationTone: ConversationTone;
  visitedVenues: string[];
  lastSessionDate: string | null;
  lastSessionSummary: string;
  interactionCount: number;
};