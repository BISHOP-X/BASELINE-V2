import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, LogOut, Users, BookOpen, Link2, Upload, BarChart3, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { mockAllProfiles, mockCourses, mockLecturerEnrollments, mockAllStudents } from "@/lib/mock-data";

type Section = "overview" | "users" | "courses" | "enrollments" | "import" | "reports";

const Admin = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("overview");

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

      <div className="container mx-auto px-6 py-8 max-w-7xl">
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
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
                    + Add User
                  </Button>
                </div>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
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
                          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                            Edit
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Courses */}
            {activeSection === "courses" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Course Management</h2>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
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
                          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Edit</Button>
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
                <div className="rounded-2xl border border-border bg-card p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-4">Select a course to manage enrollments</p>
                  <div className="space-y-2">
                    {mockCourses.map(course => {
                      const enrolled = mockLecturerEnrollments.filter(e => e.course_id === course.id).length;
                      return (
                        <div key={course.id} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[hsl(220_30%_12%)] transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <div>
                              <span className="text-sm font-medium text-foreground">{course.code} — {course.title}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{enrolled} enrolled</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CSV Import */}
            {activeSection === "import" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-foreground mb-6">Bulk CSV Import</h2>
                <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Upload CSV File</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    Upload a CSV with columns: full_name, matric_number, email, department, course_codes (comma-separated)
                  </p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
                    Choose File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported: .csv files up to 5MB
                  </p>
                </div>

                {/* Template info */}
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
                          <td className="py-2">CSC 401,CSC 411,MTH 301</td>
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
                  ].map((report, i) => (
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
                      <Button variant="outline" size="sm" className="mt-4 text-xs border-border text-muted-foreground hover:text-foreground">
                        Export CSV
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
