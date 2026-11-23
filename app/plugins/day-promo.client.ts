import type { PromoQuote } from '#shared/types/promo'

// Перераховує «Акцію дня» при зміні кошика чи подарунка (з невеликою затримкою, щоб не смикати бекенд на кожен клік)
export default defineNuxtPlugin(() => {
  const cart = useCartState()
  const { quote, gift, loading } = useDayPromo()
  let timer: ReturnType<typeof setTimeout> | undefined
  let seq = 0

  async function refresh() {
    const lines = Object.entries(cart.value ?? {}).map(([id, quantity]) => ({ id: Number(id), quantity }))
    const mine = ++seq
    if (!lines.length) {
      quote.value = { active: false }
      return
    }
    loading.value = true
    const res = await $fetch<PromoQuote>('/api/promo-quote', { method: 'POST', body: { lines, gift: gift.value } })
      .catch((): PromoQuote => ({ active: false }))
    if (mine !== seq) return
    quote.value = res
    loading.value = false
  }

  watch([cart, gift], () => {
    clearTimeout(timer)
    timer = setTimeout(refresh, 250)
  }, { deep: true, immediate: true })
  // акція починається й закінчується за годинником — раз на хвилину звіряємось
  setInterval(refresh, 60_000)
})
