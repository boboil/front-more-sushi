# Лендинг «Акція дня» — спека на реалізацію

> Для виконавця: ТЗ клієнта → `ТЗ дизайнеру лендинг «Акция дня».docx` (у клієнта/дизайнера).
> Візуальний референс (дизайн-канвас, 11 артбордів: мобільний/десктоп шаблон, стани, 7 кольорів, компоненти, рекламні креативи): **https://claude.ai/artifact/JwbmrpseRtxwcNM1o18qo3**
> Ця спека переводить дизайн у структуру коду цього репозиторію (`new-front-more-sushi`, Nuxt 3 + TS, SCSS-токени, `useCart`/`useMenu` composables).

## 0. Що ще не визначено клієнтом (не блокер для старту розробки)

Нижче — плейсхолдери. Верстаємо на реальних даних з кроку 2, але значення самих офертів/цін/годин треба підтвердити:

- Остаточний список акцій по днях (мех��ніка + товари + ціни).
- Чи є часові рамки дії акції протягом дня (зараз закладено `activeFrom`/`activeTo`, приклад — "з 11:00 до 23:00").
- Чи є побажання по кольору поверх запропонованої палітри (розділ 1).

## 1. Акцентні кольори днів

Прораховано контраст (WCAG, формула відносної яскравості) — усі ≥ 4.5:1 в обидва боки: білий текст на `base`/`dark`, і сам колір як текст/іконка на білому.

| День | key | `base` (фон першого екрана, ribbon-текст) | `dark` (другий відтінок діагоналі, тінь) | `tint` (світлий фон картки/чипа) | Контраст (білий на `base`) |
|---|---|---|---|---|---|
| Понеділок | `mon` | `#0F6E72` | `#0C5659` | `#E2EEEE` | 6.0 : 1 |
| Вівторок | `tue` | `#6B2FBF` | `#532595` | `#EDE6F7` | 7.5 : 1 |
| Середа | `wed` | `#1D4ED8` | `#173DA8` | `#E4EAFA` | 6.7 : 1 |
| Четвер | `thu` | `#196B1F`¹ | `#145318` | `#E3EDE4` | 6.6 : 1 |
| П'ятниця | `fri` | `#C24E0B`¹ | `#973D09` | `#F8EAE2` | 4.8 : 1 |
| Субота | `sat` | `#C62424` | `#9A1C1C` | `#F8E5E5` | 5.7 : 1 |
| Неділя | `sun` | `#A3175A` | `#7F1246` | `#F4E3EB` | 7.4 : 1 |

¹ Четвер і п'ятниця навмисно співпадають з існуючими брендовими токенами сайту (`$green-dark`, `$orange-dark` у `app/assets/scss/_variables.scss`) — не випадковість, не міняти без причини.

Додати в `app/assets/scss/_variables.scss`:

```scss
// Кольори днів тижня — лендинг «Акція дня»
$promo-days: (
  mon: (base: #0F6E72, dark: #0C5659, tint: #E2EEEE),
  tue: (base: #6B2FBF, dark: #532595, tint: #EDE6F7),
  wed: (base: #1D4ED8, dark: #173DA8, tint: #E4EAFA),
  thu: (base: #196B1F, dark: #145318, tint: #E3EDE4),
  fri: (base: #C24E0B, dark: #973D09, tint: #F8EAE2),
  sat: (base: #C62424, dark: #9A1C1C, tint: #F8E5E5),
  sun: (base: #A3175A, dark: #7F1246, tint: #F4E3EB),
);
```

Жодна інша зміна у фірмовий стиль (шрифт Montserrat, логотип, кнопки) не вноситься — лендинг лишається частиною сайту.

## 2. Маршрути та дані

Один шаблон, 7 сторінок за URL із ТЗ:

```
/promo/ponedilok   → day = mon
/promo/vivtorok    → day = tue
/promo/sereda      → day = wed
/promo/chetver     → day = thu
/promo/piatnytsia  → day = fri
/promo/subota      → day = sat
/promo/nedilia     → day = sun
```

Файл: `app/pages/promo/[day].vue` (один динамічний роут, як `app/pages/product/[slug].vue`). Мапінг slug → day-key — константа, не через БД:

