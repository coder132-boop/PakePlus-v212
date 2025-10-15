import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Server startup message
console.log('ChoreCore server starting...');
console.log('Note: Database tables must be created via Supabase SQL Editor');
console.log('See DATABASE_SETUP.md for setup instructions');

// Helper to verify authorization
async function getAuthorizedUser(authHeader: string | null) {
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.error('Authorization error:', error);
    return null;
  }
  
  return user;
}

// Helper to get user's role
async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data.role;
}

// Helper to check if user is admin
async function isAdmin(userId: string) {
  const role = await getUserRole(userId);
  return role === 'admin';
}

// Helper to generate 6-digit invite code
function generateInviteCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to find house by invite code
async function getHouseByInviteCode(inviteCode: string) {
  const houses = await kv.getByPrefix('house_invite_');
  // getByPrefix returns an array of values directly, not {key, value} objects
  const house = houses.find((h: any) => h.inviteCode === inviteCode);
  return house || null;
}

// Auth endpoints

// Create a new house (returns invite code)
app.post("/make-server-28dd5996/auth/create-house", async (c) => {
  try {
    const { email, password, displayName } = await c.req.json();

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let existing = await getHouseByInviteCode(inviteCode);
    
    // Ensure code is unique
    while (existing) {
      inviteCode = generateInviteCode();
      existing = await getHouseByInviteCode(inviteCode);
    }

    // Create user with admin.createUser (auto-confirms email)
    console.log('Creating new user:', email);
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        display_name: displayName,
        invite_code: inviteCode,
        is_creating_house: true,
      }
    });

    if (createError || !userData.user) {
      console.error('User creation error:', createError);
      
      // Check if user already exists
      if (createError?.message?.includes('already been registered') || createError?.message?.includes('already exists')) {
        return c.json({ 
          error: 'A user with this email address has already been registered',
          code: 'USER_EXISTS',
          details: 'Please sign in instead of creating a new account.'
        }, 409); // 409 Conflict
      }
      
      return c.json({ 
        error: createError?.message || 'Failed to create user' 
      }, 400);
    }

    const user = userData.user;
    const houseId = `house_${user.id}`;

    // Store house with invite code
    console.log('Storing house invite code:', inviteCode, 'for house:', houseId);
    await kv.set(`house_invite_${inviteCode}`, {
      houseId,
      inviteCode,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    });

    // Create user profile in database
    console.log('Creating user profile for user:', user.id, 'in house:', houseId);
    
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        house_id: houseId,
        display_name: displayName,
        role: 'admin',
        points: 0
      });

    if (profileError) {
      console.error('Profile creation error details:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
      
      // Provide specific guidance for database schema issues
      if (profileError.code === 'PGRST204' || profileError.code === '42P01' || profileError.message?.includes('does not exist')) {
        return c.json({ 
          error: 'Database schema not set up correctly',
          details: 'The database tables need to be created. Please run the SQL setup script in your Supabase SQL Editor.',
          code: 'SETUP_REQUIRED',
          hint: 'Visit your app with ?admin-setup in the URL for complete setup instructions.'
        }, 500);
      }
      
      // Check for missing column errors
      if (profileError.message?.includes('column') && profileError.message?.includes('does not exist')) {
        return c.json({ 
          error: 'Database schema is incomplete',
          details: `Database table exists but is missing required columns: ${profileError.message}`,
          code: 'SETUP_REQUIRED',
          hint: 'The database schema needs to be updated. Please run the complete SQL setup script.'
        }, 500);
      }
      
      return c.json({ 
        error: `Failed to create user profile: ${profileError.message}`,
        details: profileError.details,
        hint: profileError.hint
      }, 500);
    }

    console.log('User and house created successfully:', email, houseId);

    return c.json({ 
      success: true, 
      message: 'House created successfully',
      inviteCode,
      userId: user.id
    });
  } catch (error: any) {
    console.error('Create house exception:', error);
    return c.json({ 
      error: 'Failed to create house', 
      details: error.message || String(error)
    }, 500);
  }
});

