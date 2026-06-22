import { useSyncExternalStore } from 'react'

export function useTimeZone() {
  const store = {
    getSnapshot: () => document.documentElement.lang || 'en-US',
    subscribe: (cb: () => void) => {
      const observer = new MutationObserver(cb)
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
      return () => observer.disconnect()
    },
  }
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => 'en-US')
}
