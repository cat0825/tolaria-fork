import { useLayoutEffect, useMemo, useState, type CSSProperties, type RefObject } from 'react'

export const CONTEXT_MENU_VIEWPORT_PADDING = 8

export interface ContextMenuPoint {
  x: number
  y: number
}

export interface ContextMenuSize {
  width: number
  height: number
}

export interface ContextMenuViewport {
  width: number
  height: number
}

export interface ContextMenuPosition {
  left: number
  top: number
}

interface MeasuredMenuSize {
  key: string
  size: ContextMenuSize
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function viewportSize(): ContextMenuViewport {
  if (typeof window === 'undefined') {
    return { width: Number.POSITIVE_INFINITY, height: Number.POSITIVE_INFINITY }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function pointKey(point: ContextMenuPoint | null, minWidth: number): string {
  if (!point) return ''
  return `${point.x}:${point.y}:${minWidth}`
}

export function positionContextMenu(
  point: ContextMenuPoint,
  menuSize: ContextMenuSize,
  viewport: ContextMenuViewport,
  padding = CONTEXT_MENU_VIEWPORT_PADDING,
): ContextMenuPosition {
  const maxLeft = Math.max(padding, viewport.width - menuSize.width - padding)
  const left = clamp(point.x, padding, maxLeft)
  const preferredTop = point.y + menuSize.height + padding > viewport.height
    ? point.y - menuSize.height
    : point.y
  const maxTop = Math.max(padding, viewport.height - menuSize.height - padding)
  const top = clamp(preferredTop, padding, maxTop)

  return { left, top }
}

export function useViewportContextMenuStyle(
  menuRef: RefObject<HTMLDivElement | null>,
  point: ContextMenuPoint | null,
  minWidth: number,
): CSSProperties {
  const key = pointKey(point, minWidth)
  const [measuredSize, setMeasuredSize] = useState<MeasuredMenuSize | null>(null)
  const size = useMemo(
    () => measuredSize?.key === key ? measuredSize.size : { width: minWidth, height: 0 },
    [key, measuredSize, minWidth],
  )

  useLayoutEffect(() => {
    if (!point) return

    const frame = window.requestAnimationFrame(() => {
      const rect = menuRef.current?.getBoundingClientRect()
      if (!rect) return

      const nextSize = {
        width: Math.max(minWidth, rect.width),
        height: rect.height,
      }
      setMeasuredSize((current) => {
        if (
          current?.key === key &&
          current.size.width === nextSize.width &&
          current.size.height === nextSize.height
        ) {
          return current
        }

        return { key, size: nextSize }
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [key, menuRef, minWidth, point])

  return useMemo(() => {
    if (!point) return {}

    const position = positionContextMenu(point, size, viewportSize())
    return {
      left: position.left,
      top: position.top,
      minWidth,
      maxHeight: `calc(100vh - ${CONTEXT_MENU_VIEWPORT_PADDING * 2}px)`,
      overflowY: 'auto',
    }
  }, [minWidth, point, size])
}
