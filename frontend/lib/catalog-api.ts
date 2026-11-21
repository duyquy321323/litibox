import { apiFetch } from "@/lib/api";
import type { ColorKey, Product, Review, Style } from "@/lib/catalog";

type ApiProduct = {
  id: number;
  code: string;
  slug: string;
  name: string;
  brand: string;
  brand_segment: "low" | "mid" | "high";
  category: "set" | "lip" | "blush" | "eye" | "care" | "highlight";
  styles: Style[];
  personal_colors: ColorKey[];
  needs: string[];
  price: number | string;
  sale_price: number | string | null;
  stock: number;
  tone_hex: string | null;
  short_description: string | null;
  description: string | null;
  details: string[];
  rating: number;
  sold: number;
  is_best_seller: boolean;
  is_gift_set: boolean;
  is_combo: boolean;
};

type ApiProductList = {
  items: ApiProduct[];
  total: number;
  brands: string[];
};

type ApiReview = {
  id: number;
  customer_name: string;
  personal_color: ColorKey | null;
  rating: number;
  content: string;
};

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function mapApiProduct(item: ApiProduct): Product {
  return {
    code: item.code,
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    segment: item.brand_segment,
    category: item.category,
    styles: item.styles,
    colors: item.personal_colors,
    needs: item.needs,
    price: toNumber(item.price),
    salePrice: item.sale_price == null ? null : toNumber(item.sale_price),
    stock: item.stock,
    tone: item.tone_hex ?? "#D9A06B",
    short: item.short_description ?? "",
    description: item.description ?? "",
    details: item.details,
    rating: item.rating,
    sold: item.sold,
    best: item.is_best_seller,
    gift: item.is_gift_set,
    combo: item.is_combo,
  };
}

export async function fetchProducts(params: Record<string, string | number | boolean | undefined> = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const suffix = search.size ? `?${search.toString()}` : "";
  try {
    const data = await apiFetch<ApiProductList>(`/api/products${suffix}`, { server: true });
    return data.items.map(mapApiProduct);
  } catch {
    return null;
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const data = await apiFetch<ApiProduct>(`/api/products/slug/${encodeURIComponent(slug)}`, { server: true });
    return mapApiProduct(data);
  } catch {
    return null;
  }
}

export async function fetchReviews() {
  try {
    const data = await apiFetch<ApiReview[]>("/api/ai/reviews", { server: true });
    return data
      .filter((review): review is ApiReview & { personal_color: ColorKey } => review.personal_color !== null)
      .map((review) => ({
        name: review.customer_name,
        color: review.personal_color,
        rating: review.rating,
        content: review.content,
      })) satisfies Review[];
  } catch {
    return null;
  }
}
