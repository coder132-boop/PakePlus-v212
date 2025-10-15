import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'ocean' | 'sunset' | 'forest' | 'lavender' | 'rainbow' | 'aurora' | 'cosmic';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('chorecore_theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('chorecore_theme', theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove(
      'theme-light', 
      'theme-dark', 
      'theme-ocean', 
      'theme-sunset', 
      'theme-forest', 
      'theme-lavender',
      'theme-rainbow',
      'theme-aurora',
      'theme-cosmic'
    );
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Handle animated themes
    if (theme === 'rainbow' || theme === 'aurora' || theme === 'cosmic') {
      startDynamicTheme(theme);
    } else {
      stopDynamicTheme();
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Dynamic theme animation
let animationFrame: number | null = null;
let startTime: number | null = null;

function stopDynamicTheme() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
    startTime = null;
  }
}

function startDynamicTheme(theme: 'rainbow' | 'aurora' | 'cosmic') {
  stopDynamicTheme();
  startTime = Date.now();
  
  const animate = () => {
    const elapsed = (Date.now() - (startTime || 0)) / 1000;
    
    if (theme === 'rainbow') {
      animateRainbow(elapsed);
    } else if (theme === 'aurora') {
      animateAurora(elapsed);
    } else if (theme === 'cosmic') {
      animateCosmic(elapsed);
    }
    
    animationFrame = requestAnimationFrame(animate);
  };
  
  animate();
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function animateRainbow(time: number) {
  const hue = (time * 30) % 360;
  const primary = hslToHex(hue, 70, 50);
  const secondary = hslToHex((hue + 60) % 360, 70, 55);
  const accent = hslToHex((hue + 120) % 360, 80, 60);
  
  document.documentElement.style.setProperty('--primary', primary);
  document.documentElement.style.setProperty('--secondary', secondary);
  document.documentElement.style.setProperty('--accent', accent);
}

function animateAurora(time: number) {
  const hue1 = (time * 20 + Math.sin(time) * 30) % 360;
  const hue2 = (hue1 + 120) % 360;
  const primary = hslToHex(hue1, 60, 45);
  const secondary = hslToHex(hue2, 65, 50);
  const accent = hslToHex((hue1 + 240) % 360, 70, 55);
  
  document.documentElement.style.setProperty('--primary', primary);
  document.documentElement.style.setProperty('--secondary', secondary);
  document.documentElement.style.setProperty('--accent', accent);
}

function animateCosmic(time: number) {
  const hue = (time * 15 + Math.sin(time * 0.5) * 60) % 360;
  const primary = hslToHex((hue + 240) % 360, 80, 40);
  const secondary = hslToHex((hue + 280) % 360, 75, 45);
  const accent = hslToHex((hue + 320) % 360, 85, 50);
  
  document.documentElement.style.setProperty('--primary', primary);
  document.documentElement.style.setProperty('--secondary', secondary);
  document.documentElement.style.setProperty('--accent', accent);
}
