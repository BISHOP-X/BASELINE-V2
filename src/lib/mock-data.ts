import type { Profile, Course, Enrollment, RiskAlert, FeedbackThread, FeedbackMessage, PerformanceRecord } from "@/types/database";

// ─── Profiles ───────────────────────────────────────────────

export const mockStudentProfile: Profile = {
  id: "stu-001",
  full_name: "Chinedu Okonkwo",
  matric_number: "20/0547",
  role: "student",
  department: "Computer Science",
  avatar_url: null,
};

export const mockLecturerProfile: Profile = {
  id: "lec-001",
  full_name: "Dr. Adeyemi Fashola",
  matric_number: null,
  role: "lecturer",
  department: "Computer Science",
  avatar_url: null,
};

export const mockAdminProfile: Profile = {
  id: "adm-001",
  full_name: "Mrs. Ngozi Ibe",
  matric_number: null,
  role: "admin",
  department: "Registry",
  avatar_url: null,
};

// ─── Courses ────────────────────────────────────────────────

export const mockCourses: Course[] = [
  { id: "crs-001", code: "CSC 401", title: "Artificial Intelligence", unit_load: 3, semester: "2025/2026-2", lecturer_id: "lec-001" },
  { id: "crs-002", code: "CSC 411", title: "Software Engineering", unit_load: 3, semester: "2025/2026-2", lecturer_id: "lec-001" },
  { id: "crs-003", code: "MTH 301", title: "Numerical Methods", unit_load: 3, semester: "2025/2026-2", lecturer_id: "lec-002" },
  { id: "crs-004", code: "CSC 421", title: "Computer Networks", unit_load: 3, semester: "2025/2026-2", lecturer_id: "lec-001" },
  { id: "crs-005", code: "GES 400", title: "Entrepreneurship", unit_load: 2, semester: "2025/2026-2", lecturer_id: "lec-003" },
  { id: "crs-006", code: "CSC 431", title: "Database Systems", unit_load: 3, semester: "2025/2026-2", lecturer_id: "lec-001" },
];

// ─── Enrollments (for Chinedu) ──────────────────────────────

export const mockStudentEnrollments: Enrollment[] = [
  { id: "enr-001", student_id: "stu-001", course_id: "crs-001", current_risk_status: "satisfactory", attendance_pct: 91, ca_pct: 82, course: mockCourses[0] },
  { id: "enr-002", student_id: "stu-001", course_id: "crs-002", current_risk_status: "satisfactory", attendance_pct: 85, ca_pct: 74, course: mockCourses[1] },
  { id: "enr-003", student_id: "stu-001", course_id: "crs-003", current_risk_status: "critical",     attendance_pct: 58, ca_pct: 45, course: mockCourses[2] },
  { id: "enr-004", student_id: "stu-001", course_id: "crs-004", current_risk_status: "satisfactory", attendance_pct: 94, ca_pct: 88, course: mockCourses[3] },
  { id: "enr-005", student_id: "stu-001", course_id: "crs-005", current_risk_status: "at_risk",      attendance_pct: 72, ca_pct: 61, course: mockCourses[4] },
  { id: "enr-006", student_id: "stu-001", course_id: "crs-006", current_risk_status: "satisfactory", attendance_pct: 89, ca_pct: 79, course: mockCourses[5] },
];

// ─── Risk Alerts ────────────────────────────────────────────

export const mockAlerts: RiskAlert[] = [
  { id: "alt-001", enrollment_id: "enr-003", student_id: "stu-001", course_id: "crs-003", severity: "critical",  trigger_reason: "Attendance at 58.3% (below 60% critical threshold)", is_read: false, created_at: "2026-02-28T14:30:00Z", course: mockCourses[2] },
  { id: "alt-002", enrollment_id: "enr-005", student_id: "stu-001", course_id: "crs-005", severity: "at_risk",   trigger_reason: "Attendance at 72.0% (below 75% threshold)",         is_read: false, created_at: "2026-02-27T09:15:00Z", course: mockCourses[4] },
  { id: "alt-003", enrollment_id: "enr-003", student_id: "stu-001", course_id: "crs-003", severity: "at_risk",   trigger_reason: "Attendance at 73.0% (below 75% threshold)",         is_read: true,  created_at: "2026-02-20T11:00:00Z", course: mockCourses[2] },
  { id: "alt-004", enrollment_id: "enr-005", student_id: "stu-001", course_id: "crs-005", severity: "at_risk",   trigger_reason: "CA average at 38.5% (below 40% threshold)",         is_read: true,  created_at: "2026-02-15T16:45:00Z", course: mockCourses[4] },
];

