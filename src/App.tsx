import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardAlerts from "./pages/DashboardAlerts";
import DashboardFeedback from "./pages/DashboardFeedback";
import Lecturer from "./pages/Lecturer";
import LecturerCourse from "./pages/LecturerCourse";
import LecturerFeedback from "./pages/LecturerFeedback";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* Student */}
            <Route path="/dashboard" element={<AuthGuard allowedRoles={["student"]}><Dashboard /></AuthGuard>} />
            <Route path="/dashboard/alerts" element={<AuthGuard allowedRoles={["student"]}><DashboardAlerts /></AuthGuard>} />
            <Route path="/dashboard/feedback" element={<AuthGuard allowedRoles={["student"]}><DashboardFeedback /></AuthGuard>} />

            {/* Lecturer */}
            <Route path="/lecturer" element={<AuthGuard allowedRoles={["lecturer"]}><Lecturer /></AuthGuard>} />
            <Route path="/lecturer/course/:courseId" element={<AuthGuard allowedRoles={["lecturer"]}><LecturerCourse /></AuthGuard>} />
            <Route path="/lecturer/feedback" element={<AuthGuard allowedRoles={["lecturer"]}><LecturerFeedback /></AuthGuard>} />

            {/* Admin */}
            <Route path="/admin" element={<AuthGuard allowedRoles={["admin"]}><Admin /></AuthGuard>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
