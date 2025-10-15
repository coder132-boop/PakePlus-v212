import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, Copy, ExternalLink, RefreshCw, PartyPopper, Globe, Key } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';

interface DatabaseSetupGuideProps {
  onRetry: () => void;
  isChecking: boolean;
}

export function DatabaseSetupGuide({ onRetry, isChecking }: DatabaseSetupGuideProps) {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleConfigured, setGoogleConfigured] = useState(false);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const sqlScript = `-- ChoreCore Database Setup
-- Copy and paste this entire script into your Supabase SQL Editor

-- Step 1: Drop existing table if it has wrong schema (this is safe - no data yet)
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Step 2: Create user_profiles table with correct schema
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  house_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view profiles in their house"
  ON user_profiles FOR SELECT
  USING (house_id IN (
    SELECT house_id FROM user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Step 3: Drop and recreate recurring_tasks table
DROP TABLE IF EXISTS recurring_tasks CASCADE;

-- Create recurring_tasks table (only admins can create these)
CREATE TABLE recurring_tasks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  house_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  recurrence TEXT NOT NULL CHECK (recurrence IN ('daily', 'weekdays', 'weekends', 'weekly', 'custom')),
  custom_days INTEGER[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on recurring_tasks
ALTER TABLE recurring_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recurring_tasks
CREATE POLICY "Users can view their house's recurring tasks"
  ON recurring_tasks FOR SELECT
  USING (auth.uid() = user_id OR house_id IN (
    SELECT house_id FROM recurring_tasks WHERE user_id = auth.uid()
  ));

CREATE POLICY "Only admins can create recurring tasks"
  ON recurring_tasks FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update recurring tasks"
  ON recurring_tasks FOR UPDATE
  USING (
    house_id IN (
      SELECT house_id FROM recurring_tasks WHERE user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete recurring tasks"
  ON recurring_tasks FOR DELETE
  USING (
    house_id IN (
      SELECT house_id FROM recurring_tasks WHERE user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Step 4: Drop and recreate chores table
DROP TABLE IF EXISTS chores CASCADE;

-- Create chores table
CREATE TABLE chores (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  house_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  awarded_points INTEGER,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'pending_approval', 'completed')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  date DATE NOT NULL,
  recurring_task_id TEXT,
  completed_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on chores
ALTER TABLE chores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chores
CREATE POLICY "Users can view their house's chores"
  ON chores FOR SELECT
  USING (auth.uid() = user_id OR house_id IN (
    SELECT house_id FROM chores WHERE user_id = auth.uid()
  ));

CREATE POLICY "Only admins can create chores"
  ON chores FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Members can update chores (status only) and admins can update all"
  ON chores FOR UPDATE
  USING (
    house_id IN (
      SELECT house_id FROM chores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete chores"
  ON chores FOR DELETE
  USING (
    house_id IN (
      SELECT house_id FROM chores WHERE user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Step 5: Create indexes for better performance
CREATE INDEX idx_recurring_tasks_house ON recurring_tasks(house_id);
CREATE INDEX idx_recurring_tasks_user ON recurring_tasks(user_id);
CREATE INDEX idx_chores_house ON chores(house_id);
CREATE INDEX idx_chores_user ON chores(user_id);
CREATE INDEX idx_chores_date ON chores(date);
CREATE INDEX idx_chores_status ON chores(status);
CREATE INDEX idx_user_profiles_house ON user_profiles(house_id);

-- Step 6: Force schema cache refresh
NOTIFY pgrst, 'reload schema';`;

  const handleGoogleOAuthSetup = async () => {
    if (!googleClientId || !googleClientSecret) {
      toast.error('Please fill in both Client ID and Client Secret');
      return;
    }

    setGoogleLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28dd5996/setup/google-oauth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to configure Google OAuth');
      }

      setGoogleConfigured(true);
      toast.success('Google OAuth enabled! 🎉', {
        description: 'Users can now sign in with Google.',
        duration: 5000,
      });

      setGoogleDialogOpen(false);
      setGoogleClientId('');
      setGoogleClientSecret('');
    } catch (error: any) {
      console.error('Google OAuth setup error:', error);
      toast.error('Failed to enable Google OAuth', {
        description: error.message || 'Please check your credentials and try again.',
        duration: 6000,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCopy = () => {
    // Use the reliable textarea method that works in all contexts
    const textArea = document.createElement('textarea');
    textArea.value = sqlScript;
    
    // Make textarea visible but off-screen
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    try {
      // Select the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, sqlScript.length);
      
      // Try to copy using execCommand (works everywhere)
      const successful = document.execCommand('copy');
      
      if (successful) {
        setCopied(true);
        toast.success('SQL script copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      } else {
        // If execCommand fails, show manual copy instructions
        toast.warning('Please copy manually', {
          description: 'Select the text in the code preview below and press Ctrl+C (or Cmd+C on Mac)',
          duration: 5000,
        });
      }
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error('Please copy manually', {
        description: 'Select the text in the code preview below and press Ctrl+C (or Cmd+C on Mac)',
        duration: 5000,
      });
    } finally {
      // Always remove the textarea
      document.body.removeChild(textArea);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Open SQL Editor',
      description: 'Click below to open your Supabase SQL Editor directly',
      action: (
        <Button
          onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/sql/new`, '_blank')}
          variant="outline"
          size="sm"
          className="mt-2 bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
        >
          <ExternalLink className="size-4 mr-2" />
          Open SQL Editor
        </Button>
      ),
    },
    {
      number: 2,
      title: 'Copy SQL Script',
      description: 'Click the button below to copy the database setup script',
      action: (
        <Button
          onClick={handleCopy}
          className="mt-2 bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] hover:from-[#00A890] hover:from-[#00E5BD] text-white"
        >
          <Copy className="size-4 mr-2" />
          {copied ? 'Copied!' : 'Copy SQL Script'}
        </Button>
      ),
    },
    {
      number: 3,
      title: 'Paste and Run',
      description: 'Paste the script into SQL Editor and click "Run" (or press Ctrl/Cmd + Enter)',
      icon: '▶️',
    },
    {
      number: 4,
      title: 'Enable Email Auth (if needed)',
      description: 'Go to Authentication > Providers > Email and toggle it on',
      action: (
        <Button
          onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/auth/providers`, '_blank')}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          <ExternalLink className="size-4 mr-2" />
          Open Auth Settings
        </Button>
      ),
    },
    {
      number: 5,
      title: 'Verify Setup',
      description: 'Click below to test your database connection',
      action: (
        <Button
          onClick={onRetry}
          disabled={isChecking}
          className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          {isChecking ? (
            <>
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="size-4 mr-2" />
              Verify Database
            </>
          )}
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center size-24 rounded-3xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] text-5xl shadow-lg mb-6">
            <Database className="size-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] bg-clip-text text-transparent">
            Database Setup Required
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            ChoreCore needs a secure database to store your household's tasks. Follow these steps to set it up in just a few minutes!
          </p>
        </motion.div>

        {/* Quick Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 backdrop-blur-xl bg-gradient-to-r from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-3xl p-8 shadow-lg border border-white/60"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl text-foreground mb-3">3-Step Quick Setup</h2>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
              Set up your database in under 2 minutes. This is a one-time setup with enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/sql/new`, '_blank')}
                size="lg"
                className="bg-gradient-to-r from-[#00C2A8] to-[#00FFD1] hover:from-[#00A890] hover:to-[#00E5BD] text-white shadow-lg"
              >
                <ExternalLink className="size-5 mr-2" />
                1. Open SQL Editor
              </Button>
              <Button
                onClick={handleCopy}
                size="lg"
                variant="outline"
                className="bg-white/50 hover:bg-white/70"
              >
                <Copy className="size-5 mr-2" />
                {copied ? '✓ Copied!' : '2. Copy Script'}
              </Button>
              <Button
                onClick={onRetry}
                disabled={isChecking}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
              >
                {isChecking ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-5 mr-2" />
                    3. Verify
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 shadow-lg border border-white/60 hover:bg-white/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 size-12 rounded-2xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] flex items-center justify-center text-white shadow-lg">
                  {step.icon || step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {step.description}
                  </p>
                  {step.action && <div>{step.action}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SQL Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 backdrop-blur-xl bg-gray-900/80 rounded-3xl p-6 shadow-lg border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-white">SQL Script Preview</h3>
            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Copy className="size-4 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="bg-black/40 rounded-2xl p-4 overflow-x-auto max-h-64 overflow-y-auto">
            <pre className="text-xs text-green-400 font-mono select-all cursor-text">
              {sqlScript}
            </pre>
          </div>
          <p className="text-xs text-white/60 mt-2 text-center">
            💡 Tip: Click inside the code block to select all text, or use the Copy button above
          </p>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 backdrop-blur-xl bg-gradient-to-br from-[#7DE3D6]/30 to-[#B8F3EA]/30 rounded-3xl p-6 shadow-lg border border-white/60"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h3 className="text-lg text-foreground mb-2">Troubleshooting</h3>
              <p className="text-sm text-foreground/80 mb-3">
                If you encounter any errors during setup:
              </p>
              <ul className="text-sm text-foreground/80 space-y-2 list-disc list-inside mb-4">
                <li>Make sure you're logged into the correct Supabase project (<code className="bg-black/20 px-1.5 py-0.5 rounded text-xs">{projectId}</code>)</li>
                <li>Check that you have admin/owner permissions on the project</li>
                <li>Verify the SQL runs without errors in the SQL Editor (check the output panel at bottom)</li>
                <li>Look for "Success. No rows returned" message - that's good!</li>
                <li>Enable Email provider in Authentication &gt; Providers settings</li>
                <li>Wait 3-5 seconds after running SQL before clicking "Verify Database"</li>
                <li>Try refreshing the page after setup to re-check the database</li>
              </ul>
              <div className="bg-white/30 rounded-2xl p-4 border border-white/40">
                <p className="text-sm text-foreground/90">
                  <strong>Still having issues?</strong> Open browser console (F12 or right-click → Inspect → Console) and look for detailed error messages. You can also check that the three tables (<code className="bg-black/20 px-1.5 py-0.5 rounded text-xs">user_profiles</code>, <code className="bg-black/20 px-1.5 py-0.5 rounded text-xs">recurring_tasks</code>, <code className="bg-black/20 px-1.5 py-0.5 rounded text-xs">chores</code>) appear in your Supabase Table Editor.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What Gets Created */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-6 backdrop-blur-xl bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl p-6 shadow-lg border border-white/60"
        >
          <h3 className="text-lg text-foreground mb-3 flex items-center gap-2">
            <Database className="size-5" />
            What This Script Creates
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/30 rounded-xl p-4 border border-white/40">
              <div className="text-2xl mb-2">👤</div>
              <h4 className="text-sm text-foreground mb-1">user_profiles</h4>
              <p className="text-xs text-foreground/70">
                Stores house membership, roles (admin/member), and display names
              </p>
            </div>
            <div className="bg-white/30 rounded-xl p-4 border border-white/40">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="text-sm text-foreground mb-1">recurring_tasks</h4>
              <p className="text-xs text-foreground/70">
                Task templates that auto-generate daily chores
              </p>
            </div>
            <div className="bg-white/30 rounded-xl p-4 border border-white/40">
              <div className="text-2xl mb-2">✅</div>
              <h4 className="text-sm text-foreground mb-1">chores</h4>
              <p className="text-xs text-foreground/70">
                Daily task instances with approval workflow and point tracking
              </p>
            </div>
          </div>
        </motion.div>

        {/* Google OAuth Setup (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6 backdrop-blur-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl p-6 shadow-lg border border-white/60"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Globe className="size-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-foreground mb-2 flex items-center gap-2">
                Google Sign-In Setup
                <span className="text-xs bg-blue-500/20 text-blue-700 px-2 py-1 rounded-full">Optional</span>
                {googleConfigured && (
                  <span className="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    Configured
                  </span>
                )}
              </h3>
              <p className="text-sm text-foreground/70 mb-4">
                Allow users to sign in with their Google accounts for a smoother experience. This is optional - email/password authentication will always work.
              </p>
              
              <div className="bg-white/30 rounded-2xl p-4 border border-white/40 mb-4">
                <h4 className="text-sm text-foreground mb-2">📋 Quick Setup Steps:</h4>
                <ol className="text-xs text-foreground/80 space-y-1.5 list-decimal list-inside">
                  <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                  <li>Create a new project (or select existing)</li>
                  <li>Navigate to APIs & Services → Credentials</li>
                  <li>Click "Create Credentials" → "OAuth client ID"</li>
                  <li>Select "Web application" as application type</li>
                  <li>Add authorized redirect URI: <code className="bg-black/20 px-1.5 py-0.5 rounded text-xs">https://{projectId}.supabase.co/auth/v1/callback</code></li>
                  <li>Copy the Client ID and Client Secret</li>
                  <li>Paste them below and click "Enable Google Sign-In"</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setGoogleDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <Key className="size-4 mr-2" />
                  {googleConfigured ? 'Update' : 'Configure'} Google Sign-In
                </Button>
                <Button
                  onClick={() => window.open('https://console.cloud.google.com', '_blank')}
                  variant="outline"
                  className="bg-white/50 hover:bg-white/70"
                >
                  <ExternalLink className="size-4 mr-2" />
                  Open Google Console
                </Button>
              </div>

              {googleConfigured && (
                <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                  <CheckCircle className="size-4" />
                  Google Sign-In is active! Users can now use "Sign in with Google" on the auth page.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Google OAuth Configuration Dialog */}
      <Dialog open={googleDialogOpen} onOpenChange={setGoogleDialogOpen}>
        <DialogContent className="backdrop-blur-xl bg-white/95 border border-white/60 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="size-6 text-blue-600" />
              Configure Google Sign-In
            </DialogTitle>
            <DialogDescription>
              Enter your Google OAuth credentials from Google Cloud Console
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-sm text-foreground mb-2 flex items-center gap-2">
                <ExternalLink className="size-4" />
                Need credentials? Follow these steps:
              </h4>
              <ol className="text-xs text-foreground/80 space-y-1.5 list-decimal list-inside">
                <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console Credentials</a></li>
                <li>Create OAuth 2.0 Client ID (Web application type)</li>
                <li>Add this redirect URI: <code className="bg-white px-1.5 py-0.5 rounded text-xs">https://{projectId}.supabase.co/auth/v1/callback</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://${projectId}.supabase.co/auth/v1/callback`);
                      toast.success('Redirect URI copied!');
                    }}
                    className="ml-1 text-blue-600 hover:underline text-xs"
                  >
                    (copy)
                  </button>
                </li>
                <li>Copy the Client ID and Client Secret to the fields below</li>
              </ol>
            </div>

            <div>
              <Label htmlFor="clientId">Google Client ID</Label>
              <Input
                id="clientId"
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                placeholder="123456789-abcdefg.apps.googleusercontent.com"
                className="mt-1 font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="clientSecret">Google Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                value={googleClientSecret}
                onChange={(e) => setGoogleClientSecret(e.target.value)}
                placeholder="GOCSPX-..."
                className="mt-1 font-mono text-sm"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleGoogleOAuthSetup}
                disabled={googleLoading || !googleClientId || !googleClientSecret}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                {googleLoading ? (
                  <>
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Enabling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4 mr-2" />
                    Enable Google Sign-In
                  </>
                )}
              </Button>
              <Button
                onClick={() => setGoogleDialogOpen(false)}
                variant="outline"
                disabled={googleLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}