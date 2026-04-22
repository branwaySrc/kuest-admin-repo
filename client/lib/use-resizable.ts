'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface ResizableOptions {
  initialSize: number
  direction: 'horizontal' | 'vertical'
  minSize?: number
  maxSize?: number
  totalSize?: number
  onResizeEnd?: (size: number) => void
}

export function useResizable({
  initialSize,
  direction,
  minSize = 0,
  maxSize = 1000,
  totalSize,
  onResizeEnd,
}: ResizableOptions) {
  const [size, setSize] = useState(initialSize)
  const [isResizing, setIsResizing] = useState(false)

  const startPos = useRef(0)
  const startSize = useRef(0)
  const rafRef = useRef<number | null>(null)

  const startResizing = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault()
      setIsResizing(true)

      const currentCoord =
        direction === 'vertical'
          ? 'touches' in event
            ? event.touches[0].clientY
            : event.clientY
          : 'touches' in event
            ? event.touches[0].clientX
            : event.clientX

      startPos.current = currentCoord
      startSize.current = size
    },
    [direction, size],
  )

  const stopResizing = useCallback(() => {
    if (isResizing) {
      setIsResizing(false)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      onResizeEnd?.(size)
    }
  }, [isResizing, onResizeEnd, size])

  const onMouseMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isResizing) return
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null

        const currentPos =
          direction === 'vertical'
            ? 'touches' in event
              ? event.touches[0].clientY
              : event.clientY
            : 'touches' in event
              ? event.touches[0].clientX
              : event.clientX

        const deltaPx = startPos.current - currentPos

        // totalSize가 있다면 픽셀 변화량을 퍼센트로 환산
        const delta = totalSize ? (deltaPx / totalSize) * 100 : deltaPx

        const newSize = startSize.current + delta
        const clampedSize = Math.min(Math.max(newSize, minSize), maxSize)

        setSize(clampedSize)
      })
    },
    [isResizing, direction, minSize, maxSize, totalSize],
  )

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', stopResizing)
      window.addEventListener('touchmove', onMouseMove)
      window.addEventListener('touchend', stopResizing)
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', stopResizing)
      window.removeEventListener('touchmove', onMouseMove)
      window.removeEventListener('touchend', stopResizing)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isResizing, onMouseMove, stopResizing])

  return { size, setSize, isResizing, startResizing }
}
