import type { PromoData, PromoDay, PromoDayKey } from '#shared/types/promo'

export const PROMO_SLUG_TO_DAY: Record<string, PromoDayKey> = {
  ponedilok: 'mon', vivtorok: 'tue', sereda: 'wed', chetver: 'thu',
  piatnytsia: 'fri', subota: 'sat', nedilia: 'sun',
}

/** Акцентні кольори днів (спека, розділ 1; контраст білого тексту ≥ 4.5:1) */
export const PROMO_COLORS: Record<PromoDayKey, { base: string, dark: string, tint: string, border: string }> = {
  mon: { base: '#0F6E72', dark: '#0C5659', tint: '#E2EEEE', border: '#ABCCCE' },
  tue: { base: '#6B2FBF', dark: '#532595', tint: '#EDE6F7', border: '#CBB6E9' },
  wed: { base: '#1D4ED8', dark: '#173DA8', tint: '#E4EAFA', border: '#B0C1F1' },
  thu: { base: '#196B1F', dark: '#145318', tint: '#E3EDE4', border: '#AECBB1' },
  fri: { base: '#C24E0B', dark: '#973D09', tint: '#F8EAE2', border: '#EAC1AA' },
  sat: { base: '#C62424', dark: '#9A1C1C', tint: '#F8E5E5', border: '#EBB2B2' },
  sun: { base: '#A3175A', dark: '#7F1246', tint: '#F4E3EB', border: '#DFAEC5' },
}

/** Знахідний відмінок для «Ця акція діє щоп'ятниці» */
export const PROMO_EVERY: Record<PromoDayKey, string> = {
  mon: 'щопонеділка', tue: 'щовівторка', wed: 'щосереди', thu: 'щочетверга',
  fri: 'щоп\'ятниці', sat: 'щосуботи', sun: 'щонеділі',
}

// Europe/Kiev, а не Europe/Kyiv: стара назва є в усіх версіях ICU (і в Node, і в браузерах)
const KYIV = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Kiev', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
})
const WEEKDAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

/** День тижня (1–7), "HH:MM" і секунди від півночі за київським часом */
export function kyivNow(date = new Date()): { weekday: number, time: string, seconds: number } {
  const parts = Object.fromEntries(KYIV.formatToParts(date).map(p => [p.type, p.value]))
  const h = Number(parts.hour), m = Number(parts.minute), s = Number(parts.second)
  return {
    weekday: WEEKDAYS[parts.weekday as string] ?? 1,
    time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    seconds: h * 3600 + m * 60 + s,
  }
}

export function toSeconds(hhmm: string): number {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  return h * 3600 + m * 60
}

export function isWithinHours(day: PromoDay, now = kyivNow()): boolean {
  return now.time >= day.activeFrom && now.time < day.activeTo
}

/** Акція, що діє саме зараз (як PromoDays::current() на бекенді) */
export function currentPromoDay(data: PromoData | null | undefined, now = kyivNow()): PromoDay | null {
  if (!data?.enabled) return null
  const day = data.days.find(d => d.weekday === now.weekday && d.isActive)
  return day && isWithinHours(day, now) ? day : null
}

export function promoPrice(price: number, day: PromoDay): number {
  return day.offerType === 'percent' && day.discountPercent ? Math.round(price * (100 - day.discountPercent) / 100) : price
}
