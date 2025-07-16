import {create} from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('preferred-theme') || 'bumblebee', // Default theme
    setTheme: (theme) => {
        localStorage.setItem('preferred-theme', theme);
        set({ theme });
    }
}));
