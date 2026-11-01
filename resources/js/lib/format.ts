export function formatPrice(amount: number | string | null | undefined): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number | string | null | undefined): string {
  const parsed = typeof value === 'string' ? parseFloat(value) : value ?? 0;

  return new Intl.NumberFormat('id-ID').format(Number.isFinite(parsed) ? parsed : 0);
}

export function formatDate(value: string | null | undefined, withTime = true): string {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

export function formatShortDate(value: string | null | undefined): string {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export const orderStatusClasses: Record<string, string> = {
  pending_payment: 'bg-amber-100 text-amber-800 border-amber-200',
  waiting_confirmation: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
};

export const paymentStatusClasses: Record<string, string> = {
  unpaid: 'bg-amber-100 text-amber-800 border-amber-200',
  waiting_confirmation: 'bg-blue-100 text-blue-800 border-blue-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function whatsappLink(number: string, message: string): string {
  const phone = (number || '').replace(/[^0-9]/g, '');

  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function assetUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  return path;
}
