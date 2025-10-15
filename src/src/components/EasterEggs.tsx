import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Star, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Konami Code sequence: ↑↑↓↓←→←→BA
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

const EASTER_EGG_MESSAGES = [
  { emoji: '🎉', title: 'Party Mode!', message: 'You found the Konami Code!' },
  { emoji: '🏆', title: 'Chore Champion!', message: 'You typed the secret phrase!' },
  { emoji: '✨', title: 'Magic Unlocked!', message: 'Triple-click master detected!' },
  { emoji: '🎨', title: 'Disco Mode!', message: 'Rainbow mode activated!' },
  { emoji: '🚀', title: 'Turbo Mode!', message: 'Speed boost unlocked!' },
  { emoji: '🦄', title: 'Unicorn Mode!', message: 'Magical sparkles everywhere!' },
  { emoji: '🍕', title: 'Pizza Party!', message: 'It\'s raining pizza!' },
  { emoji: '🔥', title: 'On Fire!', message: 'You\'re unstoppable!' },
  { emoji: '❄️', title: 'Ice Mode!', message: 'Chill vibes activated!' },
  { emoji: '⚡', title: 'Lightning Fast!', message: 'Turbo speed engaged!' },
  { emoji: '👑', title: 'Legendary!', message: 'You\'re a true champion!' },
  { emoji: '🌟', title: 'Superstar!', message: 'You\'re shining bright!' },
  { emoji: '🎮', title: 'Gamer Mode!', message: 'Achievement unlocked!' },
  { emoji: '🧙', title: 'Wizard Found!', message: 'Magic powers activated!' },
  { emoji: '🐱', title: 'Secret Cat!', message: 'Meow! You found the hidden cat!' },
  { emoji: '🎪', title: 'Circus Mode!', message: 'Step right up!' },
  { emoji: '🌮', title: 'Taco Tuesday!', message: 'Every day is taco day!' },
  { emoji: '🍪', title: 'Cookie Monster!', message: 'Om nom nom!' },
  { emoji: '🎸', title: 'Rock Star!', message: 'You\'re killing it!' },
  { emoji: '💎', title: 'Diamond Found!', message: 'Rare discovery!' },
];

interface EasterEggProps {
  children: React.ReactNode;
}