// ─── Students for Lecturer View ─────────────────────────────

export const mockAllStudents: Profile[] = [
  mockStudentProfile,
  { id: "stu-002", full_name: "Amaka Eze",        matric_number: "20/0612", role: "student", department: "Computer Science", avatar_url: null },
  { id: "stu-003", full_name: "Tunde Bakare",     matric_number: "20/0489", role: "student", department: "Computer Science", avatar_url: null },
  { id: "stu-004", full_name: "Blessing Okafor",  matric_number: "20/0723", role: "student", department: "Computer Science", avatar_url: null },
  { id: "stu-005", full_name: "David Mensah",     matric_number: "20/0391", role: "student", department: "Computer Science", avatar_url: null },
  { id: "stu-006", full_name: "Fatima Abdullahi", matric_number: "20/0855", role: "student", department: "Computer Science", avatar_url: null },
  { id: "stu-007", full_name: "Grace Udo",        matric_number: "20/0267", role: "student", department: "Computer Science", avatar_url: null },
  { id: "stu-008", full_name: "Ibrahim Yusuf",    matric_number: "20/0934", role: "student", department: "Computer Science", avatar_url: null },
];

export const mockLecturerEnrollments: Enrollment[] = [
  // CSC 401
  { id: "enr-001", student_id: "stu-001", course_id: "crs-001", current_risk_status: "satisfactory", attendance_pct: 91, ca_pct: 82, student: mockAllStudents[0], course: mockCourses[0] },
  { id: "enr-010", student_id: "stu-002", course_id: "crs-001", current_risk_status: "satisfactory", attendance_pct: 88, ca_pct: 76, student: mockAllStudents[1], course: mockCourses[0] },
  { id: "enr-011", student_id: "stu-003", course_id: "crs-001", current_risk_status: "at_risk",      attendance_pct: 70, ca_pct: 55, student: mockAllStudents[2], course: mockCourses[0] },
  { id: "enr-012", student_id: "stu-004", course_id: "crs-001", current_risk_status: "satisfactory", attendance_pct: 95, ca_pct: 90, student: mockAllStudents[3], course: mockCourses[0] },
  { id: "enr-013", student_id: "stu-005", course_id: "crs-001", current_risk_status: "critical",     attendance_pct: 52, ca_pct: 35, student: mockAllStudents[4], course: mockCourses[0] },
  { id: "enr-014", student_id: "stu-006", course_id: "crs-001", current_risk_status: "satisfactory", attendance_pct: 83, ca_pct: 68, student: mockAllStudents[5], course: mockCourses[0] },
  { id: "enr-015", student_id: "stu-007", course_id: "crs-001", current_risk_status: "at_risk",      attendance_pct: 74, ca_pct: 38, student: mockAllStudents[6], course: mockCourses[0] },
  { id: "enr-016", student_id: "stu-008", course_id: "crs-001", current_risk_status: "satisfactory", attendance_pct: 90, ca_pct: 85, student: mockAllStudents[7], course: mockCourses[0] },
  // CSC 411
  { id: "enr-002", student_id: "stu-001", course_id: "crs-002", current_risk_status: "satisfactory", attendance_pct: 85, ca_pct: 74, student: mockAllStudents[0], course: mockCourses[1] },
  { id: "enr-020", student_id: "stu-002", course_id: "crs-002", current_risk_status: "at_risk",      attendance_pct: 71, ca_pct: 42, student: mockAllStudents[1], course: mockCourses[1] },
  { id: "enr-021", student_id: "stu-003", course_id: "crs-002", current_risk_status: "satisfactory", attendance_pct: 92, ca_pct: 81, student: mockAllStudents[2], course: mockCourses[1] },
  { id: "enr-022", student_id: "stu-005", course_id: "crs-002", current_risk_status: "critical",     attendance_pct: 55, ca_pct: 30, student: mockAllStudents[4], course: mockCourses[1] },
  // CSC 421
  { id: "enr-004", student_id: "stu-001", course_id: "crs-004", current_risk_status: "satisfactory", attendance_pct: 94, ca_pct: 88, student: mockAllStudents[0], course: mockCourses[3] },
  { id: "enr-030", student_id: "stu-004", course_id: "crs-004", current_risk_status: "satisfactory", attendance_pct: 87, ca_pct: 72, student: mockAllStudents[3], course: mockCourses[3] },
  { id: "enr-031", student_id: "stu-006", course_id: "crs-004", current_risk_status: "at_risk",      attendance_pct: 68, ca_pct: 45, student: mockAllStudents[5], course: mockCourses[3] },
  // CSC 431
  { id: "enr-006", student_id: "stu-001", course_id: "crs-006", current_risk_status: "satisfactory", attendance_pct: 89, ca_pct: 79, student: mockAllStudents[0], course: mockCourses[5] },
  { id: "enr-040", student_id: "stu-003", course_id: "crs-006", current_risk_status: "satisfactory", attendance_pct: 93, ca_pct: 87, student: mockAllStudents[2], course: mockCourses[5] },
  { id: "enr-041", student_id: "stu-007", course_id: "crs-006", current_risk_status: "at_risk",      attendance_pct: 73, ca_pct: 39, student: mockAllStudents[6], course: mockCourses[5] },
  { id: "enr-042", student_id: "stu-008", course_id: "crs-006", current_risk_status: "satisfactory", attendance_pct: 86, ca_pct: 78, student: mockAllStudents[7], course: mockCourses[5] },
];

