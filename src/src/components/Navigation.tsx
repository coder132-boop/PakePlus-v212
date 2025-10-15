import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Info, LayoutDashboard, Calendar, ListTodo, Gift, Sparkles, LogIn, LogOut, User, Database, Menu, X } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';
import { useTripleClick, EmojiRain } from './EasterEggs';
import { ChoreCoreLogo } from './ChoreCoreLogo';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import confetti from 'canvas-confetti';
import { toast } from 'sonner@2.0.3';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, userRole } = useTaskContext();
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [showEmojiRain, setShowEmojiRain] = useState(false);
  const [logoShake, setLogoShake] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Triple-click logo Easter egg
  const handleLogoTripleClick = useCallback(() => {
    setLogoShake(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { x: 0.1, y: 0.1 },
      colors: ['#00C2A8', '#00FFD1', '#FFD43B', '#7DE3D6', '#B8F3EA'],
    });
    toast.success('🏆 Triple-Click Champion!', {
      description: 'You found the secret logo animation!',
    });
    setTimeout(() => setLogoShake(false), 1000);
  }, []);

  const handleTripleClick = useTripleClick(handleLogoTripleClick);

  // Listen for secret key combination: Ctrl+Shift+A (for Admin)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminButton(prev => !prev);
      }
      
      // Secret emoji rain: Ctrl+Shift+E
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        setShowEmojiRain(true);
        toast.success('🎉 Emoji Rain!', {
          description: 'You found the secret emoji rain!',
        });
        setTimeout(() => setShowEmojiRain(false), 100);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Public nav items (shown when not authenticated)
  const publicNavItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'about', label: 'About', icon: Info, path: '/about' },
  ];

  // Authenticated nav items
  const authNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'chores', label: 'Chores', icon: ListTodo, path: '/chores' },
    { id: 'assign', label: 'Assign', icon: Sparkles, path: '/assign' },
    { id: 'points', label: 'Points', icon: Gift, path: '/points' },
  ];

  // Choose which nav items to show
  const navItems = isAuthenticated ? authNavItems : publicNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {showEmojiRain && <EmojiRain emoji="🏆" />}
      
      <nav className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-4">
        <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl shadow-lg border border-white/50 p-2 sm:p-3">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <button 
              onClick={handleTripleClick}
              className="flex items-center gap-2 px-2 sm:px-3 transition-all hover:scale-105 flex-shrink-0"
            >
              <div className={`size-8 sm:size-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center transition-transform ${logoShake ? 'animate-bounce' : ''} p-1`}>
                <ChoreCoreLogo size={32} className="scale-75 sm:scale-100" />
              </div>
              <span className="hidden sm:block text-foreground text-sm sm:text-base">ChoreCore</span>
            </button>
          
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                if (item.id === 'assign' && userRole === 'member') {
                  return null;
                }
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] text-white shadow-lg scale-105' 
                        : 'hover:bg-white/60 text-foreground hover:scale-105'
                      }
                    `}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
              
              {showAdminButton && (
                <button
                  onClick={() => handleNavigation('/admin-setup')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300
                    ${location.pathname === '/admin-setup'
                      ? 'bg-gradient-to-r from-[#00FFD1] to-[#7DE3D6] text-white shadow-lg scale-105'
                      : 'hover:bg-white/60 text-foreground hover:scale-105'
                    }
                  `}
                  title="Database Setup (Admin Only)"
                >
                  <Database className="size-4" />
                  <span className="text-sm">Setup</span>
                </button>
              )}
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 hover:bg-red-500/80 text-foreground hover:text-white hover:scale-105"
                >
                  <LogOut className="size-4" />
                  <span className="text-sm">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation('/login')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300
                    ${location.pathname === '/login'
                      ? 'bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] text-white shadow-lg scale-105'
                      : 'hover:bg-white/60 text-foreground hover:scale-105'
                    }
                  `}
                >
                  <LogIn className="size-4" />
                  <span className="text-sm">Login</span>
                </button>
              )}
            </div>

            {/* Mobile: Quick Access + Burger Menu */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Quick access button (Dashboard for auth, Home for public) */}
              <button
                onClick={() => handleNavigation(isAuthenticated ? '/dashboard' : '/')}
                className={`
                  flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 touch-target
                  ${(isAuthenticated && location.pathname === '/dashboard') || (!isAuthenticated && location.pathname === '/')
                    ? 'bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] text-white shadow-lg'
                    : 'hover:bg-white/60 text-foreground'
                  }
                `}
              >
                {isAuthenticated ? <LayoutDashboard className="size-4" /> : <Home className="size-4" />}
              </button>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-white/60 text-foreground touch-target">
                    <Menu className="size-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] backdrop-blur-xl bg-white/95 border-l border-white/60">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Main navigation menu for ChoreCore app
                  </SheetDescription>
                  <div className="flex flex-col gap-2 mt-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                      <div className="size-10 rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center p-1">
                        <ChoreCoreLogo size={32} />
                      </div>
                      <div>
                        <p className="text-sm text-foreground">ChoreCore</p>
                        <p className="text-xs text-muted-foreground">Smart Habits, Clean Homes</p>
                      </div>
                    </div>

                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      if (item.id === 'assign' && userRole === 'member') {
                        return null;
                      }
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.path)}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left
                            ${isActive 
                              ? 'bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] text-white shadow-lg' 
                              : 'hover:bg-white/60 text-foreground'
                            }
                          `}
                        >
                          <Icon className="size-5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    {showAdminButton && (
                      <button
                        onClick={() => handleNavigation('/admin-setup')}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left
                          ${location.pathname === '/admin-setup'
                            ? 'bg-gradient-to-r from-[#00FFD1] to-[#7DE3D6] text-white shadow-lg'
                            : 'hover:bg-white/60 text-foreground'
                          }
                        `}
                      >
                        <Database className="size-5" />
                        <span>Database Setup</span>
                      </button>
                    )}

                    <div className="border-t border-border mt-4 pt-4">
                      {isAuthenticated ? (
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/80 text-foreground hover:text-white w-full text-left"
                        >
                          <LogOut className="size-5" />
                          <span>Logout</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleNavigation('/login')}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left
                            ${location.pathname === '/login'
                              ? 'bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] text-white shadow-lg'
                              : 'hover:bg-white/60 text-foreground'
                            }
                          `}
                        >
                          <LogIn className="size-5" />
                          <span>Login</span>
                        </button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
