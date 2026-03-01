import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, LogOut, Users, AlertTriangle, Check, X, Plus, Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockCourses, mockLecturerEnrollments } from "@/lib/mock-data";
import type { RiskStatus } from "@/types/database";

type Tab = "students" | "attendance" | "grades";

const statusColors: Record<RiskStatus, string> = {
  satisfactory: "bg-success/20 text-success",
  at_risk: "bg-warning/20 text-warning",
  critical: "bg-danger/20 text-danger",
};

const statusLabels: Record<RiskStatus, string> = {
  satisfactory: "Good",
  at_risk: "At Risk",
  critical: "Critical",
};

const LecturerCourse = () => {
  const { courseId } = useParams();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("students");
  const [attendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({});

  const course = mockCourses.find(c => c.id === courseId);
  const enrollments = mockLecturerEnrollments.filter(e => e.course_id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-navy dark flex items-center justify-center">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  const atRiskCount = enrollments.filter(e => e.current_risk_status !== "satisfactory").length;

  const toggleAttendance = (studentId: string) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

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
          <div className="flex items-center gap-2">
            <Link to="/lecturer">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                <ArrowLeft className="w-4 h-4" /> Courses
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

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
        {/* Course Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-primary">{course.code}</span>
            {atRiskCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-danger">
                <AlertTriangle className="w-3.5 h-3.5" /> {atRiskCount} need attention
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
          <p className="text-muted-foreground mt-1">{enrollments.length} students enrolled · {course.unit_load} units</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-[hsl(220_30%_12%)] p-1 mb-8">
          {(["students", "attendance", "grades"] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all duration-300 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-[hsl(220_15%_55%)] hover:text-[hsl(210_30%_80%)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Students Tab */}
        {activeTab === "students" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_80px_80px_1fr] gap-4 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase border-b border-border bg-[hsl(220_30%_10%)]">
                  <span>Student</span>
                  <span className="text-center">Att %</span>
                  <span className="text-center">CA %</span>
                  <span className="text-center">Status</span>
                </div>
                {/* Rows */}
                <div className="divide-y divide-border">
              {enrollments.map((enrollment, i) => {
                const isAtRiskRow = enrollment.current_risk_status === "at_risk" || enrollment.current_risk_status === "critical";
                return (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="grid grid-cols-[1fr_80px_80px_1fr] gap-4 px-5 py-4 items-center hover:bg-[hsl(220_30%_12%)] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {enrollment.student?.full_name?.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{enrollment.student?.full_name}</p>
                        <p className="text-xs text-muted-foreground">{enrollment.student?.matric_number}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-mono text-center ${enrollment.attendance_pct < 75 ? "text-danger" : "text-foreground"}`}>
                      {enrollment.attendance_pct}%
                    </p>
                    <p className={`text-sm font-mono text-center ${enrollment.ca_pct < 40 ? "text-danger" : "text-foreground"}`}>
                      {enrollment.ca_pct}%
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${statusColors[enrollment.current_risk_status]}`}>
                        {statusLabels[enrollment.current_risk_status]}
                      </span>
                      {isAtRiskRow && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 px-2 border border-warning/40 text-warning hover:bg-warning/10 hover:border-warning/60"
                        >
                          Nudge
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === "attendance" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Mark Attendance</p>
                  <p className="text-xs text-muted-foreground">Date: {attendanceDate}</p>
                </div>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan gap-1">
                <Check className="w-4 h-4" /> Save Attendance
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-[1fr_100px] gap-4 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase border-b border-border bg-[hsl(220_30%_10%)]">
                <span>Student</span>
                <span className="text-center">Present</span>
              </div>
              <div className="divide-y divide-border">
                {enrollments.map((enrollment, i) => {
                  const isPresent = attendanceState[enrollment.student_id] ?? true;
                  return (
                    <motion.div
                      key={enrollment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-[1fr_100px] gap-4 px-5 py-4 items-center hover:bg-[hsl(220_30%_12%)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {enrollment.student?.full_name?.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{enrollment.student?.full_name}</p>
                          <p className="text-xs text-muted-foreground">{enrollment.student?.matric_number}</p>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleAttendance(enrollment.student_id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                            isPresent
                              ? "bg-success/20 text-success border border-success/30"
                              : "bg-danger/20 text-danger border border-danger/30"
                          }`}
                        >
                          {isPresent ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Grades Tab */}
        {activeTab === "grades" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-medium text-foreground">Grade Entry</p>
                <p className="text-xs text-muted-foreground">Enter CA test or assignment scores</p>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan gap-1">
                <Plus className="w-4 h-4" /> New Assessment
              </Button>
            </div>

            {/* Grade Entry Form */}
            <div className="rounded-2xl border border-border bg-card p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Type</label>
                  <select className="w-full py-2.5 px-3 glass-input text-sm text-foreground bg-transparent">
                    <option value="ca_test">CA Test</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Test 1"
                    className="w-full py-2.5 px-3 glass-input text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Max Score</label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full py-2.5 px-3 glass-input text-sm text-foreground placeholder:text-muted-foreground"
                    min={1}
                  />
                </div>
              </div>
            </div>

            {/* Per-student score entry */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="grid grid-cols-[1fr_120px] gap-4 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase border-b border-border bg-[hsl(220_30%_10%)]">
                <span>Student</span>
                <span className="text-center">Score</span>
              </div>
              <div className="divide-y divide-border">
                {enrollments.map((enrollment, i) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[1fr_120px] gap-4 px-5 py-4 items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {enrollment.student?.full_name?.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{enrollment.student?.full_name}</p>
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="number"
                        placeholder="—"
                        className="w-20 py-2 px-3 glass-input text-sm font-mono text-center text-foreground placeholder:text-muted-foreground"
                        min={0}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-border flex justify-end">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
                  Save Scores
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default LecturerCourse;