```ts
// shared/types/promo.ts
export type PromoDayKey = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun'

export const PROMO_SLUG_TO_DAY: Record<string, PromoDayKey> = {
  ponedilok: 'mon', vivtorok: 'tue', sereda: 'wed', chetver: 'thu',
  piatnytsia: 'fri', subota: 'sat', nedilia: 'sun',
}

export type PromoOfferType = 'percent' | 'gift' | 'delivery' | 'combo'

export interface PromoDay {
  day: PromoDayKey
  slug: string                 // "piatnytsia"
  label: string                // "П'ятниця"
  labelFull: string             // "П'ЯТНИЦЯ · СЬОГОДНІ АКЦІЯ" — збирається на фронті, не з бекенду
  offerType: PromoOfferType
  offerValue: number | null     // 30 → "-30%"; null для gift/delivery
  offerTitle: string            // "на всі філадельфії"
  activeFrom: string            // "11:00"
  activeTo: string              // "23:00"
  termsText: string             // 2-3 речення умов
  heroPhotoUrl: string          // квадратне/портретне фото для першого екрана й реклами
  products: PromoProduct[]      // 1–8 товарів
  tomorrow?: { day: PromoDayKey; offerTitle: string; offerValue: number | null; startsAt: string } // для стану "акція закінчилась"
}

export interface PromoProduct {
  id: number                    // product id з основного каталогу (для useCart().add)
  name: string
  weight: string                 // "250 г"
  photoUrl: string               // квадратне фото з каталогу
  oldPrice: number | null        // null для gift-механіки
  newPrice: number               // для gift — ціна комбо
  gift: boolean
  giftBadge?: string              // "2+1"
  inStock: boolean
}
```

Отримання даних — як `useMenu()` зараз отримує `/api/menu` (один `useFetch` в `app.vue`, читання через `useNuxtData`). Для промо — окремий ключ, бо дані для сторінки вузькі:

```ts
// app/composables/usePromoDay.ts
export function usePromoDay(day: PromoDayKey) {
  const { data } = useFetch<PromoDay>(`/api/promo/${day}`, { key: `promo-${day}` })
  return { promo: data }
}
```

## 3. Визначення стану сторінки

Логіка — у `app/pages/promo/[day].vue`, порівнює параметр маршруту із "сьогодні" та поточним часом проти `activeFrom`/`activeTo` з даних дня:

```ts
const route = useRoute()
const dayKey = PROMO_SLUG_TO_DAY[String(route.params.day)]
if (!dayKey) throw createError({ statusCode: 404, fatal: true })

const { promo } = await usePromoDay(dayKey)
if (!promo.value) throw createError({ statusCode: 404, fatal: true })

const todayKey = computed<PromoDayKey>(() => WEEKDAY_ORDER[new Date().getDay()])
const isToday = computed(() => dayKey === todayKey.value)
const isWithinHours = computed(() => isNowBetween(promo.value!.activeFrom, promo.value!.activeTo))

type PageState = 'active' | 'wrong-day' | 'ended' | 'loading'
const pageState = computed<PageState>(() => {
  if (!promo.value) return 'loading'
  if (!isToday.value) return 'wrong-day'
  if (!isWithinHours.value) return 'ended'
  return 'active'
})
```

| Стан | Коли | Компонент |
|---|---|---|
| `active` | `dayKey === today` і зараз у межах `activeFrom`–`activeTo` | `<PromoHero>` + `<PromoProductGrid>` (ціни зі знижкою) |
| `wrong-day` | `dayKey !== today` (прийшли за старою історіс) | `<PromoWrongDayBanner>` + `<PromoProductGrid :regular-prices="true">` + блок "А сьогодні: …" з лінком на `/promo/<today-slug>` |
| `ended` | `dayKey === today`, але зараз після `activeTo` (або до `activeFrom`) | `<PromoEndedBanner :tomorrow="promo.tomorrow">` замість хіро |
| товар `inStock: false` | на рівні картки, незалежно від стану сторінки | `<PromoProductCard :in-stock="false">` — приглушена, кнопка "Немає в наявності" |

Референс для кожного стану — артборди `Main.dc.html` (active), `StateWrongDay.dc.html`, `StateEnded.dc.html` у дизайн-канвасі.

## 4. Компоненти (`app/components/promo/`)

Усі стилі — через глобальні SCSS-змінні (`$orange`, `$radius-card`, `$shadow-cta`, …), як і решта проєкту: нічого імпортувати в `<style>`, `additionalData` вже підключає `_variables.scss`/`_mixins.scss`.