// Join existing house
app.post("/make-server-28dd5996/auth/join-house", async (c) => {
  try {
    const { email, password, displayName, inviteCode } = await c.req.json();

    // Verify invite code exists
    const house = await getHouseByInviteCode(inviteCode);
    if (!house) {
      return c.json({ error: 'Invalid invite code' }, 400);
    }

    // Create user with admin.createUser (auto-confirms email)
    console.log('Creating new user to join house:', email);
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        display_name: displayName,
        invite_code: inviteCode,
        house_id: house.houseId,
        is_creating_house: false,
      }
    });

    if (createError || !userData.user) {
      console.error('User creation error:', createError);
      
      // Check if user already exists
      if (createError?.message?.includes('already been registered') || createError?.message?.includes('already exists')) {
        return c.json({ 
          error: 'A user with this email address has already been registered',
          code: 'USER_EXISTS',
          details: 'Please sign in instead of creating a new account.'
        }, 409); // 409 Conflict
      }
      
      return c.json({ 
        error: createError?.message || 'Failed to create user' 
      }, 400);
    }

    const user = userData.user;

    // Create user profile in database
    console.log('Creating user profile for user:', user.id, 'joining house:', house.houseId);
    
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        house_id: house.houseId,
        display_name: displayName,
        role: 'member',
        points: 0
      });

    if (profileError) {
      console.error('Profile creation error details:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
      
      // Provide specific guidance for database schema issues
      if (profileError.code === 'PGRST204' || profileError.code === '42P01' || profileError.message?.includes('does not exist')) {
        return c.json({ 
          error: 'Database schema not set up correctly',
          details: 'The database tables need to be created. Please run the SQL setup script in your Supabase SQL Editor.',
          code: 'SETUP_REQUIRED',
          hint: 'Visit your app with ?admin-setup in the URL for complete setup instructions.'
        }, 500);
      }
      
      // Check for missing column errors
      if (profileError.message?.includes('column') && profileError.message?.includes('does not exist')) {
        return c.json({ 
          error: 'Database schema is incomplete',
          details: `Database table exists but is missing required columns: ${profileError.message}`,
          code: 'SETUP_REQUIRED',
          hint: 'The database schema needs to be updated. Please run the complete SQL setup script.'
        }, 500);
      }
      
      return c.json({ 
        error: `Failed to create user profile: ${profileError.message}`,
        details: profileError.details,
        hint: profileError.hint
      }, 500);
    }

    console.log('User joined house successfully:', email, house.houseId);

    return c.json({ 
      success: true, 
      message: 'Successfully joined house',
      userId: user.id,
      houseId: house.houseId
    });
  } catch (error: any) {
    console.error('Join house exception:', error);
    return c.json({ 
      error: 'Failed to join house', 
      details: error.message || String(error)
    }, 500);
  }
});

// Login with email and password
app.post("/make-server-28dd5996/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    console.log('Login attempt for:', email);

    // Create a client with the anon key for authentication
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_KEY')!;
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);

    // Sign in with email and password
    const { data, error } = await anonClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error.message);
      return c.json({ 
        error: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password' 
          : error.message
      }, 400);
    }

    if (!data.user) {
      return c.json({ error: 'Login failed' }, 400);
    }

    console.log('Login successful for:', email);

    return c.json({ 
      success: true, 
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('Login exception:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// OAuth user creates a house (for already-authenticated OAuth users)
app.post("/make-server-28dd5996/auth/oauth-create-house", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { displayName } = await c.req.json();

    // Check if user already has a profile
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingProfile) {
      return c.json({ error: 'User already belongs to a house' }, 400);
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let existing = await getHouseByInviteCode(inviteCode);
    
    while (existing) {
      inviteCode = generateInviteCode();
      existing = await getHouseByInviteCode(inviteCode);
    }

    const houseId = `house_${user.id}`;

    // Store house with invite code
    await kv.set(`house_invite_${inviteCode}`, {
      houseId,
      inviteCode,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    });

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        house_id: houseId,
        display_name: displayName,
        role: 'admin',
        points: 0
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return c.json({ error: profileError.message }, 500);
    }

    return c.json({ 
      success: true,
      inviteCode,
      houseId
    });
  } catch (error: any) {
    console.error('OAuth create house error:', error);
    return c.json({ error: 'Failed to create house' }, 500);
  }
});

// OAuth user joins a house (for already-authenticated OAuth users)
app.post("/make-server-28dd5996/auth/oauth-join-house", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { displayName, inviteCode } = await c.req.json();

    // Check if user already has a profile
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingProfile) {
      return c.json({ error: 'User already belongs to a house' }, 400);
    }

    // Verify invite code exists
    const house = await getHouseByInviteCode(inviteCode);
    if (!house) {
      return c.json({ error: 'Invalid invite code' }, 400);
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        house_id: house.houseId,
        display_name: displayName,
        role: 'member',
        points: 0
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return c.json({ error: profileError.message }, 500);
    }

    return c.json({ 
      success: true,
      houseId: house.houseId
    });
  } catch (error: any) {
    console.error('OAuth join house error:', error);
    return c.json({ error: 'Failed to join house' }, 500);
  }
});

