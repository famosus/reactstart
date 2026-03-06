import type { ReactNode } from 'react'

type SectionProps = {
  id?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
  children?: ReactNode
}

export function Section({
  id,
  title,
  description,
  centered = false,
  className = '',
  children,
}: SectionProps) {
  const alignment = centered ? 'text-center' : 'text-left'
  const headerWidth = centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'

  return (
    <section id={id} className={`space-y-7 ${alignment} ${className}`.trim()}>
      <header className={headerWidth}>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  )
}
