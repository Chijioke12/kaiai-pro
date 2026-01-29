
export enum View {
  HOME = 'HOME',
  CHAT = 'CHAT',
  SEARCH = 'SEARCH',
  VOICE = 'VOICE',
  SETTINGS = 'SETTINGS'
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  view: View;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface NavigationState {
  index: number;
  total: number;
}