### `PromoRibbonBadge.vue` — «плакатна» стрічка під кутом (альтернатива звичайній pill-бейдж)
```vue
<script setup lang="ts">
defineProps<{ text: string; color: string }>()
</script>
<template>
  <div class="ribbon" :style="{ color }">
    <span>{{ text }}</span>
  </div>
</template>
<style scoped lang="scss">
.ribbon {
  position: absolute; top: 18px; left: -10px;
  transform: rotate(-7deg);
  background: #fff; padding: 7px 22px;
  box-shadow: 0 4px 10px rgba(0,0,0,.2);
  font-weight: 800; font-size: 11px; letter-spacing: .3px;
}
</style>
```

### `PromoHero.vue` — перший екран («акція йде»)
Props: `day: PromoDay`. Рендерить:
- діагональний спліт двох відтінків дня (`clip-path: polygon(0 0,100% 0,100% 62%,0 82%)` на псевдо-шарі `base` поверх фону `dark`),
- `<PromoRibbonBadge :text="`${day.label} · СЬОГОДНІ АКЦІЯ`" :color="dayColors.dark" />`,
- велика цифра `−{{ day.offerValue }}%` (`offerType === 'percent'`) АБО іконка (gift/delivery) коли `offerValue === null`,
- `day.offerTitle`,
- фото-медальйон (коло, біла рамка 6px, `rotate(5deg)`, `box-shadow`),
- таймер до `activeTo` (`useCountdown(activeTo)` — простий composable на `setInterval`, textContent `HH:MM:SS`),
- CTA `<a href="#products">Замовити</a>`.

Повна розмітка й точні розміри/кольори — 1:1 з артборда `Main.dc.html` (мобільний) і `Desktop.dc.html` (десктоп, `@include desktop-up`).

### `PromoProductCard.vue`
```ts
const props = defineProps<{ product: PromoProduct; regularPrice?: boolean }>()
const cart = useCart()
const qty = computed(() => cart.qty(props.product.id))
```
- `regularPrice` (для стану `wrong-day`) ховає знижку, показує `newPrice` як звичайну ціну, кнопка без stepper-логіки не потрібна — товари поза акцією теж можна класти в кошик за повною ціною.
- `inStock === false` → `opacity: .55`, `filter: grayscale(1)` на фото, кнопка `disabled` з текстом «Немає в наявності».
- Кнопка «В кошик» / stepper (`-` `qty` `+`) — викликає `cart.add(product.id)` / `cart.setQty(product.id, qty±1)`. Увага: `cart.add` кладе товар у **той самий кошик**, що й основний каталог — ціна зі знижкою має підмінятись на бекенді при оформленні замовлення (ціна з акції день ≠ ціна каталогу), це бекенд-логіка, не фронтова; фронт лише передає `product.id` + `qty`.
- Скелетон завантаження — окремий `PromoProductCardSkeleton.vue` (статичні сірі блоки, `animation: shimmer`), показується поки `promo.value` ще `null`/`pending`.

### `PromoTerms.vue`, `PromoDelivery.vue`, `PromoTrust.vue`
Статичні презентаційні блоки, без динамічних даних (текст умов — із `day.termsText`; доставка/довіра — спільні для всіх днів, хардкод як на артборді `Main.dc.html`, секції «Умови акції» / «Доставка» / «Довіра»).

### `PromoWeekStrip.vue`
Стрічка 7 чипів (день + коротка назва офферу), поточний день виділений (`border: 2px solid #fff` + колір дня як фон, решта — `tint`-фон + колір-текст). Дані — константа (не з API, бо показує офери ВСІХ днів одразу):
```ts
const WEEK_PREVIEW: { day: PromoDayKey; label: string; offerShort: string }[] = [
  { day: 'mon', label: 'ПН', offerShort: '-20% на сети' },
  { day: 'tue', label: 'ВТ', offerShort: '-50% на другу ролу' },
  { day: 'wed', label: 'СР', offerShort: '-15% для двох' },
  { day: 'thu', label: 'ЧТ', offerShort: '-25% з лососем' },
  { day: 'fri', label: 'ПТ', offerShort: '-30% філадельфії' },
  { day: 'sat', label: 'СБ', offerShort: '-20% сімейний' },
  { day: 'sun', label: 'НД', offerShort: 'Десерт у дар' },
]
```
> Це дублює дані з `PromoDay`, навмисно: стрічка показує всі 7 днів одночасно, а `/api/promo/:day` віддає тільки один. Якщо бекенд готовий — замінити на `useFetch('/api/promo')` (список усіх днів) замість константи.

