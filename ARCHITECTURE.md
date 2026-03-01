# Baseline — Architecture & MVP Implementation Plan

> **Project:** Baseline — PWA-Based Early Warning System for Student Progress Monitoring
> **Target:** Babcock University
> **Date:** March 2026
> **Stack:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Current State Audit](#2-current-state-audit)
3. [Full Data Flow — End to End](#3-full-data-flow--end-to-end)
4. [Database Schema](#4-database-schema)
5. [Risk Engine — Business Logic](#5-risk-engine--business-logic)
6. [Authentication & Authorization Model](#6-authentication--authorization-model)
7. [Real-Time & Notification Pipeline](#7-real-time--notification-pipeline)
8. [PWA Architecture](#8-pwa-architecture)
9. [Edge Cases & Failure Modes](#9-edge-cases--failure-modes)
10. [Phase 1 — Backend Foundation](#10-phase-1--backend-foundation)
11. [Phase 2 — Frontend Integration & Completion](#11-phase-2--frontend-integration--completion)
12. [File Structure — Target State](#12-file-structure--target-state)

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT (PWA)                          │
│  React + TypeScript + Tailwind + shadcn/ui + Framer Motion  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐   │
│  │ Student  │  │ Lecturer │  │  Admin   │  │  Landing   │   │
│  │Dashboard │  │Dashboard │  │  Panel   │  │  + Auth    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘   │
│       │              │             │              │          │
│  ┌────┴──────────────┴─────────────┴──────────────┴─────┐   │
│  │              State Layer (TanStack Query)             │   │
│  │         + Supabase Realtime Subscriptions             │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┴───────────────────────────────┐   │
│  │              Supabase JS Client                       │   │
│  │   Auth | Database | Realtime | Storage | Functions    │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┴───────────────────────────────┐   │
│  │              Service Worker (PWA)                      │   │
│  │         Push Notifications | Offline Cache             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────┴───────────────────────────────┐
│                     SUPABASE BACKEND                         │
│                                                              │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │  Auth (JWT)  │  │  PostgREST    │  │  Realtime WS     │  │
│  │  Email/Pass  │  │  (Auto API)   │  │  (Broadcast)     │  │
│  └──────┬───────┘  └───────┬───────┘  └────────┬─────────┘  │
│         │                  │                   │             │
│  ┌──────┴──────────────────┴───────────────────┴─────────┐  │
│  │              PostgreSQL Database                        │  │
│  │                                                        │  │
│  │  profiles | courses | enrollments | performance_records │  │
│  │  risk_alerts | feedback_threads | feedback_messages     │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐    │  │
│  │  │  Row Level Security (RLS) Policies             │    │  │
│  │  │  Student: own data only                        │    │  │
│  │  │  Lecturer: own courses' students only          │    │  │
│  │  │  Admin: full access                            │    │  │
│  │  └────────────────────────────────────────────────┘    │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐    │  │
│  │  │  Database Triggers & Functions                 │    │  │
│  │  │  → on INSERT/UPDATE performance_records        │    │  │
│  │  │  → recalculate enrollment risk_status          │    │  │
│  │  │  → create risk_alert if status worsened        │    │  │
│  │  └────────────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Edge Functions (Deno)                                 │  │
│  │  → CSV bulk import (students + enrollments)            │  │
│  │  → Push notification dispatch                          │  │
│  │  → Aggregate reporting / export                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Current State Audit

### What Exists (Frontend Shell)

| Component | File(s) | Status |
|---|---|---|
| Landing page | `Index.tsx`, `HeroSection.tsx`, `BentoGrid.tsx`, `LandingNav.tsx`, `LandingFooter.tsx` | ✅ Built — cinematic UI, mobile-responsive |
| Auth page | `Auth.tsx` | ⚠️ UI built, but no real auth. `handleSubmit` just navigates |
| Student dashboard | `Dashboard.tsx`, `RiskGauge.tsx`, `CourseCard.tsx` | ⚠️ UI built with hardcoded mock data |
| Routing | `App.tsx` | ⚠️ Basic routes exist, no guards |
| Design system | `index.css`, `tailwind.config.ts`, 49 shadcn/ui components | ✅ Fully configured |
| Assets | 6 high-quality images | ✅ Present |

### What's Missing (Complete List)

| Category | Gap | Severity |
|---|---|---|
| **Backend** | No Supabase project, no database, no schema, no RLS | 🔴 Critical |
| **Auth** | No Supabase Auth, no JWT sessions, no protected routes | 🔴 Critical |
| **Lecturer role** | Zero UI — no attendance marking, grade input, student list | 🔴 Critical |
| **Admin role** | Zero UI — no user CRUD, course CRUD, enrollment linking, CSV upload | 🔴 Critical |
| **Risk engine** | No DB triggers/functions, no automated status calculation | 🔴 Critical |
| **Real-time** | No Supabase Realtime subscriptions | 🟡 High |
| **Notifications** | No push notification system, no in-app alert list | 🟡 High |
| **Feedback system** | No messaging UI or backend | 🟡 High |
| **PWA** | No service worker, no manifest.json, no offline support | 🟡 High |
| **Data correctness** | CA threshold coded as `< 50` instead of `< 40` per spec | 🟠 Medium |
| **Data correctness** | No "Critical" attendance state (< 60%) | 🟠 Medium |
| **Copy error** | BentoGrid says "Predictive algorithms" — contradicts "Rule-Based" spec | 🟠 Medium |
| **Auth fields** | No matric number or department fields | 🟠 Medium |
| **App.css** | Leftover Vite boilerplate CSS (conflicts with actual styles) | 🟢 Low |

---

## 3. Full Data Flow — End to End

### Flow 1: Lecturer Enters a Grade → Student Sees Update

```
Lecturer opens CourseDetail page
  → Selects student from enrolled list
  → Enters Assignment score (score_obtained: 12, max_score: 20)
  → Frontend calls: supabase.from('performance_records').insert({...})
  → PostgREST writes to PostgreSQL
  → DB Trigger fires: fn_recalculate_risk()
    → Queries ALL performance_records for this enrollment
    → Computes attendance_pct and ca_pct
    → Applies rules:
       attendance < 60% → 'critical'
       attendance < 75% → 'at_risk'
       ca_pct < 40% → 'at_risk'
       else → 'satisfactory'
    → UPDATE enrollments SET current_risk_status = new_status
    → IF status worsened: INSERT INTO risk_alerts (enrollment_id, severity, trigger_reason)
  → Supabase Realtime broadcasts change on `enrollments` table
  → Student's browser receives WS event
  → TanStack Query invalidates `['enrollment', id]` → re-fetches
  → RiskGauge + CourseCard re-render with live data
  → If risk_alert was created → push notification dispatched via Edge Function
```

### Flow 2: Admin Onboards 500 Students via CSV

```
Admin opens Admin Panel → Bulk Import section
  → Uploads CSV (columns: full_name, matric_number, email, department, course_codes)
  → Frontend reads CSV, validates schema client-side
  → Calls Edge Function: /functions/v1/bulk-import
  → Edge Function:
    → Creates auth users (supabase.auth.admin.createUser) in batch
    → Inserts profiles rows
    → For each course_code, inserts enrollment rows
    → Returns success/failure report (row-level errors)
  → Admin sees import summary with error log
```

### Flow 3: Student Checks Dashboard

```
Student opens app → hits /dashboard
  → AuthGuard checks supabase.auth.getSession()
    → No session? Redirect to /auth
    → Valid session? Render dashboard
  → Dashboard mounts:
    → Query 1: supabase.from('profiles').select('*').eq('id', user.id).single()
    → Query 2: supabase.from('enrollments')
                .select('*, course:courses(*), performance_records(*)')
                .eq('student_id', user.id)
    → Query 3: supabase.from('risk_alerts')
                .select('*')
                .eq('student_id', user.id)
                .order('created_at', { ascending: false })
  → Data arrives → RiskGauge computes overall score from enrollment statuses
  → CourseCards render per-course metrics
  → Subscribe to Realtime on enrollments table for live updates
```

---

## 4. Database Schema

### Entity Relationship Diagram

```
profiles (1)───────(M) enrollments (M)───────(1) courses
                        │
                   ┌────┴────┐
                   │         │
              (M)  │    (M)  │
    performance_records   risk_alerts
                   
profiles (1)───(M) feedback_threads (M)───(1) courses
                        │
                   (M)  │
              feedback_messages
```

### Table Definitions

```sql
-- Extends Supabase auth.users
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  matric_number TEXT UNIQUE,            -- NULL for staff/admin
  role          TEXT NOT NULL CHECK (role IN ('student', 'lecturer', 'admin')),
  department    TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE courses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       TEXT NOT NULL UNIQUE,       -- e.g., 'CSC 401'
  title      TEXT NOT NULL,
  unit_load  INTEGER NOT NULL DEFAULT 3,
  semester   TEXT NOT NULL,              -- e.g., '2025/2026-2'
  lecturer_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE enrollments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id           UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  current_risk_status TEXT NOT NULL DEFAULT 'satisfactory'
                      CHECK (current_risk_status IN ('satisfactory', 'at_risk', 'critical')),
  attendance_pct      NUMERIC(5,2) DEFAULT 100.00,  -- cached computation
  ca_pct              NUMERIC(5,2) DEFAULT 0.00,    -- cached computation
  created_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, course_id)
);

CREATE TABLE performance_records (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id  UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  record_type    TEXT NOT NULL CHECK (record_type IN ('attendance', 'ca_test', 'assignment')),
  score_obtained NUMERIC(6,2),          -- NULL for attendance (use is_present)
  max_score      NUMERIC(6,2),          -- NULL for attendance
  is_present     BOOLEAN,               -- Only for attendance type
  record_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  description    TEXT,                   -- e.g., 'Test 1', 'Week 3 Attendance'
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE risk_alerts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id  UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  student_id     UUID NOT NULL REFERENCES profiles(id),
  course_id      UUID NOT NULL REFERENCES courses(id),
  severity       TEXT NOT NULL CHECK (severity IN ('at_risk', 'critical')),
  trigger_reason TEXT NOT NULL,          -- e.g., 'Attendance dropped to 62% (< 75%)'
  is_read        BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE feedback_threads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES profiles(id),
  lecturer_id UUID NOT NULL REFERENCES profiles(id),
  course_id   UUID NOT NULL REFERENCES courses(id),
  subject     TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE feedback_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  UUID NOT NULL REFERENCES feedback_threads(id) ON DELETE CASCADE,
  sender_id  UUID NOT NULL REFERENCES profiles(id),
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Key Indexes

```sql
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_performance_enrollment ON performance_records(enrollment_id);
CREATE INDEX idx_risk_alerts_student ON risk_alerts(student_id);
CREATE INDEX idx_risk_alerts_unread ON risk_alerts(student_id) WHERE is_read = false;
CREATE INDEX idx_feedback_threads_student ON feedback_threads(student_id);
CREATE INDEX idx_feedback_threads_lecturer ON feedback_threads(lecturer_id);
```

---

## 5. Risk Engine — Business Logic

### PL/pgSQL Trigger Function

This runs AFTER every INSERT or UPDATE on `performance_records`. It is the core of the system.

```sql
CREATE OR REPLACE FUNCTION fn_recalculate_risk()
RETURNS TRIGGER AS $$
DECLARE
  v_enrollment_id    UUID;
  v_student_id       UUID;
  v_course_id        UUID;
  v_attendance_pct   NUMERIC(5,2);
  v_ca_pct           NUMERIC(5,2);
  v_new_status       TEXT;
  v_old_status       TEXT;
  v_trigger_reason   TEXT;
BEGIN
  v_enrollment_id := NEW.enrollment_id;

  -- Get enrollment context
  SELECT student_id, course_id, current_risk_status
    INTO v_student_id, v_course_id, v_old_status
    FROM enrollments WHERE id = v_enrollment_id;

  -- Calculate attendance percentage
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE is_present = true)::NUMERIC /
     NULLIF(COUNT(*), 0)) * 100, 100)
    INTO v_attendance_pct
    FROM performance_records
    WHERE enrollment_id = v_enrollment_id AND record_type = 'attendance';

  -- Calculate CA percentage
  SELECT COALESCE(
    (SUM(score_obtained) / NULLIF(SUM(max_score), 0)) * 100, 0)
    INTO v_ca_pct
    FROM performance_records
    WHERE enrollment_id = v_enrollment_id AND record_type IN ('ca_test', 'assignment');

  -- Apply risk rules (worst status wins)
  v_new_status := 'satisfactory';
  v_trigger_reason := NULL;

  IF v_attendance_pct < 60 THEN
    v_new_status := 'critical';
    v_trigger_reason := format('Attendance at %.1f%% (below 60%% critical threshold)', v_attendance_pct);
  ELSIF v_attendance_pct < 75 THEN
    v_new_status := 'at_risk';
    v_trigger_reason := format('Attendance at %.1f%% (below 75%% threshold)', v_attendance_pct);
  END IF;

  IF v_ca_pct < 40 THEN
    IF v_new_status = 'satisfactory' OR v_new_status = 'at_risk' THEN
      -- CA risk is at_risk level, but don't downgrade from critical
      IF v_new_status != 'critical' THEN
        v_new_status := 'at_risk';
      END IF;
      v_trigger_reason := COALESCE(v_trigger_reason || ' + ', '') ||
        format('CA average at %.1f%% (below 40%% threshold)', v_ca_pct);
    END IF;
  END IF;

  -- Update cached values on enrollment
  UPDATE enrollments
    SET current_risk_status = v_new_status,
        attendance_pct = v_attendance_pct,
        ca_pct = v_ca_pct
    WHERE id = v_enrollment_id;

  -- If status worsened, create alert
  IF v_new_status != v_old_status AND v_new_status != 'satisfactory' THEN
    INSERT INTO risk_alerts (enrollment_id, student_id, course_id, severity, trigger_reason)
    VALUES (v_enrollment_id, v_student_id, v_course_id, v_new_status, v_trigger_reason);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_recalculate_risk
  AFTER INSERT OR UPDATE ON performance_records
  FOR EACH ROW EXECUTE FUNCTION fn_recalculate_risk();
```

### Threshold Summary

| Metric | Threshold | Status |
|---|---|---|
| Attendance ≥ 75% AND CA ≥ 40% | — | ✅ Satisfactory |
| Attendance < 75% (but ≥ 60%) | 75% | ⚠️ At Risk |
| CA average < 40% | 40% | ⚠️ At Risk |
| Attendance < 60% | 60% | 🔴 Critical |

---

## 6. Authentication & Authorization Model

### Auth Flow

```
User visits /auth
  → Enters email + password + selects role tab
  → supabase.auth.signInWithPassword({ email, password })
  → Supabase returns JWT + session
  → Frontend stores session (auto-managed by supabase-js)
  → Redirect based on role:
     student  → /dashboard
     lecturer → /lecturer
     admin    → /admin
```

### Route Protection

```
AuthGuard component wraps protected routes:
  → Check supabase.auth.getSession()
  → No session → redirect /auth
  → Has session → fetch profile from profiles table
  → Check role matches route requirement
  → Role mismatch → redirect to correct dashboard
  → Render children
```

### Row Level Security (RLS) Policies

```sql
-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Lecturers can view students in their courses"
  ON profiles FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.student_id = profiles.id AND c.lecturer_id = auth.uid()
    )
  );
CREATE POLICY "Admins full access"
  ON profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ENROLLMENTS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students see own enrollments"
  ON enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Lecturers see enrollments in their courses"
  ON enrollments FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND lecturer_id = auth.uid())
  );
CREATE POLICY "Admins full access"
  ON enrollments FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PERFORMANCE_RECORDS
ALTER TABLE performance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students read own records"
  ON performance_records FOR SELECT USING (
    EXISTS (SELECT 1 FROM enrollments WHERE id = enrollment_id AND student_id = auth.uid())
  );
CREATE POLICY "Lecturers CRUD for their courses"
  ON performance_records FOR ALL USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.id = enrollment_id AND c.lecturer_id = auth.uid()
    )
  );
CREATE POLICY "Admins full access"
  ON performance_records FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RISK_ALERTS
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students see own alerts"
  ON risk_alerts FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students mark own alerts as read"
  ON risk_alerts FOR UPDATE USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "Lecturers see alerts in their courses"
  ON risk_alerts FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND lecturer_id = auth.uid())
  );
