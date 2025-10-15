import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Repeat, Calendar, User, Star, Sparkles, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTaskContext, RecurringTask } from '../contexts/TaskContext';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const EMOJI_OPTIONS = ['🗑️', '🍽️', '🛏️', '🧹', '🧺', '🌿', '🧼', '🧸', '🌀', '🚿', '🪴', '🧽', '📚', '🎮', '🏃', '🎨', '🎵', '🍳'];
const COLOR_OPTIONS = [
  { name: 'Gray', value: 'from-gray-400 to-gray-600' },
  { name: 'Blue', value: 'from-blue-400 to-blue-600' },
  { name: 'Purple', value: 'from-purple-400 to-pink-600' },
  { name: 'Orange', value: 'from-yellow-400 to-orange-600' },
  { name: 'Green', value: 'from-green-400 to-teal-600' },
  { name: 'Lime', value: 'from-lime-400 to-green-600' },
  { name: 'Pink', value: 'from-pink-400 to-rose-600' },
  { name: 'Cyan', value: 'from-cyan-400 to-blue-600' },
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type ChoreType = 'recurring' | 'one-time';

export function AssignChores() {
  const { 
    recurringTasks, 
    addRecurringTask, 
    updateRecurringTask, 
    deleteRecurringTask,
    accessToken,
    houseMembers,
    userRole
  } = useTaskContext();

  const [choreType, setChoreType] = useState<ChoreType>('recurring');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<RecurringTask | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    points: 10,
    emoji: '🗑️',
    color: 'from-gray-400 to-gray-600',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    recurrence: 'daily' as 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom',
    customDays: [] as number[],
    date: new Date().toISOString().split('T')[0],
  });

  const openCreateDialog = (type: ChoreType) => {
    const defaultAssignee = houseMembers.length > 0 
      ? (houseMembers[0].name || houseMembers[0].email) 
      : '';
    
    setChoreType(type);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      assignee: defaultAssignee,
      points: 10,
      emoji: '🗑️',
      color: 'from-gray-400 to-gray-600',
      difficulty: 'easy',
      recurrence: 'daily',
      customDays: [],
      date: new Date().toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (task: RecurringTask) => {
    setChoreType('recurring');
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      points: task.points,
      emoji: task.emoji,
      color: task.color,
      difficulty: task.difficulty,
      recurrence: task.recurrence,
      customDays: task.customDays || [],
      date: new Date().toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.assignee) {
      toast.error('Please select an assignee');
      return;
    }

    // Validate custom days for recurring tasks
    if (choreType === 'recurring' && formData.recurrence === 'custom' && formData.customDays.length === 0) {
      toast.error('Please select at least one day for custom recurrence');
      return;
    }

    setIsSubmitting(true);

    try {
      if (choreType === 'recurring') {
        const taskData = {
          title: formData.title,
          description: formData.description,
          assignee: formData.assignee,
          points: formData.points,
          emoji: formData.emoji,
          color: formData.color,
          difficulty: formData.difficulty,
          recurrence: formData.recurrence,
          customDays: formData.recurrence === 'custom' ? formData.customDays : undefined,
        };

        if (editingTask) {
          await updateRecurringTask(editingTask.id, taskData);
        } else {
          await addRecurringTask({ id: Date.now().toString(), ...taskData });
        }
      } else {
        // One-time chore
        const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996`;
        
        const choreData = {
          title: formData.title,
          description: formData.description,
          assignee: formData.assignee,
          points: formData.points,
          emoji: formData.emoji,
          color: formData.color,
          difficulty: formData.difficulty,
          date: formData.date,
          completed: false,
          status: 'incomplete',
        };

        const response = await fetch(`${serverUrl}/chores`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(choreData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create chore');
        }

        toast.success(`✨ "${formData.title}" assigned to ${formData.assignee}!`, {
          description: `Due on ${new Date(formData.date).toLocaleDateString()}`,
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving chore:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save chore');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteRecurringTask(id);
  };

  const handleDuplicate = (task: RecurringTask) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (Copy)`,
    };
    addRecurringTask(newTask);
  };

  const toggleCustomDay = (day: number) => {
    setFormData({
      ...formData,
      customDays: formData.customDays.includes(day)
        ? formData.customDays.filter(d => d !== day)
        : [...formData.customDays, day],
    });
  };

  const getRecurrenceLabel = (task: RecurringTask) => {
    switch (task.recurrence) {
      case 'daily':
        return 'Every day';
      case 'weekdays':
        return 'Mon-Fri';
      case 'weekends':
        return 'Sat-Sun';
      case 'weekly':
        return 'Once a week';
      case 'custom':
        return task.customDays?.map(d => WEEK_DAYS[d]).join(', ') || 'Custom';
      default:
        return task.recurrence;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyPoints = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 25;
      case 'hard': return 50;
      default: return 10;
    }
  };

  // Check if user is admin
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl p-12 shadow-lg border border-white/60 text-center"
          >
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl text-foreground mb-2">Admin Access Required</h2>
            <p className="text-foreground/70">Only admins can assign chores.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Sparkles className="size-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Assign Chores
            </h1>
          </div>
          <p className="text-foreground/70 ml-15">Create tasks, assign to members, and set point values 📋</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid md:grid-cols-2 gap-4"
        >
          {/* Recurring Task Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openCreateDialog('recurring')}
            className="backdrop-blur-xl bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-3xl p-8 shadow-lg border border-white/60 text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Repeat className="size-8 text-white" />
              </div>
              <Plus className="size-8 text-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-2xl text-foreground mb-2">Recurring Task</h3>
            <p className="text-foreground/70">
              Set up tasks that repeat automatically on a schedule (daily, weekly, custom days)
            </p>
          </motion.button>

          {/* One-Time Chore Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openCreateDialog('one-time')}
            className="backdrop-blur-xl bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-3xl p-8 shadow-lg border border-white/60 text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Clock className="size-8 text-white" />
              </div>
              <Plus className="size-8 text-pink-600 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-2xl text-foreground mb-2">One-Time Chore</h3>
            <p className="text-foreground/70">
              Assign a chore for a specific date (special events, seasonal tasks, etc.)
            </p>
          </motion.button>
        </motion.div>

        {/* Existing Recurring Tasks */}
        {recurringTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Repeat className="size-5 text-indigo-600" />
              <h2 className="text-2xl text-foreground">Active Recurring Tasks</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {recurringTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-all"
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`size-16 rounded-2xl bg-gradient-to-br ${task.color} flex items-center justify-center text-3xl shadow-lg`}>
                        {task.emoji}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditDialog(task)}
                          className="p-2 rounded-xl hover:bg-blue-500/20 transition-all"
                          title="Edit"
                        >
                          <Edit className="size-4 text-blue-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDuplicate(task)}
                          className="p-2 rounded-xl hover:bg-purple-500/20 transition-all"
                          title="Duplicate"
                        >
                          <Copy className="size-4 text-purple-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(task.id)}
                          className="p-2 rounded-xl hover:bg-red-500/20 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Task Details */}
                    <h3 className="text-xl text-foreground mb-2">{task.title}</h3>
                    <p className="text-sm text-foreground/70 mb-4">{task.description}</p>

                    {/* Task Meta */}
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/50 text-sm">
                        <User className="size-3" />
                        <span>{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/50 text-sm">
                        <Repeat className="size-3" />
                        <span>{getRecurrenceLabel(task)}</span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/50 text-sm">
                        <Star className="size-3" />
                        <span>{task.points} pts</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full ${getDifficultyColor(task.difficulty)} text-white text-sm`}>
                        {task.difficulty}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 backdrop-blur-xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-3xl p-6 shadow-lg border border-white/60"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-xl text-foreground mb-2">Quick Guide</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/70">
                <div>
                  <p className="mb-1"><strong>Recurring Tasks:</strong></p>
                  <ul className="space-y-1">
                    <li>• Automatically create chores based on schedule</li>
                    <li>• Perfect for daily routines and regular responsibilities</li>
                    <li>• Edit or delete anytime to update the schedule</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1"><strong>One-Time Chores:</strong></p>
                  <ul className="space-y-1">
                    <li>• Assign chores for specific dates</li>
                    <li>• Great for special events or seasonal tasks</li>
                    <li>• Appear once on the calendar and chore list</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {choreType === 'recurring' ? (
                  <>
                    <Repeat className="size-6 text-indigo-600" />
                    {editingTask ? 'Edit Recurring Task' : 'Create Recurring Task'}
                  </>
                ) : (
                  <>
                    <Clock className="size-6 text-pink-600" />
                    Create One-Time Chore
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {choreType === 'recurring' 
                  ? 'Set up a task that repeats on a schedule'
                  : 'Assign a chore for a specific date'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Chore Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Take out trash, Clean dishes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="backdrop-blur-lg bg-white/50"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="backdrop-blur-lg bg-white/50"
                  rows={3}
                />
              </div>

              {/* Assignee and Date/Recurrence Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee">
                    <User className="size-4 inline mr-2" />
                    Assign To *
                  </Label>
                  <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
                    <SelectTrigger className="backdrop-blur-lg bg-white/50">
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {houseMembers.map((member) => (
                        <SelectItem key={member.user_id} value={member.name || member.email}>
                          {member.name || member.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {choreType === 'recurring' ? (
                  <div>
                    <Label htmlFor="recurrence">
                      <Repeat className="size-4 inline mr-2" />
                      Recurrence *
                    </Label>
                    <Select value={formData.recurrence} onValueChange={(value: any) => setFormData({ ...formData, recurrence: value })}>
                      <SelectTrigger className="backdrop-blur-lg bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Every day</SelectItem>
                        <SelectItem value="weekdays">Weekdays (Mon-Fri)</SelectItem>
                        <SelectItem value="weekends">Weekends (Sat-Sun)</SelectItem>
                        <SelectItem value="weekly">Once a week</SelectItem>
                        <SelectItem value="custom">Custom days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="date">
                      <Calendar className="size-4 inline mr-2" />
                      Due Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="backdrop-blur-lg bg-white/50"
                    />
                  </div>
                )}
              </div>

              {/* Custom Days Selection (only for recurring with custom) */}
              {choreType === 'recurring' && formData.recurrence === 'custom' && (
                <div>
                  <Label>Select Days *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {WEEK_DAYS.map((day, index) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleCustomDay(index)}
                        className={`px-4 py-2 rounded-2xl transition-all ${
                          formData.customDays.includes(index)
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                            : 'bg-white/50 hover:bg-white/70 text-foreground'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficulty */}
              <div>
                <Label htmlFor="difficulty">
                  <Star className="size-4 inline mr-2" />
                  Difficulty
                </Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value: 'easy' | 'medium' | 'hard') => {
                    setFormData({ 
                      ...formData, 
                      difficulty: value,
                      points: getDifficultyPoints(value)
                    });
                  }}
                >
                  <SelectTrigger className="backdrop-blur-lg bg-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">
                      <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${getDifficultyColor('easy')}`} />
                        Easy (10 points)
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${getDifficultyColor('medium')}`} />
                        Medium (25 points)
                      </div>
                    </SelectItem>
                    <SelectItem value="hard">
                      <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${getDifficultyColor('hard')}`} />
                        Hard (50 points)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Points */}
              <div>
                <Label htmlFor="points">
                  <Star className="size-4 inline mr-2 text-[#FFD43B] fill-[#FFD43B]" />
                  Point Value
                </Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
                  className="backdrop-blur-lg bg-white/50"
                />
                <p className="text-xs text-foreground/60 mt-1">You decide the final point value when approving completed chores</p>
              </div>

              {/* Emoji Selection */}
              <div>
                <Label>Emoji</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`text-3xl p-3 rounded-2xl transition-all hover:scale-110 ${
                        formData.emoji === emoji
                          ? 'bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <Label>Color Theme</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`px-4 py-2 rounded-2xl transition-all hover:scale-105 bg-gradient-to-r ${color.value} text-white ${
                        formData.color === color.value ? 'ring-4 ring-purple-400 shadow-lg' : ''
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div>
                <Label>Preview</Label>
                <div className="mt-2 backdrop-blur-lg bg-white/50 rounded-2xl p-4 border border-white/60">
                  <div className={`bg-gradient-to-br ${formData.color} rounded-2xl p-6 text-white shadow-lg`}>
                    <div className="text-5xl mb-3">{formData.emoji}</div>
                    <h3 className="text-xl mb-2">{formData.title || 'Chore Title'}</h3>
                    <p className="text-sm opacity-90 mb-3">{formData.description || 'Description'}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{formData.assignee || 'Assignee'}</span>
                      <span>{formData.points} pts</span>
                    </div>
                    {choreType === 'recurring' ? (
                      <div className="mt-2 text-xs opacity-75">
                        {formData.recurrence === 'custom' && formData.customDays.length > 0
                          ? formData.customDays.map(d => WEEK_DAYS[d]).join(', ')
                          : getRecurrenceLabel({ ...formData, id: '', customDays: formData.customDays } as RecurringTask)}
                      </div>
                    ) : (
                      <div className="mt-2 text-xs opacity-75">
                        Due: {new Date(formData.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-2xl text-white hover:shadow-lg transition-all disabled:opacity-50 ${
                  choreType === 'recurring'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500'
                }`}
              >
                {isSubmitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Chore'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
