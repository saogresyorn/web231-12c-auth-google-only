import { z } from "zod";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  title?: string;
  stock?: number;
}

export type ProductList = Product[];

const initialProducts: Product[] = [
  {
    id: "p001",
    name: "Mechanical Keyboard",
    price: 2590,
    description: "Mechanical keyboard for work and gaming",
    category: "Electronics",
    title: "Mechanical Keyboard",
    stock: 10,
  },
  {
    id: "p002",
    name: "Wireless Mouse",
    price: 1290,
    description: "Lightweight wireless mouse",
    category: "Accessories",
    title: "Wireless Mouse",
    stock: 15,
  },
  {
    id: "p003",
    name: "USB-C Hub",
    price: 1890,
    description: "USB-C Hub with HDMI and Card Reader",
    category: "Accessories",
    title: "USB-C Hub",
    stock: 20,
  },
]

export const CATEGORIES = ["Electronics", "Accessories"] as const;
export const SORT_FIELDS = ["name", "price"] as const;

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
  q: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.string().optional(),
  limit: z.any().optional(),
})

export const defaultQuery = {
  search: "",
  q: "",
  category: "",
  sortBy: "name",
  limit: 10,
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

export function getProduct(id: string | number) {
  return products.find((product) => product.id === String(id))
}

export function updateProduct(
  id: string | number,
  values: Pick<Product, "name" | "price" | "description"> & { category?: string; title?: string; stock?: number },
) {
  const product = getProduct(id)
  if (!product) {
    throw new Error("Product not found")
  }
  product.name = values.name
  product.price = values.price
  product.description = values.description
  if (values.category) product.category = values.category
  if (values.title) product.title = values.title
  if (values.stock !== undefined) product.stock = values.stock
}

export function deleteProduct(id: string | number) {
  const index = products.findIndex((product) => product.id === String(id))
  if (index === -1) {
    throw new Error("Product not found")
  }
  products.splice(index, 1)
}
