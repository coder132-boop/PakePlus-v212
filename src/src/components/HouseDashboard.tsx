import { motion } from 'motion/react';
import { Star, Trophy, Target, Zap, TrendingUp, Award, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from './ui/progress';
import { useTaskContext } from '../contexts/TaskContext';
import { useState, useCallback } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { EmojiRain } from './EasterEggs';
import confetti from 'canvas-confetti';
import { toast } from 'sonner@2.0.3';

interface HouseDashboardProps {
  onNavigate?: (page: string) => void;
}

export function HouseDashboard({ onNavigate }: HouseDashboardProps = {}) {
  const { pendingChores, approveChore, userRole, loadPendingChores, houseMembers, chores, user } = useTaskContext();
  const [awardingPoints, setAwardingPoints] = useState<{ [key: string]: number }>({});
  const [showTrophyRain, setShowTrophyRain] = useState(false);
  const [trophyClickCount, setTrophyClickCount] = useState(0);

  // Secret trophy Easter egg - click trophy icon 5 times
  const handleTrophyClick = useCallback(() => {
    const newCount = trophyClickCount + 1;
    setTrophyClickCount(newCount);
    
    if (newCount >= 5) {
      setShowTrophyRain(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347'],
      });
      toast.success('🏆 Trophy Collector!', {
        description: 'You found the secret trophy celebration!',
      });
      setTrophyClickCount(0);
      setTimeout(() => setShowTrophyRain(false), 100);
    }
  }, [trophyClickCount]);

  // Calculate real stats from actual data
  const today = new Date().toISOString().split('T')[0];
  const todaysChores = chores.filter(c => c.date === today);
  const completedTodayCount = todaysChores.filter(c => c.status === 'completed').length;
  
  // Calculate member data with real points and completed tasks
  const membersData = houseMembers.map(member => {
    const memberChores = chores.filter(c => c.assignee === member.displayName);
    const memberCompletedChores = memberChores.filter(c => c.status === 'completed');
    const memberTodayChores = todaysChores.filter(c => c.assignee === member.displayName);
    const points = member.points || 0;
    
    // Calculate level based on points (every 100 points = 1 level)
    const level = Math.floor(points / 100) + 1;
    
    // Generate a color based on member name hash
    const colors = [
      'from-pink-500 to-rose-500',
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-yellow-500',
      'from-indigo-500 to-purple-500',
    ];
    const colorIndex = member.displayName.length % colors.length;
    
    return {
      name: member.displayName,
      avatar: member.displayName[0].toUpperCase(),
      points,
      level,
      streak: member.streak || 0,
      tasksCompleted: memberCompletedChores.length,
      tasksTotal: memberChores.length,
      color: colors[colorIndex],
    };
  });

  // Calculate house stats
  const totalPoints = houseMembers.reduce((sum, m) => sum + (m.points || 0), 0);
  const weeklyGoal = houseMembers.length * 200; // 200 points per member per week
  const tasksCompleted = chores.filter(c => c.status === 'completed').length;
  const activeStreak = Math.max(...houseMembers.map(m => m.streak || 0), 0);

  const houseStats = {
    totalPoints,
    weeklyGoal,
    tasksCompleted,
    activeStreak,
  };

  return (
    <>
      {showTrophyRain && <EmojiRain emoji="🏆" />}
      
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            House Dashboard
          </h1>
          <p className="text-base sm:text-lg text-foreground/70">Track everyone's progress and celebrate wins together! 🎉</p>
        </motion.div>

        {/* House Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-white/60 mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6 flex items-center gap-2">
            <button 
              onClick={handleTrophyClick}
              className="hover:scale-110 active:scale-95 transition-transform touch-target"
              title="Click me 5 times!"
            >
              <Trophy className="size-5 sm:size-6 text-yellow-500" />
            </button>
            <span className="text-base sm:text-xl md:text-2xl">House Progress This Week</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="backdrop-blur-lg bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⭐</div>
              <div className="text-xl sm:text-2xl text-foreground">{houseStats.totalPoints}</div>
              <div className="text-xs sm:text-sm text-foreground/70">Total Points</div>
            </div>
            
            <div className="backdrop-blur-lg bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">✅</div>
              <div className="text-xl sm:text-2xl text-foreground">{houseStats.tasksCompleted}</div>
              <div className="text-xs sm:text-sm text-foreground/70">Tasks Done</div>
            </div>
            
            <div className="backdrop-blur-lg bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🔥</div>
              <div className="text-xl sm:text-2xl text-foreground">{houseStats.activeStreak}</div>
              <div className="text-xs sm:text-sm text-foreground/70">Day Streak</div>
            </div>
            
            <div className="backdrop-blur-lg bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎯</div>
              <div className="text-xl sm:text-2xl text-foreground">{Math.round((houseStats.totalPoints / houseStats.weeklyGoal) * 100)}%</div>
              <div className="text-xs sm:text-sm text-foreground/70">Weekly Goal</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-foreground/70">
              <span>Weekly Goal Progress</span>
              <span>{houseStats.totalPoints} / {houseStats.weeklyGoal} points</span>
            </div>
            <Progress value={(houseStats.totalPoints / houseStats.weeklyGoal) * 100} className="h-4" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Members Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3 sm:mb-4"
            >
              <h2 className="text-xl sm:text-2xl text-foreground flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">👥</span>
                House Members
              </h2>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              {membersData.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/60"
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className={`size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-3xl sm:text-4xl shadow-lg flex-shrink-0`}>
                      {member.avatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
                        <h3 className="text-lg sm:text-xl text-foreground truncate">{member.name}</h3>
                        <div className="flex items-center gap-1 bg-yellow-400/30 rounded-full px-2 sm:px-3 py-1 backdrop-blur-sm flex-shrink-0">
                          <Star className="size-3 sm:size-4 text-yellow-600 fill-yellow-600" />
                          <span className="text-xs sm:text-sm text-foreground">{member.points}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-foreground/70 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Trophy className="size-3 sm:size-4" />
                          Level {member.level}
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="size-3 sm:size-4 text-orange-500" />
                          {member.streak} day streak
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-foreground/70">
                      <span>Tasks Progress</span>
                      <span>{member.tasksCompleted} / {member.tasksTotal}</span>
                    </div>
                    <Progress value={(member.tasksCompleted / member.tasksTotal) * 100} className="h-3" />
                  </div>

                  {member.tasksCompleted === member.tasksTotal && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-2xl p-3 border border-green-400/40 backdrop-blur-sm text-center"
                    >
                      <span className="text-sm text-foreground">🎉 All tasks completed! Amazing work!</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Admin Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3 sm:mb-4"
            >
              <h2 className="text-xl sm:text-2xl text-foreground flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">👑</span>
                <span className="text-base sm:text-xl md:text-2xl">{userRole === 'admin' ? 'Admin Control Center' : 'House Info'}</span>
              </h2>
            </motion.div>

            {/* Pending Approvals (Admins Only) */}
            {userRole === 'admin' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/60 mb-4 sm:mb-6"
              >
                <h3 className="text-lg sm:text-xl text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <Target className="size-4 sm:size-5" />
                  <span className="text-base sm:text-lg md:text-xl">Pending Approvals ({pendingChores.length})</span>
                </h3>

                {pendingChores.length === 0 ? (
                  <div className="text-center py-8 text-foreground/60">
                    <div className="text-4xl mb-2">✅</div>
                    <p>No chores pending approval!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingChores.map((chore, index) => (
                      <motion.div
                        key={chore.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="backdrop-blur-lg rounded-2xl p-4 border border-orange-400/40 bg-orange-400/20"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`size-12 rounded-2xl bg-gradient-to-br ${chore.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                            {chore.emoji}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-foreground mb-1">{chore.title}</h4>
                            <p className="text-sm text-foreground/70 mb-2">{chore.description}</p>
                            <div className="flex items-center gap-2 text-xs text-foreground/60">
                              <span>👤 {chore.assignee}</span>
                              <span>•</span>
                              <span>Suggested: {chore.points} points</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Award points"
                            value={awardingPoints[chore.id] || chore.points}
                            onChange={(e) => setAwardingPoints({ ...awardingPoints, [chore.id]: parseInt(e.target.value) || 0 })}
                            className="flex-1"
                          />
                          <Button
                            onClick={async () => {
                              await approveChore(chore.id, awardingPoints[chore.id] || chore.points);
                              setAwardingPoints({ ...awardingPoints, [chore.id]: 0 });
                            }}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          >
                            <CheckCircle className="size-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/60"
            >
              <h3 className="text-lg sm:text-xl text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Zap className="size-4 sm:size-5" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button className="backdrop-blur-lg bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40 hover:scale-105 transition-transform touch-target">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">➕</div>
                  <div className="text-xs sm:text-sm text-foreground">Add Chore</div>
                </button>
                
                <button className="backdrop-blur-lg bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40 hover:scale-105 transition-transform touch-target">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎁</div>
                  <div className="text-xs sm:text-sm text-foreground">Set Reward</div>
                </button>
                
                <button className="backdrop-blur-lg bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40 hover:scale-105 transition-transform touch-target">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📊</div>
                  <div className="text-xs sm:text-sm text-foreground">View Reports</div>
                </button>
                
                <button 
                  onClick={() => onNavigate?.('settings')}
                  className="backdrop-blur-lg bg-gradient-to-br from-orange-400/30 to-red-400/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40 hover:scale-105 transition-transform touch-target"
                >
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⚙️</div>
                  <div className="text-xs sm:text-sm text-foreground">Settings</div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
