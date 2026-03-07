create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.repositories (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  provider text not null check (provider in ('github', 'gitlab')),
  repo_url text not null unique,
  owner text not null,
  repo_name text not null,
  default_branch text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  repository_id uuid references public.repositories(id) on delete set null,
  branch_name text,
  status text not null default 'provisioning' check (status in ('provisioning', 'ready', 'stopped', 'failed')),
  preview_url text,
  created_at timestamptz not null default now()
);

alter table public.submissions
  add column if not exists project_id uuid references public.projects(id) on delete set null,
  add column if not exists repository_id uuid references public.repositories(id) on delete set null;

create index if not exists submissions_status_created_at_idx
  on public.submissions (status, created_at desc);
create index if not exists submissions_project_id_idx
  on public.submissions (project_id);
create index if not exists submissions_repository_id_idx
  on public.submissions (repository_id);

create index if not exists repositories_project_id_idx
  on public.repositories (project_id);
create index if not exists repositories_provider_owner_repo_idx
  on public.repositories (provider, owner, repo_name);

create index if not exists workspaces_user_id_created_at_idx
  on public.workspaces (user_id, created_at desc);
create index if not exists workspaces_project_id_idx
  on public.workspaces (project_id);
create index if not exists workspaces_repository_id_idx
  on public.workspaces (repository_id);

alter table public.admin_users enable row level security;
alter table public.repositories enable row level security;
alter table public.workspaces enable row level security;

-- Remove old policy names (earlier drafts) so we can standardize policy definitions.
drop policy if exists "Admins can read admin_users" on public.admin_users;
drop policy if exists admin_users_select_for_admins on public.admin_users;
drop policy if exists admin_users_manage_for_admins on public.admin_users;

drop policy if exists "Admins can read submissions" on public.submissions;
drop policy if exists "Admins can update submissions" on public.submissions;
drop policy if exists submissions_select_for_admins on public.submissions;
drop policy if exists submissions_update_for_admins on public.submissions;

drop policy if exists projects_select_for_admins on public.projects;
drop policy if exists projects_insert_for_admins on public.projects;
drop policy if exists projects_update_for_admins on public.projects;

drop policy if exists project_tags_select_for_admins on public.project_tags;
drop policy if exists project_tags_insert_for_admins on public.project_tags;
drop policy if exists project_tags_update_for_admins on public.project_tags;

drop policy if exists "Admins can read repositories" on public.repositories;
drop policy if exists "Admins can update repositories" on public.repositories;
drop policy if exists repositories_select_for_admins on public.repositories;
drop policy if exists repositories_insert_for_admins on public.repositories;
drop policy if exists repositories_update_for_admins on public.repositories;

drop policy if exists "Users can read their own workspaces" on public.workspaces;
drop policy if exists "Users can create their own workspaces" on public.workspaces;
drop policy if exists "Users can update their own workspaces" on public.workspaces;
drop policy if exists workspaces_select_for_user_or_admin on public.workspaces;
drop policy if exists workspaces_insert_for_owner on public.workspaces;
drop policy if exists workspaces_update_for_user_or_admin on public.workspaces;

-- Refresh admin helper functions.
drop function if exists public.is_admin(uuid);
drop function if exists public.is_admin();

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated, service_role;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists repositories_touch_updated_at on public.repositories;
create trigger repositories_touch_updated_at
before update on public.repositories
for each row
execute function public.touch_updated_at();

-- Recreate admin policies.
create policy admin_users_select_for_admins
on public.admin_users
for select
to authenticated
using (public.is_admin());

create policy admin_users_manage_for_admins
on public.admin_users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy submissions_select_for_admins
on public.submissions
for select
to authenticated
using (public.is_admin());

create policy submissions_update_for_admins
on public.submissions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy projects_select_for_admins
on public.projects
for select
to authenticated
using (public.is_admin());

create policy projects_insert_for_admins
on public.projects
for insert
to authenticated
with check (public.is_admin());

create policy projects_update_for_admins
on public.projects
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy project_tags_select_for_admins
on public.project_tags
for select
to authenticated
using (public.is_admin());

create policy project_tags_insert_for_admins
on public.project_tags
for insert
to authenticated
with check (public.is_admin());

create policy project_tags_update_for_admins
on public.project_tags
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy repositories_select_for_admins
on public.repositories
for select
to authenticated
using (public.is_admin());

create policy repositories_insert_for_admins
on public.repositories
for insert
to authenticated
with check (public.is_admin());

create policy repositories_update_for_admins
on public.repositories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy workspaces_select_for_user_or_admin
on public.workspaces
for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

create policy workspaces_insert_for_owner
on public.workspaces
for insert
to authenticated
with check (auth.uid() = user_id or public.is_admin());

create policy workspaces_update_for_user_or_admin
on public.workspaces
for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

-- Keep repository extraction logic in sync with current parser.
create or replace function public.capture_repository_from_submission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_url text;
  host_name text;
  repo_path text;
  repo_owner text;
  repo_name text;
  repo_provider text;
  canonical_repo_url text;
  repository_row_id uuid;
begin
  normalized_url := trim(coalesce(new.github_url, ''));

  if normalized_url = '' then
    new.repository_id := null;
    return new;
  end if;

  normalized_url := regexp_replace(normalized_url, '^https?://', '', 'i');
  normalized_url := regexp_replace(normalized_url, '^www\.', '', 'i');

  host_name := lower(split_part(normalized_url, '/', 1));
  repo_path := coalesce(substring(normalized_url from '^[^/]+/(.+)$'), '');
  repo_path := split_part(repo_path, '?', 1);
  repo_path := split_part(repo_path, '#', 1);
  repo_path := regexp_replace(repo_path, '/+$', '');

  repo_owner := lower(split_part(repo_path, '/', 1));
  repo_name := lower(split_part(repo_path, '/', 2));
  repo_name := regexp_replace(repo_name, '\\.git$', '', 'i');

  if repo_owner = '' or repo_name = '' then
    new.repository_id := null;
    return new;
  end if;

  if host_name = 'github.com' or host_name like 'github.%' then
    repo_provider := 'github';
  elsif host_name = 'gitlab.com' or host_name like 'gitlab.%' then
    repo_provider := 'gitlab';
  else
    new.repository_id := null;
    return new;
  end if;

  canonical_repo_url := format('https://%s/%s/%s', host_name, repo_owner, repo_name);

  insert into public.repositories (
    project_id,
    provider,
    repo_url,
    owner,
    repo_name,
    default_branch
  )
  values (
    null,
    repo_provider,
    canonical_repo_url,
    repo_owner,
    repo_name,
    null
  )
  on conflict (repo_url)
  do update set
    provider = excluded.provider,
    owner = excluded.owner,
    repo_name = excluded.repo_name,
    updated_at = now()
  returning id into repository_row_id;

  new.repository_id := repository_row_id;
  return new;
end;
$$;

drop trigger if exists submissions_capture_repository on public.submissions;
create trigger submissions_capture_repository
before insert or update of github_url on public.submissions
for each row
execute function public.capture_repository_from_submission();
