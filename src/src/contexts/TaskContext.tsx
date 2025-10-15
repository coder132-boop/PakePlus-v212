import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

export interface RecurringTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  points: number;
  emoji: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  recurrence: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';
  customDays?: number[]; // 0-6 for Sun-Sat
  custom_days?: number[]; // API format
}

export interface Chore {
  id: string;
  title: string;
  description: string;
  assignee: string;
  points: number;
  awarded_points?: number;
  emoji: string;
  color: string;
  completed: boolean;
  status: 'incomplete' | 'pending_approval' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
  date: string; // ISO date string
  recurringTaskId?: string; // Link back to recurring task template
  recurring_task_id?: string; // API format
  completed_by?: string;
  approved_by?: string;
  completed_at?: string;
  approved_at?: string;
}

interface TaskContextType {
  recurringTasks: RecurringTask[];
  setRecurringTasks: (tasks: RecurringTask[]) => void;
  addRecurringTask: (task: RecurringTask) => Promise<void>;
  updateRecurringTask: (id: string, task: Partial<RecurringTask>) => Promise<void>;
  deleteRecurringTask: (id: string) => Promise<void>;
  
  chores: Chore[];
  pendingChores: Chore[];
  toggleChore: (id: string) => Promise<void>;
  approveChore: (id: string, awardedPoints: number) => Promise<void>;
  getTodaysChores: () => Chore[];
  getChoresForDate: (date: Date) => Chore[];
  loadPendingChores: () => Promise<void>;
  
  isAuthenticated: boolean;
  accessToken: string | null;
  userRole: 'admin' | 'member' | null;
  user: any;
  userProfile: any;
  houseId: string | null;
  houseMembers: any[];
  logout: () => Promise<void>;
  loading: boolean;
  
