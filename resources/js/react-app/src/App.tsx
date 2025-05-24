import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Login from "./pages/Login";
import AppLayout from "./components/layout/AppLayout";
import { useAuth } from "./context/AuthContext";
import { LocalizationProvider } from "./context/LocalizationContext";

// Route wrapper to apply AppLayout to authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

function App() {
  return (
    <AuthProvider>
      <LocalizationProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
            <Route path="/issues/:id" element={<ProtectedRoute><IssueDetailPage /></ProtectedRoute>} />
            <Route path="/report-issue" element={<ProtectedRoute><ReportIssuePage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;