// Get house info by invite code
app.get("/make-server-28dd5996/house-by-code/:code", async (c) => {
  try {
    const code = c.req.param('code');
    const house = await getHouseByInviteCode(code);
    
    if (!house) {
      return c.json({ error: 'Invalid invite code' }, 404);
    }

    // Get house member count
    const { data: members, error } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('house_id', house.houseId);

    if (error) {
      console.error('Error fetching house members:', error);
    }

    return c.json({ 
      valid: true,
      memberCount: members?.length || 0,
      houseId: house.houseId
    });
  } catch (error) {
    console.error('House lookup exception:', error);
    return c.json({ error: 'Failed to lookup house' }, 500);
  }
});

// Recurring tasks endpoints
app.get("/make-server-28dd5996/recurring-tasks", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { data, error } = await supabase
    .from('recurring_tasks')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching recurring tasks:', error);
    return c.json({ error: error.message }, 500);
  }

  return c.json({ tasks: data });
});

app.post("/make-server-28dd5996/recurring-tasks", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Only admins can create recurring tasks
  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can create recurring tasks' }, 403);
  }

  try {
    const task = await c.req.json();
    
    // Get user's house_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    const houseId = profile?.house_id || `house_${user.id}`;

    const { data, error } = await supabase
      .from('recurring_tasks')
      .insert({
        ...task,
        user_id: user.id,
        house_id: houseId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating recurring task:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ task: data });
  } catch (error) {
    console.error('Exception creating recurring task:', error);
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

app.put("/make-server-28dd5996/recurring-tasks/:id", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Only admins can update recurring tasks
  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can update recurring tasks' }, 403);
  }

  try {
    const id = c.req.param('id');
    const updates = await c.req.json();

    const { data, error } = await supabase
      .from('recurring_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recurring task:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ task: data });
  } catch (error) {
    console.error('Exception updating recurring task:', error);
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

app.delete("/make-server-28dd5996/recurring-tasks/:id", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Only admins can delete recurring tasks
  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can delete recurring tasks' }, 403);
  }

  const id = c.req.param('id');
  const { error } = await supabase
    .from('recurring_tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting recurring task:', error);
    return c.json({ error: error.message }, 500);
  }

  return c.json({ success: true });
});

// Chores endpoints
app.get("/make-server-28dd5996/chores", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const date = c.req.query('date');
  let query = supabase
    .from('chores')
    .select('*')
    .eq('user_id', user.id);

  if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching chores:', error);
    return c.json({ error: error.message }, 500);
  }

  return c.json({ chores: data });
});

app.post("/make-server-28dd5996/chores", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Only admins can manually create chores
  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can create chores' }, 403);
  }

  try {
    const chore = await c.req.json();
    
    // Get user's house_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    const houseId = profile?.house_id || `house_${user.id}`;

    const { data, error } = await supabase
      .from('chores')
      .insert({
        ...chore,
        user_id: user.id,
        house_id: houseId,
        status: 'incomplete',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chore:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ chore: data });
  } catch (error) {
    console.error('Exception creating chore:', error);
    return c.json({ error: 'Failed to create chore' }, 500);
  }
});

app.put("/make-server-28dd5996/chores/:id", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const userIsAdmin = await isAdmin(user.id);

    // Members can only toggle to pending_approval, admins can do everything
    if (!userIsAdmin && updates.status && updates.status !== 'pending_approval') {
      return c.json({ error: 'Members can only mark chores for approval' }, 403);
    }

    // Prepare the update object based on status change
    let updateData: any = { ...updates };
    
    if (updates.status === 'pending_approval') {
      updateData.completed_by = user.id;
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('chores')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating chore:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ chore: data });
  } catch (error) {
    console.error('Exception updating chore:', error);
    return c.json({ error: 'Failed to update chore' }, 500);
  }
});

// Approve chore endpoint (admins only)
app.post("/make-server-28dd5996/chores/:id/approve", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Only admins can approve chores
  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can approve chores' }, 403);
  }

  try {
    const id = c.req.param('id');
    const { awardedPoints } = await c.req.json();

    const { data, error } = await supabase
      .from('chores')
      .update({
        status: 'completed',
        completed: true,
        awarded_points: awardedPoints,
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error approving chore:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ chore: data });
  } catch (error) {
    console.error('Exception approving chore:', error);
    return c.json({ error: 'Failed to approve chore' }, 500);
  }
});

