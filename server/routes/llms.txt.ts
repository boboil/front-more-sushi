import type { Menu } from '#shared/types/menu'

// /llms.txt — короткий опис ресторану й повне меню з цінами в Markdown для AI-асистентів (формат llmstxt.org).
// Будується з того ж /api/menu, що й сайт, тож ціни завжди актуальні.
export default defineEventHandler(async (event) => {
  const { public: { siteUrl } } = useRuntimeConfig(event)
  const url = siteUrl.replace(/\/$/, '')
  const menu = await $fetch<Menu>('/api/menu')
  const price = (n: number) => `${Math.round(n)} грн`
  const delivery = menu.deliveryCost > 0
    ? `по Сумах: ${price(menu.deliveryCost)} для замовлень до ${price(FREE_DELIVERY_FROM)}, від ${price(FREE_DELIVERY_FROM)} — безкоштовно`
    : 'по Сумах безкоштовно'

  const lines: string[] = [
    '# Дари Моря',
    '',
    `> Ресторан суші у Сумах (${CONTACTS.address}). Роли, сети, преміум роли, піца, напої та десерти. Доставка по місту й самовивіз, щодня ${CONTACTS.hours}. Замовлення на сайті або за телефоном ${CONTACTS.phone.label}.`,
    '',
    '## Основне',
    '',
    `- Адреса: Суми, ${CONTACTS.address} ([мапа](${CONTACTS.map}))`,
    `- Телефон: ${CONTACTS.phone.label} (+380990663511)`,
    `- Години роботи: щодня ${CONTACTS.hours}, доставка до ${CONTACTS.deliveryUntil}`,
    `- Доставка: ${delivery}. Самовивіз: ${CONTACTS.address}`,
    '- Оплата: готівкою або карткою через термінал при отриманні; онлайн-оплати немає',
    `- Instagram: ${CONTACTS.instagram.href}`,
    '- Ціни в гривнях (UAH), можуть змінюватися; актуальні — на сторінці страви',
    '',
    '## Сторінки',
    '',
    `- [Меню](${url}/menu): усі страви з цінами та фільтрами`,
    `- [Доставка і самовивіз](${url}/delivery): умови й вартість доставки`,
    `- [Контакти](${url}/contacts): адреса, телефон, години роботи, форма зворотного зв'язку`,
    `- [Політика конфіденційності](${url}/privacy)`,
    `- [Умови використання](${url}/terms)`,
    '',
  ]

  const promo = menu.products.filter(p => p.isPromo)
  if (promo.length) {
    lines.push('## Акції', '')
    for (const p of promo) {
      const old = p.oldPrice ? ` (було ${price(p.oldPrice)})` : ''
      lines.push(`- [${p.name}](${url}/product/${p.slug}): ${price(p.price)}${old}${p.note ? ` — ${p.note}` : ''}`)
    }
    lines.push('')
  }

  lines.push('## Меню', '')
  for (const c of menu.categories) {
    const items = menu.products.filter(p => p.categories.includes(c.slug))
    if (!items.length) continue
    lines.push(`### [${c.name}](${url}/menu/${c.slug})`, '')
    for (const p of items) {
      const details = [p.weight, p.ingredients.join(', ')].filter(Boolean).join('; ')
      lines.push(`- [${p.name}](${url}/product/${p.slug}): ${price(p.price)}${details ? ` — ${details}` : ''}`)
    }
    lines.push('')
  }

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=600')
  return lines.join('\n')
})
