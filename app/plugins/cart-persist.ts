export default defineNuxtPlugin(() => {
  const cart = useCartState()
  const lastOrder = useLastOrder()
  const cartCookie = useCookie('ms_cart', CART_COOKIE_OPTS)
  const lastOrderCookie = useCookie('ms_last_order', { ...CART_COOKIE_OPTS, maxAge: 60 * 60 * 24 * 180 })

  watch(cart, (v) => { cartCookie.value = v as never }, { deep: true })
  watch(lastOrder, (v) => { lastOrderCookie.value = v as never }, { deep: true })
})
