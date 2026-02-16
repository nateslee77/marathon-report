'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { SearchPlayer } from '@/types';
import { SUSHI_DEFAULT_BADGES } from '@/lib/badges';

interface AuthUser {
  id: string;
  name: string;
  tag: string;
  avatar: string;
}

export type AvatarBorderStyle = 'none' | 'pulse-glow' | 'spinning-gradient' | 'shimmer-sweep' | 'breathing-ring' | 'electric-arc';

interface AppContextType {
  recentPlayers: SearchPlayer[];
  addRecentPlayer: (player: SearchPlayer) => void;
  user: AuthUser | null;
  signIn: () => void;
  signOut: () => void;
  cardThemeColor: string | null;
  setCardThemeColor: (color: string) => void;
  equippedBadges: string[];
  setEquippedBadges: (badges: string[]) => void;
  selectedAvatar: string;
  setSelectedAvatar: (avatar: string) => void;
  avatarBorderStyle: AvatarBorderStyle;
  setAvatarBorderStyle: (style: AvatarBorderStyle) => void;
}

const DEFAULT_AVATAR = '/images/avatars/avatar6.png';

const AppContext = createContext<AppContextType>({
  recentPlayers: [],
  addRecentPlayer: () => {},
  user: null,
  signIn: () => {},
  signOut: () => {},
  cardThemeColor: null,
  setCardThemeColor: () => {},
  equippedBadges: [],
  setEquippedBadges: () => {},
  selectedAvatar: DEFAULT_AVATAR,
  setSelectedAvatar: () => {},
  avatarBorderStyle: 'none',
  setAvatarBorderStyle: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [recentPlayers, setRecentPlayers] = useState<SearchPlayer[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cardThemeColor, setCardThemeColorState] = useState<string | null>('#cccccc');
  const [equippedBadges, setEquippedBadgesState] = useState<string[]>(SUSHI_DEFAULT_BADGES);
  const [selectedAvatar, setSelectedAvatarState] = useState<string>(DEFAULT_AVATAR);
  const [avatarBorderStyle, setAvatarBorderStyleState] = useState<AvatarBorderStyle>('none');

  // Load persisted values on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('marathon-avatar');
    if (savedAvatar) setSelectedAvatarState(savedAvatar);
    const savedBorder = localStorage.getItem('marathon-avatar-border') as AvatarBorderStyle | null;
    if (savedBorder) setAvatarBorderStyleState(savedBorder);
    const savedTheme = localStorage.getItem('marathon-theme-color');
    if (savedTheme) setCardThemeColorState(savedTheme);
    const savedBadges = localStorage.getItem('marathon-badges');
    if (savedBadges) {
      try { setEquippedBadgesState(JSON.parse(savedBadges)); } catch {}
    }
  }, []);

  const setSelectedAvatar = useCallback((avatar: string) => {
    setSelectedAvatarState(avatar);
    localStorage.setItem('marathon-avatar', avatar);
  }, []);

  const setAvatarBorderStyle = useCallback((style: AvatarBorderStyle) => {
    setAvatarBorderStyleState(style);
    localStorage.setItem('marathon-avatar-border', style);
  }, []);

  const setCardThemeColor = useCallback((color: string) => {
    setCardThemeColorState(color);
    localStorage.setItem('marathon-theme-color', color);
  }, []);

  const setEquippedBadges = useCallback((badges: string[]) => {
    setEquippedBadgesState(badges);
    localStorage.setItem('marathon-badges', JSON.stringify(badges));
  }, []);

  const addRecentPlayer = useCallback((player: SearchPlayer) => {
    setRecentPlayers((prev) => {
      const filtered = prev.filter((p) => p.id !== player.id);
      return [player, ...filtered].slice(0, 8);
    });
  }, []);

  const signIn = useCallback(() => {
    setUser({ id: 'player-001', name: 'Sushi', tag: '#7742', avatar: selectedAvatar });
  }, [selectedAvatar]);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  // Update user avatar when selectedAvatar changes while signed in
  useEffect(() => {
    if (user) {
      setUser((prev) => prev ? { ...prev, avatar: selectedAvatar } : null);
    }
  }, [selectedAvatar]);

  return (
    <AppContext.Provider value={{ recentPlayers, addRecentPlayer, user, signIn, signOut, cardThemeColor, setCardThemeColor, equippedBadges, setEquippedBadges, selectedAvatar, setSelectedAvatar, avatarBorderStyle, setAvatarBorderStyle }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