CREATE POLICY "Admins full access"
  ON risk_alerts FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 7. Real-Time & Notification Pipeline

### Supabase Realtime Channels

```typescript
// Student dashboard — subscribe to enrollment changes
supabase.channel('enrollment-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'enrollments',
    filter: `student_id=eq.${userId}`,
  }, (payload) => {
    queryClient.invalidateQueries({ queryKey: ['enrollments', userId] });
  })
  .subscribe();

// Student — subscribe to new risk alerts
supabase.channel('risk-alerts')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'risk_alerts',
    filter: `student_id=eq.${userId}`,
  }, (payload) => {
    // Show toast notification
    // Invalidate alerts query
  })
  .subscribe();
```

### Push Notification Pipeline

```
DB Trigger creates risk_alert
  → Supabase Database Webhook fires on risk_alerts INSERT
  → Calls Edge Function: /functions/v1/send-push
  → Edge Function:
    → Reads push subscription from profiles (push_subscription JSONB column)
    → Uses Web Push API to send notification
    → Notification payload: { title, body, url: '/dashboard' }
  → Service worker receives push event
  → Shows native OS notification
```

---

## 8. PWA Architecture

### Required Files

| File | Purpose |
|---|---|
| `public/manifest.json` | App name, icons, theme color, start URL, display: standalone |
| `public/sw.js` | Service worker — cache strategy, push listener |
| `public/icons/` | PWA icons (192x192, 512x512) |

