import type { PromoQuote } from '#shared/types/promo'

/** «Акція дня» для поточного кошика (оновлює plugins/day-promo.client.ts) і обраний подарунок */
export function useDayPromo() {
  const quote = useState<PromoQuote>('day-promo-quote', () => ({ active: false }))
  const gift = useState<number | null>('day-promo-gift', () => null)
  const loading = useState('day-promo-loading', () => false)

  /** знижка акції, якої ще немає в цінах меню */
  const extraDiscount = computed(() => (quote.value.active && quote.value.applied ? quote.value.extraDiscount ?? 0 : 0))

  /** подарунки рядками кошика (по 0 грн): товари сайту, а без картки — назва з Poster */
  const giftLines = computed(() => {
    if (!quote.value.active || !quote.value.applied) return []
    return (quote.value.gifts ?? []).flatMap(g => g.items?.length
      ? g.items.map(i => ({ key: `${g.posterId}-${i.productId}`, productId: i.productId as number | null, name: i.name, price: i.price, qty: g.count, image: i.image ?? null }))
      : [{ key: String(g.posterId), productId: g.productId, name: g.name, price: g.price, qty: g.count, image: null }])
  })

  return { quote, gift, loading, extraDiscount, giftLines }
}