// ─── Feedback Threads ───────────────────────────────────────

export const mockFeedbackThreads: FeedbackThread[] = [
  {
    id: "fb-001", student_id: "stu-001", lecturer_id: "lec-001", course_id: "crs-001",
    subject: "Need help understanding Week 5 material",
    is_resolved: false, created_at: "2026-02-26T10:00:00Z", course: mockCourses[0],
    messages: [
      { id: "msg-001", thread_id: "fb-001", sender_id: "stu-001", body: "Good day Dr. Adeyemi, I'm struggling with the neural network backpropagation topic from Week 5. Could we schedule a brief meeting?", created_at: "2026-02-26T10:00:00Z" },
      { id: "msg-002", thread_id: "fb-001", sender_id: "lec-001", body: "Hello Chinedu. Yes, I have office hours on Thursday 2-4pm. Please come with specific questions. Also review Chapter 8 of the textbook before then.", created_at: "2026-02-26T14:30:00Z" },
      { id: "msg-003", thread_id: "fb-001", sender_id: "stu-001", body: "Thank you sir, I will be there.", created_at: "2026-02-26T15:00:00Z" },
    ],
  },
  {
    id: "fb-002", student_id: "stu-005", lecturer_id: "lec-001", course_id: "crs-002",
    subject: "Request for assignment extension",
    is_resolved: true, created_at: "2026-02-20T08:00:00Z", course: mockCourses[1],
    messages: [
      { id: "msg-004", thread_id: "fb-002", sender_id: "stu-005", body: "Good morning sir. I was hospitalized last week and couldn't submit Assignment 3. Please may I have an extension?", created_at: "2026-02-20T08:00:00Z" },
      { id: "msg-005", thread_id: "fb-002", sender_id: "lec-001", body: "Sorry to hear that David. Please submit a medical report and I'll grant a one-week extension.", created_at: "2026-02-20T10:15:00Z" },
    ],
  },
];

// ─── All Lecturers & Admins (for Admin panel) ───────────────

export const mockAllLecturers: Profile[] = [
  mockLecturerProfile,
  { id: "lec-002", full_name: "Prof. Bola Akinwale",  matric_number: null, role: "lecturer", department: "Mathematics",       avatar_url: null },
  { id: "lec-003", full_name: "Dr. Emeka Nwankwo",    matric_number: null, role: "lecturer", department: "Business Admin",    avatar_url: null },
];

export const mockAllProfiles: Profile[] = [
  ...mockAllStudents,
  ...mockAllLecturers,
  mockAdminProfile,
];