### Service Worker Strategy

- **Cache-first** for static assets (JS, CSS, images)
- **Network-first** for API calls (Supabase data)
- **Push event listener** receives notifications and displays them
- **Background sync** for offline grade changes (stretch goal)

---

## 9. Edge Cases & Failure Modes

### Race Conditions
| Scenario | Risk | Mitigation |
|---|---|---|
| Two lecturers editing same student's grade simultaneously | Low (single lecturer per course) | Supabase upsert with conflict resolution |
| Realtime event arrives before query completes | Dashboard flicker | Use TanStack Query `staleTime` + deduplication |
| CSV import with duplicate matric numbers | Rows rejected | Validate uniqueness client-side + ON CONFLICT DO NOTHING |

### Data Integrity
| Scenario | Risk | Mitigation |
|---|---|---|
| Lecturer enters score > max_score | Invalid data | CHECK constraint: `score_obtained <= max_score` |
| Attendance marked for non-existent session | Orphan data | `record_date` validated against course schedule |
| Student unenrolled mid-semester | Risk alerts orphaned | CASCADE DELETE from enrollments |

### Network Failure (Nigeria Context)
| Scenario | Risk | Mitigation |
|---|---|---|
| Offline during grade entry | Data loss | Optimistic UI + retry queue (service worker) |
| Slow 2G/3G connection | Timeout | Lightweight payloads, skeleton loaders, cached dashboard |
| Realtime WS disconnect | Stale data | Auto-reconnect + poll fallback every 30s |

