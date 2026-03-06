import type { Project } from '../data/projects'

type ProjectCardProps = {
  project: Project
  demoLabel?: string
}

export function ProjectCard({
  project,
  demoLabel = 'Live Demo',
}: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/70">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900">{project.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={`${project.id}-${item}`}
              className="rounded-full border border-slate-200 bg-slate-100/70 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
        >
          {demoLabel}
        </a>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900"
        >
          GitHub
        </a>
      </div>
    </article>
  )
}
