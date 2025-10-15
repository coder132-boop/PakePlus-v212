import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Star, Gift, Trophy, Crown, Sparkles, Lock, Settings, Plus, Pencil, Trash2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner@2.0.3';
import { useTaskContext } from '../contexts/TaskContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  emoji: string;
  color: string;
  house_id: string;
  created_at?: string;
  created_by?: string;
}

const colorOptions = [
  { label: 'Teal', value: 'from-[#7DE3D6] to-[#B8F3EA]' },
  { label: 'Cyan', value: 'from-[#00C2A8] to-[#00FFD1]' },
  { label: 'Yellow', value: 'from-[#FFD43B] to-yellow-400' },
  { label: 'Purple', value: 'from-purple-400 to-purple-600' },
  { label: 'Pink', value: 'from-pink-400 to-pink-600' },
  { label: 'Orange', value: 'from-orange-400 to-orange-600' },
  { label: 'Green', value: 'from-green-400 to-green-600' },
  { label: 'Blue', value: 'from-blue-400 to-blue-600' },
];

export function PointsPage() {
  const { houseMembers, user, userRole, accessToken } = useTaskContext();
  
  // Find current user's points
  const currentUserProfile = houseMembers.find(m => m.user_id === user?.id);
  const userPoints = currentUserProfile?.points || 0;
  
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [milestoneShown, setMilestoneShown] = useState<number[]>([]);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  
  // Form state for creating/editing rewards
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formEmoji, setFormEmoji] = useState('🎁');
  const [formColor, setFormColor] = useState('from-[#00C2A8] to-[#00FFD1]');

  const isAdmin = userRole === 'admin';

  // Fetch rewards from backend
  useEffect(() => {
    fetchRewards();
  }, [accessToken]);

  const fetchRewards = async () => {
    if (!accessToken) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/rewards`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch rewards');
      }

      const data = await response.json();
      setRewards(data.rewards || []);
    } catch (error: any) {
      console.error('Error fetching rewards:', error);
      toast.error('Failed to load rewards', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Milestone Easter eggs
  useEffect(() => {
    const milestones = [100, 250, 500, 1000];
    const reached = milestones.find(m => userPoints >= m && !milestoneShown.includes(m));
    
    if (reached) {
      setMilestoneShown([...milestoneShown, reached]);
      
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00C2A8', '#00FFD1', '#FFD43B', '#7DE3D6', '#B8F3EA'],
      });
      
      toast.success(`🎉 Milestone Reached: ${reached} Points!`, {
        description: getMilestoneMessage(reached),
        duration: 5000,
      });
    }
  }, [userPoints, milestoneShown]);

  const getMilestoneMessage = (points: number) => {
    switch (points) {
      case 100: return 'You\'re getting the hang of this! 🌟';
      case 250: return 'Quarter of the way to legendary status! 💪';
      case 500: return 'Halfway to ChoreCore Champion! 🏆';
      case 1000: return 'You\'re a ChoreCore LEGEND! 👑';
      default: return 'Amazing work!';
    }
  };

  const canAfford = (cost: number) => userPoints >= cost;

  const claimReward = async (reward: Reward) => {
    if (!canAfford(reward.cost) || claimedRewards.includes(reward.id)) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/rewards/${reward.id}/claim`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to claim reward');
      }

      const data = await response.json();
      
      setClaimedRewards([...claimedRewards, reward.id]);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00C2A8', '#00FFD1', '#FFD43B'],
      });

      toast.success('Reward claimed! 🎉', {
        description: `You've claimed "${reward.title}" for ${reward.cost} points!`,
      });

      // Reload the page to refresh points
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward', {
        description: error.message,
      });
    }
  };

  const openCreateDialog = () => {
    setEditingReward(null);
    setFormTitle('');
    setFormDescription('');
    setFormCost('');
    setFormEmoji('🎁');
    setFormColor('from-[#00C2A8] to-[#00FFD1]');
    setManageDialogOpen(true);
  };

  const openEditDialog = (reward: Reward) => {
    setEditingReward(reward);
    setFormTitle(reward.title);
    setFormDescription(reward.description);
    setFormCost(reward.cost.toString());
    setFormEmoji(reward.emoji);
    setFormColor(reward.color);
    setManageDialogOpen(true);
  };

  const handleSaveReward = async () => {
    if (!formTitle || !formDescription || !formCost) {
      toast.error('Please fill in all fields');
      return;
    }

    const cost = parseInt(formCost);
    if (isNaN(cost) || cost < 0) {
      toast.error('Please enter a valid point cost');
      return;
    }

    try {
      const url = editingReward
        ? `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/rewards/${editingReward.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/rewards`;

      const response = await fetch(url, {
        method: editingReward ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          cost: cost,
          emoji: formEmoji,
          color: formColor,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save reward');
      }

      toast.success(editingReward ? 'Reward updated!' : 'Reward created!', {
        description: `"${formTitle}" has been ${editingReward ? 'updated' : 'added to your rewards'}.`,
      });

      setManageDialogOpen(false);
      fetchRewards();
    } catch (error: any) {
      console.error('Error saving reward:', error);
      toast.error('Failed to save reward', {
        description: error.message,
      });
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/rewards/${rewardId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete reward');
      }

      toast.success('Reward deleted');
      fetchRewards();
    } catch (error: any) {
      console.error('Error deleting reward:', error);
      toast.error('Failed to delete reward', {
        description: error.message,
      });
    }
  };

  const achievements = [
    { title: 'First Task', description: 'Complete your first task', icon: '⭐', unlocked: true },
    { title: 'Week Streak', description: 'Complete all tasks for a week', icon: '🔥', unlocked: true },
    { title: 'Point Collector', description: 'Earn 100 points', icon: '💯', unlocked: true },
    { title: 'Early Riser', description: 'Complete tasks before noon', icon: '🌅', unlocked: false },
    { title: 'Consistency Pro', description: '30-day streak', icon: '👑', unlocked: false },
    { title: 'Top Contributor', description: 'Most tasks completed this month', icon: '🏆', unlocked: false },
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-2 bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] bg-clip-text text-transparent">
            Points & Achievements
          </h1>
          <p className="text-base sm:text-lg text-foreground/70">
            Track your points and redeem rewards set by your admin
          </p>
        </motion.div>

        {/* Points Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-[#00C2A8]/40 to-[#00FFD1]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg border border-white/60 mb-6 sm:mb-8 relative overflow-hidden"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-10 -right-10 text-9xl opacity-20"
          >
            ⭐
          </motion.div>
          
          <div className="relative z-10 text-center">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">💰</div>
            <h2 className="text-xl sm:text-2xl text-foreground mb-2">Your Points Balance</h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-5xl sm:text-6xl text-foreground"
            >
              {userPoints}
            </motion.div>
            <p className="text-sm sm:text-base text-foreground/70 mt-2">
              Complete chores to earn points! Admins decide how many points each task is worth.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Rewards */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl text-foreground flex items-center gap-2">
                <Gift className="size-5 sm:size-6" />
                Available Rewards
              </h2>
              {isAdmin ? (
                <Button
                  onClick={openCreateDialog}
                  size="sm"
                  className="bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] hover:from-[#00B89E] hover:to-[#00F0C7] text-white"
                >
                  <Plus className="size-4 mr-1" />
                  Add Reward
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/60">
                  <Settings className="size-3 sm:size-4" />
                  <span>Set by admin</span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="size-8 border-4 border-teal-200 border-t-[#00C2A8] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-foreground/60">Loading rewards...</p>
              </div>
            ) : rewards.length === 0 ? (
              <div className="text-center py-12 backdrop-blur-xl bg-white/40 rounded-3xl border border-white/60">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-xl text-foreground mb-2">No Rewards Yet</h3>
                <p className="text-foreground/70 mb-4">
                  {isAdmin
                    ? 'Create your first reward to get started!'
                    : 'Your admin hasn\'t created any rewards yet.'}
                </p>
                {isAdmin && (
                  <Button
                    onClick={openCreateDialog}
                    className="bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] hover:from-[#00B89E] hover:to-[#00F0C7] text-white"
                  >
                    <Plus className="size-4 mr-2" />
                    Create First Reward
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {rewards.map((reward, index) => {
                  const affordable = canAfford(reward.cost);
                  const claimed = claimedRewards.includes(reward.id);
                  
                  return (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={affordable && !claimed ? { scale: 1.03, y: -4 } : {}}
                      className={`
                        backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/60 relative overflow-hidden
                        ${claimed ? 'opacity-60' : ''}
                        ${affordable && !claimed && !isAdmin ? 'cursor-pointer' : 'cursor-default'}
                        transition-all
                      `}
                      onClick={() => {
                        if (!isAdmin && affordable && !claimed) {
                          claimReward(reward);
                        }
                      }}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${reward.color} opacity-10`} />

                      <div className="relative">
                        {/* Icon */}
                        <div className={`size-16 sm:size-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${reward.color} flex items-center justify-center text-3xl sm:text-4xl shadow-lg mb-3 sm:mb-4 mx-auto`}>
                          {reward.emoji}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl text-foreground text-center mb-1 sm:mb-2">{reward.title}</h3>
                        <p className="text-xs sm:text-sm text-foreground/70 text-center mb-3 sm:mb-4">{reward.description}</p>

                        {/* Cost */}
                        <div className={`
                          flex items-center justify-center gap-1 sm:gap-2 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2
                          ${affordable 
                            ? 'bg-green-400/30 border border-green-400/40' 
                            : 'bg-red-400/30 border border-red-400/40'
                          }
                        `}>
                          <Star className="size-3 sm:size-4 text-[#FFD43B] fill-[#FFD43B]" />
                          <span className="text-sm sm:text-base text-foreground">{reward.cost} points</span>
                        </div>

                        {/* Admin controls */}
                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(reward);
                              }}
                              className="size-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                            >
                              <Pencil className="size-4 text-white" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReward(reward.id);
                              }}
                              className="size-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                            >
                              <Trash2 className="size-4 text-white" />
                            </button>
                          </div>
                        )}

                        {claimed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 sm:top-4 right-2 sm:right-4"
                          >
                            <div className="size-8 sm:size-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-sm sm:text-base text-white">✓</span>
                            </div>
                          </motion.div>
                        )}

                        {/* Claim button (only for non-admins) */}
                        {!isAdmin && affordable && !claimed && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-3 sm:mt-4 w-full py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] text-white text-sm sm:text-base shadow-lg touch-target"
                          >
                            Claim Reward! 🎉
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-2xl text-foreground mb-4 flex items-center gap-2">
              <Trophy className="size-6" />
              Achievements
            </h2>

            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    backdrop-blur-xl bg-white/40 rounded-3xl p-4 shadow-lg border border-white/60
                    ${!achievement.unlocked ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      size-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg
                      ${achievement.unlocked 
                        ? 'bg-gradient-to-br from-[#FFD43B] to-yellow-400' 
                        : 'bg-gray-300'
                      }
                    `}>
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base text-foreground">{achievement.title}</h3>
                      <p className="text-sm text-foreground/70">{achievement.description}</p>
                    </div>

                    {achievement.unlocked && (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="size-5 text-[#FFD43B]" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Motivation Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 backdrop-blur-xl bg-gradient-to-br from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-3xl p-6 shadow-lg border border-white/60"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="text-lg text-foreground mb-2">Keep Going!</h3>
                <p className="text-sm text-foreground/80">
                  You're doing amazing! Complete more chores to earn points. Your admin sets the point values and rewards!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Manage Reward Dialog (Admin Only) */}
      {isAdmin && (
        <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
          <DialogContent className="backdrop-blur-xl bg-white/95 border border-white/60">
            <DialogHeader>
              <DialogTitle>
                {editingReward ? 'Edit Reward' : 'Create New Reward'}
              </DialogTitle>
              <DialogDescription>
                {editingReward 
                  ? 'Update the reward details below.' 
                  : 'Create a new reward for your house members to claim with their points.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Reward Title</Label>
                <Input
                  id="title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Coffee Run"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g., Get your favorite coffee on the house"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="cost">Point Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formCost}
                  onChange={(e) => setFormCost(e.target.value)}
                  placeholder="e.g., 50"
                  min="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="emoji">Emoji</Label>
                <Input
                  id="emoji"
                  value={formEmoji}
                  onChange={(e) => setFormEmoji(e.target.value)}
                  placeholder="e.g., ☕"
                  maxLength={2}
                  className="mt-1 text-2xl"
                />
              </div>

              <div>
                <Label>Color Theme</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormColor(option.value)}
                      className={`
                        h-12 rounded-xl bg-gradient-to-br ${option.value} 
                        border-2 transition-all
                        ${formColor === option.value 
                          ? 'border-foreground scale-105' 
                          : 'border-white/40 hover:scale-105'
                        }
                      `}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveReward}
                  className="flex-1 bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] hover:from-[#00B89E] hover:to-[#00F0C7] text-white"
                >
                  {editingReward ? 'Update Reward' : 'Create Reward'}
                </Button>
                <Button
                  onClick={() => setManageDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
