import { useSyncExternalStore } from 'react';

const listeners = new Set();

function readInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved === 'dark';
  } catch {}
  return Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
}

let darkTheme = readInitialTheme();

function applyTheme() {
  document.documentElement.classList.toggle('dark', darkTheme);
  try { localStorage.setItem('theme', darkTheme ? 'dark' : 'light'); } catch {}
}

applyTheme();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return darkTheme;
}

function setTheme(next) {
  const nextValue = typeof next === 'function' ? next(darkTheme) : next;
  if (Boolean(nextValue) === darkTheme) return;
  darkTheme = Boolean(nextValue);
  applyTheme();
  listeners.forEach((listener) => listener());
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return { dark, setDark: setTheme, toggleTheme: () => setTheme((current) => !current) };
}
