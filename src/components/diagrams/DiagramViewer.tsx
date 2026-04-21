'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

// ── Constants ───────────────────────────────────────────────────
const CANVAS_W = 900
const CANVAS_H = 874
const MIN_SCALE = 0.15
const MAX_SCALE = 3.0
const ZOOM_STEP = 0.15

// ── Types ───────────────────────────────────────────────────────
interface DiagramViewerProps {
  children: React.ReactNode
  description: string
  title?: string
}

interface TransformState {
  scale: number
  tx: number
  ty: number
}

interface DragState {
  active: boolean
  startX: number
  startY: number
  txAtStart: number
  tyAtStart: number
}

// ── Shared viewer logic extracted into a hook ────────────────────
function useViewer(isFullscreen: boolean) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const wrapRef     = useRef<HTMLDivElement>(null)

  const transform = useRef<TransformState>({ scale: 1, tx: 0, ty: 0 })
  const drag      = useRef<DragState>({ active: false, startX: 0, startY: 0, txAtStart: 0, tyAtStart: 0 })

  const [zoomPercent, setZoomPercent]       = useState(100)
  const [viewportHeight, setViewportHeight] = useState(500)
  const [showHint, setShowHint]             = useState(true)

  const applyTransform = useCallback((newScale: number, newTx: number, newTy: number) => {
    const viewport = viewportRef.current
    const wrap     = wrapRef.current
    if (!viewport || !wrap) return

    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))

    const vw      = viewport.clientWidth
    const vh      = viewport.clientHeight
    const scaledW = CANVAS_W * newScale
    const scaledH = CANVAS_H * newScale

    newTx = Math.max(Math.min(0, vw - scaledW), Math.min(0, newTx))
    newTy = Math.max(Math.min(0, vh - scaledH), Math.min(0, newTy))

    transform.current = { scale: newScale, tx: newTx, ty: newTy }
    wrap.style.transform = `translate(${newTx}px, ${newTy}px) scale(${newScale})`
    setZoomPercent(Math.round(newScale * 100))
  }, [])

  const fitScale = useCallback((): number => {
    const vw = viewportRef.current?.clientWidth ?? CANVAS_W
    // In fullscreen the container height is fixed by the viewport, so also
    // constrain by height. In inline mode the height is *derived from* the
    // scale, so constraining by height would create a circular dependency.
    if (isFullscreen) {
      const vh = viewportRef.current?.clientHeight ?? CANVAS_H
      return Math.min(1, vw / CANVAS_W, vh / CANVAS_H)
    }
    return Math.min(1, vw / CANVAS_W)
  }, [isFullscreen])

  const resetToFit = useCallback(() => {
    applyTransform(fitScale(), 0, 0)
  }, [applyTransform, fitScale])

  useEffect(() => {
    const update = () => {
      const s = fitScale()
      if (!isFullscreen) setViewportHeight(Math.round(CANVAS_H * s))
    }

    const observer = new ResizeObserver(() => {
      update()
      resetToFit()
    })

    update()
    resetToFit()

    if (viewportRef.current) observer.observe(viewportRef.current)
    return () => observer.disconnect()
  }, [fitScale, resetToFit, isFullscreen])

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 2800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect  = el.getBoundingClientRect()
      const mx    = e.clientX - rect.left
      const my    = e.clientY - rect.top
      const { scale, tx, ty } = transform.current
      const delta    = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta))
      const factor   = newScale / scale
      applyTransform(newScale, mx - factor * (mx - tx), my - factor * (my - ty))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [applyTransform])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      txAtStart: transform.current.tx,
      tyAtStart: transform.current.ty,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    const { startX, startY, txAtStart, tyAtStart } = drag.current
    applyTransform(
      transform.current.scale,
      txAtStart + e.clientX - startX,
      tyAtStart + e.clientY - startY,
    )
  }

  const onPointerUp = () => { drag.current.active = false }

  const zoomIn = () => {
    const { scale, tx, ty } = transform.current
    const vw = viewportRef.current?.clientWidth  ?? 0
    const vh = viewportRef.current?.clientHeight ?? 0
    applyTransform(scale + ZOOM_STEP, tx - (vw * ZOOM_STEP) / 2, ty - (vh * ZOOM_STEP) / 2)
  }

  const zoomOut = () => {
    const { scale, tx, ty } = transform.current
    const vw = viewportRef.current?.clientWidth  ?? 0
    const vh = viewportRef.current?.clientHeight ?? 0
    applyTransform(scale - ZOOM_STEP, tx + (vw * ZOOM_STEP) / 2, ty + (vh * ZOOM_STEP) / 2)
  }

  return {
    viewportRef, wrapRef,
    zoomPercent, viewportHeight, showHint,
    onPointerDown, onPointerMove, onPointerUp,
    zoomIn, zoomOut, resetToFit,
    isDragging: drag.current.active,
  }
}

