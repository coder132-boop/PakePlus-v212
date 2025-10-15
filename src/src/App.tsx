import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { TaskProvider, useTaskContext } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { HouseDashboard } from './components/HouseDashboard';
import { ChoreCalendar } from './components/ChoreCalendar';
import { ChoreList } from './components/ChoreList';
import { AssignChores } from './components/AssignChores';
import { PointsPage } from './components/PointsPage';
import { AuthPage } from './components/AuthPage';
import { DatabaseSetupGuide } from './components/DatabaseSetupGuide';
import { SettingsPage } from './components/SettingsPage';
import { Toaster } from './components/ui/sonner';
import { EasterEggs } from './components/EasterEggs';
import { ChoreCoreLogo } from './components/ChoreCoreLogo';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useTaskContext();
  const location = useLocation();

  if (loading) {
    return null; // Will show loading screen from AppContent
  }

  if (!isAuthenticated) {
    // Redirect to login with the attempted path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Admin-only route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { userRole, loading } = useTaskContext();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { loading, databaseSetup, checkingDatabase, checkDatabase, isAuthenticated } = useTaskContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for admin URL parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin-setup')) {
      navigate('/admin-setup', { replace: true });
    }
  }, []);

  // Navigation handler for components that need it
  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      'home': '/login',
      'about': '/about',
      'dashboard': '/dashboard',
      'calendar': '/calendar',
      'chores': '/chores',
      'assign': '/assign',
      'points': '/points',
      'settings': '/settings',
      'auth': '/login',
    };
    navigate(routes[page] || '/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="size-16 sm:size-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD1] text-3xl sm:text-4xl shadow-lg mb-3 sm:mb-4 mx-auto flex items-center justify-center animate-bounce">
            <div className="scale-75 sm:scale-100">
              <ChoreCoreLogo size={48} />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl text-foreground mb-2">Loading ChoreCore...</h2>
          <div className="size-7 sm:size-8 border-4 border-teal-200 border-t-[#00C2A8] rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <EasterEggs>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#00C2A8]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD43B]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#00FFD1]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-6000" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Navigation currentPage={location.pathname.slice(1) || 'home'} onNavigate={handleNavigate} />
          
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
            <Route path="/login" element={<AuthPage onNavigate={handleNavigate} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin-setup" element={<DatabaseSetupGuide onRetry={checkDatabase} isChecking={checkingDatabase} />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <HouseDashboard onNavigate={handleNavigate} />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <ChoreCalendar />
              </ProtectedRoute>
            } />
            <Route path="/chores" element={
              <ProtectedRoute>
                <ChoreList />
              </ProtectedRoute>
            } />
            <Route path="/points" element={
              <ProtectedRoute>
                <PointsPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Admin-only routes */}
            <Route path="/assign" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AssignChores />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Toast Notifications */}
        <Toaster position="top-right" richColors />
      </div>
    </EasterEggs>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
