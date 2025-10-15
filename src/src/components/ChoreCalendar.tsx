import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, Filter, X } from 'lucide-react';
import { useTaskContext, Chore } from '../contexts/TaskContext';
import { toast } from 'sonner@2.0.3';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export function ChoreCalendar() {
  const { getChoresForDate, toggleChore, user, houseMembers, userRole } = useTaskContext();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [weekChores, setWeekChores] = useState<{ [key: number]: Chore[] }>({});
  const [dayChores, setDayChores] = useState<Chore[]>([]);
  const [monthChores, setMonthChores] = useState<{ [key: number]: Chore[] }>({});
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterRecurring, setFilterRecurring] = useState<boolean | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'incomplete' | 'pending_approval' | 'completed'>('all');
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1 + (currentWeek * 7));

  const getDateForDay = (dayIndex: number) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + dayIndex);
    return date.getDate();
  };

  const getDateObjectForDay = (dayIndex: number) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + dayIndex);
    return date;
  };

  const getCurrentDayDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + currentDay);
    return date;
  };

  const getMonthStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + currentMonth);
    date.setDate(1);
    return date;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Apply filters to chores
  const filterChores = (chores: Chore[]) => {
    return chores.filter(chore => {
      // Filter by assignee
      if (filterAssignee !== 'all' && chore.assignee !== filterAssignee) {
        return false;
      }
      
      // Filter by recurring status
      if (filterRecurring !== null) {
        const isRecurring = !!chore.recurringTaskId || !!chore.recurring_task_id;
        if (filterRecurring && !isRecurring) return false;
        if (!filterRecurring && isRecurring) return false;
      }
      
      // Filter by status
      if (filterStatus !== 'all' && chore.status !== filterStatus) {
        return false;
      }
      
      return true;
    });
  };

  // Load chores based on view mode
  useEffect(() => {
    async function loadChores() {
      setLoading(true);
      
      if (viewMode === 'weekly') {
        const choresMap: { [key: number]: Chore[] } = {};
        for (let i = 0; i < 7; i++) {
          const dateObj = getDateObjectForDay(i);
          const chores = await getChoresForDate(dateObj);
          choresMap[i] = filterChores(chores);
        }
        setWeekChores(choresMap);
      } else if (viewMode === 'daily') {
        const dateObj = getCurrentDayDate();
        const chores = await getChoresForDate(dateObj);
        setDayChores(filterChores(chores));
      } else if (viewMode === 'monthly') {
        const monthStart = getMonthStartDate();
        const daysInMonth = getDaysInMonth(monthStart);
        const choresMap: { [key: number]: Chore[] } = {};
        
        for (let i = 0; i < daysInMonth; i++) {
          const dateObj = new Date(monthStart);
          dateObj.setDate(i + 1);
          const chores = await getChoresForDate(dateObj);
          choresMap[i] = filterChores(chores);
        }
        setMonthChores(choresMap);
      }
      
      setLoading(false);
    }
    
    loadChores();
  }, [currentWeek, currentDay, currentMonth, viewMode, filterAssignee, filterRecurring, filterStatus]);

  const handleChoreClick = (chore: Chore) => {
    // Check if this chore belongs to the current user
    const userEmail = user?.email;
    const userName = user?.user_metadata?.name || userEmail;
    
    // Members can only mark their own chores
    if (userRole !== 'admin' && chore.assignee !== userName && chore.assignee !== userEmail) {
      toast.error('You can only mark your own chores complete', {
        description: `This chore is assigned to ${chore.assignee}`,
      });
      return;
    }
    
    // Don't allow toggling already approved chores
    if (chore.status === 'completed') {
      toast.info('This task has already been approved');
      return;
    }
    
    toggleChore(chore.id);
  };

  const renderChoreCard = (chore: Chore, index: number, size: 'small' | 'large' = 'small') => {
    const userEmail = user?.email;
    const userName = user?.user_metadata?.name || userEmail;
    const isOwnChore = chore.assignee === userName || chore.assignee === userEmail;
    const canToggle = userRole === 'admin' || isOwnChore;

    return (
      <motion.div
        key={chore.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 + index * 0.02 }}
        whileHover={canToggle ? { scale: 1.05, y: -4 } : {}}
        onClick={() => handleChoreClick(chore)}
        className={`
          backdrop-blur-lg bg-gradient-to-br ${chore.color} rounded-xl sm:rounded-2xl border border-white/40 relative
          ${chore.status === 'completed' ? 'opacity-50' : chore.status === 'pending_approval' ? 'opacity-75' : 'shadow-lg'}
          transition-all
          ${size === 'large' ? 'p-4 sm:p-6' : 'p-2 sm:p-3'}
          ${canToggle && chore.status !== 'completed' ? 'cursor-pointer' : 'cursor-default'}
          ${!canToggle ? 'ring-2 ring-white/30' : ''}
          touch-target
        `}
      >
        <div className={size === 'large' ? 'text-4xl sm:text-5xl mb-2 sm:mb-3' : 'text-xl sm:text-2xl md:text-3xl mb-1'}>{chore.emoji}</div>
        <div className={`text-white mb-1 ${size === 'large' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm line-clamp-2'}`}>
          {chore.title}
        </div>
        <div className={`text-white/80 truncate ${size === 'large' ? 'text-sm' : 'text-[10px] sm:text-xs'}`}>{chore.assignee}</div>
        
        {/* Status badges */}
        {chore.status === 'pending_approval' && (
          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-yellow-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            ⏳ <span className="hidden sm:inline">Pending</span>
          </div>
        )}
        {chore.status === 'completed' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute bg-green-500 rounded-full flex items-center justify-center ${
              size === 'large' ? 'top-2 sm:top-3 right-2 sm:right-3 size-6 sm:size-8' : 'top-1 right-1 size-5 sm:size-6'
            }`}
          >
            <span className={`text-white ${size === 'large' ? 'text-sm sm:text-base' : 'text-[10px] sm:text-xs'}`}>✓</span>
          </motion.div>
        )}
        
        {/* Not own chore indicator */}
        {!canToggle && (
          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-blue-500/80 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            👁️ <span className="hidden sm:inline">View Only</span>
          </div>
        )}
      </motion.div>
    );
  };

  const activeFilterCount = 
    (filterAssignee !== 'all' ? 1 : 0) + 
    (filterRecurring !== null ? 1 : 0) + 
    (filterStatus !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setFilterAssignee('all');
    setFilterRecurring(null);
    setFilterStatus('all');
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center shadow-lg">
              <CalendarIcon className="size-5 sm:size-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] bg-clip-text text-transparent">
              Chore Calendar
            </h1>
          </div>
          <p className="text-sm sm:text-base text-foreground/70 sm:ml-15">Plan your schedule and track progress 📅</p>
        </motion.div>

        {/* View Mode Toggle & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-4 items-center"
        >
          {/* View Toggle */}
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-lg border border-white/60 inline-flex gap-1 sm:gap-2">
            {(['daily', 'weekly', 'monthly'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all capitalize text-sm sm:text-base touch-target ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] text-white shadow-lg'
                    : 'hover:bg-white/60 text-foreground'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`backdrop-blur-xl rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg border transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 text-sm sm:text-base touch-target ${
              activeFilterCount > 0 
                ? 'bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] text-white border-white/60' 
                : 'bg-white/40 border-white/60 text-foreground hover:bg-white/60'
            }`}
          >
            <Filter className="size-4 sm:size-5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-[#00C2A8] size-5 sm:size-6 rounded-full flex items-center justify-center text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Info Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:inline-flex backdrop-blur-xl bg-gradient-to-br from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-full px-4 py-2 shadow-lg border border-white/60 items-center gap-2"
          >
            <Sparkles className="size-4 text-[#00C2A8]" />
            <span className="text-sm text-foreground">Auto-generated from recurring tasks</span>
          </motion.div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-lg border border-white/60 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-foreground flex items-center gap-2">
                    <Filter className="size-5" />
                    Filter Chores
                  </h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-foreground/70 hover:text-foreground flex items-center gap-1"
                    >
                      <X className="size-4" />
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Assignee Filter */}
                  <div>
                    <label className="text-sm text-foreground/70 mb-2 block">Assigned To</label>
                    <select
                      value={filterAssignee}
                      onChange={(e) => setFilterAssignee(e.target.value)}
                      className="w-full backdrop-blur-lg bg-white/50 border border-white/60 rounded-2xl px-4 py-2 text-foreground"
                    >
                      <option value="all">All Members</option>
                      {houseMembers.map((member) => (
                        <option key={member.user_id} value={member.name || member.email}>
                          {member.name || member.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Recurring Filter */}
                  <div>
                    <label className="text-sm text-foreground/70 mb-2 block">Type</label>
                    <select
                      value={filterRecurring === null ? 'all' : filterRecurring ? 'recurring' : 'one-time'}
                      onChange={(e) => 
                        setFilterRecurring(
                          e.target.value === 'all' ? null : e.target.value === 'recurring'
                        )
                      }
                      className="w-full backdrop-blur-lg bg-white/50 border border-white/60 rounded-2xl px-4 py-2 text-foreground"
                    >
                      <option value="all">All Types</option>
                      <option value="recurring">Recurring Only</option>
                      <option value="one-time">One-time Only</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm text-foreground/70 mb-2 block">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="w-full backdrop-blur-lg bg-white/50 border border-white/60 rounded-2xl px-4 py-2 text-foreground"
                    >
                      <option value="all">All Statuses</option>
                      <option value="incomplete">Incomplete</option>
                      <option value="pending_approval">Pending Approval</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="backdrop-blur-xl bg-white/40 rounded-3xl p-4 shadow-lg border border-white/60 mb-6"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (viewMode === 'daily') setCurrentDay(currentDay - 1);
                else if (viewMode === 'weekly') setCurrentWeek(currentWeek - 1);
                else setCurrentMonth(currentMonth - 1);
              }}
              className="p-3 rounded-2xl hover:bg-white/60 transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="size-6 text-foreground" />
            </button>

            <div className="flex items-center gap-2">
              <CalendarIcon className="size-5 text-foreground" />
              <span className="text-foreground">
                {viewMode === 'daily' && (
                  currentDay === 0 ? 'Today' : currentDay > 0 ? `${currentDay} Day${currentDay > 1 ? 's' : ''} Ahead` : `${Math.abs(currentDay)} Day${Math.abs(currentDay) > 1 ? 's' : ''} Ago`
                )}
                {viewMode === 'weekly' && (
                  currentWeek === 0 ? 'This Week' : currentWeek > 0 ? `${currentWeek} Week${currentWeek > 1 ? 's' : ''} Ahead` : `${Math.abs(currentWeek)} Week${Math.abs(currentWeek) > 1 ? 's' : ''} Ago`
                )}
                {viewMode === 'monthly' && (
                  (() => {
                    const monthDate = getMonthStartDate();
                    return monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  })()
                )}
              </span>
            </div>

            <button
              onClick={() => {
                if (viewMode === 'daily') setCurrentDay(currentDay + 1);
                else if (viewMode === 'weekly') setCurrentWeek(currentWeek + 1);
                else setCurrentMonth(currentMonth + 1);
              }}
              className="p-3 rounded-2xl hover:bg-white/60 transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight className="size-6 text-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Calendar Grid - Daily View */}
        {viewMode === 'daily' && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 md:p-8 shadow-lg border border-white/60"
          >
            <div className="text-center mb-8">
              <motion.div 
                className="backdrop-blur-lg bg-gradient-to-br from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-3xl p-6 border border-white/40 inline-block"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-xl text-foreground/70 mb-2">
                  {getCurrentDayDate().toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="text-6xl text-foreground mb-2">
                  {getCurrentDayDate().getDate()}
                </div>
                <div className="text-foreground/70">
                  {getCurrentDayDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <div className="size-12 border-4 border-teal-200 border-t-[#00C2A8] rounded-full animate-spin mb-4" />
                  <p className="text-foreground/60">Loading chores...</p>
                </div>
              ) : dayChores.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-xl text-foreground/70">No chores {activeFilterCount > 0 ? 'match your filters' : 'scheduled for this day'}!</p>
                  <p className="text-sm text-foreground/60 mt-2">
                    {activeFilterCount > 0 ? 'Try adjusting your filters' : 'Enjoy your free time'}
                  </p>
                </div>
              ) : (
                dayChores.map((chore, index) => renderChoreCard(chore, index, 'large'))
              )}
            </div>
          </motion.div>
        )}

        {/* Calendar Grid - Weekly View */}
        {viewMode === 'weekly' && (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl p-4 md:p-6 shadow-lg border border-white/60"
          >
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {weekDays.map((day, index) => {
                const dateObj = getDateObjectForDay(index);
                const isToday = dateObj.toDateString() === new Date().toDateString();
                
                return (
                  <div key={day} className="text-center">
                    <div className={`backdrop-blur-lg bg-gradient-to-br rounded-2xl p-3 mb-4 border transition-all ${
                      isToday 
                        ? 'from-[#00C2A8]/40 to-[#00FFD1]/40 border-[#00C2A8] shadow-lg' 
                        : 'from-[#7DE3D6]/30 to-[#B8F3EA]/30 border-white/40'
                    }`}>
                      <div className="text-xs md:text-sm text-foreground/70">{day}</div>
                      <div className={`text-xl md:text-2xl ${isToday ? 'text-[#00C2A8]' : 'text-foreground'}`}>
                        {getDateForDay(index)}
                      </div>
                    </div>

                    {/* Chores for this day */}
                    <div className="space-y-2 min-h-[200px]">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="size-6 border-2 border-teal-200 border-t-[#00C2A8] rounded-full animate-spin" />
                        </div>
                      ) : (weekChores[index] || []).length === 0 ? (
                        <div className="text-2xl opacity-30 pt-4">✨</div>
                      ) : (
                        (weekChores[index] || []).map((chore, choreIndex) => 
                          renderChoreCard(chore, choreIndex, 'small')
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Calendar Grid - Monthly View */}
        {viewMode === 'monthly' && (
          <motion.div
            key="monthly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl p-4 md:p-6 shadow-lg border border-white/60"
          >
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {monthDays.map((day) => (
                <div key={day} className="text-center text-sm text-foreground/70 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {loading ? (
                <div className="col-span-7 flex flex-col items-center justify-center py-12">
                  <div className="size-12 border-4 border-teal-200 border-t-[#00C2A8] rounded-full animate-spin mb-4" />
                  <p className="text-foreground/60">Loading month...</p>
                </div>
              ) : (
                (() => {
                  const monthStart = getMonthStartDate();
                  const daysInMonth = getDaysInMonth(monthStart);
                  const firstDay = getFirstDayOfMonth(monthStart);
                  const cells = [];
                  const today = new Date();

                  // Empty cells before first day
                  for (let i = 0; i < firstDay; i++) {
                    cells.push(
                      <div key={`empty-${i}`} className="aspect-square" />
                    );
                  }

                  // Days of the month
                  for (let day = 0; day < daysInMonth; day++) {
                    const dayChores = monthChores[day] || [];
                    const dateObj = new Date(monthStart);
                    dateObj.setDate(day + 1);
                    const isToday = dateObj.toDateString() === today.toDateString();

                    cells.push(
                      <motion.div
                        key={day}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.01 + day * 0.005 }}
                        whileHover={{ scale: 1.05 }}
                        className={`aspect-square backdrop-blur-lg bg-gradient-to-br rounded-2xl p-2 border relative overflow-hidden transition-all ${
                          isToday 
                            ? 'from-[#00C2A8]/40 to-[#00FFD1]/40 border-2 border-[#00C2A8] shadow-lg' 
                            : 'from-[#7DE3D6]/20 to-[#B8F3EA]/20 border-white/40'
                        }`}
                      >
                        <div className={`text-xs md:text-sm mb-1 ${isToday ? 'text-[#00C2A8]' : 'text-foreground'}`}>
                          {day + 1}
                        </div>
                        <div className="space-y-1">
                          {dayChores.slice(0, 2).map((chore) => {
                            const userEmail = user?.email;
                            const userName = user?.user_metadata?.name || userEmail;
                            const isOwnChore = chore.assignee === userName || chore.assignee === userEmail;
                            const canToggle = userRole === 'admin' || isOwnChore;
                            
                            return (
                              <div
                                key={chore.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChoreClick(chore);
                                }}
                                className={`text-xs bg-gradient-to-br ${chore.color} rounded-lg px-1.5 py-0.5 transition-all hover:scale-105 ${
                                  chore.status === 'completed' ? 'opacity-50' : ''
                                } ${canToggle && chore.status !== 'completed' ? 'cursor-pointer' : 'cursor-default'}`}
                              >
                                <span className="text-[10px]">{chore.emoji}</span>
                                <span className="ml-1 text-white text-[10px] truncate block">{chore.title}</span>
                              </div>
                            );
                          })}
                          {dayChores.length > 2 && (
                            <div className="text-[10px] text-foreground/70 text-center">+{dayChores.length - 2} more</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  }

                  return cells;
                })()
              )}
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 backdrop-blur-xl bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl p-6 shadow-lg border border-white/60"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="text-foreground mb-2">Quick Tips</h3>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Members can only mark their own chores complete (👁️ View Only badge shows others' chores)</li>
                <li>• Click your chores to mark them complete - they'll go to "⏳ Pending" for admin approval</li>
                <li>• Use filters to find specific chores by assignee, type, or status</li>
                <li>• Today's date is highlighted in purple for easy reference</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