app.delete("/make-server-28dd5996/chores/:id", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Only admins can delete chores
  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can delete chores' }, 403);
  }

  const id = c.req.param('id');
  const { error } = await supabase
    .from('chores')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting chore:', error);
    return c.json({ error: error.message }, 500);
  }

  return c.json({ success: true });
});

// Generate chores from recurring tasks
app.post("/make-server-28dd5996/chores/generate", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { date } = await c.req.json();
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Get user's house_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    const houseId = profile?.house_id || `house_${user.id}`;

    // Get all recurring tasks for this user
    const { data: recurringTasks, error: tasksError } = await supabase
      .from('recurring_tasks')
      .select('*')
      .eq('user_id', user.id);

    if (tasksError) {
      console.error('Error fetching recurring tasks:', tasksError);
      return c.json({ error: tasksError.message }, 500);
    }

    // Check if chores already exist for this date
    const { data: existingChores } = await supabase
      .from('chores')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', date);

    if (existingChores && existingChores.length > 0) {
      return c.json({ message: 'Chores already generated for this date' });
    }

    // Filter tasks that should run on this day
    const shouldRunOnDay = (task: any, day: number) => {
      switch (task.recurrence) {
        case 'daily':
          return true;
        case 'weekdays':
          return day >= 1 && day <= 5;
        case 'weekends':
          return day === 0 || day === 6;
        case 'weekly':
          return day === 1; // Monday
        case 'custom':
          return task.custom_days?.includes(day) || false;
        default:
          return false;
      }
    };

    const choresToCreate = recurringTasks
      .filter(task => shouldRunOnDay(task, dayOfWeek))
      .map(task => ({
        id: `${task.id}-${date}`,
        user_id: user.id,
        house_id: houseId,
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        points: task.points,
        emoji: task.emoji,
        color: task.color,
        completed: false,
        status: 'incomplete',
        difficulty: task.difficulty,
        date: date,
        recurring_task_id: task.id,
      }));

    if (choresToCreate.length === 0) {
      return c.json({ message: 'No chores to generate for this date', chores: [] });
    }

    const { data, error } = await supabase
      .from('chores')
      .insert(choresToCreate)
      .select();

    if (error) {
      console.error('Error generating chores:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ chores: data });
  } catch (error) {
    console.error('Exception generating chores:', error);
    return c.json({ error: 'Failed to generate chores' }, 500);
  }
});

// Get user role endpoint
app.get("/make-server-28dd5996/user/role", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const role = await getUserRole(user.id);
  if (!role) {
    return c.json({ error: 'User profile not found' }, 404);
  }

  return c.json({ role });
});

// Get house members endpoint
app.get("/make-server-28dd5996/house-members", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Get user's house_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return c.json({ members: [] });
    }

    // Get all members in the same house
    const { data: members, error } = await supabase
      .from('user_profiles')
      .select('user_id, display_name, role, created_at')
      .eq('house_id', profile.house_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching house members:', error);
      return c.json({ error: error.message }, 500);
    }

    // Get email addresses for each member
    const membersWithEmail = await Promise.all(
      (members || []).map(async (member) => {
        const { data: { user: memberUser } } = await supabase.auth.admin.getUserById(member.user_id);
        return {
          ...member,
          name: member.display_name,
          email: memberUser?.email || 'Unknown',
        };
      })
    );

    return c.json({ members: membersWithEmail });
  } catch (error) {
    console.error('Exception fetching house members:', error);
    return c.json({ error: 'Failed to fetch house members' }, 500);
  }
});

// Get pending chores for approval (admins only)
app.get("/make-server-28dd5996/chores/pending", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can view pending chores' }, 403);
  }

  try {
    // Get user's house_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    const { data, error } = await supabase
      .from('chores')
      .select('*')
      .eq('house_id', profile?.house_id)
      .eq('status', 'pending_approval')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending chores:', error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ chores: data });
  } catch (error) {
    console.error('Exception fetching pending chores:', error);
    return c.json({ error: 'Failed to fetch pending chores' }, 500);
  }
});

// Rewards endpoints

// Get all rewards for the user's house
app.get("/make-server-28dd5996/rewards", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Get user's house_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return c.json({ rewards: [] });
    }

    // Get all rewards stored in KV for this house
    const rewards = await kv.getByPrefix(`reward_${profile.house_id}_`);
    
    return c.json({ rewards: rewards || [] });
  } catch (error) {
    console.error('Exception fetching rewards:', error);
    return c.json({ error: 'Failed to fetch rewards' }, 500);
  }
});

