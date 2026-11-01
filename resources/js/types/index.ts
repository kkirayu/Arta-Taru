export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  avatar?: string | null;
  is_active?: boolean;
  email_verified_at?: string | null;
  two_factor_enabled?: boolean;
  two_factor_confirmed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
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

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  name: string;
  size: string | null;
  color: string | null;
  price: number | null;
  stock: number;
  product_image_id: number | null;
  is_active: boolean;
  sort_order: number;
  label?: string;
  image?: ProductImage | null;
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
  variants?: ProductVariant[];
  active_variants?: ProductVariant[];
  effective_price?: number;
  stock_status_label?: string;
  average_rating?: number;
  approved_reviews_avg_rating?: number | null;
  approved_reviews_count?: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  path: string;
  url?: string;
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
  prev_page_url: string | null;
  next_page_url: string | null;
}

/* ------------------------------------------------------------------------- */
/* Commerce                                                                   */
/* ------------------------------------------------------------------------- */

export interface BankAccount {
  bank: string;
  account_number: string;
  account_name: string;
}

export interface ShippingDestination {
  province: string;
  cities: string[];
}

export interface ShippingRate {
  id: number;
  province: string;
  city: string | null;
  district: string | null;
  cost: number;
  free_shipping_min_total: number | null;
  eta_min_days: number;
  eta_max_days: number;
  eta_label?: string;
  area_label?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface CartLine {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  variant_id: number | null;
  variant_label: string | null;
  image: string | null;
  price: number;
  quantity: number;
  line_total: number;
  available_stock: number;
}

export interface CartSummary {
  items: CartLine[];
  subtotal: number;
  count: number;
  issues: string[];
}

export interface CustomerAddress {
  id: number;
  user_id: number;
  label: string;
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  district: string | null;
  postal_code: string | null;
  address_line: string;
  notes: string | null;
  is_default: boolean;
  full_address?: string;
  created_at: string;
}

export interface OrderAddress {
  id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  province: string;
  city: string;
  district: string | null;
  postal_code: string | null;
  notes: string | null;
  full_address?: string;
}

export interface Payment {
  id: number;
  order_id: number;
  method: string;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  amount: number;
  proof_path: string | null;
  status: 'pending' | 'verified' | 'rejected';
  status_label?: string;
  verified_by: number | null;
  verified_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  verifier?: User | null;
  order?: Order;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_variant_id: number | null;
  product_name: string;
  sku: string;
  variant_label: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  weight: number | null;
  product?: Product;
  review?: Review | null;
}

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  from_status: string | null;
  to_status: string;
  to_status_label?: string;
  note: string | null;
  changed_by: number | null;
  created_at: string;
  user?: User | null;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  status_label?: string;
  payment_status: string;
  payment_status_label?: string;
  payment_method: string;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  unique_code: number;
  grand_total: number;
  shipping_method: string | null;
  shipping_courier: string | null;
  tracking_number: string | null;
  notes: string | null;
  admin_notes: string | null;
  expires_at: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  items_count?: number;
  address?: OrderAddress | null;
  payments?: Payment[];
  latest_payment?: Payment | null;
  status_histories?: OrderStatusHistory[];
  user?: User | null;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number | null;
  order_item_id: number | null;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  product?: Product;
  user?: User | null;
}

export interface DailyStat {
  id: number;
  date: string;
  revenue: number;
  orders_count: number;
  paid_orders_count: number;
  items_sold: number;
  product_views: number;
  add_to_cart: number;
  checkouts: number;
  new_customers: number;
}

export interface StoreInfo {
  name: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  hours: string;
  instagram_url: string;
  facebook_url: string;
  free_shipping_min_total: number | null;
  payment_expiry_hours: number;
}

export interface PageProps {
  auth: { user: User | null; customer: Customer | null };
  cart_count: number;
  wishlist_count: number;
  unread_notifications: number;
  store: StoreInfo;
  flash: { success: string | null; error: string | null };
  errors: Record<string, string>;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------------- */
/* Page props                                                                 */
/* ------------------------------------------------------------------------- */

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
}

export interface ProductShowProps extends PageProps {
  product: Product;
  related_products: Product[];
  whatsapp_number: string;
  reviews?: Review[];
  review_summary?: { count: number; average: number };
  reviewable_item?: OrderItem | null;
  shipping_rates?: ShippingRate[];
  free_shipping_min_total?: number | null;
  is_wishlisted?: boolean;
}

export interface CategoryIndexProps extends PageProps {
  categories: Pagination<Category>;
}

export interface CategoryFormProps extends PageProps {
  category?: Category;
  parent_categories: Category[];
}

export interface BrandIndexProps extends PageProps {
  brands: Pagination<Brand>;
}

export interface BrandFormProps extends PageProps {
  brand?: Brand;
}

export interface InventoryProps extends PageProps {
  products: Pagination<Product>;
}

export interface BannerIndexProps extends PageProps {
  banners: Pagination<Banner>;
}

export interface BannerFormProps extends PageProps {
  banner?: Banner;
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
    stock_status?: string;
  };
}

