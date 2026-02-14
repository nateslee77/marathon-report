'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
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
}

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
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [recentPlayers, setRecentPlayers] = useState<SearchPlayer[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cardThemeColor, setCardThemeColor] = useState<string | null>(null);
  const [equippedBadges, setEquippedBadges] = useState<string[]>(SUSHI_DEFAULT_BADGES);

  const addRecentPlayer = useCallback((player: SearchPlayer) => {
    setRecentPlayers((prev) => {
      const filtered = prev.filter((p) => p.id !== player.id);
      return [player, ...filtered].slice(0, 8);
    });
  }, []);

  const signIn = useCallback(() => {
    setUser({ id: 'player-001', name: 'Sushi', tag: '#7742', avatar: '/images/sushi pfp.png' });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AppContext.Provider value={{ recentPlayers, addRecentPlayer, user, signIn, signOut, cardThemeColor, setCardThemeColor, equippedBadges, setEquippedBadges }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
