import type { Menu, OrderRequest, OrderResponse } from '#shared/types/menu'

// Значення 1-в-1 зі старого фронту (front-more-sushi CheckoutComponent) — їх бачить оператор у Poster
const PAYMENT: Record<OrderRequest['payment'], string> = {
  cash: 'готівка',
  terminal: 'термінал',
}

// ключі помилок валідації бекенду → поля форми
const ERROR_FIELDS: Record<string, string> = { 'street': 'address', 'time.day': 'date', 'time.time': 'time' }

function sticksCount(v: unknown, fallback: number): number {
  const n = Math.floor(Number(v))
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), 20) : fallback
}

// значення, які очікує бекенд (див. more-sushi OrderController::addOrder)
const DELIVERY = { delivery: 'курʼєр', pickup: 'самовивiз' } as const

export default defineEventHandler(async (event): Promise<OrderResponse> => {
  const body = await readBody<OrderRequest>(event)

  if (!body?.lines?.length) {
    throw createError({ statusCode: 422, data: { errors: { lines: 'Кошик порожній' } } })
  }

  // Ціни рахуємо на сервері з актуального меню, а не довіряємо клієнту
  const menu = await $fetch<Menu>('/api/menu')
  const byId = new Map(menu.products.map(p => [p.id, p]))
  const products = body.lines
    .map(l => ({ product: byId.get(l.id), quantity: Math.max(0, Math.floor(l.quantity)) }))
    .filter((l): l is { product: NonNullable<typeof l.product>, quantity: number } => !!l.product && l.quantity > 0)

  if (!products.length) {
    throw createError({ statusCode: 422, data: { errors: { lines: 'Товари з кошика більше недоступні' } } })
  }

  const { public: { features } } = useRuntimeConfig(event)
  const subtotal = products.reduce((s, l) => s + l.product.price * l.quantity, 0)
  const isDelivery = body.mode === 'delivery'
  const discount = features.promo ? promoDiscount(body.promoCode, subtotal) : 0
  const afterDiscount = subtotal - discount
  const bonus = features.bonus && body.useBonus ? Math.min(DEMO_BONUS_BALANCE, afterDiscount) : 0
  const total = afterDiscount - bonus + (isDelivery ? deliveryFee(menu.deliveryCost, subtotal) : 0)

  // доставляємо до під'їзду
  const building = body.entrance ? `під'їзд ${body.entrance}` : ''

  const isAsap = body.when !== 'time' || !body.time || !body.date

  try {
    const res = await $fetch<{ data?: { id?: number } }>(backendUrl('add-order'), {
      method: 'POST',
      body: {
        customer: {
          name: body.name?.trim(),
          phone: (body.phone ?? '').replace(/[^\d+]/g, ''),
          delivery: isDelivery ? DELIVERY.delivery : DELIVERY.pickup,
          // для самовивозу старий фронт слав порожні рядки
          street: isDelivery ? body.address?.trim() ?? '' : '',
          building: isDelivery ? building : '',
          payment: PAYMENT[body.payment] ?? PAYMENT.cash,
          sticks: {
            standard: sticksCount(body.sticks?.standard, 1),
            educational: sticksCount(body.sticks?.educational, 0),
          },
          isAsSoonAsPossible: isAsap ? 'true' : 'false',
          time: { day: isAsap ? '' : body.date, time: isAsap ? '' : body.time },
        },
        products: products.map(l => ({
          id: l.product.id,
          title: l.product.name,
          price: l.product.price,
          quantity: l.quantity,
        })),
        sum: total,
      },
    })
    const id = res?.data?.id ?? null
    const categoryName = (slug: string) => menu.categories.find(c => c.slug === slug)?.name
    const gaSent = id !== null && await sendGaPurchase(event, {
      transactionId: String(id),
      value: total,
      items: gaItems(products.map(l => ({ product: l.product, qty: l.quantity })), categoryName),
      params: { shipping_tier: body.mode === 'delivery' ? 'delivery' : 'pickup', payment_type: body.payment },
    })
    return { id, total, gaSent }
  }
  catch (e: unknown) {
    const err = e as { response?: { status?: number, _data?: { errors?: Record<string, string[]> } } }
    if (err.response?.status === 422) {
      const raw = err.response._data?.errors ?? {}
      const errors: Record<string, string> = {}
      for (const [key, messages] of Object.entries(raw)) {
        const field = key.replace(/^customer\./, '')
        errors[ERROR_FIELDS[field] ?? field] = Array.isArray(messages) ? messages[0]! : String(messages)
      }
      throw createError({ statusCode: 422, data: { errors } })
    }
    throw createError({ statusCode: 502, statusMessage: 'Order backend error' })
  }
})
