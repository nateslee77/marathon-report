'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { SearchPlayer } from '@/types';

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

const DEFAULT_AVATAR = '/images/avatars/default.svg';

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

/** Save a single preference to Supabase (fire-and-forget). */
function savePreferenceToSupabase(updates: Record<string, unknown>) {
  fetch('/api/user/preferences', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).catch(() => {
    // Silently fail — localStorage is the offline fallback
  });
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [recentPlayers, setRecentPlayers] = useState<SearchPlayer[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cardThemeColor, setCardThemeColorState] = useState<string | null>('#cccccc');
  const [equippedBadges, setEquippedBadgesState] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatarState] = useState<string>(DEFAULT_AVATAR);
  const [avatarBorderStyle, setAvatarBorderStyleState] = useState<AvatarBorderStyle>('none');
  const hasFetchedPrefs = useRef(false);

  // Load persisted values from localStorage on mount (immediate cache)
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

  // When signed in, fetch preferences from Supabase (source of truth)
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.bungieMembershipId || hasFetchedPrefs.current) {
      return;
    }
    hasFetchedPrefs.current = true;

    fetch('/api/user/preferences')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch preferences');
        return res.json();
      })
      .then((prefs) => {
        if (prefs.selected_avatar) {
          setSelectedAvatarState(prefs.selected_avatar);
          localStorage.setItem('marathon-avatar', prefs.selected_avatar);
        }
        if (prefs.card_theme_color) {
          setCardThemeColorState(prefs.card_theme_color);
          localStorage.setItem('marathon-theme-color', prefs.card_theme_color);
        }
        if (prefs.avatar_border_style && prefs.avatar_border_style !== 'none') {
          setAvatarBorderStyleState(prefs.avatar_border_style);
          localStorage.setItem('marathon-avatar-border', prefs.avatar_border_style);
        }
        if (Array.isArray(prefs.equipped_badges) && prefs.equipped_badges.length > 0) {
          setEquippedBadgesState(prefs.equipped_badges);
          localStorage.setItem('marathon-badges', JSON.stringify(prefs.equipped_badges));
        }
      })
      .catch(() => {
        // Fall back to localStorage values already loaded
      });
  }, [status, session]);

  // Reset fetch flag on sign-out so next sign-in re-fetches
  useEffect(() => {
    if (status === 'unauthenticated') {
      hasFetchedPrefs.current = false;
    }
  }, [status]);

  const setSelectedAvatar = useCallback((avatar: string) => {
    setSelectedAvatarState(avatar);
    localStorage.setItem('marathon-avatar', avatar);
    savePreferenceToSupabase({ selected_avatar: avatar });
  }, []);

  const setAvatarBorderStyle = useCallback((style: AvatarBorderStyle) => {
    setAvatarBorderStyleState(style);
    localStorage.setItem('marathon-avatar-border', style);
    savePreferenceToSupabase({ avatar_border_style: style });
  }, []);

  const setCardThemeColor = useCallback((color: string) => {
    setCardThemeColorState(color);
    localStorage.setItem('marathon-theme-color', color);
    savePreferenceToSupabase({ card_theme_color: color });
  }, []);

  const setEquippedBadges = useCallback((badges: string[]) => {
    setEquippedBadgesState(badges);
    localStorage.setItem('marathon-badges', JSON.stringify(badges));
    savePreferenceToSupabase({ equipped_badges: badges });
  }, []);

  const addRecentPlayer = useCallback((player: SearchPlayer) => {
    setRecentPlayers((prev) => {
      const filtered = prev.filter((p) => p.id !== player.id);
      return [player, ...filtered].slice(0, 8);
    });
  }, []);

  // Sync NextAuth session with app user state
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.bungieMembershipId || '',
        name: session.user.name || 'Guardian',
        tag: session.user.bungieMembershipId ? `#${session.user.bungieMembershipId.slice(-4)}` : '',
        avatar: selectedAvatar,
      });
    } else {
      setUser(null);
    }
  }, [session, selectedAvatar]);

  const signIn = useCallback(() => {
    // Now handled by NextAuth - kept for compatibility
  }, []);

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
