create extension if not exists pgcrypto with schema extensions;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text not null,
  full_description text,
  github_url text not null,
  demo_url text,
  image_url text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists public.project_tags (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  github_url text not null,
  demo_url text,
  description text not null,
  submitter_email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists projects_status_created_at_idx
  on public.projects (status, created_at desc);

create index if not exists projects_featured_created_at_idx
  on public.projects (is_featured, created_at desc);

create index if not exists project_tags_project_id_idx
  on public.project_tags (project_id);

create unique index if not exists project_tags_project_id_tag_uidx
  on public.project_tags (project_id, tag);

alter table public.projects enable row level security;
alter table public.project_tags enable row level security;
alter table public.submissions enable row level security;

create policy "Public can read published projects"
on public.projects
for select
using (status = 'published');

create policy "Public can read tags for published projects"
on public.project_tags
for select
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = public.project_tags.project_id
      and public.projects.status = 'published'
  )
);

create policy "Anyone can submit projects"
on public.submissions
for insert
with check (true);
