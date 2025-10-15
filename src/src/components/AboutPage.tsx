import { motion } from 'motion/react';
import { Trash2, Utensils, Sparkles, Star, Trophy, Gift } from 'lucide-react';

export function AboutPage() {
  const steps = [
    {
      icon: Utensils,
      title: 'Admins Create Tasks',
      description: 'House admins set up recurring tasks and assign them to members.',
      color: 'from-[#00C2A8] to-[#00FFD1]',
      emoji: '🍽️',
    },
    {
      icon: Sparkles,
      title: 'Members Complete Work',
      description: 'Members mark tasks as complete when finished and submit for approval.',
      color: 'from-[#00FFD1] to-[#7DE3D6]',
      emoji: '✨',
    },
    {
      icon: Star,
      title: 'Admins Review',
      description: 'Admins review completed tasks and award points based on quality.',
      color: 'from-[#FFD43B] to-[#FFC107]',
      emoji: '⭐',
    },
    {
      icon: Trophy,
      title: 'Track Progress',
      description: 'Monitor individual and household progress with detailed dashboards.',
      color: 'from-[#7DE3D6] to-[#B8F3EA]',
      emoji: '🏆',
    },
    {
      icon: Gift,
      title: 'Earn Points',
      description: 'Complete chores to earn points. Admins decide point values and define rewards you can redeem.',
      color: 'from-[#FFD43B] to-[#00C2A8]',
      emoji: '🎁',
    },
  ];

  const choreTypes = [
    { icon: '🗑️', name: 'Take Out Trash', color: 'bg-gradient-to-br from-slate-400 to-slate-600' },
    { icon: '🍽️', name: 'Wash Dishes', color: 'bg-gradient-to-br from-[#00C2A8] to-[#00FFD1]' },
    { icon: '🧹', name: 'Sweep Floor', color: 'bg-gradient-to-br from-[#FFD43B] to-[#FFC107]' },
    { icon: '🛏️', name: 'Make Bed', color: 'bg-gradient-to-br from-[#00FFD1] to-[#7DE3D6]' },
    { icon: '🧺', name: 'Fold Laundry', color: 'bg-gradient-to-br from-[#7DE3D6] to-[#B8F3EA]' },
    { icon: '🌿', name: 'Water Plants', color: 'bg-gradient-to-br from-[#00C2A8] to-[#7DE3D6]' },
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4 bg-gradient-to-r from-[#00C2A8] via-[#00FFD1] to-[#00C2A8] bg-clip-text text-transparent px-2">
            How It Works
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto px-4">
            A simple approval workflow that keeps everyone accountable
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6 sm:space-y-8 mb-10 sm:mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/60"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Step number and icon */}
                  <div className="flex items-center gap-3 sm:gap-4 sm:flex-col sm:items-center">
                    <div className="relative">
                      <div className={`size-16 sm:size-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-3xl sm:text-4xl">{step.emoji}</span>
                      </div>
                      <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 size-6 sm:size-8 rounded-full bg-white shadow-lg flex items-center justify-center text-foreground text-sm sm:text-base">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl md:text-3xl text-foreground mb-2 sm:mb-3">{step.title}</h3>
                    <p className="text-sm sm:text-base md:text-lg text-foreground/70">{step.description}</p>
                  </div>

                  {/* Decorative icon */}
                  <div className="hidden md:flex">
                    <Icon className="size-12 text-foreground/20" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chore Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 shadow-lg border border-white/60"
        >
          <h2 className="text-3xl text-center mb-8 text-foreground">
            Common Household Tasks
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {choreTypes.map((chore, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`${chore.color} rounded-2xl p-4 shadow-lg text-white text-center`}
              >
                <div className="text-4xl mb-2">{chore.icon}</div>
                <p className="text-sm">{chore.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Speech Bubble Tip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 relative"
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-400/40 to-orange-400/40 rounded-3xl p-8 shadow-lg border border-white/60 text-center">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-2xl text-foreground mb-3">Pro Tip</h3>
            <p className="text-lg text-foreground/80">
              Set up recurring tasks to automate daily assignments. Members stay accountable with the approval workflow.
            </p>
          </div>
          {/* Speech bubble arrow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] border-t-orange-400/40" />
        </motion.div>
      </div>
    </div>
  );
}
