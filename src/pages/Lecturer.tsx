import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, LogOut, Users, AlertTriangle, BookOpen, TrendingDown, ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockCourses, mockLecturerEnrollments } from "@/lib/mock-data";

const lecturerCourses = mockCourses.filter(c => c.lecturer_id === "lec-001");

const Lecturer = () => {
  const { user, logout } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const getCourseStats = (courseId: string) => {
    const enrolled = mockLecturerEnrollments.filter(e => e.course_id === courseId);
    const atRisk = enrolled.filter(e => e.current_risk_status === "at_risk").length;
    const critical = enrolled.filter(e => e.current_risk_status === "critical").length;
    return { total: enrolled.length, atRisk, critical };
  };

  const totalStudents = lecturerCourses.reduce((acc, c) => acc + getCourseStats(c.id).total, 0);
  const totalAtRisk = lecturerCourses.reduce((acc, c) => acc + getCourseStats(c.id).atRisk + getCourseStats(c.id).critical, 0);

  return (
    <div className="min-h-screen bg-navy dark">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-navy/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Baseline</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Lecturer</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/lecturer/feedback">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
                Feedback
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

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.full_name || "Lecturer"}
          </h1>
          <p className="text-muted-foreground mt-1">Monitor student performance across your courses</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpen, label: "My Courses", value: lecturerCourses.length, color: "text-primary" },
            { icon: Users, label: "Total Students", value: totalStudents, color: "text-foreground" },
            { icon: AlertTriangle, label: "At Risk", value: totalAtRisk, color: totalAtRisk > 0 ? "text-danger" : "text-success" },
            { icon: TrendingDown, label: "Critical", value: lecturerCourses.reduce((a, c) => a + getCourseStats(c.id).critical, 0), color: "text-danger" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="p-5 rounded-2xl bg-card border border-border"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <p className={`text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Course Tiles */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lecturerCourses.map((course, i) => {
              const stats = getCourseStats(course.id);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Link to={`/lecturer/course/${course.id}`}>
                    <div className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono text-primary">{course.code}</span>
                          <h3 className="text-foreground font-semibold mt-1">{course.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{course.unit_load} units · {course.semester}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{stats.total}</span>
                        </div>
                        {stats.atRisk > 0 && (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                            <span className="text-sm text-warning">{stats.atRisk} at risk</span>
                          </div>
                        )}
                        {stats.critical > 0 && (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                            <span className="text-sm text-danger">{stats.critical} critical</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* At Risk Students (All Courses) */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Students Needing Attention</h2>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-9 pr-4 py-2 text-sm glass-input text-foreground placeholder:text-muted-foreground"
                  readOnly
                />
              </div>
            </div>
            <div className="divide-y divide-border">
              {mockLecturerEnrollments
                .filter(e => e.current_risk_status !== "satisfactory")
                .map((enrollment, i) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="px-5 py-4 flex items-center gap-4 hover:bg-[hsl(220_30%_12%)] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {enrollment.student?.full_name?.split(" ").map(n => n[0]).join("") || "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{enrollment.student?.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {enrollment.student?.matric_number} · {enrollment.course?.code}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className={`text-xs ${enrollment.attendance_pct < 75 ? "text-danger" : "text-muted-foreground"}`}>
                          Att: {enrollment.attendance_pct}%
                        </p>
                        <p className={`text-xs ${enrollment.ca_pct < 40 ? "text-danger" : "text-muted-foreground"}`}>
                          CA: {enrollment.ca_pct}%
                        </p>
                      </div>
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded-lg ${
                        enrollment.current_risk_status === "critical"
                          ? "bg-danger/20 text-danger"
                          : "bg-warning/20 text-warning"
                      }`}>
                        {enrollment.current_risk_status === "critical" ? "Critical" : "At Risk"}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Lecturer;
