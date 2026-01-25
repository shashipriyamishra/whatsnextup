/**
 * Analytics & Performance Monitoring
 * Tracks Web Vitals and user interactions
 */

import { logger } from "./logger"

type Metric = {
  name: string
  value: number
  rating?: "good" | "needs-improvement" | "poor"
  delta?: number
  id?: string
}

/**
 * Report Web Vitals to analytics service
 * Tracks: LCP, FID, CLS, FCP, TTFB
 */
export function reportWebVitals(metric: Metric) {
  // Log in development
  if (process.env.NODE_ENV === "development") {
    logger.performance(metric.name, metric.value, "ms")
  }

  // Send to analytics service in production
  if (process.env.NODE_ENV === "production") {
    // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
    // Example: gtag('event', metric.name, { value: metric.value })

    // For now, send to our logger
    logger.info("Web Vital", {
      metric: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
    })
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  logger.info("Page View", { url })

  // TODO: Send to analytics service
  // Example: gtag('config', GA_ID, { page_path: url })
}

/**
 * Track user event
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number,
) {
  logger.userAction(`${category}.${action}`, { label, value })

  // TODO: Send to analytics service
  // Example: gtag('event', action, { event_category: category, event_label: label, value })
}

/**
 * Track error
 */
export function trackError(error: Error, context?: string) {
  logger.error(`Error: ${context || "Unknown"}`, error)

  // TODO: Send to error tracking service (Sentry, etc.)
  // Example: Sentry.captureException(error, { contexts: { context } })
}

/**
 * Track custom metric
 */
export function trackMetric(name: string, value: number) {
  logger.performance(name, value)

  // TODO: Send to analytics service
}
