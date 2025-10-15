import { motion } from 'motion/react';
import { useState } from 'react';
import { Palette, Sun, Moon, Waves, Sunset, Trees, Flower2, Check, ChevronRight, User, Bell, Lock, Info, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTaskContext } from '../contexts/TaskContext';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { userProfile, houseId } = useTaskContext();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);

  const themes = [
    {
      id: 'light' as const,
      name: 'Light',
      description: 'Clean and bright',
      icon: Sun,
      gradient: 'from-white to-gray-100',
      preview: 'bg-white',
      category: 'static' as const,
    },
    {
      id: 'dark' as const,
      name: 'Dark',
      description: 'Easy on the eyes',
      icon: Moon,
      gradient: 'from-gray-800 to-gray-900',
      preview: 'bg-gray-800',
      category: 'static' as const,
    },
    {
      id: 'ocean' as const,
      name: 'Ocean',
      description: 'Cool and calming',
      icon: Waves,
      gradient: 'from-blue-400 to-cyan-500',
      preview: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      category: 'static' as const,
    },
    {
      id: 'sunset' as const,
      name: 'Sunset',
      description: 'Warm and vibrant',
      icon: Sunset,
      gradient: 'from-orange-400 to-pink-500',
      preview: 'bg-gradient-to-br from-orange-400 to-pink-500',
      category: 'static' as const,
    },
    {
      id: 'forest' as const,
      name: 'Forest',
      description: 'Natural and fresh',
      icon: Trees,
      gradient: 'from-green-400 to-emerald-600',
      preview: 'bg-gradient-to-br from-green-400 to-emerald-600',
      category: 'static' as const,
    },
    {
      id: 'lavender' as const,
      name: 'Lavender',
      description: 'Soft and elegant',
      icon: Flower2,
      gradient: 'from-purple-400 to-pink-400',
      preview: 'bg-gradient-to-br from-purple-400 to-pink-400',
      category: 'static' as const,
    },
    {
      id: 'rainbow' as const,
      name: 'Rainbow',
      description: '🌈 Ever-changing colors',
      icon: Sparkles,
      gradient: 'from-red-400 via-purple-400 to-blue-400',
      preview: 'bg-gradient-to-br from-red-400 via-purple-400 to-blue-400',
      category: 'dynamic' as const,
    },
    {
      id: 'aurora' as const,
      name: 'Aurora',
      description: '✨ Northern lights',
      icon: Sparkles,
      gradient: 'from-green-400 via-blue-500 to-purple-600',
      preview: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
      category: 'dynamic' as const,
    },
    {
      id: 'cosmic' as const,
      name: 'Cosmic',
      description: '🌌 Deep space vibes',
      icon: Sparkles,
      gradient: 'from-purple-600 via-pink-600 to-cyan-600',
      preview: 'bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600',
      category: 'dynamic' as const,
    },
  ];

  const handleThemeChange = (newTheme: typeof themes[number]['id']) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${themes.find(t => t.id === newTheme)?.name}!`, {
      description: 'Your new look is ready',
    });
  };

  const handleToggle = (setting: string, value: boolean, setter: (val: boolean) => void) => {
    setter(value);
    localStorage.setItem(`chorecore_${setting}`, String(value));
    toast.success(`${setting.charAt(0).toUpperCase() + setting.slice(1)} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center size-20 rounded-3xl bg-gradient-to-br from-orange-400 to-red-400 shadow-lg mb-4">
            <Sparkles className="size-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl mb-3 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-lg text-foreground/70">
            Customize your ChoreCore experience
          </p>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 shadow-lg border border-white/60 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="size-5 text-foreground/70" />
            <h2 className="text-xl text-foreground">Account</h2>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Display Name</span>
              <span className="text-sm text-foreground">{userProfile?.display_name || 'User'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">Role</span>
              <span className={`text-sm px-2 py-1 rounded-lg ${
                userProfile?.role === 'admin' 
                  ? 'bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] text-white' 
                  : 'bg-white/50 text-foreground'
              }`}>
                {userProfile?.role === 'admin' ? 'Admin' : 'Member'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/70">House ID</span>
              <span className="text-sm text-foreground font-mono">{houseId || 'Not set'}</span>
            </div>
          </div>
        </motion.div>

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 shadow-lg border border-white/60 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Palette className="size-5 text-foreground/70" />
            <h2 className="text-xl text-foreground">Theme</h2>
          </div>
          <Separator className="mb-6" />
          
          {/* Static Themes */}
          <div className="mb-6">
            <h3 className="text-sm text-foreground/60 mb-3">Classic Themes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.filter(t => t.category === 'static').map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.id;
                
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative backdrop-blur-xl rounded-2xl p-4 border-2 transition-all
                      ${isActive 
                        ? 'border-[#00C2A8] bg-gradient-to-br from-[#00C2A8]/10 to-[#00FFD1]/10 shadow-lg' 
                        : 'border-white/40 bg-white/30 hover:bg-white/50'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`size-12 rounded-xl ${t.preview} flex items-center justify-center shadow-md`}>
                        <Icon className="size-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-foreground mb-0.5">{t.name}</h3>
                        <p className="text-xs text-foreground/60">{t.description}</p>
                      </div>
                      {isActive && (
                        <div className="size-6 rounded-full bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center">
                          <Check className="size-4 text-white" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Themes */}
          <div>
            <h3 className="text-sm text-foreground/60 mb-3">✨ Animated Themes (Color-Changing)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.filter(t => t.category === 'dynamic').map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              
              return (
                <motion.button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative backdrop-blur-xl rounded-2xl p-4 border-2 transition-all
                    ${isActive 
                      ? 'border-[#00C2A8] bg-gradient-to-br from-[#00C2A8]/10 to-[#00FFD1]/10 shadow-lg' 
                      : 'border-white/40 bg-white/30 hover:bg-white/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`size-12 rounded-xl ${t.preview} flex items-center justify-center shadow-md animate-pulse`}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-foreground mb-0.5">{t.name}</h3>
                      <p className="text-xs text-foreground/60">{t.description}</p>
                    </div>
                    {isActive && (
                      <div className="size-6 rounded-full bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center">
                        <Check className="size-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 shadow-lg border border-white/60 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Bell className="size-5 text-foreground/70" />
            <h2 className="text-xl text-foreground">Preferences</h2>
          </div>
          <Separator className="mb-6" />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-foreground">Notifications</Label>
                <p className="text-sm text-foreground/60">Get alerts for chore updates</p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={(val) => handleToggle('notifications', val, setNotifications)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sounds" className="text-foreground">Sound Effects</Label>
                <p className="text-sm text-foreground/60">Play sounds for actions</p>
              </div>
              <Switch
                id="sounds"
                checked={soundEffects}
                onCheckedChange={(val) => handleToggle('soundEffects', val, setSoundEffects)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations" className="text-foreground">Animations</Label>
                <p className="text-sm text-foreground/60">Enable celebratory animations</p>
              </div>
              <Switch
                id="animations"
                checked={animations}
                onCheckedChange={(val) => handleToggle('animations', val, setAnimations)}
              />
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 shadow-lg border border-white/60"
        >
          <div className="flex items-center gap-3 mb-4">
            <Info className="size-5 text-foreground/70" />
            <h2 className="text-xl text-foreground">About</h2>
          </div>
          <Separator className="mb-4" />
          
          <div className="space-y-3 text-sm text-foreground/70">
            <div className="flex justify-between items-center">
              <span>Version</span>
              <span className="text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Built with</span>
              <span className="text-foreground">React + Supabase</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Status</span>
              <span className="text-green-500 flex items-center gap-1">
                <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/40 text-center">
            <p className="text-sm text-foreground/70">
              ChoreCore - The Core of Clean
            </p>
            <p className="text-xs text-foreground/50 mt-1">
              Smart Habits, Clean Homes
            </p>
          </div>
        </motion.div>

        {/* Easter Egg Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-foreground/40">
            💡 Tip: Try pressing Ctrl+Shift+E for a surprise!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
