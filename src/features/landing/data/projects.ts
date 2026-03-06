import type { Project } from '@/features/landing/types'

export const featuredTags = [
  'Open Source',
  'AI',
  'Productivity',
  'UI',
  'Developer Tools',
]

export const featuredProjects: Project[] = [
  {
    id: 'ai-dashboard',
    title: 'AI Dashboard',
    description: 'A simple AI-powered dashboard UI.',
    stack: ['React', 'Vite', 'Tailwind'],
    demoUrl: 'https://example.com/ai-dashboard',
    githubUrl: 'https://github.com/example/ai-dashboard',
  },
  {
    id: 'markdown-editor',
    title: 'Markdown Editor',
    description: 'Minimal markdown editor built with React.',
    stack: ['React', 'TypeScript'],
    demoUrl: 'https://example.com/markdown-editor',
    githubUrl: 'https://github.com/example/markdown-editor',
  },
  {
    id: 'task-manager',
    title: 'Task Manager',
    description: 'Lightweight productivity app.',
    stack: ['React', 'Zustand', 'Tailwind'],
    demoUrl: 'https://example.com/task-manager',
    githubUrl: 'https://github.com/example/task-manager',
  },
  {
    id: 'component-lab',
    title: 'Component Lab',
    description: 'A focused space for testing reusable React UI patterns.',
    stack: ['React', 'TypeScript', 'Storybook'],
    demoUrl: 'https://example.com/component-lab',
    githubUrl: 'https://github.com/example/component-lab',
  },
]

export const browseProjects: Project[] = [
  ...featuredProjects,
  {
    id: 'finance-tracker',
    title: 'Finance Tracker',
    description: 'A personal finance tracker with clean visual summaries.',
    stack: ['React', 'Recharts', 'Vite'],
    demoUrl: 'https://example.com/finance-tracker',
    githubUrl: 'https://github.com/example/finance-tracker',
  },
  {
    id: 'habit-board',
    title: 'Habit Board',
    description: 'Simple daily habit planning with streak tracking.',
    stack: ['React', 'TypeScript', 'Tailwind'],
    demoUrl: 'https://example.com/habit-board',
    githubUrl: 'https://github.com/example/habit-board',
  },
  {
    id: 'docs-viewer',
    title: 'Docs Viewer',
    description: 'A lightweight interface for browsing technical docs.',
    stack: ['React', 'MDX', 'Vite'],
    demoUrl: 'https://example.com/docs-viewer',
    githubUrl: 'https://github.com/example/docs-viewer',
  },
  {
    id: 'kanban-lite',
    title: 'Kanban Lite',
    description: 'Drag-and-drop task workflow in a minimal board layout.',
    stack: ['React', 'DnD Kit', 'Tailwind'],
    demoUrl: 'https://example.com/kanban-lite',
    githubUrl: 'https://github.com/example/kanban-lite',
  },
]
