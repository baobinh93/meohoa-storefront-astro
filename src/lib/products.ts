import { hasSupabaseConfig, supabase } from "./supabase";
import type { LookupRow, Product, ProductImage } from "../types/product";

function getLabel(row: LookupRow | undefined, fallback: string): string {
  if (!row) return fallback;
  const value =
    row.name ?? row.label ?? row.title ?? row.display_name ?? row.slug;
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export async function getPublishedProducts(): Promise<Product[]> {
  if (!hasSupabaseConfig || !supabase) {
    console.warn(
      "[Mèo Hoa] Chưa cấu hình Supabase. Storefront sẽ hiển thị trạng thái trống.",
    );
    return [];
  }

  const { data: productRows, error: productsError } = await supabase
    .from("products")
    .select(
      "id, category_id, color_id, badge_id, name, slug, price, original_price, description, status, sort_order, meta_title, meta_description",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (productsError) {
    throw new Error(
      `Không thể lấy sản phẩm công khai: ${productsError.message}`,
    );
  }

  const rows = productRows ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);
  const categoryIds = [
    ...new Set(rows.map((row) => row.category_id).filter(Boolean)),
  ];
  const colorIds = [
    ...new Set(rows.map((row) => row.color_id).filter(Boolean)),
  ];
  const badgeIds = [
    ...new Set(rows.map((row) => row.badge_id).filter(Boolean)),
  ];

  const [imagesResult, categoriesResult, colorsResult, badgesResult] =
    await Promise.all([
      supabase
        .from("product_images")
        .select("id, product_id, image_url, alt, is_primary, sort_order")
        .in("product_id", ids)
        .order("sort_order", { ascending: true }),
      categoryIds.length
        ? supabase.from("categories").select("*").in("id", categoryIds)
        : Promise.resolve({ data: [], error: null }),
      colorIds.length
        ? supabase.from("colors").select("*").in("id", colorIds)
        : Promise.resolve({ data: [], error: null }),
      badgeIds.length
        ? supabase.from("badges").select("*").in("id", badgeIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (imagesResult.error) {
    throw new Error(
      `Không thể lấy ảnh sản phẩm: ${imagesResult.error.message}`,
    );
  }

  const imageRows = (imagesResult.data ?? []) as ProductImage[];
  const categories = new Map<string, LookupRow>(
    (categoriesResult.data ?? []).map((row: LookupRow) => [
      String(row.id),
      row,
    ]),
  );
  const colors = new Map<string, LookupRow>(
    (colorsResult.data ?? []).map((row: LookupRow) => [String(row.id), row]),
  );
  const badges = new Map<string, LookupRow>(
    (badgesResult.data ?? []).map((row: LookupRow) => [String(row.id), row]),
  );
  const imagesByProduct = new Map<string, ProductImage[]>();

  for (const image of imageRows) {
    const list = imagesByProduct.get(image.product_id) ?? [];
    list.push(image);
    imagesByProduct.set(image.product_id, list);
  }

  return rows.map((row) => {
    const productImages = (imagesByProduct.get(row.id) ?? []).sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return a.sort_order - b.sort_order;
    });
    const badge = badges.get(String(row.badge_id));

    return {
      ...row,
      price: asNumber(row.price),
      original_price:
        row.original_price === null ? null : asNumber(row.original_price),
      product_images: productImages,
      category_name: getLabel(categories.get(String(row.category_id)), "Khác"),
      color_name: getLabel(colors.get(String(row.color_id)), "Mặc định"),
      badge_name: badge ? getLabel(badge, "").toLocaleUpperCase("vi-VN") : null,
    } as Product;
  });
}

export async function getPublishedProductBySlug(
  slug: string,
): Promise<Product | null> {
  const products = await getPublishedProducts();
  return products.find((product) => product.slug === slug) ?? null;
}
