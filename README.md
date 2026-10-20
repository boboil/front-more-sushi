# new-front-more-sushi

Новий фронт moresushi.in.ua за дизайном `design_handoff_more_sushi_redesign/`.
**Nuxt 4** (Vue 3 + SSR), SCSS, без UI-бібліотек.

## Запуск

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:3000
npm run build && npm start   # прод (Node-сервер з SSR)
docker compose up --build    # або в Docker
```

## Архітектура

```
server/                 Nitro (BFF між браузером і Laravel)
  api/menu.get.ts       меню: catalog + stock + hero-slides + delivery-cost → нормалізовані дані, кеш 60 с
  api/order.post.ts     оформлення: перераховує суму з цін меню і шле в /api/shop/add-order
  utils/backend.ts      парсинг відповіді бекенду (склад, теги-фільтри, примітки акцій)
shared/                 типи та утиліти, спільні для сервера і клієнта
app/
  app.vue               один раз вантажить меню (потрапляє в SSR payload)
  composables/          useMenu, useCart (cookie → SSR бачить кошик), useCheckout, useProductModal
  components/           ui/ · menu/ · cart/ · product/ · home/ · layout/
  pages/                /  /menu  /menu/:slug  /product/:slug  /cart  /checkout  /order/success
  assets/scss/          токени дизайну (_variables.scss), міксини, базові стилі
```

- **Мобільний / десктоп** — одні й ті самі сторінки, адаптив через `$mobile-max-width: 767px` / `$tablet-max-width: 1023px`.
  На `/` мобільний бачить «Головну», десктоп — меню з банером (як у прототипі).
- **Товар**: на десктопі клік по картці відкриває модалку, на мобільному — сторінку `/product/:slug`
  (картки — звичайні посилання, тож SEO та «відкрити в новій вкладці» працюють).
- **Фільтри** — у query (`/menu/roli?f=salmon,spicy`), їх рендерить SSR.
- **Кошик** і «минуле замовлення» — у cookie, тому сума в шапці й кількості на картках правильні вже в HTML.
- Старі адреси `/catalog` і `/stock` редіректять 301 на `/menu` і `/menu/akcii`.

## Що чекає на бекенд

| Що | Зараз |
|---|---|
| Теги продуктів (`spicy`, `baked`, `salmon`…) | визначаються з назви/складу регулярками (`server/utils/backend.ts → detectTags`) |
| Коментар до замовлення, поверх/квартира | поверх/під'їзд/кв. склеюються в `building`; `comment` надсилається, але `OrderController::addOrder` його ігнорує |
| Промокоди, бонуси | UI готовий, приховано прапорцями `NUXT_PUBLIC_FEATURES_*` (демо-код `MORE10`, баланс 85 грн) |
| «Карткою онлайн» | онлайн-оплати немає — передається як рядок `payment`, оператор обробляє вручну |
| Історія замовлень | «Повторити» бере останнє замовлення з cookie цього браузера |

## Деплой (moresushi.in.ua)

```bash
./deploy.sh
```

На сервері (FastPanel, Debian 11):
- код: `/var/www/moresushi_in_usr/data/www/moresushi.in.ua/new-front/.output` (старий фронт лишився поруч у `dist/`)
- сервіс: `systemctl status moresushi-front` (Node 22 з `/opt/node22`, `127.0.0.1:3020`, env — у `/etc/systemd/system/moresushi-front.service`)
- секрети (`NUXT_GA_API_SECRET`) — у `/etc/moresushi-front.env` (лише root, підключено через `EnvironmentFile`), не в репозиторії
- nginx: `/etc/nginx/fastpanel2-available/moresushi_in_usr/moresushi.in.ua.conf` — проксі на `:3020`, статика з `.output/public`.
  ⚠️ FastPanel може перезаписати цей файл, якщо змінити налаштування сайту в панелі — тоді треба повторити правки.
  Старий конфіг (відкат на старий фронт): `/root/nginx-backup-moresushi.in.ua.conf.20261020_185653` → скопіювати на місце, `nginx -t && systemctl reload nginx`.
- логи: `journalctl -u moresushi-front -f`