### Auth Edge Cases
| Scenario | Mitigation |
|---|---|
| JWT expired during session | Supabase auto-refresh; if refresh fails → redirect to /auth |
| Student tries to access /admin | AuthGuard checks role → redirect |
| Auth.users exists but no profile row | After signup trigger creates profile; guard checks profile exists |

---

## 10. Phase 1 — Backend Foundation

**Goal:** Establish a fully functional Supabase backend with all tables, RLS, triggers, and the risk engine — testable independently of frontend.

### Phase 1A: Supabase Project Setup & Schema

| # | Task | Details |
|---|---|---|
| 1.1 | Create Supabase project | Create project, save URL + anon key + service role key |
| 1.2 | Install supabase-js | `npm install @supabase/supabase-js` |
| 1.3 | Create `src/lib/supabase.ts` | Initialize client with env vars from `.env.local` |
| 1.4 | Create `.env.local` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| 1.5 | Run schema SQL | Create all 7 tables (profiles, courses, enrollments, performance_records, risk_alerts, feedback_threads, feedback_messages) |
| 1.6 | Create indexes | Performance indexes on foreign keys and filters |
| 1.7 | Create risk engine trigger | `fn_recalculate_risk()` + trigger on `performance_records` |
| 1.8 | Add CHECK constraints | `score_obtained <= max_score`, role enum, status enum |

