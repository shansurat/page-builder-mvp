'use client'

import { useEffect, useRef } from 'react'

interface AnalyticsTrackerProps {
  pageId: string
}

export default function AnalyticsTracker({ pageId }: AnalyticsTrackerProps) {
  const startTime = useRef<number>(Date.now())
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    const getDeviceType = (): string => {
      const width = window.innerWidth
      if (width < 768) return 'mobile'
      if (width < 1024) return 'tablet'
      return 'desktop'
    }

    const trackView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId,
            deviceType: getDeviceType(),
          }),
        })
      } catch (error) {
        console.error('Error tracking page view:', error)
      }
    }

    trackView()

    const handleBeforeUnload = async () => {
      const duration = Math.floor((Date.now() - startTime.current) / 1000)
      const bounced = duration < 5

      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId,
            deviceType: getDeviceType(),
            duration,
            bounced,
          }),
        })
      } catch (error) {
        console.error('Error tracking analytics on exit:', error)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pageId])

  return null
}
