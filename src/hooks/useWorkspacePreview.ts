import { useEffect, useRef, useState, type RefObject } from 'react'

type UseWorkspacePreviewResult = {
  previewRef: RefObject<HTMLDivElement | null>
  typedText: string
  visibleStatuses: number
}

export function useWorkspacePreview(
  command: string,
  statusCount: number,
): UseWorkspacePreviewResult {
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [visibleStatuses, setVisibleStatuses] = useState(0)

  useEffect(() => {
    const element = previewRef.current

    if (!element || hasStarted) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) {
      return
    }

    let commandTimer: number | undefined
    const statusTimers: number[] = []

    if (typedText.length < command.length) {
      commandTimer = window.setTimeout(() => {
        setTypedText(command.slice(0, typedText.length + 1))
      }, 85)
    } else {
      Array.from({ length: statusCount }).forEach((_, index) => {
        const timer = window.setTimeout(() => {
          setVisibleStatuses(index + 1)
        }, 260 + index * 340)

        statusTimers.push(timer)
      })
    }

    return () => {
      if (commandTimer) {
        window.clearTimeout(commandTimer)
      }

      statusTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [command, hasStarted, statusCount, typedText])

  return {
    previewRef,
    typedText,
    visibleStatuses,
  }
}
