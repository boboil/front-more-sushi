import type { MenuProduct } from '#shared/types/menu'

export interface TrackLine {
  product: MenuProduct
  qty: number
}

export interface GaItem {
  item_id: string
  item_name: string
  item_category?: string
  price: number
  quantity: number
}

/** Товари у форматі GA4 ecommerce; категорія — перша з тих, де лежить товар */
export function gaItems(lines: TrackLine[], categoryName: (slug: string) => string | undefined): GaItem[] {
  return lines.map(({ product, qty }) => {
    const category = product.categories[0] && categoryName(product.categories[0])
    return {
      item_id: String(product.id),
      item_name: product.name,
      ...(category ? { item_category: category } : {}),
      price: product.price,
      quantity: qty,
    }
  })
}

export function linesValue(lines: TrackLine[]): number {
  return lines.reduce((s, l) => s + l.product.price * l.qty, 0)
}