### `PromoCartBar.vue` — мобільна плашка кошика
Аналог `MobileBottomBar.vue`, але не таббар, а сумарна плашка конкретно для цієї сторінки — `position: fixed; bottom: 0` (над існуючим `MobileBottomBar`, або замість нього на `/promo/*` — вирішити при інтеграції, щоб не було двох фіксованих панелей знизу одночасно):
```vue
<script setup lang="ts">
const cart = useCart()
</script>
<template>
  <div v-if="!cart.isEmpty.value" class="promo-cartbar only-mobile">
    <span>{{ cart.count.value }} товари · {{ formatPrice(cart.total.value) }}</span>
    <NuxtLink to="/checkout">Оформити</NuxtLink>
  </div>
</template>
```
Дивись `app/components/layout/MobileBottomBar.vue` — там уже є практично такий самий «floating cartbar» блок (`v-if="!cart.isEmpty.value"`), можливо достатньо його переставити/заресайзити під промо-сторінку замість нового компонента.

### `PromoWrongDayBanner.vue` / `PromoEndedBanner.vue`
1:1 з артбордами `StateWrongDay.dc.html` / `StateEnded.dc.html`. `PromoEndedBanner` приймає `tomorrow: PromoDay['tomorrow']` і рендерить той самий «плакатний» блок (діагональ + велика цифра + фото-медальйон), що й хіро, тільки менший і з CTA «Нагадати, коли почнеться» (`disabled`, нагадування — поза скоупом MVP).

## 5. SEO / OG

Кожна `/promo/:day` — свій `useSeoMeta`/`useHead` (як у `product/[slug].vue`), `ogImage` — окрема картинка 1200×630 на день (референс `OgImage.dc.html`, та сама «плакатна» композиція). До появи реальних рендер-сервісів — статичні PNG, по одному на день, у `public/img/promo/og-<day>.png`.

## 6. Маркетингові матеріали (не код, довідково для таргетолога/дизайнера)

У канвасі вже є готові шаблони-референси (не потребують фронтенд-розробки, це експорт картинок):
- Сторіс 1080×1920 — `AdCreativeStory.dc.html`
- Пост 1080×1350 — `AdCreativePost.dc.html`
- Кожен — на прикладі п'ятниці, та сама «плакатна цифра», переноситься на будь-який день підстановкою кольору/цифри/фото з таблиці розділу 1.

## 7. Чекліст готовності (звіряти з ТЗ «Что сдать»)

- [ ] `app/pages/promo/[day].vue` + 404 на невідомий slug
- [ ] 4 стани сторінки (`active` / `wrong-day` / `ended` / товар `inStock:false`) — розділ 3
- [ ] Кнопка «В кошик»: звичайна / натиснута / доданий (stepper) — інтеграція з `useCart()`
- [ ] Скелетон картки товару на час завантаження
- [ ] Мобільна версія без скролу на першому екрані (перевірити на 375×667 і 375×812)
- [ ] Десктопна версія 1440
- [ ] Контраст тексту ≥ 4.5:1 на всіх 7 кольорах (вже прораховано, розділ 1 — не перераховувати)
- [ ] Жоден текст (оффер/ціна/назва товару) не «запечений» у картинку — усе звичайний HTML/CSS, крім самих рекламних креативів (сторіс/пост/OG), де текст є частиною експортованої картинки за задумом
- [ ] Плашка кошика знизу на мобільному — узгодити з `MobileBottomBar`, щоб не було двох фіксованих панелей одночасно
- [ ] OG-картинка на кожен день
- [ ] Підтвердити в клієнта: офери/ціни/години дії (розділ 0) — поки що плейсхолдери з дизайну

## 8. Що лишається дизайнерським рішенням, а не кодом

- Повний набір фото товарів з каталогу (квадратні, зараз у дизайні — одне тестове фото на всі картки).
- Фінальні тексти офертів/умов — зараз приклади, не затверджені клієнтом.
