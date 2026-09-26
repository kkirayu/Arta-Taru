export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  seo_title: string | null;
  meta_description: string | null;
  sort_order: number;
  is_active: boolean;
  parent?: Category;
  children?: Category[];
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  is_active: boolean;
  products_count?: number;
  created_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  brand_id: number | null;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  low_stock_threshold: number;
  stock_status: string;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
  primary_image?: ProductImage;
  specifications?: ProductSpecification[];
  effective_price?: number;
  stock_status_label?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  path: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductSpecification {
  id: number;
  product_id: number;
  key: string;
  value: string;
  sort_order: number;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  desktop_image: string | null;
  mobile_image: string | null;
  cta_label: string | null;
  cta_url: string | null;
  start_at: string | null;
  end_at: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  action: string;
  subject_type: string | null;
  subject_id: number | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user?: User;
}

export interface Pagination<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PageProps {
  auth: { user: User | null };
  flash: { success: string | null; error: string | null };
  [key: string]: unknown;
}

export interface DashboardProps extends PageProps {
  stats: {
    total_products: number;
    active_products: number;
    low_stock: number;
    total_categories: number;
    total_brands: number;
    whatsapp_clicks: number;
    out_of_stock: number;
    hidden_products: number;
  };
  low_stock_products: Product[];
  most_viewed_products: Product[];
  most_whatsapp_products: Product[];
  latest_products: Product[];
  recent_logs: ActivityLog[];
}

export interface ProductIndexProps extends PageProps {
  products: Pagination<Product>;
  categories: Category[];
  brands: Brand[];
  filters: {
    search?: string;
    category?: string;
    brand?: string;
    status?: string;
  };
}

export interface ProductFormProps extends PageProps {
  product?: Product;
  categories: Category[];
  brands: Brand[];
  errors: Record<string, string>;
}

export interface ProductShowProps extends PageProps {
  product: Product;
  related_products: Product[];
  whatsapp_number: string;
}

export interface CategoryIndexProps extends PageProps {
  categories: Pagination<Category>;
}

export interface CategoryFormProps extends PageProps {
  category?: Category;
  parent_categories: Category[];
  errors: Record<string, string>;
}

export interface BrandIndexProps extends PageProps {
  brands: Pagination<Brand>;
}

export interface BrandFormProps extends PageProps {
  brand?: Brand;
  errors: Record<string, string>;
}

export interface InventoryProps extends PageProps {
  products: Pagination<Product>;
}

export interface BannerIndexProps extends PageProps {
  banners: Pagination<Banner>;
}

export interface BannerFormProps extends PageProps {
  banner?: Banner;
  errors: Record<string, string>;
}

export interface AnalyticsProps extends PageProps {
  summary: {
    total_views: number;
    total_searches: number;
    total_whatsapp: number;
  };
  daily_views: { date: string; count: number }[];
  daily_whatsapp: { date: string; count: number }[];
  popular_products: Product[];
  popular_searches: { term: string; count: number }[];
}

export interface ActivityLogIndexProps extends PageProps {
  logs: Pagination<ActivityLog>;
}

export interface SettingsProps extends PageProps {
  settings: Record<string, string>;
  errors: Record<string, string>;
}

export interface CatalogProps extends PageProps {
  products: Pagination<Product>;
  categories: Category[];
  brands: Brand[];
  filters: {
    search?: string;
    category?: string;
    brand?: string;
    sort?: string;
    min_price?: string;
    max_price?: string;
    in_stock?: string;
  };
}

export interface HomeProps extends PageProps {
  banners: Banner[];
  categories: Category[];
  featured_products: Product[];
  latest_products: Product[];
}

export interface LoginProps extends PageProps {
  errors: Record<string, string>;
}
