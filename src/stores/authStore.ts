import { create } from 'zustand';

interface User {
  id: string;
  username: string;
}

interface AuthStore {
  user: User | null;
  currentRole: 'demander' | 'rights_holder' | 'agent' | null;
  setUser: (user: User | null) => void;
  setCurrentRole: (role: 'demander' | 'rights_holder' | 'agent' | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  currentRole: localStorage.getItem('currentRole') as any,
  setUser: (user) => set({ user }),
  setCurrentRole: (role) => {
    if (role) localStorage.setItem('currentRole', role);
    else localStorage.removeItem('currentRole');
    set({ currentRole: role });
  },
  logout: () => {
    localStorage.removeItem('currentRole');
    set({ user: null, currentRole: null });
  },
}));
