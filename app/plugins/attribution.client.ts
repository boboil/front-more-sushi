// Записує UTM-мітки / реферер один раз на завантаження сторінки (див. utils/attribution.ts)
export default defineNuxtPlugin(() => {
  captureAttribution()
})