export function EasterEggs({ children }: EasterEggProps) {
  const [konamiProgress, setKonamiProgress] = useState<number>(0);
  const [secretPhrase, setSecretPhrase] = useState<string>('');
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementData, setAchievementData] = useState(EASTER_EGG_MESSAGES[0]);
  const [partyMode, setPartyMode] = useState(false);
  const [discoMode, setDiscoMode] = useState(false);
  const [rainbowMode, setRainbowMode] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const [unicornMode, setUnicornMode] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [gravityMode, setGravityMode] = useState(false);
  const [glitchMode, setGlitchMode] = useState(false);
  const [clickCombo, setClickCombo] = useState<number>(0);
  const [cornersClicked, setCornersClicked] = useState<Set<string>>(new Set());
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [shakeCount, setShakeCount] = useState(0);

  // Define all callback functions first
  const triggerEasterEgg = useCallback((data: typeof EASTER_EGG_MESSAGES[0]) => {
    setAchievementData(data);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 4000);
  }, []);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00C2A8', '#00FFD1', '#FFD43B', '#7DE3D6', '#B8F3EA'],
    });
  }, []);

  const triggerEmojiRain = useCallback((emoji: string) => {
    // Create temporary emoji rain by firing multiple sets
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 20,
          spread: 100,
          origin: { y: 0, x: Math.random() },
          gravity: 1.2,
          scalar: 2,
        });
      }, i * 300);
    }
  }, []);

  const activatePartyMode = useCallback(() => {
    setPartyMode(true);
    triggerEasterEgg(EASTER_EGG_MESSAGES[0]);
    
    // Fire confetti multiple times
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00C2A8', '#00FFD1', '#FFD43B', '#7DE3D6', '#B8F3EA'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00C2A8', '#00FFD1', '#FFD43B', '#7DE3D6', '#B8F3EA'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setTimeout(() => setPartyMode(false), duration);
  }, [triggerEasterEgg]);

  const activateDiscoMode = useCallback(() => {
    setDiscoMode(true);
    triggerEasterEgg(EASTER_EGG_MESSAGES[3]);
    toast.success('🎨 Disco Mode Activated!', {
      description: 'Groovy colors for 10 seconds!',
    });
    setTimeout(() => setDiscoMode(false), 10000);
  }, [triggerEasterEgg]);

  const activateRainbowMode = useCallback(() => {
    setRainbowMode(true);
    triggerEasterEgg({ emoji: '🌈', title: 'Rainbow Mode!', message: 'Taste the rainbow!' });
    toast.success('🌈 Rainbow Mode Activated!', {
      description: 'Everything is colorful!',
    });
    setTimeout(() => setRainbowMode(false), 10000);
  }, [triggerEasterEgg]);

  const activateUnicornMode = useCallback(() => {
    setUnicornMode(true);
    triggerEasterEgg(EASTER_EGG_MESSAGES[5]);
    toast.success('🦄 Unicorn Mode Activated!', {
      description: 'Magical sparkles everywhere!',
    });
    // Continuous sparkle confetti
    const duration = 8000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff99ff', '#99ccff', '#ffccff', '#ccffff'],
        shapes: ['star'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff99ff', '#99ccff', '#ffccff', '#ccffff'],
        shapes: ['star'],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
    setTimeout(() => setUnicornMode(false), duration);
  }, [triggerEasterEgg]);

  const activateTurboMode = useCallback(() => {
    setTurboMode(true);
    triggerEasterEgg(EASTER_EGG_MESSAGES[9]);
    toast.success('⚡ Turbo Mode Activated!', {
      description: 'Everything is faster now!',
    });
    setTimeout(() => setTurboMode(false), 10000);
  }, [triggerEasterEgg]);

  const activateMatrixMode = useCallback(() => {
    setMatrixMode(true);
    triggerEasterEgg({ emoji: '💚', title: 'Matrix Mode!', message: 'Welcome to the Matrix...' });
    toast.success('💚 Matrix Mode Activated!', {
      description: 'Follow the green text...',
    });
    setTimeout(() => setMatrixMode(false), 10000);
  }, [triggerEasterEgg]);

  const activateGravityMode = useCallback(() => {
    setGravityMode(true);
    triggerEasterEgg({ emoji: '🌍', title: 'Gravity Mode!', message: 'What goes up must come down!' });
    toast.success('🌍 Gravity Mode Activated!', {
      description: 'Things are falling!',
    });
    setTimeout(() => setGravityMode(false), 8000);
  }, [triggerEasterEgg]);

  const activateGlitchMode = useCallback(() => {
    setGlitchMode(true);
    triggerEasterEgg({ emoji: '📺', title: 'Glitch Mode!', message: 'Reality.exe has stopped working!' });
    toast.success('📺 Glitch Mode Activated!', {
      description: 'Everything is glitching!',
    });
    setTimeout(() => setGlitchMode(false), 8000);
  }, [triggerEasterEgg]);

  // Konami Code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard events when user is typing in an input field
      const target = e.target as HTMLElement;
      const isTypingInField = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;
      
      const key = e.key;

      // Keyboard shortcuts (only work when NOT in input fields)
      if (e.ctrlKey && e.shiftKey && key === 'M') {
        e.preventDefault();
        activateMatrixMode();
        return;
      }

      if (e.ctrlKey && e.shiftKey && key === 'C') {
        e.preventDefault();
        fireConfetti();
        toast.success('🎊 Confetti Burst!');
        return;
      }

      if (e.ctrlKey && e.shiftKey && key === 'R') {
        e.preventDefault();
        activateRainbowMode();
        return;
      }

      if (e.ctrlKey && e.shiftKey && key === 'P') {
        e.preventDefault();
        activatePartyMode();
        return;
      }

      if (e.ctrlKey && e.shiftKey && key === 'U') {
        e.preventDefault();
        activateUnicornMode();
        return;
      }

      if (e.ctrlKey && e.shiftKey && key === 'T') {
        e.preventDefault();
        activateTurboMode();
        return;
      }

      if (e.ctrlKey && e.shiftKey && key === 'G') {
        e.preventDefault();
        activateGlitchMode();
        return;
      }
      
      // SECRET PHRASES: Only track when NOT typing in input fields
      if (isTypingInField) {
        return; // Don't track secret phrases while typing in forms
      }
      
      // Track secret phrase typing
      const newPhrase = (secretPhrase + key).toLowerCase().slice(-20);
      setSecretPhrase(newPhrase);

      // Check for secret phrases
      if (newPhrase.includes('chorecore') || newPhrase.includes('core')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[1]);
        fireConfetti();
        setSecretPhrase('');
      }

      if (newPhrase.includes('disco')) {
        activateDiscoMode();
        setSecretPhrase('');
      }

      if (newPhrase.includes('rainbow')) {
        activateRainbowMode();
        setSecretPhrase('');
      }

      if (newPhrase.includes('unicorn')) {
        activateUnicornMode();
        setSecretPhrase('');
      }

      if (newPhrase.includes('pizza')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[6]);
        triggerEmojiRain('🍕');
        setSecretPhrase('');
      }

      if (newPhrase.includes('cookie')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[17]);
        triggerEmojiRain('🍪');
        setSecretPhrase('');
      }

      if (newPhrase.includes('taco')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[16]);
        triggerEmojiRain('🌮');
        setSecretPhrase('');
      }

      if (newPhrase.includes('fire')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[7]);
        triggerEmojiRain('🔥');
        setSecretPhrase('');
      }

      if (newPhrase.includes('ice') || newPhrase.includes('freeze')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[8]);
        triggerEmojiRain('❄️');
        setSecretPhrase('');
      }

      if (newPhrase.includes('magic')) {
        activateUnicornMode();
        setSecretPhrase('');
      }

      if (newPhrase.includes('turbo') || newPhrase.includes('speed') || newPhrase.includes('fast')) {
        activateTurboMode();
        setSecretPhrase('');
      }

      if (newPhrase.includes('matrix')) {
        activateMatrixMode();
        setSecretPhrase('');
      }

      if (newPhrase.includes('gravity')) {
        activateGravityMode();
        setSecretPhrase('');
      }

      if (newPhrase.includes('glitch')) {
        activateGlitchMode();
        setSecretPhrase('');
      }

      if (newPhrase.includes('legendary') || newPhrase.includes('legend')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[10]);
        activatePartyMode();
        setSecretPhrase('');
      }

      if (newPhrase.includes('winner') || newPhrase.includes('win')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[11]);
        fireConfetti();
        setSecretPhrase('');
      }

      if (newPhrase.includes('awesome') || newPhrase.includes('amazing')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[11]);
        fireConfetti();
        toast.success('No, YOU\'RE awesome! 😊');
        setSecretPhrase('');
      }

      if (newPhrase.includes('secret')) {
        toast.info('🤫 Psst... Try typing "unicorn", "matrix", or "gravity"!', {
          duration: 5000,
        });
        setSecretPhrase('');
      }

      if (newPhrase.includes('cat') || newPhrase.includes('meow')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[14]);
        triggerEmojiRain('🐱');
        setSecretPhrase('');
      }

      if (newPhrase.includes('diamond')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[19]);
        triggerEmojiRain('💎');
        setSecretPhrase('');
      }

      if (newPhrase.includes('star')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[11]);
        triggerEmojiRain('⭐');
        setSecretPhrase('');
      }

      if (newPhrase.includes('rocket')) {
        triggerEasterEgg(EASTER_EGG_MESSAGES[9]);
        triggerEmojiRain('🚀');
        setSecretPhrase('');
      }

      // Check Konami code
      if (key === KONAMI_CODE[konamiProgress]) {
        const newProgress = konamiProgress + 1;
        setKonamiProgress(newProgress);

        if (newProgress === KONAMI_CODE.length) {
          activatePartyMode();
          setKonamiProgress(0);
        }
      } else {
        setKonamiProgress(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiProgress, secretPhrase, activateMatrixMode, activateRainbowMode, activatePartyMode, activateUnicornMode, activateTurboMode, activateGlitchMode, activateDiscoMode, activateGravityMode, triggerEasterEgg, triggerEmojiRain, fireConfetti]);

  // Click combo detector
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Increment click combo
      const newCombo = clickCombo + 1;
      setClickCombo(newCombo);

      // Reset combo after 2 seconds of no clicks
      setTimeout(() => setClickCombo(0), 2000);

      // 20 clicks = achievement
      if (newCombo === 20) {
        triggerEasterEgg({ emoji: '🖱️', title: 'Click Master!', message: 'You clicked 20 times!' });
        fireConfetti();
        setClickCombo(0);
      }

      // Check for corner clicks
      const x = e.clientX;
      const y = e.clientY;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cornerSize = 50;

      let corner = '';
      if (x < cornerSize && y < cornerSize) corner = 'tl';
      else if (x > w - cornerSize && y < cornerSize) corner = 'tr';
      else if (x < cornerSize && y > h - cornerSize) corner = 'bl';
      else if (x > w - cornerSize && y > h - cornerSize) corner = 'br';

      if (corner) {
        const newCorners = new Set(cornersClicked);
        newCorners.add(corner);
        setCornersClicked(newCorners);

        if (newCorners.size === 4) {
          triggerEasterEgg({ emoji: '🎯', title: 'Corner Master!', message: 'You clicked all 4 corners!' });
          activatePartyMode();
          setCornersClicked(new Set());
        }
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [clickCombo, cornersClicked, triggerEasterEgg, fireConfetti, activatePartyMode]);

  // Mouse shake detector
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - lastMousePos.x);
      const dy = Math.abs(e.clientY - lastMousePos.y);
      
      // If mouse moved more than 100px in one frame, count as shake
      if (dx > 100 || dy > 100) {
        const newShake = shakeCount + 1;
        setShakeCount(newShake);

        setTimeout(() => setShakeCount(0), 1000);

        if (newShake >= 10) {
          triggerEasterEgg({ emoji: '🌪️', title: 'Shake Master!', message: 'You shook the screen!' });
          activateGlitchMode();
          setShakeCount(0);
        }
      }

      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lastMousePos, shakeCount, triggerEasterEgg, activateGlitchMode]);

  // Time-based Easter egg - check if it's midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours === 0 && minutes === 0) {
        triggerEasterEgg({ emoji: '🌙', title: 'Midnight Chorer!', message: 'Cleaning at midnight? You\'re dedicated!' });
        activateMatrixMode();
      }

      // Easter egg for exact 4:20
      if (hours === 4 && minutes === 20) {
        triggerEasterEgg({ emoji: '🌿', title: 'Early Bird!', message: '4:20 AM? That\'s dedication!' });
        fireConfetti();
      }

      // Easter egg for 13:37 (leet time)
      if (hours === 13 && minutes === 37) {
        triggerEasterEgg({ emoji: '💻', title: '1337 H4X0R!', message: 'Leet time detected!' });
        activateMatrixMode();
      }
    };

    const interval = setInterval(checkMidnight, 60000); // Check every minute
    checkMidnight(); // Check immediately

    return () => clearInterval(interval);
  }, [triggerEasterEgg, activateMatrixMode, fireConfetti]);

  return (
    <div className={`
      ${partyMode ? 'animate-pulse' : ''}
      ${discoMode ? 'disco-mode' : ''}
      ${rainbowMode ? 'rainbow-mode' : ''}
      ${turboMode ? 'turbo-mode' : ''}
      ${unicornMode ? 'unicorn-mode' : ''}
      ${matrixMode ? 'matrix-mode' : ''}
      ${gravityMode ? 'gravity-mode' : ''}
      ${glitchMode ? 'glitch-mode' : ''}
    `}>
      {children}

      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          >
            <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-400/90 to-orange-500/90 rounded-3xl p-6 shadow-2xl border-4 border-white/60 min-w-80">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-5xl"
                >
                  {achievementData.emoji}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl text-white mb-1 drop-shadow-lg">
                    {achievementData.title}
                  </h3>
                  <p className="text-white/90 text-sm drop-shadow">
                    {achievementData.message}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Star className="size-4 text-white fill-white animate-pulse" />
                  <Sparkles className="size-4 text-white fill-white animate-pulse delay-100" />
                  <Trophy className="size-4 text-white fill-white animate-pulse delay-200" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Party Mode Overlay */}
      {partyMode && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle, rgba(255,107,107,0.2) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(78,205,196,0.2) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(255,230,109,0.2) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(241,167,254,0.2) 0%, transparent 70%)',
              ],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Corner Click Indicators */}
      {cornersClicked.size > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {cornersClicked.has('tl') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 left-4 text-4xl"
            >
              ✨
            </motion.div>
          )}
          {cornersClicked.has('tr') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 text-4xl"
            >
              ✨
            </motion.div>
          )}
          {cornersClicked.has('bl') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-4 left-4 text-4xl"
            >
              ✨
            </motion.div>
          )}
          {cornersClicked.has('br') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-4 right-4 text-4xl"
            >
              ✨
            </motion.div>
          )}
        </div>
      )}

      {/* Special Mode Styles */}
      <style>{`
        .disco-mode {
          animation: disco-bg 1s infinite;
        }
        
        @keyframes disco-bg {
          0% { filter: hue-rotate(0deg) saturate(1.5); }
          25% { filter: hue-rotate(90deg) saturate(1.5); }
          50% { filter: hue-rotate(180deg) saturate(1.5); }
          75% { filter: hue-rotate(270deg) saturate(1.5); }
          100% { filter: hue-rotate(360deg) saturate(1.5); }
        }

        .rainbow-mode * {
          animation: rainbow-text 3s infinite;
        }

        @keyframes rainbow-text {
          0% { color: #00C2A8; }
          16% { color: #00FFD1; }
          33% { color: #7DE3D6; }
          50% { color: #B8F3EA; }
          66% { color: #FFD43B; }
          83% { color: #FFC107; }
          100% { color: #00C2A8; }
        }

        .turbo-mode * {
          animation-duration: 0.3s !important;
          transition-duration: 0.1s !important;
        }

        .unicorn-mode {
          animation: unicorn-glow 2s infinite;
        }

        @keyframes unicorn-glow {
          0%, 100% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.2) saturate(1.8); }
        }

        .matrix-mode {
          filter: hue-rotate(90deg) saturate(2);
          animation: matrix-flicker 0.1s infinite;
        }

        @keyframes matrix-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.98; }
        }

        .gravity-mode * {
          animation: gravity-fall 2s ease-in;
        }

        @keyframes gravity-fall {
          0% { transform: translateY(-20px); }
          50% { transform: translateY(5px); }
          100% { transform: translateY(0); }
        }

        .glitch-mode {
          animation: glitch 0.3s infinite;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
}

// Triple-Click Easter Egg Hook
export function useTripleClick(callback: () => void, delay = 500) {
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState(0);

  const handleClick = useCallback(() => {
    const now = Date.now();
    
    if (now - lastClick < delay) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      if (newCount === 2) {
        callback();
        setClickCount(0);
      }
    } else {
      setClickCount(0);
    }
    
    setLastClick(now);
  }, [clickCount, lastClick, delay, callback]);

  return handleClick;
}

// Emoji Rain Easter Egg
export function EmojiRain({ emoji, duration = 3000 }: { emoji: string; duration?: number }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    const count = 30;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: -100, x: `${particle.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            rotate: 360,
            opacity: 0,
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            ease: 'linear',
          }}
          className="absolute text-4xl"
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

// Click Counter for Emoji Easter Eggs
export function useEmojiClickCounter(threshold = 10, callback: () => void) {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);

    if (newCount >= threshold) {
      callback();
      setCount(0);
    }
  }, [count, threshold, callback]);

  return { count, handleClick, reset: () => setCount(0) };
}
