type FeaturedTagsProps = {
  tags: string[]
}

export function FeaturedTags({ tags }: FeaturedTagsProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