// Create a new reward (admins only)
app.post("/make-server-28dd5996/rewards", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can create rewards' }, 403);
  }

  try {
    const reward = await c.req.json();

    // Get user's house_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    const houseId = profile?.house_id || `house_${user.id}`;
    const rewardId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const newReward = {
      id: rewardId,
      house_id: houseId,
      title: reward.title,
      description: reward.description,
      cost: reward.cost,
      emoji: reward.emoji,
      color: reward.color || 'from-[#00C2A8] to-[#00FFD1]',
      created_at: new Date().toISOString(),
      created_by: user.id,
    };

    await kv.set(`reward_${houseId}_${rewardId}`, newReward);

    return c.json({ reward: newReward });
  } catch (error) {
    console.error('Exception creating reward:', error);
    return c.json({ error: 'Failed to create reward' }, 500);
  }
});

// Update a reward (admins only)
app.put("/make-server-28dd5996/rewards/:id", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can update rewards' }, 403);
  }

  try {
    const rewardId = c.req.param('id');
    const updates = await c.req.json();

    // Get user's house_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    const houseId = profile?.house_id || `house_${user.id}`;
    const key = `reward_${houseId}_${rewardId}`;

    // Get existing reward
    const existingReward = await kv.get(key);
    if (!existingReward) {
      return c.json({ error: 'Reward not found' }, 404);
    }

    // Update reward
    const updatedReward = {
      ...existingReward,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    await kv.set(key, updatedReward);

    return c.json({ reward: updatedReward });
  } catch (error) {
    console.error('Exception updating reward:', error);
    return c.json({ error: 'Failed to update reward' }, 500);
  }
});

// Delete a reward (admins only)
app.delete("/make-server-28dd5996/rewards/:id", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (!(await isAdmin(user.id))) {
    return c.json({ error: 'Only admins can delete rewards' }, 403);
  }

  try {
    const rewardId = c.req.param('id');

    // Get user's house_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    const houseId = profile?.house_id || `house_${user.id}`;
    const key = `reward_${houseId}_${rewardId}`;

    await kv.del(key);

    return c.json({ success: true });
  } catch (error) {
    console.error('Exception deleting reward:', error);
    return c.json({ error: 'Failed to delete reward' }, 500);
  }
});

// Claim a reward (deducts points from user)
app.post("/make-server-28dd5996/rewards/:id/claim", async (c) => {
  const user = await getAuthorizedUser(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const rewardId = c.req.param('id');

    // Get user's house_id and points
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('house_id, points')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const houseId = profile.house_id;
    const key = `reward_${houseId}_${rewardId}`;

    // Get reward
    const reward = await kv.get(key);
    if (!reward) {
      return c.json({ error: 'Reward not found' }, 404);
    }

    // Check if user has enough points
    if (profile.points < reward.cost) {
      return c.json({ error: 'Not enough points' }, 400);
    }

    // Deduct points from user
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ points: profile.points - reward.cost })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating user points:', updateError);
      return c.json({ error: 'Failed to claim reward' }, 500);
    }

    // Log the claim (store in KV)
    const claimId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await kv.set(`claim_${houseId}_${user.id}_${claimId}`, {
      id: claimId,
      user_id: user.id,
      reward_id: rewardId,
      reward_title: reward.title,
      points_spent: reward.cost,
      claimed_at: new Date().toISOString(),
    });

    return c.json({ 
      success: true, 
      newBalance: profile.points - reward.cost 
    });
  } catch (error) {
    console.error('Exception claiming reward:', error);
    return c.json({ error: 'Failed to claim reward' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-28dd5996/health", (c) => {
  return c.json({ status: "ok" });
});

// Database setup check endpoint
app.get("/make-server-28dd5996/database-check", async (c) => {
  try {
    const missingTables: string[] = [];
    
    // Check if tables exist - use different column for each table since they have different primary keys
    const tableChecks = [
      { name: 'user_profiles', column: 'user_id' },
      { name: 'recurring_tasks', column: 'id' },
      { name: 'chores', column: 'id' }
    ];
    
    for (const table of tableChecks) {
      const { error } = await supabase
        .from(table.name)
        .select(table.column)
        .limit(1);
      
      if (error) {
        console.log(`Table ${table.name} check error:`, error.message, error.code);
        if (error.message.includes('does not exist') || error.message.includes('relation') || error.code === '42P01' || error.code === 'PGRST116') {
          missingTables.push(table.name);
        }
      }
    }
    
    return c.json({
      isSetup: missingTables.length === 0,
      missingTables,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database check error:', error);
    return c.json({
      isSetup: false,
      missingTables: ['user_profiles', 'recurring_tasks', 'chores'],
      error: 'Failed to check database setup',
    }, 500);
  }
});

Deno.serve(app.fetch);