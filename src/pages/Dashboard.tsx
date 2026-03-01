import { motion } from "framer-motion";
import { Activity, Bell, LogOut, Calendar, BookOpen, AlertTriangle, MessageSquare, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RiskGauge from "@/components/dashboard/RiskGauge";
import CourseCard from "@/components/dashboard/CourseCard";
import { useAuth } from "@/contexts/AuthContext";
import { mockStudentEnrollments, mockAlerts } from "@/lib/mock-data";

const enrollments = mockStudentEnrollments;
const unreadAlerts = mockAlerts.filter(a => !a.is_read);

const overallScore = Math.round(
  enrollments.reduce((a, e) => a + (e.ca_pct * 0.6 + e.attendance_pct * 0.4), 0) / enrollments.length
);
const atRiskCount = enrollments.filter(e => e.current_risk_status !== "satisfactory").length;

const gradients = [
  "bg-gradient-to-br from-[hsl(180_70%_30%)] to-[hsl(220_60%_25%)]",
  "bg-gradient-to-br from-[hsl(260_60%_35%)] to-[hsl(300_50%_25%)]",
  "bg-gradient-to-br from-[hsl(0_60%_35%)] to-[hsl(30_70%_25%)]",
  "bg-gradient-to-br from-[hsl(145_50%_30%)] to-[hsl(180_60%_20%)]",
  "bg-gradient-to-br from-[hsl(38_70%_35%)] to-[hsl(15_60%_25%)]",
  "bg-gradient-to-br from-[hsl(200_60%_30%)] to-[hsl(240_50%_25%)]",
];

const trendFromStatus = (status: string) => status === "satisfactory" ? "up" as const : status === "critical" ? "down" as const : "down" as const;

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-navy dark">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-navy/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Baseline</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard/alerts">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-danger text-[10px] font-bold flex items-center justify-center text-destructive-foreground">
                    {unreadAlerts.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/dashboard/feedback">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/" onClick={logout}>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Good evening, {user?.full_name?.split(" ")[0] || "Student"}</h1>
          <p className="text-muted-foreground mt-1">Here's your academic health snapshot</p>
        </motion.div>

        {/* Warning Banner */}
        {atRiskCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8 p-4 rounded-2xl border border-danger/30 bg-danger/5 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-danger mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-danger">Intervention Needed</p>
              <p className="text-sm text-muted-foreground mt-1">
                {atRiskCount} course{atRiskCount > 1 ? "s" : ""} below threshold. Contact your advisor immediately.
              </p>
            </div>
          </motion.div>
        )}

        {/* Gauge + Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-1">
            <RiskGauge score={overallScore} label="Academic Health Score" />
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, label: "Enrolled Courses", value: enrollments.length, color: "text-primary" },
              { icon: AlertTriangle, label: "At Risk", value: atRiskCount, color: atRiskCount > 0 ? "text-danger" : "text-success" },
              { icon: Calendar, label: "Avg. Attendance", value: `${Math.round(enrollments.reduce((a, e) => a + e.attendance_pct, 0) / enrollments.length)}%`, color: "text-foreground" },
              { icon: Activity, label: "Avg. Grade", value: `${Math.round(enrollments.reduce((a, e) => a + e.ca_pct, 0) / enrollments.length)}%`, color: "text-foreground" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-5 rounded-2xl bg-card border border-border"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className={`text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Your Courses</h2>
            <Link to="/dashboard/alerts" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View alerts <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment, i) => (
              <CourseCard
                key={enrollment.id}
                code={enrollment.course?.code || ""}
                title={enrollment.course?.title || ""}
                grade={enrollment.ca_pct}
                attendance={enrollment.attendance_pct}
                trend={trendFromStatus(enrollment.current_risk_status)}
                gradient={gradients[i % gradients.length]}
                delay={0.1 * i}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
