import type { TrackData, TrackEvent } from '~/plugins/analytics.client'

/** Подія аналітики (GA4 + пікселі); на сервері нічого не робить */
export function useTrack() {
  const nuxtApp = useNuxtApp()
  return (event: TrackEvent, data?: TrackData) => {
    if (import.meta.client) nuxtApp.$track?.(event, data)
  }
}