### Phase 1B: Auth & Profile Management

| # | Task | Details |
|---|---|---|
| 1.9 | Configure Supabase Auth | Enable email/password provider, disable email confirmation for pilot |
| 1.10 | Create handle_new_user trigger | On `auth.users` INSERT → create `profiles` row with metadata |
| 1.11 | Generate TypeScript types | `npx supabase gen types typescript` → `src/types/database.ts` |

### Phase 1C: RLS Policies

| # | Task | Details |
|---|---|---|
| 1.12 | Enable RLS on all tables | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` |
| 1.13 | Write Student policies | SELECT own profile, enrollments, records, alerts |
| 1.14 | Write Lecturer policies | SELECT students in their courses, CRUD performance records |
| 1.15 | Write Admin policies | Full CRUD on all tables |
| 1.16 | Test policies | Use Supabase SQL editor to verify with different JWTs |

### Phase 1D: Edge Functions

| # | Task | Details |
|---|---|---|
| 1.17 | CSV bulk import function | Parse CSV → create users + profiles + enrollments |
| 1.18 | Push notification function | Receive webhook from risk_alert INSERT → send Web Push |

### Phase 1E: Seed Data

| # | Task | Details |
|---|---|---|
| 1.19 | Create seed script | `supabase/seed.sql` with: 1 admin, 3 lecturers, 20 students, 6 courses, enrollments, sample performance records |
| 1.20 | Validate risk engine | Insert sample records via SQL, verify enrollment statuses and alert generation |

---

## 11. Phase 2 — Frontend Integration & Completion

**Goal:** Wire every UI to real Supabase data, build missing role dashboards, add real-time features and PWA support.

### Phase 2A: Auth Integration

| # | Task | Details |
|---|---|---|
| 2.1 | Create `AuthContext` | React context wrapping `supabase.auth.onAuthStateChange`, provides `user`, `profile`, `loading` |
| 2.2 | Create `AuthGuard` component | Checks session + role, redirects if unauthorized |
| 2.3 | Wire `Auth.tsx` to real Supabase Auth | Replace `navigate('/dashboard')` with `supabase.auth.signInWithPassword()` |
| 2.4 | Add matric_number field | Show for student role in auth form |
| 2.5 | Role-based redirect | After login: student → `/dashboard`, lecturer → `/lecturer`, admin → `/admin` |
| 2.6 | Logout | Wire LogOut button to `supabase.auth.signOut()` |

### Phase 2B: Student Dashboard — Live Data

| # | Task | Details |
|---|---|---|
| 2.7 | Create data hooks | `useStudentEnrollments()`, `useStudentAlerts()`, `useProfile()` using TanStack Query |
| 2.8 | Wire `Dashboard.tsx` | Replace hardcoded array with `useStudentEnrollments()` |
| 2.9 | Fix risk thresholds | CA: `< 40%` (not 50), add "Critical" state for attendance `< 60%` |
| 2.10 | Build Alert History page | `/dashboard/alerts` — list of `risk_alerts` with severity + trigger reason + timestamp |
| 2.11 | Add Realtime subscriptions | Subscribe to `enrollments` + `risk_alerts` changes for the logged-in student |
| 2.12 | Skeleton loading states | Show while data loads (already have shadcn Skeleton component) |

### Phase 2C: Lecturer Dashboard — New Build

| # | Task | Details |
|---|---|---|
| 2.13 | Create `/lecturer` route + page | Layout: sidebar with course list, main content area |
| 2.14 | Course overview page | Show enrolled students with risk status badges, filterable by status |
| 2.15 | Attendance marking UI | Date picker + checkboxes for each student → bulk INSERT `performance_records` (type: attendance) |
| 2.16 | Grade entry UI | Select student → form: record_type (ca_test/assignment), score, max_score, description → INSERT |
| 2.17 | At-risk student list | Filtered view: only students with `at_risk` or `critical` status across all their courses |
| 2.18 | Nudge/warning action | Button to manually send a notification (INSERT into risk_alerts with custom message) |
| 2.19 | Data hooks | `useLecturerCourses()`, `useCourseStudents(courseId)`, mutation hooks for records |

### Phase 2D: Admin Panel — New Build

| # | Task | Details |
|---|---|---|
| 2.20 | Create `/admin` route + page | Layout: sidebar with sections (Users, Courses, Enrollments, Reports) |
| 2.21 | User management CRUD | Table with search/filter, create/edit modal (role, name, matric, department) |
| 2.22 | Course management CRUD | Table, create/edit modal (code, title, unit_load, semester, assign lecturer) |
| 2.23 | Enrollment management | Select course → add/remove students |
| 2.24 | CSV bulk import UI | File upload → preview parsed rows → confirm → call Edge Function |
| 2.25 | Reporting dashboard | Aggregate stats: total students, at-risk count by department, export to CSV |
| 2.26 | Data hooks | Admin-scoped queries with full table access |

### Phase 2E: Feedback System

| # | Task | Details |
|---|---|---|
| 2.27 | Student: "Contact Lecturer" button | On CourseCard → opens thread create modal |
| 2.28 | Feedback thread list | `/dashboard/feedback` — list of threads, click to open |
| 2.29 | Message thread UI | Chat-style interface, send message → INSERT `feedback_messages` |
| 2.30 | Lecturer: feedback inbox | `/lecturer/feedback` — list of open threads across all courses |
| 2.31 | Realtime messaging | Subscribe to `feedback_messages` inserts for open thread |

### Phase 2F: Copy & UI Fixes

| # | Task | Details |
|---|---|---|
| 2.32 | Fix BentoGrid copy | Change "Predictive algorithms" to "Rule-based threshold monitoring" |
| 2.33 | Delete `App.css` | Remove leftover Vite boilerplate |
| 2.34 | Update `index.html` metadata | Ensure title/description match "Baseline" |
| 2.35 | Add `RiskGauge` "Critical" state | Red + pulsing for `< 60%` attendance |

### Phase 2G: PWA Setup

| # | Task | Details |
|---|---|---|
| 2.36 | Create `public/manifest.json` | name: "Baseline", icons, theme_color, background_color, start_url, display: standalone |
| 2.37 | Generate PWA icons | 192x192 + 512x512 PNG icons |
| 2.38 | Create service worker | `public/sw.js` — cache static assets, handle push events |
| 2.39 | Register SW in `main.tsx` | `navigator.serviceWorker.register('/sw.js')` |
| 2.40 | Push subscription flow | On login → request notification permission → save subscription to profile |
| 2.41 | Link `<link rel="manifest">` | Add to `index.html` |

---

## 12. File Structure — Target State

```
src/
├── assets/                          # Images (existing)
├── components/
│   ├── ui/                          # shadcn/ui (existing, 49 components)
│   ├── landing/                     # Landing page (existing)
│   │   ├── HeroSection.tsx
│   │   ├── BentoGrid.tsx
│   │   ├── LandingNav.tsx
│   │   └── LandingFooter.tsx
│   ├── dashboard/                   # Student dashboard components
│   │   ├── RiskGauge.tsx            # (existing — needs Critical state)
│   │   ├── CourseCard.tsx           # (existing — needs threshold fix)
│   │   ├── AlertList.tsx            # NEW
│   │   └── FeedbackThread.tsx       # NEW
│   ├── lecturer/                    # NEW — Lecturer components
│   │   ├── AttendanceMarker.tsx
│   │   ├── GradeEntryForm.tsx
│   │   ├── StudentRiskTable.tsx
│   │   ├── CourseSelector.tsx
│   │   └── NudgeButton.tsx
│   ├── admin/                       # NEW — Admin components
│   │   ├── UserTable.tsx
│   │   ├── CourseTable.tsx
│   │   ├── EnrollmentManager.tsx
│   │   ├── CsvImporter.tsx
│   │   └── ReportingDashboard.tsx
│   ├── auth/                        # NEW
│   │   ├── AuthGuard.tsx
│   │   └── RoleRedirect.tsx
│   └── NavLink.tsx                  # (existing)
├── contexts/                        # NEW
│   └── AuthContext.tsx
├── hooks/
│   ├── use-mobile.tsx               # (existing)
│   ├── use-toast.ts                 # (existing)
│   ├── useAuth.ts                   # NEW
│   ├── useProfile.ts               # NEW
│   ├── useStudentEnrollments.ts     # NEW
│   ├── useStudentAlerts.ts          # NEW
│   ├── useLecturerCourses.ts        # NEW
│   ├── useCourseStudents.ts         # NEW
│   ├── usePerformanceMutations.ts   # NEW
│   └── useFeedback.ts              # NEW
├── lib/
│   ├── utils.ts                     # (existing)
│   └── supabase.ts                  # NEW — Supabase client init
├── pages/
│   ├── Index.tsx                    # (existing — landing)
│   ├── Auth.tsx                     # (existing — needs wiring)
│   ├── Dashboard.tsx                # (existing — needs wiring)
│   ├── DashboardAlerts.tsx          # NEW
│   ├── DashboardFeedback.tsx        # NEW
│   ├── Lecturer.tsx                 # NEW
│   ├── LecturerCourse.tsx           # NEW
│   ├── LecturerFeedback.tsx         # NEW
│   ├── Admin.tsx                    # NEW
│   ├── AdminUsers.tsx               # NEW
│   ├── AdminCourses.tsx             # NEW
│   ├── AdminImport.tsx              # NEW
│   ├── AdminReports.tsx             # NEW
│   └── NotFound.tsx                 # (existing)
├── types/
│   └── database.ts                  # NEW — Supabase generated types
├── test/                            # (existing)
├── App.tsx                          # (needs route additions)
├── App.css                          # DELETE (boilerplate)
├── index.css                        # (existing — good)
├── main.tsx                         # (needs SW registration)
└── vite-env.d.ts                    # (existing)

