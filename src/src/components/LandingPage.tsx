import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Book, Download } from 'lucide-react';
import { ChoreCoreLogo } from './ChoreCoreLogo';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4 sm:mb-6"
          >
            <div className="relative">
              <div className="size-24 sm:size-32 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-[#00C2A8] via-[#00FFD1] to-white flex items-center justify-center shadow-2xl p-4 sm:p-6">
                <ChoreCoreLogo size={80} className="scale-90 sm:scale-100" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2"
              >
                <Sparkles className="size-6 sm:size-8 text-[#FFD43B] fill-[#FFD43B]" />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl mb-3 sm:mb-4 bg-gradient-to-r from-[#00C2A8] via-[#00FFD1] to-[#00C2A8] bg-clip-text text-transparent px-2">
            ChoreCore
          </h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-block backdrop-blur-xl bg-white/50 rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-4 shadow-lg border border-white/60 mb-6 sm:mb-8 mx-3"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-foreground">
              Smart <span className="text-[#00C2A8]">Habits</span>, Clean <span className="text-[#00FFD1]">Homes</span>
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-12 px-4"
          >
            Transform household chores into an engaging game. Track tasks, earn points, and keep your home running smoothly. Perfect for roommates, families, and shared living spaces.
          </motion.p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="group relative inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#00C2A8] via-[#00FFD1] to-[#00C2A8] text-white text-lg sm:text-2xl shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 touch-target"
            >
              <span>Get Started</span>
              <ArrowRight className="size-5 sm:size-6 group-hover:translate-x-2 transition-transform" />
              
              {/* Animated border glow */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#00FFD1] via-[#7DE3D6] to-[#00FFD1] opacity-0 group-hover:opacity-50 blur-xl -z-10"
              />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl backdrop-blur-xl bg-white/60 hover:bg-white/80 text-foreground text-base sm:text-lg shadow-lg border border-white/60 transition-all duration-300 touch-target"
            >
              <Book className="size-5" />
              <span>Learn More</span>
            </motion.button>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/ChoreCore-Desktop.zip"
              download
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-[#7DE3D6]/60 to-[#00FFD1]/60 hover:from-[#7DE3D6]/80 hover:to-[#00FFD1]/80 text-foreground text-base sm:text-lg shadow-lg border border-white/60 transition-all duration-300 touch-target"
            >
              <Download className="size-5" />
              <span>Desktop App</span>
            </motion.a>
          </div>

          {/* Desktop App Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-4 text-xs sm:text-sm text-foreground/70"
          >
            💻 Available for Windows, Mac, and Linux
          </motion.div>

          {/* Passwordless Auth Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 backdrop-blur-xl bg-gradient-to-r from-[#00FFD1]/30 to-[#7DE3D6]/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-white/60 mx-3 max-w-md"
          >
            <span className="text-xl sm:text-2xl flex-shrink-0">🔐</span>
            <div className="text-left">
              <p className="text-xs sm:text-sm text-foreground/90">
                <span className="text-[#00C2A8] font-medium">Simple & secure!</span> Sign in with your email and password.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-16"
        >
          {[
            { emoji: '🔄', title: 'Set Recurring Tasks', color: 'from-[#00C2A8] to-[#00FFD1]' },
            { emoji: '✅', title: 'Check Off Daily', color: 'from-[#00FFD1] to-[#7DE3D6]' },
            { emoji: '🎁', title: 'Earn Points', color: 'from-[#FFD43B] to-[#FFC107]' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/60 text-center"
            >
              <div className={`size-16 sm:size-20 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl sm:text-4xl shadow-lg`}>
                {item.emoji}
              </div>
              <h3 className="text-lg sm:text-xl text-foreground">{item.title}</h3>
            </motion.div>
          ))}
        </motion.div>

        {/* Why ChoreCore Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-10 sm:mt-16 backdrop-blur-xl bg-gradient-to-br from-[#FFD43B]/30 to-[#FFC107]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#FFD43B]/40 text-center"
        >
          <div className="size-16 sm:size-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FFD43B] to-[#FFC107] flex items-center justify-center shadow-lg">
            <Sparkles className="size-8 sm:size-10 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl text-foreground mb-3">Why ChoreCore?</h3>
          <p className="text-sm sm:text-base text-foreground/80 mb-6 max-w-2xl mx-auto">
            Make household chores fun and rewarding. With motivating progress tracking, beautiful themes, and smart scheduling, keeping your home clean has never been easier.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              { name: 'Motivating', emoji: '🎯', desc: 'Track progress' },
              { name: 'Beautiful', emoji: '✨', desc: '9 themes' },
              { name: 'Smart', emoji: '🧠', desc: 'Auto-schedule' },
              { name: 'Mobile', emoji: '📱', desc: 'Anywhere' },
            ].map((feature, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/40 rounded-xl p-4 border border-white/60">
                <div className="text-3xl mb-2">{feature.emoji}</div>
                <div className="text-sm text-foreground mb-1">{feature.name}</div>
                <div className="text-xs text-foreground/70">{feature.desc}</div>
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FFD43B] to-[#FFC107] text-white shadow-lg hover:shadow-xl transition-all"
          >
            <span className="text-lg">Start Your Free Account</span>
            <ArrowRight className="size-5" />
          </motion.button>
        </motion.div>

        {/* Fun facts floating cards */}
        <div className="mt-10 sm:mt-16 grid md:grid-cols-2 gap-4 sm:gap-6">
          {/* Passwordless Auth Feature - Full Width Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="md:col-span-2 backdrop-blur-xl bg-gradient-to-br from-[#00FFD1]/30 to-[#7DE3D6]/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-[#00FFD1]/40 relative overflow-hidden"
          >
            {/* Animated shine effect */}
            <motion.div
              animate={{ x: ['0%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                  🔐
                </div>
                <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                  ✨
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl text-center text-foreground mb-2 sm:mb-3">
                Simple & Secure Authentication
              </h3>
              
              <p className="text-center text-sm sm:text-base md:text-lg text-foreground/80 mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
                Create your account in seconds with email and password. 
                <br className="hidden md:block" />
                Join households using simple 6-digit invite codes.
              </p>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="backdrop-blur-xl bg-white/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-white/60">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📧</div>
                  <p className="text-xs sm:text-sm text-foreground/90">Email & password</p>
                </div>
                <div className="backdrop-blur-xl bg-white/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-white/60">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏠</div>
                  <p className="text-xs sm:text-sm text-foreground/90">Create or join</p>
                </div>
                <div className="backdrop-blur-xl bg-white/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-white/60">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎉</div>
                  <p className="text-xs sm:text-sm text-foreground/90">You're in!</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-foreground/70">
                <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse" />
                <span>Secure • Fast • No email verification needed</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8 }}
            className="backdrop-blur-xl bg-gradient-to-br from-[#00C2A8]/20 to-[#00FFD1]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/60"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                👨‍👩‍👧‍👦
              </div>
              <div>
                <h3 className="text-lg sm:text-xl text-foreground mb-1 sm:mb-2">Perfect for Any Living Space</h3>
                <p className="text-sm sm:text-base text-foreground/70">Coordinate tasks with roommates, family members, or anyone sharing your space.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 }}
            className="backdrop-blur-xl bg-gradient-to-br from-[#7DE3D6]/20 to-[#B8F3EA]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/60"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7DE3D6] to-[#B8F3EA] flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                📱
              </div>
              <div>
                <h3 className="text-lg sm:text-xl text-foreground mb-1 sm:mb-2">Easy to Use</h3>
                <p className="text-sm sm:text-base text-foreground/70">Intuitive interface designed for everyone, regardless of age or tech experience.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
