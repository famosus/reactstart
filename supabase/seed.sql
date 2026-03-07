insert into public.projects (
  name,
  slug,
  short_description,
  full_description,
  github_url,
  demo_url,
  is_featured,
  status
)
values
  (
    'AI Dashboard',
    'ai-dashboard',
    'A simple AI-powered dashboard UI.',
    'A simple AI-powered dashboard UI built with React, Vite, and Tailwind.',
    'https://github.com/example/ai-dashboard',
    'https://example.com/ai-dashboard',
    true,
    'published'
  ),
  (
    'Markdown Editor',
    'markdown-editor',
    'Minimal markdown editor built with React.',
    'A minimal markdown editor built with React and TypeScript.',
    'https://github.com/example/markdown-editor',
    'https://example.com/markdown-editor',
    true,
    'published'
  ),
  (
    'Task Manager',
    'task-manager',
    'Lightweight productivity app.',
    'A lightweight React productivity app for managing personal tasks.',
    'https://github.com/example/task-manager',
    'https://example.com/task-manager',
    false,
    'published'
  ),
  (
    'Component Lab',
    'component-lab',
    'A focused space for testing reusable React UI patterns.',
    'A focused React playground for iterating on reusable interface patterns.',
    'https://github.com/example/component-lab',
    'https://example.com/component-lab',
    true,
    'published'
  )
on conflict (slug) do nothing;

insert into public.project_tags (project_id, tag)
select id, 'React' from public.projects where slug = 'ai-dashboard'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'Vite' from public.projects where slug = 'ai-dashboard'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'Tailwind' from public.projects where slug = 'ai-dashboard'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'React' from public.projects where slug = 'markdown-editor'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'TypeScript' from public.projects where slug = 'markdown-editor'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'React' from public.projects where slug = 'task-manager'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'Zustand' from public.projects where slug = 'task-manager'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'Tailwind' from public.projects where slug = 'task-manager'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'React' from public.projects where slug = 'component-lab'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'TypeScript' from public.projects where slug = 'component-lab'
on conflict do nothing;

insert into public.project_tags (project_id, tag)
select id, 'Storybook' from public.projects where slug = 'component-lab'
on conflict do nothing;