public/
├── manifest.json                    # NEW
├── sw.js                            # NEW
└── icons/                           # NEW
    ├── icon-192.png
    └── icon-512.png

supabase/
├── migrations/
│   ├── 001_schema.sql               # All table definitions
│   ├── 002_rls_policies.sql         # All RLS policies
│   ├── 003_risk_engine.sql          # Trigger function
│   └── 004_auth_trigger.sql         # handle_new_user
├── functions/
│   ├── bulk-import/index.ts         # CSV import Edge Function
│   └── send-push/index.ts           # Push notification Edge Function
└── seed.sql                         # Demo data
```

---

## Dependency Additions Required

```bash
npm install @supabase/supabase-js
# That's it. Everything else is already installed.
```

---

## Decision Log

| Decision | Rationale |
|---|---|
| Cached `attendance_pct` / `ca_pct` on enrollments table | Avoids expensive aggregation on every dashboard load — Nigerian mobile context demands fast reads |
| Risk engine in PL/pgSQL trigger, not Edge Function | Runs atomically with the INSERT — zero chance of stale status between write and read |
| "Worst status wins" rule | If attendance is Critical but CA is fine, student is still Critical — conservative approach protects students |
| TanStack Query + Realtime invalidation (not replacing) | TanStack gives caching, deduplication, retries. Realtime only signals when to refetch, not replaces state |
| No email confirmation for pilot | Accounts are admin-provisioned → no need for email verification friction |
| Service worker cache-first for assets | Static assets rarely change; API calls always go network-first for freshness |

---

*This document is the single source of truth for the Baseline MVP. All implementation should reference these specifications.*