// ── Inner viewer (shared between inline and fullscreen) ──────────
function ViewerPane({
  children,
  height,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleFullscreen,
  isFullscreen,
  zoomPercent,
  showHint,
  viewportRef,
  wrapRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  children: React.ReactNode
  height: string | number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  zoomPercent: number
  showHint: boolean
  viewportRef: React.RefObject<HTMLDivElement | null>
  wrapRef: React.RefObject<HTMLDivElement | null>
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: () => void
}) {
  return (
    <div
      ref={viewportRef}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: isFullscreen ? 0 : 12,
        overflow: 'hidden',
        cursor: 'grab',
        background: '#f5f5f5',
        boxShadow: isFullscreen ? 'none' : '0 8px 40px rgba(0,0,0,0.14)',
        userSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Diagram canvas */}
      <div
        ref={wrapRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: CANVAS_W,
          height: CANVAS_H,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {children}
      </div>

      {/* Controls: +/−/⊙/fullscreen */}
      <div
        style={{
          position: 'absolute', bottom: 14, right: 14,
          display: 'flex', gap: 6, zIndex: 100,
        }}
      >
        {([
          { label: '+',  title: 'Zoom in',    onClick: onZoomIn  },
          { label: '−',  title: 'Zoom out',   onClick: onZoomOut },
          { label: '⊙',  title: 'Reset zoom', onClick: onReset },
        ] as const).map((btn) => (
          <button
            key={btn.label}
            title={btn.title}
            onClick={(e) => { e.stopPropagation(); btn.onClick() }}
            onPointerDown={(e) => e.stopPropagation()}
            style={controlButtonStyle(btn.label === '⊙' ? 13 : 16)}
          >
            {btn.label}
          </button>
        ))}

        <button
          title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Expand to fullscreen'}
          onClick={(e) => { e.stopPropagation(); onToggleFullscreen() }}
          onPointerDown={(e) => e.stopPropagation()}
          style={controlButtonStyle(13)}
        >
          {isFullscreen ? '✕' : '⛶'}
        </button>
      </div>

      {/* Zoom % indicator */}
      <div style={zoomLabelStyle}>
        {zoomPercent}%
      </div>

      {/* Hint toast */}
      {showHint && (
        <div style={hintStyle}>
          Scroll to zoom · Drag to pan
        </div>
      )}
    </div>
  )
}

// ── Component ───────────────────────────────────────────────────
export function DiagramViewer({ children, description, title }: DiagramViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const inline     = useViewer(false)
  const fullscreen = useViewer(true)

  // Close on Escape
  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isFullscreen])

  // Prevent body scroll when fullscreen overlay is open
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  const sharedProps = (v: ReturnType<typeof useViewer>, fs: boolean) => ({
    onZoomIn: v.zoomIn,
    onZoomOut: v.zoomOut,
    onReset: v.resetToFit,
    onToggleFullscreen: () => setIsFullscreen((x) => !x),
    isFullscreen: fs,
    zoomPercent: v.zoomPercent,
    showHint: v.showHint,
    viewportRef: v.viewportRef,
    wrapRef: v.wrapRef,
    onPointerDown: v.onPointerDown,
    onPointerMove: v.onPointerMove,
    onPointerUp: v.onPointerUp,
  })

  return (
    <>
      {/* Inline figure */}
      <figure style={{ margin: '1.5rem 0' }} aria-label={title ?? 'Flow diagram'}>
        <figcaption className="sr-only">{description}</figcaption>

        {/* Expand prompt — visible only when not fullscreen */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          marginBottom: 6, gap: 6,
        }}>
          <button
            onClick={() => setIsFullscreen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 500, color: '#2563eb',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '2px 0', fontFamily: 'Inter, sans-serif',
            }}
          >
            <span style={{ fontSize: 14 }}>⛶</span>
            Expand diagram
          </button>
        </div>

        <ViewerPane {...sharedProps(inline, false)} height={inline.viewportHeight}>
          {children}
        </ViewerPane>
      </figure>

      {/* Fullscreen overlay — rendered in a portal so it escapes prose/layout clipping */}
      {isFullscreen && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title ?? 'Flow diagram'}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setIsFullscreen(false)}
        >
          <div
            style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <ViewerPane {...sharedProps(fullscreen, true)} height="100%">
              {children}
            </ViewerPane>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

// ── Style helpers ────────────────────────────────────────────────
function controlButtonStyle(fontSize: number): React.CSSProperties {
  return {
    width: 32, height: 32,
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
    fontSize,
    color: '#374151',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
  }
}

const zoomLabelStyle: React.CSSProperties = {
  position: 'absolute', bottom: 14, left: 14,
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid #e2e8f0',
  borderRadius: 5,
  padding: '4px 10px',
  fontSize: 11, fontWeight: 600, color: '#64748b',
  fontFamily: 'Inter, sans-serif',
  zIndex: 100,
  pointerEvents: 'none',
}

const hintStyle: React.CSSProperties = {
  position: 'absolute', top: 12, left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  fontSize: 11, fontWeight: 500,
  padding: '5px 12px',
  borderRadius: 99,
  whiteSpace: 'nowrap',
  zIndex: 100,
  pointerEvents: 'none',
  fontFamily: 'Inter, sans-serif',
}