  databaseSetup: boolean;
  checkingDatabase: boolean;
  checkDatabase: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [recurringTasks, setRecurringTasks] = useState<RecurringTask[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [pendingChores, setPendingChores] = useState<Chore[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'member' | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [houseId, setHouseId] = useState<string | null>(null);
  const [houseMembers, setHouseMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [databaseSetup, setDatabaseSetup] = useState(false);
  const [checkingDatabase, setCheckingDatabase] = useState(false);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996`;

  // Check database setup and session on mount
  useEffect(() => {
    checkDatabaseAndSession();
  }, []);

  async function checkDatabaseAndSession() {
    setLoading(true);
    
    // First check if database is set up
    await checkDatabase();
    
    // Then check session
    await checkSession();
  }

  async function checkDatabase() {
    setCheckingDatabase(true);
    try {
      const response = await fetch(`${serverUrl}/database-check`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const wasSetup = databaseSetup;
        setDatabaseSetup(data.isSetup);
        
        if (data.isSetup && !wasSetup) {
          toast.success('🎉 Database setup verified! You can now create an account.', {
            description: 'All tables are configured correctly.',
          });
        } else if (!data.isSetup && data.missingTables?.length > 0) {
          console.log('⚠️ Database not fully configured. Missing tables:', data.missingTables);
          console.log('Admin: Navigate to the app and add ?admin-setup to the URL to view setup instructions');
        }
      } else {
        setDatabaseSetup(false);
        console.warn('⚠️ Could not verify database setup');
      }
    } catch (error) {
      console.error('Database check failed:', error);
      setDatabaseSetup(false);
    } finally {
      setCheckingDatabase(false);
    }
  }

  async function checkSession() {
    try {
      console.log('🔍 Checking for existing session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session check error:', error);
        setLoading(false);
        return;
      }
      
      if (session?.access_token) {
        console.log('✅ Session found! User:', session.user?.email);
        console.log('🔑 Access token:', session.access_token.substring(0, 20) + '...');
        setAccessToken(session.access_token);
        setIsAuthenticated(true);
        await loadData(session.access_token);
      } else {
        console.log('ℹ️ No active session found');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Session check error:', error);
      setLoading(false);
    }
  }

  async function loadData(token: string) {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser(token);
      setUser(currentUser);

      // Load user profile directly from database
      console.log('📋 Loading user profile...');
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', currentUser?.id)
        .single();

      if (profileError || !profileData) {
        // User might not be in a house yet (e.g., Google OAuth user or new user)
        console.log('ℹ️ User profile not found:', profileError?.message);
        setUserRole(null);
        setUserProfile(null);
        setHouseId(null);
        setLoading(false);
        return; // Stop here, user needs to create or join a house
      }

      console.log('👤 User profile loaded:', {
        role: profileData.role,
        house_id: profileData.house_id,
        display_name: profileData.display_name
      });
      setUserRole(profileData.role);
      setUserProfile(profileData);
      setHouseId(profileData.house_id);

      // Load house members
      const membersResponse = await fetch(`${serverUrl}/house-members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setHouseMembers(membersData.members || []);
      }

      // Load recurring tasks
      const tasksResponse = await fetch(`${serverUrl}/recurring-tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        const tasks = tasksData.tasks.map((t: any) => ({
          ...t,
          customDays: t.custom_days,
        }));
        setRecurringTasks(tasks);
      }

      // Generate and load today's chores
      const today = new Date().toISOString().split('T')[0];
      await generateChoresForDate(today, token);
      
      const choresResponse = await fetch(`${serverUrl}/chores?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (choresResponse.ok) {
        const choresData = await choresResponse.json();
        const choresList = choresData.chores.map((c: any) => ({
          ...c,
          recurringTaskId: c.recurring_task_id,
        }));
        setChores(choresList);
      }

      // Load pending chores if admin
      if (roleData?.role === 'admin') {
        await loadPendingChoresInternal(token);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  }

  async function loadPendingChoresInternal(token: string) {
    try {
      const response = await fetch(`${serverUrl}/chores/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const choresList = data.chores.map((c: any) => ({
          ...c,
          recurringTaskId: c.recurring_task_id,
        }));
        setPendingChores(choresList);
      }
    } catch (error) {
      console.error('Error loading pending chores:', error);
    }
  }

  async function loadPendingChores() {
    if (!accessToken) return;
    await loadPendingChoresInternal(accessToken);
  }

  async function generateChoresForDate(date: string, token: string) {
    try {
      await fetch(`${serverUrl}/chores/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      });
    } catch (error) {
      console.error('Error generating chores:', error);
    }
  }

  // Auth is handled by email/password via server endpoints in AuthPage
  // This context manages session state and data loading

  async function logout() {
    try {
      await supabase.auth.signOut();
      setAccessToken(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setUser(null);
      setUserProfile(null);
      setHouseId(null);
      setHouseMembers([]);
      setRecurringTasks([]);
      setChores([]);
      setPendingChores([]);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  }

  async function addRecurringTask(task: RecurringTask) {
    if (!accessToken) {
      toast.error('Please login to add tasks');
      return;
    }

    try {
      const taskData = {
        ...task,
        custom_days: task.customDays,
      };

      const response = await fetch(`${serverUrl}/recurring-tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const { task: createdTask } = await response.json();
      const normalizedTask = {
        ...createdTask,
        customDays: createdTask.custom_days,
      };
      
      setRecurringTasks(prev => [...prev, normalizedTask]);
      
      // Generate chores for today if applicable
      const today = new Date().toISOString().split('T')[0];
      await generateChoresForDate(today, accessToken);
      
      // Reload today's chores
      const choresResponse = await fetch(`${serverUrl}/chores?date=${today}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (choresResponse.ok) {
        const choresData = await choresResponse.json();
        const choresList = choresData.chores.map((c: any) => ({
          ...c,
          recurringTaskId: c.recurring_task_id,
        }));
        setChores(choresList);
      }

      toast.success(`✨ "${task.title}" added as recurring task!`);
    } catch (error) {
      console.error('Error adding recurring task:', error);
      toast.error('Failed to add recurring task');
    }
  }

  async function updateRecurringTask(id: string, updates: Partial<RecurringTask>) {
    if (!accessToken) {
      toast.error('Please login to update tasks');
      return;
    }

    try {
      const updateData = {
        ...updates,
        custom_days: updates.customDays,
      };

      const response = await fetch(`${serverUrl}/recurring-tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const { task: updatedTask } = await response.json();
      const normalizedTask = {
        ...updatedTask,
        customDays: updatedTask.custom_days,
      };
      
      setRecurringTasks(prev =>
        prev.map(task => (task.id === id ? { ...task, ...normalizedTask } : task))
      );

      toast.success('Task updated successfully! ✅');
    } catch (error) {
      console.error('Error updating recurring task:', error);
      toast.error('Failed to update task');
    }
  }

  async function deleteRecurringTask(id: string) {
    if (!accessToken) {
      toast.error('Please login to delete tasks');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/recurring-tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      setRecurringTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted! 🗑️');
    } catch (error) {
      console.error('Error deleting recurring task:', error);
      toast.error('Failed to delete task');
    }
  }

  async function toggleChore(id: string) {
    if (!accessToken) {
      toast.error('Please login to update chores');
      return;
    }

    const chore = chores.find(c => c.id === id);
    if (!chore) return;

    // Determine new status based on current status
    let newStatus: 'incomplete' | 'pending_approval' | 'completed';
    
    if (chore.status === 'incomplete') {
      newStatus = 'pending_approval';
    } else if (chore.status === 'pending_approval') {
      newStatus = 'incomplete';
    } else {
      // Already completed, can't toggle
      toast.info('This task has already been approved');
      return;
    }

    // Optimistic update
    setChores(prev =>
      prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );

    try {
      const response = await fetch(`${serverUrl}/chores/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Revert on error
        setChores(prev =>
          prev.map(c => (c.id === id ? { ...c, status: chore.status } : c))
        );
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      if (newStatus === 'pending_approval') {
        toast.success(`Task submitted for approval`, {
          description: `"${chore.title}" is now pending admin review`,
        });
        // Reload pending chores if admin
        if (userRole === 'admin') {
          await loadPendingChoresInternal(accessToken);
        }
      } else {
        toast.info('Task marked as incomplete');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  }

  async function approveChore(id: string, awardedPoints: number) {
    if (!accessToken) {
      toast.error('Please login to approve tasks');
      return;
    }

    if (userRole !== 'admin') {
      toast.error('Only admins can approve tasks');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/chores/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ awardedPoints }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const { chore: updatedChore } = await response.json();
      
      // Update chores list
      setChores(prev =>
        prev.map(c => (c.id === id ? { ...updatedChore, recurringTaskId: updatedChore.recurring_task_id } : c))
      );

      // Remove from pending list
      setPendingChores(prev => prev.filter(c => c.id !== id));

      toast.success(`Task approved`, {
        description: `${awardedPoints} points awarded`,
      });
    } catch (error) {
      console.error('Error approving task:', error);
      toast.error('Failed to approve task');
    }
  }

  function getTodaysChores() {
    const today = new Date().toISOString().split('T')[0];
    return chores.filter(chore => chore.date === today);
  }

  async function getChoresForDate(date: Date) {
    const dateString = date.toISOString().split('T')[0];
    
    // Check if we have chores in state
    const existingChores = chores.filter(chore => chore.date === dateString);
    if (existingChores.length > 0) {
      return existingChores;
    }

    // Load from server
    if (!accessToken) return [];

    try {
      // Generate chores for this date
      await generateChoresForDate(dateString, accessToken);

      // Fetch chores
      const response = await fetch(`${serverUrl}/chores?date=${dateString}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const choresList = data.chores.map((c: any) => ({
          ...c,
          recurringTaskId: c.recurring_task_id,
        }));
        
        // Add to state
        setChores(prev => {
          const filtered = prev.filter(c => c.date !== dateString);
          return [...filtered, ...choresList];
        });
        
        return choresList;
      }
    } catch (error) {
      console.error('Error loading chores for date:', error);
    }

    return [];
  }

  return (
    <TaskContext.Provider
      value={{
        recurringTasks,
        setRecurringTasks,
        addRecurringTask,
        updateRecurringTask,
        deleteRecurringTask,
        chores,
        pendingChores,
        toggleChore,
        approveChore,
        getTodaysChores,
        getChoresForDate,
        loadPendingChores,
        isAuthenticated,
        accessToken,
        userRole,
        user,
        userProfile,
        houseId,
        houseMembers,
        logout,
        loading,
        databaseSetup,
        checkingDatabase,
        checkDatabase,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}