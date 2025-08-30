"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts"

type Sample = {
  t: number // seconds since start
  keystrokes: number
  typingRate: number // keys/sec
  avgKeyInterval: number // ms
  mouseSpeed: number // px/sec
  clicks: number
  idleRatio: number // fraction of second without events
  score: number // anomaly score
}

export function BehaviorTracker({
  onAnomaly,
}: {
  onAnomaly?: (s: Sample) => void
}) {
  const [samples, setSamples] = useState<Sample[]>([])
  const startedAt = useRef<number>(Date.now())
  const current = useRef({
    keystrokes: 0,
    keyIntervals: [] as number[],
    lastKeyAt: 0,
    mouseDist: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    hasMouse: false,
    clicks: 0,
    activeMs: 0,
  })

  useEffect(() => {
    const onKey = () => {
      const n = Date.now()
      if (current.current.lastKeyAt !== 0) {
        current.current.keyIntervals.push(n - current.current.lastKeyAt)
      }
      current.current.lastKeyAt = n
      current.current.keystrokes += 1
      current.current.activeMs += 5
    }
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e
      if (!current.current.hasMouse) {
        current.current.hasMouse = true
        current.current.lastMouseX = x
        current.current.lastMouseY = y
        return
      }
      const dx = x - current.current.lastMouseX
      const dy = y - current.current.lastMouseY
      current.current.mouseDist += Math.hypot(dx, dy)
      current.current.lastMouseX = x
      current.current.lastMouseY = y
      current.current.activeMs += 8
    }
    const onClick = () => {
      current.current.clicks += 1
      current.current.activeMs += 20
    }

    window.addEventListener("keydown", onKey)
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("click", onClick)

    const iv = setInterval(() => {
      const now = Date.now()
      const tSec = Math.round((now - startedAt.current) / 1000)
      const keystrokes = current.current.keystrokes
      const typingRate = keystrokes
      const avgKeyInterval = current.current.keyIntervals.length
        ? current.current.keyIntervals.reduce((a, b) => a + b, 0) / current.current.keyIntervals.length
        : 0
      const mouseSpeed = current.current.mouseDist
      const clicks = current.current.clicks
      const idleRatio = Math.max(0, 1 - Math.min(current.current.activeMs, 1000) / 1000)

      const next: Sample = {
        t: tSec,
        keystrokes,
        typingRate,
        avgKeyInterval,
        mouseSpeed,
        clicks,
        idleRatio,
        score: 0,
      }

      setSamples((prev) => {
        const updated = [...prev, next].slice(-60)
        const base = updated.slice(0, Math.min(updated.length, 10))
        const mean = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
        const mTyping = mean(base.map((s) => s.typingRate))
        const mMouse = mean(base.map((s) => s.mouseSpeed))
        const mClicks = mean(base.map((s) => s.clicks))
        const mIdle = mean(base.map((s) => s.idleRatio))
        const clamp = (v: number, min = 0, max = 10) => Math.max(min, Math.min(max, v))

        const latest = updated[updated.length - 1]
        const delTyping = Math.abs(latest.typingRate - mTyping)
        const delMouse = Math.abs(latest.mouseSpeed - mMouse)
        const delClicks = Math.abs(latest.clicks - mClicks)
        const delIdle = Math.abs(latest.idleRatio - mIdle)

        const nTyping = clamp(delTyping / (mTyping + 1))
        const nMouse = clamp(delMouse / (mMouse + 50))
        const nClicks = clamp(delClicks / (mClicks + 1))
        const nIdle = clamp(delIdle / 0.5)

        const score = Number((nTyping * 0.35 + nMouse * 0.35 + nClicks * 0.15 + nIdle * 0.15).toFixed(2))
        latest.score = score

        if (score >= 2.2 && onAnomaly) onAnomaly(latest)

        return [...updated.slice(0, -1), latest]
      })

      // reset counters for the next second
      current.current.keystrokes = 0
      current.current.keyIntervals = []
      current.current.mouseDist = 0
      current.current.clicks = 0
      current.current.activeMs = 0
    }, 1000)

    return () => {
      clearInterval(iv)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("click", onClick)
    }
  }, [onAnomaly])

  const trust = useMemo(() => {
    if (samples.length === 0) return 100
    const s = samples[samples.length - 1].score
    const t = Math.round(100 - Math.min(60, s * 12))
    return t
  }, [samples])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border p-4">
          <div className="text-sm text-muted-foreground">Session Trust</div>
          <div className="mt-1 text-3xl font-semibold">{trust}%</div>
          <div className="mt-1 text-xs text-muted-foreground">Adaptive to recent behavior</div>
        </div>
        <div className="rounded-md border p-4">
          <div className="text-sm text-muted-foreground">Typing rate</div>
          <div className="mt-1 text-2xl font-semibold">{samples.at(-1)?.typingRate ?? 0} keys/s</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Avg interval: {Math.round(samples.at(-1)?.avgKeyInterval ?? 0)} ms
          </div>
        </div>
        <div className="rounded-md border p-4">
          <div className="text-sm text-muted-foreground">Mouse speed</div>
          <div className="mt-1 text-2xl font-semibold">{Math.round(samples.at(-1)?.mouseSpeed ?? 0)} px/s</div>
          <div className="mt-1 text-xs text-muted-foreground">Clicks: {samples.at(-1)?.clicks ?? 0}</div>
        </div>
      </div>

      <div className="rounded-md border p-4">
        <div className="text-sm font-medium">Behavior Over Time</div>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={samples}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="typingRate"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  name="Typing (keys/s)"
                />
                <Line
                  type="monotone"
                  dataKey="mouseSpeed"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                  name="Mouse (px/s)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={samples}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="score" fill="#f59e0b" name="Anomaly score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
