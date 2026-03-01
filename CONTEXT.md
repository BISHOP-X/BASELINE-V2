# Project Context: Baseline

## 1. Project Name
**Baseline** (A PWA-Based Early Warning System for Student Progress Monitoring and Attrition Management)

## 2. Project Definition
Baseline is a Progressive Web Application (PWA) designed for Babcock University to proactively reduce student attrition. It shifts the academic monitoring model from "reactive" (noticing failure after exams) to "proactive" (identifying risk during the semester).

### Core Problem
Students often fail or drop out because academic struggles (low attendance, poor test scores) go unnoticed until final exams, when it is too late to intervene.

### Primary Users
1.  **Students:** Need real-time visibility into their standing to self-correct before failing.
2.  **Lecturers/Advisors:** Need a centralized dashboard to identify struggling students without manual calculation.
3.  **Administrators:** Need system oversight and aggregate reporting on attrition risks.

### Core Mechanics
The system functions as a digital "Check Engine Light." It aggregates continuous assessment (CA) data and attendance records in real-time. If a student's performance metrics drop below a pre-defined "baseline," the system automatically triggers a status change and notifies relevant parties.

## 3. User Flows & Features

### Student Flows
* **Authentication:** Sign up/Login via email. (Note: In the pilot scope, accounts may be pre-provisioned by Admins).
* **Dashboard View:** View a "Health Gauge" summarizing overall academic standing (Safe / At Risk / Critical).
* **Course Monitoring:** View a list of enrolled courses with specific progress bars for Attendance and CA Scores.
* **Receive Alerts:** Receive push notifications or in-app alerts when a specific course status changes to "At Risk."
* **Feedback:** Send direct messages/feedback to lecturers regarding specific flagged courses.

### Lecturer Flows
* **Course Management:** View assigned courses.
* **Data Entry:**
    * **Attendance:** Mark attendance for a specific class date (Bulk or individual).
    * **Grades:** Input scores for Assignments, Tests, and Projects.
* **Risk Monitoring:** View a filtered list of "At Risk" students within their courses.
* **Intervention:** Manually send "Nudge" notifications or formal warnings to students.
* **Feedback Response:** Reply to student feedback queries.

### Admin Flows
* **System Seeding:** Since there is no live integration with the university database, Admins must:
    * Create Course entities.
    * Create User accounts (Students/Lecturers).
    * Link Students to Courses (Enrollment).
* **Reporting:** Export lists of at-risk students for departmental review.

## 4. Data Requirements

### Core Entities
* **Profiles:** Extends Auth users. Stores `full_name`, `matric_number` (ID), `role` (Student/Lecturer/Admin), `department`.
* **Courses:** `code` (e.g., SENG 401), `title`, `unit_load`, `semester`.
* **Enrollments:** Junction linking **Profiles (Student)** to **Courses**. Holds the computed `current_risk_status` (Satisfactory, At Risk, Critical).
* **Performance Records:** The raw data points.
    * Types: `Attendance`, `CA_Test`, `Assignment`.
    * Data: `score_obtained`, `max_score`, `date`, `enrollment_id`.
* **Risk Alerts:** Generated events. Links to `enrollment_id`. Stores `severity` and `trigger_reason` (e.g., "Attendance < 75%").
* **Feedback:** Threaded messages between Student and Lecturer linked to a Course.

### Data Relationships
* One Student has many Enrollments.
* One Course has many Enrollments.
* One Enrollment has many Performance Records.
* One Enrollment has many Risk Alerts.

## 5. Business Logic & Rules (The "Risk Engine")

**Constraint:** The system uses deterministic **Rule-Based Logic**, not AI/ML.

### Risk Calculation Triggers
Logic must run whenever a new `Performance Record` is inserted or updated.

### Risk Thresholds (The "Baseline")
1.  **Attendance Risk:**
    * **Formula:** `(Count of "Present" / Total Class Sessions) * 100`
    * **Rule:** If Attendance < **75%**, Status = **At Risk**.
    * **Rule:** If Attendance < **60%**, Status = **Critical**.
2.  **Academic Risk (Continuous Assessment):**
    * **Formula:** `(Sum of Earned CA Scores / Sum of Total Possible CA Scores) * 100`
    * **Rule:** If Average < **40%**, Status = **At Risk**.

### Alerting Logic
* When a student's status changes from "Satisfactory" to "At Risk" or "Critical," a `Risk Alert` record must be created.
* This should trigger a notification (Push/Email) to the Student and the Course Lecturer.

## 6. Frontend Integration
* **Authentication:** The frontend expects a JWT-based session (Supabase Auth).
* **State Management:** The frontend needs real-time subscriptions (WebSockets) to update the Dashboard immediately when a Lecturer inputs a grade.
* **API Pattern:** RESTful or Client-Library (Supabase JS) access.
* **PWA Support:** Backend must support PWA service worker registration and Push Notification subscriptions.

## 7. External Services & Integrations
* **Database & Backend Service:** **Supabase** (PostgreSQL).
    * Used for: Database, Authentication, Real-time subscriptions, and Edge Functions (for the Risk Logic).
* **NO External University DB:** The system **DOES NOT** connect to the official University portal. All data is local to this application.

## 8. Security & Privacy
* **Row Level Security (RLS):**
    * **Students:** Can only `SELECT` their own Profile, Enrollments, Grades, and Alerts. Cannot `INSERT/UPDATE` grades.
    * **Lecturers:** Can `SELECT` all students *within courses they teach*. Can `INSERT/UPDATE` Performance Records for those courses.
    * **Admins:** Full access.
* **Data Privacy:** Grades are sensitive. A student must **never** be able to see another student's specific grades.

## 9. Performance & Scale
* **Usage Pattern:** Bursty. High traffic during test weeks and immediately after grades are released.
* **Optimizations:** Dashboards should use efficient queries (e.g., SQL Views or Calculated Columns) to fetch "Risk Status" rather than computing it on the client side from raw records every time.

## 10. Known Constraints
* **Data Import:** Implementation must provide a mechanism (likely CSV upload) for Admins to bulk-upload students and course registrations, as manual entry for 500+ students is unfeasible.
* **Mobile-First:** Logic must ensure lightweight data payloads for mobile users on poor networks (Nigeria context).