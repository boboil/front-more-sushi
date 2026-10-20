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
  qty: number
  sum: number
}

export function useCart() {
  const cart = useCartState()
  const lastOrder = useLastOrder()
  const { productById, deliveryCost } = useMenu()
  const { public: { features } } = useRuntimeConfig()
  const track = useTrack()

  const promo = useState('promo', () => ({ input: '', code: '', error: '' }))

  const lines = computed<CartLine[]>(() =>
    Object.entries(cart.value ?? {})
      .map(([id, qty]) => {
        const product = productById(Number(id))
        return product ? { product, qty, sum: product.price * qty } : null
      })
      .filter((l): l is CartLine => !!l && l.qty > 0),
  )

  const count = computed(() => lines.value.reduce((s, l) => s + l.qty, 0))
  const subtotal = computed(() => lines.value.reduce((s, l) => s + l.sum, 0))
  const discount = computed(() => (features.promo ? promoDiscount(promo.value.code, subtotal.value) : 0))
  const delivery = computed(() => deliveryFee(deliveryCost.value, subtotal.value))
  /** сума без доставки (доставку додає оформлення залежно від способу отримання) */
  const total = computed(() => subtotal.value - discount.value)

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
    lastOrder,
    lastOrderLines,
    lastOrderTotal: computed(() => lastOrderLines.value.reduce((s, l) => s + l.product.price * l.qty, 0)),
    reorder,
  }
}
