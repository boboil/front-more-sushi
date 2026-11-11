// Розмітка schema.org (JSON-LD) — щоб пошуковики й AI-агенти читали ресторан, меню та ціни як дані.
// Ресторан і сайт мають сталі @id, інші сутності посилаються на них.
import type { Menu, MenuProduct } from '../types/menu'
import { CONTACTS } from './contacts'
import { FREE_DELIVERY_FROM } from './menu'

type Json = Record<string, unknown>

const base = (siteUrl: string) => siteUrl.replace(/\/$/, '')

export const restaurantId = (siteUrl: string) => `${base(siteUrl)}/#restaurant`
const websiteId = (siteUrl: string) => `${base(siteUrl)}/#website`

export function restaurantSchema(siteUrl: string): Json {
  const url = base(siteUrl)
  return {
    '@type': 'Restaurant',
    '@id': restaurantId(url),
    'name': 'Дари Моря',
    'alternateName': ['Dary Morya', 'More Sushi', 'Дари Моря Суші'],
    'description': 'Ресторан суші у Сумах: роли, сети, преміум роли, піца, напої та десерти. Доставка по місту і самовивіз.',
    'url': `${url}/`,
    'logo': `${url}/img/logo-big.png`,
    'image': `${url}/img/logo-big.png`,
    'telephone': '+380990663511',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'вул. Троїцька, 17',
      'addressLocality': 'Суми',
      'addressRegion': 'Сумська область',
      'addressCountry': 'UA',
    },
    'geo': { '@type': 'GeoCoordinates', 'latitude': 50.915289, 'longitude': 34.814198 },
    'openingHoursSpecification': [{
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      'opens': '11:00',
      'closes': '20:30',
    }],
    'servesCuisine': ['Японська', 'Суші', 'Піца'],
    'priceRange': '₴₴',
    'currenciesAccepted': 'UAH',
    'paymentAccepted': 'Готівка, картка через термінал',
    'acceptsReservations': false,
    'hasMenu': `${url}/menu`,
    'areaServed': { '@type': 'City', 'name': 'Суми' },
    'hasMap': CONTACTS.map,
    'sameAs': [CONTACTS.instagram.href, 'https://www.youtube.com/@darymoria_sushi'],
    'potentialAction': {
      '@type': 'OrderAction',
      'target': { '@type': 'EntryPoint', 'urlTemplate': `${url}/menu`, 'actionPlatform': ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] },
      'deliveryMethod': ['http://purl.org/goodrelations/v1#DeliveryModeOwnFleet', 'http://purl.org/goodrelations/v1#DeliveryModePickUp'],
    },
  }
}

export function websiteSchema(siteUrl: string): Json {
  const url = base(siteUrl)
  return {
    '@type': 'WebSite',
    '@id': websiteId(url),
    'url': `${url}/`,
    'name': 'Дари Моря',
    'inLanguage': 'uk',
    'publisher': { '@id': restaurantId(url) },
  }
}

function offer(p: MenuProduct, siteUrl: string): Json {
  return {
    '@type': 'Offer',
    'price': p.price,
    'priceCurrency': 'UAH',
    'availability': 'https://schema.org/InStock',
    'url': `${base(siteUrl)}/product/${p.slug}`,
    'seller': { '@id': restaurantId(siteUrl) },
  }
}

export function productSchema(p: MenuProduct, siteUrl: string, categoryName?: string): Json {
  return {
    '@type': 'Product',
    '@id': `${base(siteUrl)}/product/${p.slug}#product`,
    'name': p.name,
    'sku': String(p.id),
    'image': p.image,
    'description': p.description || p.ingredients.join(', '),
    'url': `${base(siteUrl)}/product/${p.slug}`,
    ...(categoryName ? { category: categoryName } : {}),
    ...(p.weight ? { additionalProperty: [{ '@type': 'PropertyValue', 'name': 'Вага / обʼєм', 'value': p.weight }] } : {}),
    'brand': { '@id': restaurantId(siteUrl) },
    'offers': offer(p, siteUrl),
  }
}

function menuItem(p: MenuProduct, siteUrl: string): Json {
  return {
    '@type': 'MenuItem',
    'name': p.name,
    'url': `${base(siteUrl)}/product/${p.slug}`,
    'image': p.image,
    ...(p.ingredients.length ? { description: p.ingredients.join(', ') } : {}),
    'offers': { '@type': 'Offer', 'price': p.price, 'priceCurrency': 'UAH' },
  }
}

/** Меню цілком або одна категорія (slug) — розділи з позиціями та цінами */
export function menuSchema(menu: Menu, siteUrl: string, onlySlug?: string): Json {
  const sections = menu.categories
    .filter(c => !onlySlug || c.slug === onlySlug)
    .map(c => ({
      '@type': 'MenuSection',
      'name': c.name,
      'url': `${base(siteUrl)}/menu/${c.slug}`,
      'hasMenuItem': menu.products.filter(p => p.categories.includes(c.slug)).map(p => menuItem(p, siteUrl)),
    }))
  return {
    '@type': 'Menu',
    '@id': `${base(siteUrl)}/menu${onlySlug ? `/${onlySlug}` : ''}#menu`,
    'name': 'Меню «Дари Моря»',
    'inLanguage': 'uk',
    'url': `${base(siteUrl)}/menu${onlySlug ? `/${onlySlug}` : ''}`,
    'description': `Ціни в гривнях. Доставка по Сумах безкоштовна від ${FREE_DELIVERY_FROM} грн, є самовивіз.`,
    'hasMenuSection': sections,
    'isPartOf': { '@id': restaurantId(siteUrl) },
  }
}

export function breadcrumbSchema(siteUrl: string, items: Array<{ name: string, path: string }>): Json {
  return {
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': item.name,
      'item': `${base(siteUrl)}${item.path}`,
    })),
  }
}

/** Скрипт для useHead: кілька сутностей в одному @graph */
export function jsonLd(...nodes: Json[]) {
  return {
    type: 'application/ld+json' as const,
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }),
  }
}
