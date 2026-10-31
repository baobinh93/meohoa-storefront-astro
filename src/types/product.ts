export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  color_id: string;
  badge_id: string | null;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  description: string | null;
  status: string;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  product_images: ProductImage[];
  category_name: string;
  color_name: string;
  badge_name: string;
}

export interface LookupRow {
  id?: string;
  name?: string;
  label?: string;
  title?: string;
  display_name?: string;
  slug?: string;
  is_active?: boolean;
  [key: string]: unknown;
}
