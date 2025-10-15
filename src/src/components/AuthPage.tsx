import { motion } from 'motion/react';
import { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { LogIn, UserPlus, Users, Mail, Lock, Home, CheckCircle2, Hash } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChoreCoreLogo } from './ChoreCoreLogo';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { Checkbox } from './ui/checkbox';

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const { isAuthenticated, databaseSetup, user, userRole, accessToken } = useTaskContext();
  const [step, setStep] = useState<'choice' | 'create' | 'join' | 'login' | 'oauth-setup'>('choice');
  const [mode, setMode] = useState<'create' | 'join' | 'login'>('create');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [generatedInviteCode, setGeneratedInviteCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // Default to true (keep logged in)

  // If authenticated but no house, show OAuth setup
  if (user && accessToken && !userRole && step !== 'oauth-setup') {
    setStep('oauth-setup');
  }

  // If fully authenticated with a house, redirect to dashboard
  if (isAuthenticated && userRole) {
    onNavigate('dashboard');
    return null;
  }

  // If database is not set up, show warning
  if (!databaseSetup) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-gradient-to-br from-red-400/30 to-orange-400/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/60"
          >
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
            <h2 className="text-xl sm:text-2xl text-foreground mb-3 sm:mb-4">Database Not Set Up</h2>
            <p className="text-sm sm:text-base text-foreground/70 mb-4 sm:mb-6">
              Please complete the database setup before using authentication features.
            </p>
            <p className="text-xs sm:text-sm text-foreground/60">
              The app will automatically redirect once setup is complete.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleCreateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/auth/create-house`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, displayName }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Invalid response from server');
      }

      console.log('Create house response:', { ok: response.ok, status: response.status, data });

      if (!response.ok) {
        const errorMessage = data?.error || 'Failed to create house';
        const errorDetails = data?.details ? ` - ${data.details}` : '';
        
        // If it's a database setup error, redirect to setup guide
        if (data?.code === 'SETUP_REQUIRED') {
          toast.error('Database Setup Required', {
            description: data.details,
            duration: 10000,
          });
          setTimeout(() => {
            window.location.href = window.location.pathname + '?admin-setup';
          }, 2000);
          return;
        }
        
        // If user already exists, suggest signing in instead
        if (data?.code === 'USER_EXISTS' || errorMessage.includes('already been registered') || errorMessage.includes('already exists')) {
          toast.error('Account already exists', {
            description: 'This email is already registered. Please sign in instead.',
            duration: 6000,
          });
          setTimeout(() => {
            setStep('login');
            setMode('login');
          }, 2000);
          return;
        }
        
        throw new Error(errorMessage + errorDetails);
      }

      if (!data || !data.inviteCode) {
        console.error('Missing invite code in response:', data);
        throw new Error('Server did not return an invite code');
      }

      // Now sign in the newly created user to establish a session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Auto-login after signup failed:', signInError);
        toast.warning('Account created but auto-login failed', {
          description: 'Please sign in manually',
        });
        return;
      }

      // Store session persistence preference
      if (rememberMe) {
        localStorage.setItem('chorecore_remember_me', 'true');
      }

      toast.success('House created successfully!', {
        description: `Your house invite code: ${data.inviteCode}. Share this with your housemates!`,
        duration: 8000,
      });

      // Reload to trigger context refresh
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error('Create house error:', error);
      toast.error('Failed to create house', {
        description: error.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName || !inviteCode) {
      toast.error('Please fill in all fields');
      return;
    }

    if (inviteCode.length !== 6 || !/^\d+$/.test(inviteCode)) {
      toast.error('Invite code must be 6 digits');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/auth/join-house`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, displayName, inviteCode }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Invalid response from server');
      }

      console.log('Join house response:', { ok: response.ok, status: response.status, data });

      if (!response.ok) {
        const errorMessage = data?.error || 'Failed to join house';
        const errorDetails = data?.details ? ` - ${data.details}` : '';
        
        // If it's a database setup error, redirect to setup guide
        if (data?.code === 'SETUP_REQUIRED') {
          toast.error('Database Setup Required', {
            description: data.details,
            duration: 10000,
          });
          setTimeout(() => {
            window.location.href = window.location.pathname + '?admin-setup';
          }, 2000);
          return;
        }
        
        // If user already exists, suggest signing in instead
        if (data?.code === 'USER_EXISTS' || errorMessage.includes('already been registered') || errorMessage.includes('already exists')) {
          toast.error('Account already exists', {
            description: 'This email is already registered. Please sign in instead.',
            duration: 6000,
          });
          setTimeout(() => {
            setStep('login');
            setMode('login');
          }, 2000);
          return;
        }
        
        throw new Error(errorMessage + errorDetails);
      }

      // Now sign in the newly created user to establish a session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Auto-login after joining failed:', signInError);
        toast.warning('Account created but auto-login failed', {
          description: 'Please sign in manually',
        });
        return;
      }

      // Store session persistence preference
      if (rememberMe) {
        localStorage.setItem('chorecore_remember_me', 'true');
      }

      toast.success('Successfully joined house!', {
        description: 'Welcome to your new household!',
      });

      // Reload to trigger context refresh
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error('Join house error:', error);
      toast.error('Failed to join house', {
        description: error.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      // Use Supabase client to sign in (this handles session persistence automatically)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        const errorMessage = error.message === 'Invalid login credentials'
          ? 'Invalid email or password'
          : error.message;
        throw new Error(errorMessage);
      }

      if (!data.session) {
        throw new Error('Login failed - no session returned');
      }

      console.log('Login successful! Session:', {
        user: data.user?.email,
        hasAccessToken: !!data.session.access_token,
      });

      // Store session persistence preference
      if (rememberMe) {
        localStorage.setItem('chorecore_remember_me', 'true');
      } else {
        localStorage.removeItem('chorecore_remember_me');
      }

      toast.success('Successfully signed in!', {
        description: 'Welcome back!',
      });

      // Reload to trigger context refresh with the new session
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to sign in', {
        description: error.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        
        // Check if it's a "provider not enabled" error
        if (error.message?.includes('not enabled') || error.message?.includes('Provider')) {
          toast.error('Google Sign-In Not Set Up', {
            description: 'Google OAuth is optional. Please use email/password to sign in, or see GOOGLE_OAUTH_SETUP.md to enable it.',
            duration: 8000,
          });
          setLoading(false);
          return;
        }
        
        throw new Error(error.message);
      }

      // Store session persistence preference
      if (rememberMe) {
        localStorage.setItem('chorecore_remember_me', 'true');
      }

      // The redirect will happen automatically
      toast.success('Redirecting to Google...', {
        description: 'Please sign in with your Google account',
      });
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Failed to sign in with Google', {
        description: 'Please use email/password instead, or see GOOGLE_OAUTH_SETUP.md for setup help.',
        duration: 6000,
      });
      setLoading(false);
    }
  };

  const handleOAuthCreateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/auth/oauth-create-house`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ displayName }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create house');
      }

      toast.success('House created successfully!', {
        description: `Your invite code: ${data.inviteCode}`,
        duration: 8000,
      });

      setGeneratedInviteCode(data.inviteCode);

      // Reload to trigger context refresh
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('OAuth create house error:', error);
      toast.error('Failed to create house', {
        description: error.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthJoinHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !inviteCode) {
      toast.error('Please fill in all fields');
      return;
    }

    if (inviteCode.length !== 6 || !/^\d+$/.test(inviteCode)) {
      toast.error('Invite code must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/auth/oauth-join-house`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ displayName, inviteCode }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join house');
      }

      toast.success('Successfully joined house!', {
        description: 'Welcome to your new household!',
      });

      // Reload to trigger context refresh
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('OAuth join house error:', error);
      toast.error('Failed to join house', {
        description: error.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };



  // Choice Screen
  if (step === 'choice') {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="mb-3 sm:mb-4 flex justify-center">
              <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-br from-[#00C2A8] via-[#00FFD1] to-white flex items-center justify-center shadow-lg p-3 sm:p-4">
                <ChoreCoreLogo size={64} />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl mb-3 sm:mb-4 bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] bg-clip-text text-transparent px-2">
              Welcome to ChoreCore
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 px-4">
              Choose how you'd like to get started
            </p>
          </motion.div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Create Account */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => {
                setMode('create');
                setStep('create');
              }}
              className="backdrop-blur-xl bg-gradient-to-br from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/60 hover:bg-white/50 transition-all text-left group touch-target"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <UserPlus className="size-6 sm:size-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl text-foreground mb-0.5 sm:mb-1">Create Account</h3>
                  <p className="text-xs sm:text-sm text-foreground/70">Start a new household</p>
                </div>
              </div>
              <p className="text-foreground/60 text-xs sm:text-sm">
                Create your account and become an admin. You'll get a 6-digit invite code to share with housemates.
              </p>
            </motion.button>

            {/* Join House */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => {
                setMode('join');
                setStep('join');
              }}
              className="backdrop-blur-xl bg-gradient-to-br from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/60 hover:bg-white/50 transition-all text-left group touch-target"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <Users className="size-6 sm:size-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl text-foreground mb-0.5 sm:mb-1">Join a House</h3>
                  <p className="text-xs sm:text-sm text-foreground/70">Use invite code</p>
                </div>
              </div>
              <p className="text-foreground/60 text-xs sm:text-sm">
                Have an invite code? Create your account and join an existing household as a member.
              </p>
            </motion.button>

            {/* Sign In */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                setMode('login');
                setStep('login');
              }}
              className="backdrop-blur-xl bg-gradient-to-br from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/60 hover:bg-white/50 transition-all text-left group touch-target sm:col-span-2"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <LogIn className="size-6 sm:size-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl text-foreground mb-0.5 sm:mb-1">Sign In</h3>
                  <p className="text-xs sm:text-sm text-foreground/70">Access your account</p>
                </div>
              </div>
              <p className="text-foreground/60 text-xs sm:text-sm">
                Already have an account? Sign in with your email to access your household.
              </p>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Create House Form
  if (step === 'create') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 shadow-lg border border-white/60"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-3xl shadow-lg mb-4">
                <Home className="size-8 text-white" />
              </div>
              <h2 className="text-2xl text-foreground mb-2">Create Your House</h2>
              <p className="text-sm text-foreground/70">
                You'll become the admin with a unique invite code
              </p>
            </div>

            <form onSubmit={handleCreateHouse} className="space-y-6">
              <div>
                <Label htmlFor="displayName" className="text-foreground/80 mb-2 block">
                  Your Name
                </Label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground/80 mb-2 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground/80 mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Home className="size-5 mr-2" />
                    Create House
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setStep('choice')}
                variant="outline"
                className="w-full backdrop-blur-xl bg-white/40 border-white/60"
              >
                Back
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // Join House Form
  if (step === 'join') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 shadow-lg border border-white/60"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-3xl shadow-lg mb-4">
                <Users className="size-8 text-white" />
              </div>
              <h2 className="text-2xl text-foreground mb-2">Join a House</h2>
              <p className="text-sm text-foreground/70">
                Enter the invite code from your housemate
              </p>
            </div>

            <form onSubmit={handleJoinHouse} className="space-y-6">
              <div>
                <Label htmlFor="inviteCode" className="text-foreground/80 mb-2 block">
                  6-Digit Invite Code
                </Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                  <Input
                    id="inviteCode"
                    type="text"
                    value={inviteCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setInviteCode(value);
                    }}
                    placeholder="123456"
                    className="pl-12 backdrop-blur-xl bg-white/50 border-white/60 text-2xl text-center tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="displayName-join" className="text-foreground/80 mb-2 block">
                  Your Name
                </Label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                  <Input
                    id="displayName-join"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email-join" className="text-foreground/80 mb-2 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                  <Input
                    id="email-join"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password-join" className="text-foreground/80 mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                  <Input
                    id="password-join"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Users className="size-5 mr-2" />
                    Join House
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setStep('choice')}
                variant="outline"
                className="w-full backdrop-blur-xl bg-white/40 border-white/60"
              >
                Back
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // Login Form
  if (step === 'login') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 shadow-lg border border-white/60"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-3xl shadow-lg mb-4">
                <LogIn className="size-8 text-white" />
              </div>
              <h2 className="text-2xl text-foreground mb-2">Welcome Back</h2>
              <p className="text-sm text-foreground/70">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email-login" className="text-foreground/80 mb-2 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                  <Input
                    id="email-login"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password-login" className="text-foreground/80 mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                  <Input
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm text-foreground/80 cursor-pointer"
                >
                  Keep me logged in
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-foreground/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/40 backdrop-blur-xl text-foreground/60 rounded-full">
                    or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                variant="outline"
                className="w-full backdrop-blur-xl bg-white/50 border-white/60 hover:bg-white/70"
                size="lg"
              >
                <svg className="size-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
              
              <p className="text-xs text-center text-foreground/50 mt-3">
                Note: Google Sign-In is optional. If it doesn't work, just use email/password above! 
                See GOOGLE_OAUTH_SETUP.md for setup instructions.
              </p>

              <Button
                type="button"
                onClick={() => setStep('choice')}
                variant="outline"
                className="w-full backdrop-blur-xl bg-white/40 border-white/60 mt-4"
              >
                Back
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // OAuth Setup Screen - for Google/OAuth users who need to create or join a house
  if (step === 'oauth-setup') {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="mb-3 sm:mb-4 flex justify-center">
              <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-br from-[#00C2A8] via-[#00FFD1] to-white flex items-center justify-center shadow-lg p-3 sm:p-4">
                <ChoreCoreLogo size={64} />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl mb-3 sm:mb-4 bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] bg-clip-text text-transparent px-2">
              Welcome, {user?.email}!
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 px-4">
              Let's get you set up with a house
            </p>
          </motion.div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Create House */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-gradient-to-br from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/60"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center shadow-lg flex-shrink-0">
                  <Home className="size-6 sm:size-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl text-foreground mb-0.5 sm:mb-1">Create House</h3>
                  <p className="text-xs sm:text-sm text-foreground/70">Start a new household</p>
                </div>
              </div>
              
              <form onSubmit={handleOAuthCreateHouse} className="space-y-4">
                <div>
                  <Label htmlFor="oauth-name" className="text-foreground/80 mb-2 block">
                    Your Name
                  </Label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                    <Input
                      id="oauth-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Home className="size-5 mr-2" />
                      Create House
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Join House */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-gradient-to-br from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-white/60"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center shadow-lg flex-shrink-0">
                  <Users className="size-6 sm:size-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl text-foreground mb-0.5 sm:mb-1">Join House</h3>
                  <p className="text-xs sm:text-sm text-foreground/70">Use invite code</p>
                </div>
              </div>
              
              <form onSubmit={handleOAuthJoinHouse} className="space-y-4">
                <div>
                  <Label htmlFor="oauth-code" className="text-foreground/80 mb-2 block">
                    6-Digit Invite Code
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                    <Input
                      id="oauth-code"
                      type="text"
                      value={inviteCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setInviteCode(value);
                      }}
                      placeholder="123456"
                      className="pl-12 backdrop-blur-xl bg-white/50 border-white/60 text-2xl text-center tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="oauth-name-join" className="text-foreground/80 mb-2 block">
                    Your Name
                  </Label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground/40" />
                    <Input
                      id="oauth-name-join"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="pl-12 backdrop-blur-xl bg-white/50 border-white/60"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Users className="size-5 mr-2" />
                      Join House
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
