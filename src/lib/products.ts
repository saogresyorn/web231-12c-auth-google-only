import { z } from "zod";

export type Product = {
  id: string
  name: string
  price: number
  description: string
  category?: string
  title?: string
  stock?: number
}

const initialProducts: Product[] = [
  {
    id: "p001",
    name: "Mechanical Keyboard",
    price: 2590,
    description: "Mechanical keyboard for work and gaming",
  },
  {
    id: "p002",
    name: "Wireless Mouse",
    price: 1290,
    description: "Lightweight wireless mouse",
  },
  {
    id: "p003",
    name: "USB-C Hub",
    price: 1890,
    description: "USB-C Hub with HDMI and Card Reader",
  },
]

export const CATEGORIES = ["Electronics", "Accessories"] as const
export const SORT_FIELDS = ["name", "price"] as const

export const ProductDraftSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string().optional(),
  title: z.string().optional(),
  stock: z.number().optional(),
})

export const SearchQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.string().optional(),
})

export const defaultQuery = {
  search: "",
  category: "",
  sortBy: "name",
}

export type ProductDraft = z.infer<typeof ProductDraftSchema>
export type SearchQuery = z.infer<typeof SearchQuerySchema>

declare global {
  // eslint-disable-next-line no-var
  var demoProducts: Product[] | undefined
}

const products =
  globalThis.demoProducts ??
  structuredClone(initialProducts)

if (process.env.NODE_ENV !== "production") {
  globalThis.demoProducts = products
}

export function getProducts() {
  return products
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id)
}

export function updateProduct(
  id: string,
  values: Pick<Product, "name" | "price" | "description">,
) {
  const product = getProduct(id)
  if (!product) {
    throw new Error("Product not found")
  }
  product.name = values.name
  product.price = values.price
  product.description = values.description
}

export function deleteProduct(id: string) {
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) {
    throw new Error("Product not found")
  }
  products.splice(index, 1)
}
