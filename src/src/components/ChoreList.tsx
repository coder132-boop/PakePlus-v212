import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Check, User, Star, Sparkles, RefreshCw } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';
import { useEmojiClickCounter, EmojiRain } from './EasterEggs';
import { toast } from 'sonner@2.0.3';

export function ChoreList() {
  const { getTodaysChores, toggleChore, recurringTasks, userRole } = useTaskContext();
  const chores = getTodaysChores();

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [rainEmoji, setRainEmoji] = useState<string | null>(null);
  
  const { handleClick: handleEmojiClick } = useEmojiClickCounter(10, () => {
    toast.success('🎉 Emoji Master!', {
      description: 'You clicked an emoji 10 times!',
    });
    setRainEmoji('🎉');
    setTimeout(() => setRainEmoji(null), 100);
  });

  const filteredChores = chores.filter(chore => {
    if (filter === 'active') return chore.status === 'incomplete';
    if (filter === 'completed') return chore.status === 'completed' || chore.status === 'pending_approval';
    return true;
  });

  const totalPoints = chores.filter(c => c.status === 'completed').reduce((sum, c) => sum + (c.awarded_points || c.points), 0);
  const completedCount = chores.filter(c => c.status === 'completed').length;
  const pendingCount = chores.filter(c => c.status === 'pending_approval').length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <>
      {rainEmoji && <EmojiRain emoji={rainEmoji} />}
      
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Today's Chores
          </h1>
          <p className="text-base sm:text-lg text-foreground/70">
            {dayName} - Check off tasks and earn points! ⭐
          </p>
        </motion.div>

        {/* Auto-generated info banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-lg border border-white/60 mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <RefreshCw className="size-4 sm:size-5 text-indigo-600 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-foreground">
              <strong>Auto-generated from {recurringTasks.length} recurring tasks!</strong> These chores are automatically created based on your recurring task templates.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/60 mb-4 sm:mb-6"
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-1">📝</div>
              <div className="text-xl sm:text-2xl text-foreground">{chores.length}</div>
              <div className="text-xs sm:text-sm text-foreground/70">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-1">✅</div>
              <div className="text-xl sm:text-2xl text-foreground">{completedCount}</div>
              <div className="text-xs sm:text-sm text-foreground/70">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-1">⭐</div>
              <div className="text-xl sm:text-2xl text-foreground">{totalPoints}</div>
              <div className="text-xs sm:text-sm text-foreground/70">Points Earned</div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-lg border border-white/60 mb-4 sm:mb-6 inline-flex gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto mobile-scroll"
        >
          {[
            { id: 'all', label: 'All', emoji: '📋' },
            { id: 'active', label: 'Active', emoji: '🎯' },
            { id: 'completed', label: 'Done', emoji: '✅' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`
                px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all flex-1 sm:flex-none touch-target whitespace-nowrap
                ${filter === tab.id 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105' 
                  : 'hover:bg-white/60 text-foreground'
                }
              `}
            >
              <span className="mr-1 sm:mr-2">{tab.emoji}</span>
              <span className="text-sm sm:text-base">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Chore List */}
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredChores.map((chore, index) => (
              <motion.div
                key={chore.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`
                    backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/60 cursor-pointer
                    ${chore.status === 'completed' ? 'opacity-70' : ''}
                    ${chore.status === 'pending_approval' ? 'border-orange-400 border-2' : ''}
                    transition-all relative overflow-hidden
                  `}
                  onClick={() => toggleChore(chore.id)}
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${chore.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                  <div className="relative flex items-start gap-3 sm:gap-4">
                    {/* Checkbox */}
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className={`
                        size-7 sm:size-8 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1 touch-target
                        ${chore.status === 'completed'
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-400'
                          : chore.status === 'pending_approval'
                          ? 'bg-gradient-to-br from-orange-400 to-yellow-400 border-orange-400'
                          : 'border-foreground/30 bg-white/50'
                        }
                        transition-all
                      `}
                    >
                      {chore.status === 'completed' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check className="size-5 text-white" />
                        </motion.div>
                      )}
                      {chore.status === 'pending_approval' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <span className="text-white text-xs">⏳</span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Emoji Icon - Click 10 times for Easter egg! */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmojiClick();
                      }}
                      className={`size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${chore.color} flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0 hover:scale-110 active:scale-95 transition-transform touch-target`}
                    >
                      {chore.emoji}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1 sm:mb-2">
                        <h3 className={`text-base sm:text-xl text-foreground ${chore.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                          {chore.title}
                        </h3>
                        
                        <div className="flex items-center gap-1 bg-yellow-400/30 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 backdrop-blur-sm flex-shrink-0">
                          <Star className="size-3 sm:size-4 text-yellow-600 fill-yellow-600" />
                          <span className="text-xs sm:text-sm text-foreground">
                            {chore.status === 'completed' && chore.awarded_points 
                              ? chore.awarded_points 
                              : chore.points}
                          </span>
                        </div>
                      </div>

                      <p className={`text-xs sm:text-sm text-foreground/70 mb-2 sm:mb-3 ${chore.status === 'completed' ? 'line-through' : ''}`}>
                        {chore.description}
                      </p>

                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-foreground/70">
                          <User className="size-3 sm:size-4" />
                          <span className="truncate max-w-[100px] sm:max-w-none">{chore.assignee}</span>
                        </div>
                        
                        <div className={`${getDifficultyColor(chore.difficulty)} text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full`}>
                          {chore.difficulty.charAt(0).toUpperCase() + chore.difficulty.slice(1)}
                        </div>

                        {chore.status === 'pending_approval' && (
                          <div className="flex items-center gap-0.5 sm:gap-1 bg-orange-400/30 text-orange-700 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                            <span>⏳</span>
                            <span className="hidden sm:inline">Pending Approval</span>
                            <span className="sm:hidden">Pending</span>
                          </div>
                        )}

                        {chore.recurringTaskId && (
                          <div className="flex items-center gap-0.5 sm:gap-1 bg-indigo-400/30 text-indigo-700 text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                            <RefreshCw className="size-2 sm:size-3" />
                            <span className="hidden sm:inline">Auto-generated</span>
                            <span className="sm:hidden">Auto</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Completion celebration */}
                  {chore.status === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="text-4xl">🎉</div>
                    </motion.div>
                  )}

                  {/* Pending approval indicator */}
                  {chore.status === 'pending_approval' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="text-4xl">⏳</div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredChores.length === 0 && chores.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl p-12 shadow-lg border border-white/60 text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl text-foreground mb-2">No Chores Today!</h3>
            <p className="text-foreground/70 mb-4">
              You don't have any chores scheduled for {dayName}.
            </p>
            <p className="text-sm text-foreground/60">
              Go to the <strong>Recurring Tasks</strong> page to set up automatic chore templates!
            </p>
          </motion.div>
        )}

        {/* Empty filter state */}
        {filteredChores.length === 0 && chores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl p-12 shadow-lg border border-white/60 text-center"
          >
            <div className="text-6xl mb-4">🎊</div>
            <h3 className="text-2xl text-foreground mb-2">
              {filter === 'completed' ? 'No Completed Chores Yet' : 'All Done!'}
            </h3>
            <p className="text-foreground/70">
              {filter === 'completed' 
                ? "You haven't completed any chores yet. Get started!" 
                : "No active chores right now. Great job!"}
            </p>
          </motion.div>
        )}

        {/* Pending approval message for members */}
        {userRole === 'member' && pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 backdrop-blur-xl bg-gradient-to-br from-orange-400/40 to-yellow-400/40 rounded-3xl p-6 shadow-lg border border-white/60"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">⏳</div>
              <div>
                <h3 className="text-xl text-foreground mb-2">Chores Pending Approval</h3>
                <p className="text-sm text-foreground/80">
                  You have {pendingCount} {pendingCount === 1 ? 'chore' : 'chores'} waiting for admin approval. An admin will review and award points soon!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* All chores completed celebration */}
        {chores.length > 0 && completedCount === chores.length && pendingCount === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 backdrop-blur-xl bg-gradient-to-br from-green-400/40 to-emerald-400/40 rounded-3xl p-8 shadow-lg border border-white/60 text-center"
          >
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-3xl text-foreground mb-3">All Tasks Complete</h3>
            <p className="text-lg text-foreground/80 mb-2">
              You've finished all your tasks for today.
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl">
              <Star className="size-6 text-yellow-600 fill-yellow-600" />
              <span className="text-foreground">{totalPoints} points earned today</span>
            </div>
          </motion.div>
        )}

        {/* Helpful Tip */}
        {chores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 backdrop-blur-xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-3xl p-6 shadow-lg border border-white/60"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h3 className="text-lg text-foreground mb-2">How It Works</h3>
                <p className="text-sm text-foreground/80">
                  {userRole === 'admin' 
                    ? 'Review pending tasks in the House Dashboard to approve completions and award points. Recurring tasks automatically generate new daily tasks.'
                    : 'Click any task to mark it as complete. An admin will review and award points based on the work completed.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}
