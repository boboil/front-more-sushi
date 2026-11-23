import type { OrderLine } from '#shared/types/menu'
import type { PromoQuote } from '#shared/types/promo'

// Що дасть «Акція дня» кошику: знижка, подарунок, підказка (рахує бекенд за акцією Poster)
export default defineEventHandler(async (event): Promise<PromoQuote> => {
  const body = await readBody<{ lines?: OrderLine[], gift?: number | null }>(event)
  return fetchPromoQuote(Array.isArray(body?.lines) ? body.lines : [], body?.gift ?? null)
})
