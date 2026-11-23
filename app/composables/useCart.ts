import type { MenuProduct, OrderLine } from '#shared/types/menu'

type CartState = Record<string, number>

export const CART_COOKIE_OPTS = { maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' as const, path: '/' }

// Кошик і минуле замовлення зберігаються в cookie (синхронізує plugins/cart-persist.ts),
// тож SSR одразу рендерить правильний стан — кількості на картках, суму в шапці.
export function useCartState() {
  return useState<CartState>('cart', () => useCookie<CartState>('ms_cart').value ?? {})
}

export function useLastOrder() {
  return useState<OrderLine[]>('last-order', () => useCookie<OrderLine[]>('ms_last_order').value ?? [])
}

export interface CartLine {
  product: MenuProduct
  /** скільки штук у кошику всього */
  qty: number
  /** з них платних (решта — подарунок «Акції дня», показується окремим рядком за 0 грн) */
  paidQty: number
  /** сума за платні штуки */
  sum: number
}

/** Рядок-подарунок «Акції дня» (0 грн): окремий товар закладу або безкоштовна штука з кошика */
export interface CartGiftLine {
  key: string
  productId: number | null
  name: string
  price: number
  qty: number
  /** фото, якщо картки немає в меню (прихована картка подарунка) */
  image?: string | null
}

export function useCart() {
  const cart = useCartState()
  const lastOrder = useLastOrder()
  const { productById, deliveryCost } = useMenu()
  const { public: { features } } = useRuntimeConfig()
  const track = useTrack()

  const promo = useState('promo', () => ({ input: '', code: '', error: '' }))
  const dayPromo = useDayPromo()

  /** безкоштовні штуки «Акції дня» (напр. «Роли 2+1»): товар => кількість */
  const freeQty = computed(() => {
    const q = dayPromo.quote.value
    return new Map((q.active && q.applied ? q.freeItems ?? [] : []).map(f => [f.productId, f.count]))
  })

  const lines = computed<CartLine[]>(() =>
    Object.entries(cart.value ?? {})
      .map(([id, qty]) => {
        const product = productById(Number(id))
        if (!product) return null
        const paidQty = Math.max(0, qty - (freeQty.value.get(product.id) ?? 0))
        return { product, qty, paidQty, sum: product.price * paidQty }
      })
      .filter((l): l is CartLine => !!l && l.qty > 0),
  )

  /** подарунки рядками по 0 грн: безкоштовні штуки з кошика + товари, які додасть заклад */
  const giftLines = computed<CartGiftLine[]>(() => [
    ...lines.value
      .filter(l => l.qty > l.paidQty)
      .map(l => ({ key: `free-${l.product.id}`, productId: l.product.id, name: l.product.name, price: l.product.price, qty: l.qty - l.paidQty })),
    ...dayPromo.giftLines.value,
  ])

  const count = computed(() => lines.value.reduce((s, l) => s + l.qty, 0))
  /** «Страви»: лише платні штуки (подарунки — окремими рядками по 0 грн) */
  const subtotal = computed(() => lines.value.reduce((s, l) => s + l.sum, 0))
  /** за повними цінами — для безкоштовної доставки, як рахує сервер */
  const fullSubtotal = computed(() => lines.value.reduce((s, l) => s + l.product.price * l.qty, 0))
  const discount = computed(() => (features.promo ? promoDiscount(promo.value.code, fullSubtotal.value) : 0))
  const delivery = computed(() => deliveryFee(deliveryCost.value, fullSubtotal.value))
  /** сума без доставки (доставку додає оформлення залежно від способу отримання) */
  const total = computed(() => Math.max(0, subtotal.value - discount.value))

  function qty(id: number): number {
    return cart.value?.[id] ?? 0
  }

  function setQty(id: number, q: number) {
    const delta = Math.max(q, 0) - qty(id)
    const product = productById(id)
    if (delta && product) track(delta > 0 ? 'add_to_cart' : 'remove_from_cart', { lines: [{ product, qty: Math.abs(delta) }] })
    const next = { ...cart.value }
    if (q <= 0) delete next[id]
    else next[id] = q
    cart.value = next
  }

  function add(id: number, n = 1) {
    setQty(id, qty(id) + n)
  }

  function clear() {
    cart.value = {}
    promo.value = { input: '', code: '', error: '' }
    dayPromo.gift.value = null
  }

  const lastOrderLines = computed(() =>
    (lastOrder.value ?? [])
      .map(l => ({ product: productById(l.id), qty: l.quantity }))
      .filter((l): l is { product: MenuProduct, qty: number } => !!l.product),
  )

  function reorder() {
    const next = { ...cart.value }
    for (const l of lastOrderLines.value) next[l.product.id] = (next[l.product.id] ?? 0) + l.qty
    cart.value = next
    if (lastOrderLines.value.length) track('add_to_cart', { lines: lastOrderLines.value, params: { source: 'reorder' } })
  }

  function applyPromo() {
    const code = normalizePromoCode(promo.value.input)
    promo.value = isValidPromoCode(code)
      ? { input: code, code, error: '' }
      : { input: promo.value.input, code: '', error: 'Такого коду не знайдено' }
  }

  return {
    lines,
    count,
    subtotal,
    fullSubtotal,
    giftLines,
    discount,
    delivery,
    total,
    isEmpty: computed(() => count.value === 0),
    qty,
    setQty,
    add,
    clear,
    promo,
    applyPromo,
    /** «Акція дня» за правилами Poster: quote, обраний подарунок, знижка поза цінами меню */
    dayPromo,
    lastOrder,
    lastOrderLines,
    lastOrderTotal: computed(() => lastOrderLines.value.reduce((s, l) => s + l.product.price * l.qty, 0)),
    reorder,
  }
}
