import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, LogOut, Users, BookOpen, Link2, Upload, BarChart3, ChevronRight, X, Check, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { mockAllProfiles, mockCourses, mockLecturerEnrollments, mockAllStudents } from "@/lib/mock-data";
import type { Profile, Course } from "@/types/database";

type Section = "overview" | "users" | "courses" | "enrollments" | "import" | "reports";

const Admin = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("overview");

  // User modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [userForm, setUserForm] = useState({ full_name: "", email: "", role: "student", department: "", matric_number: "" });

  // Course modal
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({ code: "", title: "", unit_load: "3", semester: "First", lecturer_id: "" });

  const lecturers = mockAllProfiles.filter(p => p.role === "lecturer");

  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({ full_name: "", email: "", role: "student", department: "", matric_number: "" });
    setUserModalOpen(true);
  };
  const openEditUser = (profile: Profile) => {
    setEditingUser(profile);
    setUserForm({ full_name: profile.full_name, email: "", role: profile.role, department: profile.department ?? "", matric_number: profile.matric_number ?? "" });
    setUserModalOpen(true);
  };
  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({ code: "", title: "", unit_load: "3", semester: "First", lecturer_id: "" });
    setCourseModalOpen(true);
  };
  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({ code: course.code, title: course.title, unit_load: String(course.unit_load), semester: course.semester ?? "First", lecturer_id: course.lecturer_id ?? "" });
    setCourseModalOpen(true);
  };

  // Enrollment sub-panel
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Record<string, string[]>>({});

  // CSV import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvFileName, setCsvFileName] = useState("");

  // Reports export feedback
  const [exportingReport, setExportingReport] = useState<string | null>(null);
  const handleExport = (title: string) => {
    setExportingReport(title);
    setTimeout(() => setExportingReport(null), 2000);
  };

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const rows = text.trim().split("\n").map(r => r.split(",").map(c => c.trim()));
      setCsvRows(rows);
    };
    reader.readAsText(file);
  };

  const navItems: { key: Section; label: string; icon: typeof Users }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "users", label: "Users", icon: Users },
    { key: "courses", label: "Courses", icon: BookOpen },
    { key: "enrollments", label: "Enrollments", icon: Link2 },
    { key: "import", label: "CSV Import", icon: Upload },
    { key: "reports", label: "Reports", icon: BarChart3 },
  ];

  const totalStudents = mockAllProfiles.filter(p => p.role === "student").length;
  const totalLecturers = mockAllProfiles.filter(p => p.role === "lecturer").length;
  const totalCourses = mockCourses.length;
  const totalAtRisk = mockLecturerEnrollments.filter(e => e.current_risk_status !== "satisfactory").length;

  return (
    <div className="min-h-screen bg-navy dark">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-navy/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Baseline</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-danger/10 text-danger font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.full_name}</span>
            <Link to="/" onClick={logout}>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar Nav */}
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === item.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-[hsl(220_30%_12%)]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Main Content */}
          <div>
            {/* Overview */}
            {activeSection === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-foreground mb-6">System Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Students", value: totalStudents, color: "text-primary" },
                    { label: "Lecturers", value: totalLecturers, color: "text-foreground" },
                    { label: "Courses", value: totalCourses, color: "text-foreground" },
                    { label: "At Risk", value: totalAtRisk, color: totalAtRisk > 0 ? "text-danger" : "text-success" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-5 rounded-2xl bg-card border border-border"
                    >
                      <p className={`text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Departments breakdown */}
                <h3 className="text-sm font-semibold text-foreground mb-3">Risk by Department</h3>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  {["Computer Science", "Mathematics", "Business Admin"].map((dept, i) => {
                    const deptStudents = mockAllStudents.filter(s => s.department === dept || (dept === "Computer Science"));
                    const deptAtRisk = dept === "Computer Science" ? 5 : dept === "Mathematics" ? 1 : 0;
                    const pct = deptStudents.length > 0 ? Math.round((deptAtRisk / Math.max(deptStudents.length, 1)) * 100) : 0;
                    return (
                      <div key={dept} className={`px-5 py-4 flex items-center justify-between ${i > 0 ? "border-t border-border" : ""}`}>
                        <div>
                          <p className="text-sm font-medium text-foreground">{dept}</p>
                          <p className="text-xs text-muted-foreground">{deptStudents.length} students</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 rounded-full bg-[hsl(220_30%_15%)] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct > 30 ? "bg-danger" : pct > 0 ? "bg-warning" : "bg-success"}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-mono ${pct > 30 ? "text-danger" : pct > 0 ? "text-warning" : "text-success"}`}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Users */}
            {activeSection === "users" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">User Management</h2>
                  <Button size="sm" onClick={openAddUser} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
                    + Add User
                  </Button>
                </div>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <div className="min-w-[540px]">
                      <div className="grid grid-cols-[1fr_120px_150px_80px] gap-4 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase border-b border-border bg-[hsl(220_30%_10%)]">
                        <span>Name</span>
                        <span>Role</span>
                        <span>Department</span>
                        <span className="text-center">Actions</span>
                      </div>
                      <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
                    {mockAllProfiles.map((profile, i) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="grid grid-cols-[1fr_120px_150px_80px] gap-4 px-5 py-4 items-center hover:bg-[hsl(220_30%_12%)] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {profile.full_name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{profile.full_name}</p>
                            <p className="text-xs text-muted-foreground">{profile.matric_number || "Staff"}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold capitalize px-2 py-1 rounded-lg w-fit ${
                          profile.role === "admin" ? "bg-danger/20 text-danger"
                          : profile.role === "lecturer" ? "bg-primary/20 text-primary"
                          : "bg-[hsl(220_30%_15%)] text-muted-foreground"
                        }`}>
                          {profile.role}
                        </span>
                        <span className="text-sm text-muted-foreground truncate">{profile.department}</span>
                        <div className="flex justify-center">
                          <Button variant="ghost" size="sm" onClick={() => openEditUser(profile)} className="text-xs text-muted-foreground hover:text-foreground">
                            Edit
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Courses */}
            {activeSection === "courses" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Course Management</h2>
                  <Button size="sm" onClick={openAddCourse} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
                    + Add Course
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockCourses.map((course, i) => {
                    const lecturer = mockAllProfiles.find(p => p.id === course.lecturer_id);
                    const enrolled = mockLecturerEnrollments.filter(e => e.course_id === course.id).length;
                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-mono text-primary">{course.code}</span>
                            <h3 className="text-foreground font-semibold mt-1">{course.title}</h3>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => openEditCourse(course)} className="text-xs text-muted-foreground">Edit</Button>
                        </div>
                        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                          <span>{course.unit_load} units</span>
                          <span>{course.semester}</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {lecturer?.full_name || "Unassigned"}
                          </span>
                          <span className="text-xs text-muted-foreground">{enrolled} students</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Enrollments */}
            {activeSection === "enrollments" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-foreground mb-6">Enrollment Management</h2>

                {!selectedCourseForEnroll ? (
                  /* Course list */
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <p className="text-sm text-muted-foreground mb-4">Click a course to manage its student enrollments</p>
                    <div className="space-y-2">
                      {mockCourses.map(course => {
                        const courseEnrolled = enrolledIds[course.id] ??
                          mockLecturerEnrollments.filter(e => e.course_id === course.id).map(e => e.student_id);
                        return (
                          <button
                            key={course.id}
                            onClick={() => {
                              setEnrolledIds(prev => ({
                                ...prev,
                                [course.id]: prev[course.id] ??
                                  mockLecturerEnrollments.filter(e => e.course_id === course.id).map(e => e.student_id)
                              }));
                              setSelectedCourseForEnroll(course);
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[hsl(220_30%_12%)] transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-sm font-medium text-foreground">{course.code} — {course.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">{courseEnrolled.length} enrolled</span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Sub-panel */
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <button
                      onClick={() => setSelectedCourseForEnroll(null)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" /> All Courses
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs font-mono text-primary">{selectedCourseForEnroll.code}</p>
                        <h3 className="text-foreground font-semibold">{selectedCourseForEnroll.title}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Enrolled */}
                      <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="px-4 py-3 bg-[hsl(220_30%_10%)] border-b border-border">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Enrolled
                            <span className="ml-2 font-mono text-primary">
                              {(enrolledIds[selectedCourseForEnroll.id] ?? []).length}
                            </span>
                          </p>
                        </div>
                        <div className="divide-y divide-border">
                          {(enrolledIds[selectedCourseForEnroll.id] ?? []).length === 0 && (
                            <p className="text-xs text-muted-foreground px-4 py-4">No students enrolled</p>
                          )}
                          {(enrolledIds[selectedCourseForEnroll.id] ?? []).map(sid => {
                            const s = mockAllStudents.find(st => st.id === sid);
                            if (!s) return null;
                            return (
                              <div key={sid} className="flex items-center justify-between px-4 py-3 hover:bg-[hsl(220_30%_12%)] transition-colors">
                                <div>
                                  <p className="text-sm font-medium text-foreground">{s.full_name}</p>
                                  <p className="text-xs text-muted-foreground">{s.matric_number}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs h-7 px-2 border border-danger/30 text-danger hover:bg-danger/10 hover:border-danger/50"
                                  onClick={() => setEnrolledIds(prev => ({
                                    ...prev,
                                    [selectedCourseForEnroll.id]: (prev[selectedCourseForEnroll.id] ?? []).filter(id => id !== sid)
                                  }))}
                                >
                                  Remove
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Unenrolled */}
                      <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="px-4 py-3 bg-[hsl(220_30%_10%)] border-b border-border">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Add Students</p>
                        </div>
                        <div className="divide-y divide-border">
                          {mockAllStudents
                            .filter(s => !(enrolledIds[selectedCourseForEnroll.id] ?? []).includes(s.id))
                            .map(s => (
                              <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-[hsl(220_30%_12%)] transition-colors">
                                <div>
                                  <p className="text-sm font-medium text-foreground">{s.full_name}</p>
                                  <p className="text-xs text-muted-foreground">{s.matric_number}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs h-7 px-2 border border-success/30 text-success hover:bg-success/10 hover:border-success/50"
                                  onClick={() => setEnrolledIds(prev => ({
                                    ...prev,
                                    [selectedCourseForEnroll.id]: [...(prev[selectedCourseForEnroll.id] ?? []), s.id]
                                  }))}
                                >
                                  Enroll
                                </Button>
                              </div>
                            ))
                          }
                          {mockAllStudents.filter(s => !(enrolledIds[selectedCourseForEnroll.id] ?? []).includes(s.id)).length === 0 && (
                            <p className="text-xs text-muted-foreground px-4 py-4">All students enrolled</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* CSV Import */}
            {activeSection === "import" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-foreground mb-6">Bulk CSV Import</h2>

                {/* Hidden real file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvFile}
                />

                {/* Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {csvFileName ? csvFileName : "Click to Choose CSV File"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {csvFileName
                      ? `${csvRows.length > 0 ? csvRows.length - 1 : 0} data rows detected — click to replace`
                      : "Columns: full_name, matric_number, email, department, course_codes"}
                  </p>
                  {!csvFileName && (
                    <p className="text-xs text-muted-foreground mt-4">Supported: .csv files up to 5MB</p>
                  )}
                </div>

                {/* Parsed preview */}
                {csvRows.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 bg-[hsl(220_30%_10%)] border-b border-border">
                      <p className="text-xs font-semibold text-foreground">Preview — {csvRows.length - 1} rows</p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan"
                        >
                          <Check className="w-3.5 h-3.5" /> Import All
                        </Button>
                        <button onClick={() => { setCsvRows([]); setCsvFileName(""); }} className="text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-xs font-mono">
                        <thead className="sticky top-0 bg-[hsl(220_30%_10%)]">
                          <tr className="text-muted-foreground border-b border-border">
                            {csvRows[0].map((h, i) => (
                              <th key={i} className="text-left px-4 py-2 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {csvRows.slice(1).map((row, ri) => (
                            <tr key={ri} className="hover:bg-[hsl(220_30%_12%)]">
                              {row.map((cell, ci) => (
                                <td key={ci} className="px-4 py-2 text-foreground whitespace-nowrap">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* Template */}
                {csvRows.length === 0 && (
                  <div className="mt-6 rounded-2xl border border-border bg-card p-5">
                    <h4 className="text-sm font-semibold text-foreground mb-3">CSV Template</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr className="text-muted-foreground border-b border-border">
                            <th className="text-left py-2 pr-4">full_name</th>
                            <th className="text-left py-2 pr-4">matric_number</th>
                            <th className="text-left py-2 pr-4">email</th>
                            <th className="text-left py-2 pr-4">department</th>
                            <th className="text-left py-2">course_codes</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground">
                          <tr className="border-b border-border">
                            <td className="py-2 pr-4">Chinedu Okonkwo</td>
                            <td className="py-2 pr-4">20/0547</td>
                            <td className="py-2 pr-4">chinedu@babcock.edu.ng</td>
                            <td className="py-2 pr-4">Computer Science</td>
                            <td className="py-2">CSC 401,CSC 411</td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4">Amaka Eze</td>
                            <td className="py-2 pr-4">20/0612</td>
                            <td className="py-2 pr-4">amaka@babcock.edu.ng</td>
                            <td className="py-2 pr-4">Computer Science</td>
                            <td className="py-2">CSC 401,CSC 421</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Reports */}
            {activeSection === "reports" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-foreground mb-6">Reports & Export</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "At-Risk Students Report", desc: "Export list of all students currently flagged as at-risk or critical", count: totalAtRisk },
                    { title: "Attendance Summary", desc: "Course-by-course attendance percentages for all enrolled students", count: null },
                    { title: "CA Performance Report", desc: "Continuous assessment averages across all courses and departments", count: null },
                    { title: "Full System Snapshot", desc: "Complete data export: students, courses, enrollments, grades, alerts", count: null },
                  ].map((report, i) => {
                    const exported = exportingReport === report.title;
                    return (
                      <motion.div
                        key={report.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="p-5 rounded-2xl border border-border bg-card"
                      >
                        <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{report.desc}</p>
                        {report.count !== null && (
                          <p className="text-2xl font-bold font-mono text-danger mt-3">{report.count}</p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(report.title)}
                          className={`mt-4 text-xs gap-1.5 transition-all duration-300 ${
                            exported
                              ? "border-success/50 text-success bg-success/10 hover:bg-success/10"
                              : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {exported
                            ? <><Check className="w-3.5 h-3.5" /> Exported!</>
                            : <><Download className="w-3.5 h-3.5" /> Export CSV</>}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        editing={editingUser}
        form={userForm}
        setForm={setUserForm}
        lecturers={lecturers}
      />
      <CourseModal
        open={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        editing={editingCourse}
        form={courseForm}
        setForm={setCourseForm}
        lecturers={lecturers}
      />
    </div>
  );
};

/* ── Add / Edit Course Modal ── */
const CourseModal = ({ open, onClose, editing, form, setForm, lecturers }: {
  open: boolean; onClose: () => void; editing: Course | null;
  form: { code: string; title: string; unit_load: string; semester: string; lecturer_id: string };
  setForm: React.Dispatch<React.SetStateAction<{ code: string; title: string; unit_load: string; semester: string; lecturer_id: string }>>;
  lecturers: Profile[];
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="bg-[hsl(220_40%_8%)] border-border text-foreground max-w-md">
      <DialogHeader>
        <DialogTitle className="text-foreground">{editing ? "Edit Course" : "Add Course"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Course Code</label>
            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. CSC 401" className="w-full py-2.5 px-3 glass-input text-sm text-foreground placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Unit Load</label>
            <input type="number" min={1} max={6} value={form.unit_load} onChange={e => setForm(f => ({ ...f, unit_load: e.target.value }))} className="w-full py-2.5 px-3 glass-input text-sm text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Course Title</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Software Engineering" className="w-full py-2.5 px-3 glass-input text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Semester</label>
          <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))} className="w-full py-2.5 px-3 glass-input text-sm text-foreground bg-[hsl(220_30%_10%)]">
            <option value="First">First Semester</option>
            <option value="Second">Second Semester</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Assign Lecturer</label>
          <select value={form.lecturer_id} onChange={e => setForm(f => ({ ...f, lecturer_id: e.target.value }))} className="w-full py-2.5 px-3 glass-input text-sm text-foreground bg-[hsl(220_30%_10%)]">
            <option value="">Unassigned</option>
            {lecturers.map(l => <option key={l.id} value={l.id}>{l.full_name}</option>)}
          </select>
        </div>
      </div>
      <DialogFooter className="gap-2">
        <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">Cancel</Button>
        <Button onClick={onClose} disabled={!form.code.trim() || !form.title.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan disabled:opacity-40">
          {editing ? "Save Changes" : "Create Course"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ── Add / Edit User Modal ── */
const UserModal = ({ open, onClose, editing, form, setForm, lecturers: _l }: {
  open: boolean; onClose: () => void; editing: Profile | null;
  form: { full_name: string; email: string; role: string; department: string; matric_number: string };
  setForm: React.Dispatch<React.SetStateAction<{ full_name: string; email: string; role: string; department: string; matric_number: string }>>;
  lecturers: Profile[];
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="bg-[hsl(220_40%_8%)] border-border text-foreground max-w-md">
      <DialogHeader>
        <DialogTitle className="text-foreground">{editing ? "Edit User" : "Add User"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-2">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Full Name</label>
          <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Chinedu Okonkwo" className="w-full py-2.5 px-3 glass-input text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@babcock.edu.ng" className="w-full py-2.5 px-3 glass-input text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Role</label>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full py-2.5 px-3 glass-input text-sm text-foreground bg-[hsl(220_30%_10%)]">
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Department</label>
          <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Computer Science" className="w-full py-2.5 px-3 glass-input text-sm text-foreground placeholder:text-muted-foreground" />
        </div>
        {form.role === "student" && (
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Matric Number</label>
            <input value={form.matric_number} onChange={e => setForm(f => ({ ...f, matric_number: e.target.value }))} placeholder="e.g. 20/0547" className="w-full py-2.5 px-3 glass-input text-sm text-foreground placeholder:text-muted-foreground" />
          </div>
        )}
      </div>
      <DialogFooter className="gap-2">
        <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">Cancel</Button>
        <Button onClick={onClose} disabled={!form.full_name.trim() || !form.email.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan disabled:opacity-40">
          {editing ? "Save Changes" : "Create User"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default Admin;
