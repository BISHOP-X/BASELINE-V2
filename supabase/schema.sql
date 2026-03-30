-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Table Definitions
-- -----------------------------------------------------------------------------

-- User Profiles
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null check (role in ('admin', 'lecturer', 'student')),
  name text not null,
  matric_number text unique, -- Nullable for admin/lecturer
  email text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Courses
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  title text not null,
  lecturer_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Course Enrollments (Students -> Courses)
create table if not exists public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  enrolled_at timestamp with time zone default now(),
  unique(course_id, student_id)
);

-- Feedback / Messages
create table if not exists public.feedback (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- -----------------------------------------------------------------------------
-- 2. Row Level Security (RLS) Policies
-- -----------------------------------------------------------------------------

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admin can do all profile operations" on profiles for all using (
  exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )
);

-- Courses
alter table public.courses enable row level security;
create policy "Courses are viewable by everyone" on courses for select using (true);
create policy "Admins can manage courses" on courses for all using (
  exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )
);

-- Enrollments
alter table public.enrollments enable row level security;
create policy "Students can view their own enrollments" on enrollments for select using (
  auth.uid() = student_id
);
create policy "Lecturers can view enrollments for their courses" on enrollments for select using (
  exists (
    select 1 from public.courses where id = course_id and lecturer_id = auth.uid()
  )
);
create policy "Admins can manage enrollments" on enrollments for all using (
  exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )
);

-- Feedback
alter table public.feedback enable row level security;
-- Sender can view own feedback
create policy "Users can view feedback they sent" on feedback for select using (
  auth.uid() = sender_id
);
-- Receiver (Lecturer) can view feedback for their courses
create policy "Lecturers can view feedback for their courses" on feedback for select using (
  exists (
    select 1 from public.courses where id = course_id and lecturer_id = auth.uid()
  )
);
create policy "Admins can view all feedback" on feedback for select using (
  exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )
);
create policy "Users can insert feedback" on feedback for insert with check (
  auth.uid() = sender_id
);
create policy "Receivers or senders can update read status" on feedback for update using (
  auth.uid() = sender_id or 
  exists (
    select 1 from public.courses where id = course_id and lecturer_id = auth.uid()
  )
);
