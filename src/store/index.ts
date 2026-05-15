import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
}

interface AppStore {
  user: User | null;
  currentRole: 'demander' | 'rights_holder' | 'agent' | null;
  language: 'zh' | 'en';
  setUser: (user: User | null) => void;
  setCurrentRole: (role: 'demander' | 'rights_holder' | 'agent' | null) => void;
  setLanguage: (lang: 'zh' | 'en') => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      currentRole: null,
      language: 'zh',
      setUser: (user) => set({ user }),
      setCurrentRole: (role) => set({ currentRole: role }),
      setLanguage: (lang) => set({ language: lang }),
      logout: () => set({ user: null, currentRole: null }),
    }),
    {
      name: 'app-storage',
    }
  )
);
