export type UserRole = "student" | "lecturer" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  matric_number: string | null;
  role: UserRole;
  department: string;
  avatar_url: string | null;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  unit_load: number;
  semester: string;
  lecturer_id: string;
}

export type RiskStatus = "satisfactory" | "at_risk" | "critical";

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  current_risk_status: RiskStatus;
  attendance_pct: number;
  ca_pct: number;
  course?: Course;
  student?: Profile;
}

export type RecordType = "attendance" | "ca_test" | "assignment";

export interface PerformanceRecord {
  id: string;
  enrollment_id: string;
  record_type: RecordType;
  score_obtained: number | null;
  max_score: number | null;
  is_present: boolean | null;
  record_date: string;
  description: string | null;
  created_at: string;
}

export interface RiskAlert {
  id: string;
  enrollment_id: string;
  student_id: string;
  course_id: string;
  severity: "at_risk" | "critical";
  trigger_reason: string;
  is_read: boolean;
  created_at: string;
  course?: Course;
}

export interface FeedbackThread {
  id: string;
  student_id: string;
  lecturer_id: string;
  course_id: string;
  subject: string;
  is_resolved: boolean;
  created_at: string;
  course?: Course;
  messages?: FeedbackMessage[];
}

export interface FeedbackMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}
