/**
 * Helper function to track an event on the website.
 * 
 * @param eventName which event is being logged
 * @param params list of attributes of click
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  // guard: only run if GA is available
  // @ts-ignore
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    // @ts-ignore
    window.gtag('event', eventName, params || {});
  }
}