export interface HomeProps extends PageProps {
  banners: Banner[];
  categories: Category[];
  featured_products: Product[];
  latest_products: Product[];
}

export interface LoginProps extends PageProps {
  alreadyLoggedIn?: boolean;
  status?: string | null;
  canResetPassword?: boolean;
}

export interface RegisterProps extends PageProps {}

export interface ForgotPasswordProps extends PageProps {
  status?: string;
}

export interface ResetPasswordProps extends PageProps {
  token: string;
  email: string | null;
}

export interface VerifyEmailProps extends PageProps {}

export interface TwoFactorChallengeProps extends PageProps {
  recoveryCodesEnabled: boolean;
}

export interface RecoveryCodeChallengeProps extends PageProps {}

export interface TwoFactorSetupProps extends PageProps {
  secret: string;
  qr_code_url: string;
  recovery_codes: string[];
}

export interface ApiToken {
  id: number;
  name: string;
  abilities: string[];
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface ApiTokensProps extends PageProps {
  tokens: Pagination<ApiToken>;
}

export interface CartPageProps extends PageProps {
  cart: CartSummary;
}

export interface CheckoutProps extends PageProps {
  cart: CartSummary;
  destinations: ShippingDestination[];
  rates: {
    province: string;
    city: string | null;
    cost: number;
    free_shipping_min_total: number | null;
    eta_label: string;
  }[];
  bank_accounts: BankAccount[];
  unique_code_enabled: boolean;
  default_address: CustomerAddress | null;
  customer: { name: string; email: string; phone: string | null } | null;
  settings: {
    store_name: string;
    whatsapp_number: string;
    store_address: string;
    store_hours: string;
    payment_expiry_hours: number;
    free_shipping_min_total: number | null;
  };
}

export interface OrderPageProps extends PageProps {
  order: Order;
  bank_accounts: BankAccount[];
  whatsapp_number?: string;
  guest_token?: string | null;
  can_upload_proof?: boolean;
}

export interface TrackProps extends PageProps {
  order_number?: string | null;
  email?: string | null;
}

export interface AccountDashboardProps extends PageProps {
  summary: {
    orders_count: number;
    active_orders: number;
    wishlist_count: number;
    total_spent: number;
  };
  recent_orders: Order[];
  default_address: CustomerAddress | null;
}

export interface AccountProfileProps extends PageProps {
  user: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'avatar'>;
}

export interface AccountOrdersProps extends PageProps {
  orders: Pagination<Order>;
  statuses: Record<string, string>;
  filters: { status?: string };
}

export interface AccountOrderProps extends PageProps {
  order: Order;
  bank_accounts: BankAccount[];
  can_review: boolean;
}

export interface AccountAddressesProps extends PageProps {
  addresses: CustomerAddress[];
  destinations: ShippingDestination[];
}

export interface StaticPageProps extends PageProps {
  title: string;
  slug: string;
  content: string;
  items: { question: string; answer: string }[];
}

export interface WishlistProps extends PageProps {
  products: Product[];
  product_ids: number[];
  is_guest: boolean;
}

/* ------------------------------------------------------------------------- */
/* Admin commerce                                                             */
/* ------------------------------------------------------------------------- */

export interface AdminOrdersProps extends PageProps {
  orders: Pagination<Order>;
  statuses: Record<string, string>;
  payment_statuses: Record<string, string>;
  counts: Record<string, number>;
  filters: {
    status?: string;
    payment_status?: string;
    search?: string;
    from?: string;
    to?: string;
  };
  pending_payments: number;
}

export interface AdminOrderShowProps extends PageProps {
  order: Order;
  statuses: Record<string, string>;
  payment_statuses: Record<string, string>;
  bank_accounts: BankAccount[];
}

export interface AdminPaymentsProps extends PageProps {
  payments: Pagination<Payment>;
  counts: { pending: number; verified: number; rejected: number };
  filters: { status?: string; search?: string };
}

export interface AdminCustomersProps extends PageProps {
  customers: Pagination<User & { orders_count: number; total_spent: number | null }>;
  filters: { search?: string; status?: string };
}

export interface AdminCustomerShowProps extends PageProps {
  customer: User & { addresses: CustomerAddress[] };
  orders: Pagination<Order>;
  summary: { orders_count: number; total_spent: number; last_order_at: string | null };
}

export interface AdminShippingRatesProps extends PageProps {
  rates: Pagination<ShippingRate>;
  filters: { search?: string };
}

export interface AdminReportsProps extends PageProps {
  summary: {
    revenue: number;
    paid_orders: number;
    orders: number;
    average_order_value: number;
    items_sold: number;
    new_customers: number;
  };
  daily: DailyStat[];
  top_products: { product_name: string; quantity: number; revenue: number }[];
  by_category: { category: string; quantity: number; revenue: number }[];
  status_breakdown: Record<string, number>;
  filters: { from: string; to: string };
}

export interface AdminReviewsProps extends PageProps {
  reviews: Pagination<Review>;
  counts: { pending: number; approved: number };
  filters: { status?: string; rating?: string };
}

export interface AdminUsersProps extends PageProps {
  users: Pagination<User>;
  filters: { search?: string };
}
