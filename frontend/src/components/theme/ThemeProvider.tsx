import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type AccentColor = 'blue' | 'green' | 'orange' | 'purple' | 'red';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  accent: AccentColor;
  setAccent: (a: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const accentHsl: Record<AccentColor, { light: string; dark: string }> = {
  blue: { light: '221 83% 53%', dark: '217 91% 60%' },
  green: { light: '142 71% 45%', dark: '142 71% 45%' },
  orange: { light: '38 92% 50%', dark: '32 95% 55%' },
  purple: { light: '280 65% 60%', dark: '265 85% 65%' },
  red: { light: '0 84% 60%', dark: '0 72% 56%' },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('trackport-theme') as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    if (typeof window === 'undefined') return 'blue';
    const stored = localStorage.getItem('trackport-accent') as AccentColor | null;
    return stored ?? 'blue';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('trackport-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const vals = accentHsl[accent][theme];
    root.style.setProperty('--primary', vals);
    root.style.setProperty('--ring', vals);
    localStorage.setItem('trackport-accent', accent);
  }, [accent, theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const setAccent = (a: AccentColor) => setAccentState(a);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
