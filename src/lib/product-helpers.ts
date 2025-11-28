/* ---------- Types ---------- */
export type CategoryApi = {
  id: number
  name: string
  parent_id?: number | null
  children_recursive?: CategoryApi[]
}

export type ProductsResponse = {
  data: any[]
  current_page: number
  last_page: number
}

export type PriceRange = {
  min_price: number
  max_price: number
}

export type FileType = {
  type: string
  count?: number
}



const API_BASE = "https://filerget.com/api"

// Fetch categories
export async function fetchCategories(): Promise<CategoryApi[]> {
  const res = await fetch(`${API_BASE}/categories`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })
  if (!res.ok) throw new Error("Failed to fetch categories")
  const json = await res.json()
  return json.data || []
}

// Fetch price range
export async function fetchPriceRange(): Promise<PriceRange> {
  const res = await fetch(`${API_BASE}/products/meta/price-range`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })
  if (!res.ok) throw new Error("Failed to fetch price range")
  return res.json()
}

// Fetch file types
export async function fetchFileTypes(): Promise<FileType[]> {
  const res = await fetch(`${API_BASE}/products/meta/file-types`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })
  if (!res.ok) throw new Error("Failed to fetch file types")
  const json = await res.json()
  return json.data || []
}

// Fetch products with filters
export async function fetchProducts(params: {
  search?: string
  category_ids?: string
  min_price?: number
  max_price?: number
  file_types?: string
  page?: number
}): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams()

  if (params.search) searchParams.append("search", params.search)
  if (params.category_ids) searchParams.append("category_ids", params.category_ids)
  if (params.min_price !== undefined) searchParams.append("min_price", String(params.min_price))
  if (params.max_price !== undefined) searchParams.append("max_price", String(params.max_price))
  if (params.file_types) searchParams.append("file_types", params.file_types)
  if (params.page && params.page > 1) searchParams.append("page", String(params.page))

  const url = `${API_BASE}/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

  const res = await fetch(url, {
    cache: "no-store", // Dynamic data based on filters
  })

  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
  return res.json()
}


/* ---------- Category Helper Functions ---------- */

export const collectCategoryIds = (cats: CategoryApi[], selected: string[]) => {
  const ids = new Set<string>()
  const rootById: Record<number, CategoryApi> = {}

  const index = (nodes: CategoryApi[]) => {
    for (const n of nodes) {
      rootById[n.id] = n
      if (n.children_recursive?.length) index(n.children_recursive)
    }
  }
  index(cats)

  for (const s of selected) {
    const id = Number(s)
    const node = rootById[id]
    if (node) {
      // اگر parent انتخاب شده است، فقط ID های childها را اضافه کن، خود parent نه
      if (node.children_recursive?.length) {
        const visitChildren = (n: CategoryApi) => {
          ;(n.children_recursive || []).forEach((c) => {
            ids.add(String(c.id))
            visitChildren(c)
          })
        }
        visitChildren(node)
      } else {
        // اگر node child هست، خودش اضافه شود
        ids.add(s)
      }
    }
  }

  return Array.from(ids)
}

export const findCategoryName = (cats: CategoryApi[], id: number): string | null => {
  for (const c of cats) {
    if (c.id === id) return c.name
    if (c.children_recursive) {
      const found = findCategoryName(c.children_recursive, id)
      if (found) return found
    }
  }
  return null
}

// پیدا کردن والد‌ها (بازگشتی)
export const findParents = (cats: CategoryApi[], id: number, parents: number[] = []): any => {
  for (const c of cats) {
    if (c.id === id) return parents
    if (c.children_recursive?.length) {
      const res = findParents(c.children_recursive, id, [...parents, c.id])
      if (res) return res
    }
  }
  return null
}

// پیدا کردن تمام چیلدها (بازگشتی)
export const findChildren = (node: CategoryApi) => {
  let ids: number[] = []
  if (node.children_recursive?.length) {
    for (const child of node.children_recursive) {
      ids.push(child.id)
      ids = ids.concat(findChildren(child))
    }
  }
  return ids
}

// پیدا کردن یک دسته با id
export const findCat = (cats: CategoryApi[], id: number): CategoryApi | null => {
  for (const c of cats) {
    if (c.id === id) return c
    if (c.children_recursive) {
      const f = findCat(c.children_recursive, id)
      if (f) return f
    }
  }
  return null
}

export const getAllDescendants = (node: CategoryApi): CategoryApi[] => {
  let result: CategoryApi[] = []
  if (node.children_recursive) {
    node.children_recursive.forEach((child) => {
      result.push(child)
      result = result.concat(getAllDescendants(child))
    })
  }
  return result
}





