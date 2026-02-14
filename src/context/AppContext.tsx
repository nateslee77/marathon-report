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
}

const DEFAULT_AVATAR = '/images/sushi pfp.png';

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
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [recentPlayers, setRecentPlayers] = useState<SearchPlayer[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cardThemeColor, setCardThemeColor] = useState<string | null>(null);
  const [equippedBadges, setEquippedBadges] = useState<string[]>(SUSHI_DEFAULT_BADGES);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_AVATAR);

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
    <AppContext.Provider value={{ recentPlayers, addRecentPlayer, user, signIn, signOut, cardThemeColor, setCardThemeColor, equippedBadges, setEquippedBadges, selectedAvatar, setSelectedAvatar }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
