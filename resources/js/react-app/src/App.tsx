import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Issues from "./pages/Issues";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Logs from "./pages/Logs";
import { AuthProvider } from "./context/AuthContext";
import ReportIssuePage from "./pages/ReportIssuePage";
import IssueDetailPage from "./pages/IssueDetailPage";
import LoginPage from "./pages/Login";
import AppLayout from "./components/layout/AppLayout";
import { useAuth } from "./context/AuthContext";
import { LocalizationProvider } from "./context/LocalizationContext";

const queryClient = new QueryClient();

// Route wrapper to apply AppLayout to authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <AppLayout>{children}</AppLayout>;
};

// Public route without AppLayout
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

function App() {
  return (
    <LocalizationProvider defaultLanguage="de">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                
                {/* Special route for report issue - doesn't use AppLayout because it's modal only */}
                <Route path="/report-issue" element={<ReportIssuePage />} />
                
                {/* Protected routes with AppLayout */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                <Route path="/project/:projectId" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
                <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
                <Route path="/issue/:issueId" element={<ProtectedRoute><IssueDetailPage /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                
                {/* 404 */}
                <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}

export default App;
