import type { OrderRequest, OrderResponse } from '#shared/types/menu'

type CheckoutForm = Omit<OrderRequest, 'lines' | 'promoCode'>

const REMEMBER_FIELDS = ['name', 'phone', 'address', 'entrance', 'mode'] as const
type Remembered = Partial<Pick<CheckoutForm, typeof REMEMBER_FIELDS[number]>>

/** "0991234567" / "380991234567" → "+380 99 123 45 67" */
export function formatPhone(value: string): string {
  let d = value.replace(/\D/g, '')
  if (d.startsWith('0')) d = `38${d}`
  else if (d && !d.startsWith('380')) d = `380${d}`
  d = d.slice(0, 12)
  if (!d) return ''
  const parts = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 10), d.slice(10, 12)].filter(Boolean)
  return `+${parts.join(' ')}`
}

export function useCheckout() {
  const track = useTrack()
  const cart = useCart()
  const remembered = useCookie<Remembered>('ms_customer', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', default: () => ({}) })

  const form = useState<CheckoutForm>('checkout', () => ({
    mode: 'delivery',
    name: '',
    phone: '',
    address: '',
    entrance: '',
    when: 'asap',
    date: '',
    time: '',
    payment: 'cash',
    sticks: { standard: 1, educational: 0 },
    useBonus: false,
    // лише відомі поля: у старих cookie ще можуть бути floor/apartment
    ...Object.fromEntries(REMEMBER_FIELDS.filter(k => remembered.value[k] !== undefined).map(k => [k, remembered.value[k]])),
  }))

  const errors = ref<Record<string, string>>({})
  const submitting = ref(false)
  const failed = ref(false)
  const placed = useState<OrderResponse | null>('placed-order', () => null)

  function validate(): boolean {
    const e: Record<string, string> = {}
    const f = form.value
    if (!f.name.trim()) e.name = 'Вкажіть ім\'я'
    if (f.phone.replace(/\D/g, '').length !== 12) e.phone = 'Вкажіть номер у форматі +380 XX XXX XX XX'
    if (f.mode === 'delivery' && !f.address.trim()) e.address = 'Вкажіть адресу доставки'
    if (f.when === 'time' && !f.date) e.date = 'Оберіть дату'
    if (f.when === 'time' && !f.time) e.time = 'Оберіть час'
    errors.value = e
    return !Object.keys(e).length
  }

  async function submit(): Promise<boolean> {
    failed.value = false
    if (!validate()) return false
    submitting.value = true
    const tracked = cart.lines.value.map(l => ({ product: l.product, qty: l.qty }))
    const shipping = form.value.mode === 'delivery' ? 'delivery' : 'pickup'
    track('add_shipping_info', { lines: tracked, params: { shipping_tier: shipping } })
    track('add_payment_info', { lines: tracked, params: { payment_type: form.value.payment } })
    try {
      const lines = cart.lines.value.map(l => ({ id: l.product.id, quantity: l.qty }))
      const res = await $fetch<OrderResponse>('/api/order', {
        method: 'POST',
        body: { ...form.value, promoCode: cart.promo.value.code, lines } satisfies OrderRequest,
      })
      remembered.value = Object.fromEntries(REMEMBER_FIELDS.map(k => [k, form.value[k]])) as Remembered
      cart.lastOrder.value = lines
      cart.clear()
      form.value.sticks = { standard: 1, educational: 0 }
      form.value.useBonus = false
      placed.value = res
      track('purchase', {
        lines: tracked,
        value: res.total,
        params: { ...(res.id ? { transaction_id: String(res.id) } : {}), shipping_tier: shipping, payment_type: form.value.payment },
        skipGa: res.gaSent,
      })
      return true
    }
    catch (e: unknown) {
      const err = e as { statusCode?: number, data?: { data?: { errors?: Record<string, string> } } }
      const fieldErrors = err.data?.data?.errors
      if (err.statusCode === 422 && fieldErrors) errors.value = fieldErrors
      else failed.value = true
      return false
    }
    finally {
      submitting.value = false
    }
  }

  return { form, errors, submitting, failed, placed, submit }
}
