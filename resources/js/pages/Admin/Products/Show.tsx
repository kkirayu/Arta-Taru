import { useState, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Package, Upload, X, Star, Eye, EyeOff, Image as ImageIcon, Loader2, Check, Plus, Layers, Power } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import ConfirmDialog from '@/components/ConfirmDialog';
import { compressImage } from '@/lib/image';
import type { ProductShowProps, ProductImage, ProductVariant } from '@/types';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ImageItem extends ProductImage {}

interface VariantForm {
  name: string;
  sku: string;
  size: string;
  color: string;
  price: string;
  stock: string;
  is_active: boolean;
  sort_order: string;
}

const emptyVariantForm: VariantForm = {
  name: '',
  sku: '',
  size: '',
  color: '',
  price: '',
  stock: '0',
  is_active: true,
  sort_order: '0',
};

export default function ProductShow({ product }: ProductShowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [images, setImages] = useState<ImageItem[]>(
    (product.images || []).map((img) => ({ ...img }))
  );
  const variants = product.variants || [];
  const [variantOpen, setVariantOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [variantForm, setVariantForm] = useState<VariantForm>({ ...emptyVariantForm });
  const [variantErrors, setVariantErrors] = useState<Record<string, string>>({});
  const [variantToDelete, setVariantToDelete] = useState<ProductVariant | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [editingAlt, setEditingAlt] = useState<number | null>(null);
  const [altText, setAltText] = useState('');
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    router.delete(`/admin/products/${product.id}`);
  };

  const handleTogglePublish = () => {
    router.post(`/admin/products/${product.id}/toggle-publish`, {}, { preserveScroll: true });
  };

  const handleToggleFeatured = () => {
    router.post(`/admin/products/${product.id}/toggle-featured`, {}, { preserveScroll: true });
  };

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArr.length === 0) {
      setUploadError('Pilih file gambar yang valid (JPEG, PNG, WebP, GIF).');
      return;
    }

    setUploading(true);
    setUploadError(null);

    for (const file of fileArr) {
      let compressed: File;

      try {
        // Vercel rejects request bodies over 4.5 MB, so keep every upload under 4 MB.
        compressed = await compressImage(file, 4 * 1024 * 1024);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : `Gagal memproses ${file.name}.`);
        continue;
      }

      const formData = new FormData();
      formData.append('image', compressed);

      try {
        const res = await fetch(`/admin/products/${product.id}/images`, {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `Gagal upload ${file.name}`);
        }

        const data = await res.json();
        const newImage: ImageItem = { ...data };
        setImages((prev) => [...prev, newImage]);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload gagal.');
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [product.id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      const res = await fetch(`/admin/products/${product.id}/images/${imageId}/set-primary`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      if (res.ok) {
        setImages((prev) =>
          prev.map((img) => ({ ...img, is_primary: img.id === imageId }))
        );
      }
    } catch {}
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      const res = await fetch(`/admin/products/${product.id}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        setImageToDelete(null);
      }
    } catch {}
  };

  const handleSaveAlt = async (imageId: number) => {
    try {
      const res = await fetch(`/admin/products/${product.id}/images/${imageId}/alt-text`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ alt_text: altText }),
      });
      if (res.ok) {
        setImages((prev) =>
          prev.map((img) => (img.id === imageId ? { ...img, alt_text: altText } : img))
        );
        setEditingAlt(null);
      }
    } catch {}
  };

  const openVariantCreate = () => {
    setEditingVariant(null);
    setVariantForm({
      ...emptyVariantForm,
      sku: `${product.sku}-`,
      sort_order: String(variants.length),
    });
    setVariantErrors({});
    setVariantOpen(true);
  };

  const openVariantEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setVariantForm({
      name: variant.name,
      sku: variant.sku,
      size: variant.size || '',
      color: variant.color || '',
      price: variant.price != null ? String(variant.price) : '',
      stock: String(variant.stock),
      is_active: variant.is_active !== false,
      sort_order: String(variant.sort_order ?? 0),
    });
    setVariantErrors({});
    setVariantOpen(true);
  };

  const submitVariant = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: variantForm.name,
      sku: variantForm.sku,
      size: variantForm.size || null,
      color: variantForm.color || null,
      price: variantForm.price === '' ? null : Number(variantForm.price),
      stock: Number(variantForm.stock || 0),
      is_active: variantForm.is_active,
      sort_order: Number(variantForm.sort_order || 0),
    };
    const options = {
      preserveScroll: true,
      onSuccess: () => { setVariantOpen(false); setVariantErrors({}); },
      onError: (errs: Record<string, string>) => setVariantErrors(errs),
    };

    if (editingVariant) {
      router.put(`/admin/products/${product.id}/variants/${editingVariant.id}`, payload, options);
    } else {
      router.post(`/admin/products/${product.id}/variants`, payload, options);
    }
  };

  const deleteVariant = () => {
    if (!variantToDelete) return;
    router.delete(`/admin/products/${product.id}/variants/${variantToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => setVariantToDelete(null),
    });
  };

  const toggleVariantActive = (variant: ProductVariant) => {
    router.put(
      `/admin/products/${product.id}/variants/${variant.id}`,
      {
        name: variant.name,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        price: variant.price,
        stock: variant.stock,
        is_active: !(variant.is_active !== false),
        sort_order: variant.sort_order,
      },
      { preserveScroll: true }
    );
  };

  const variantField = <K extends keyof VariantForm>(key: K, value: VariantForm[K]) => {
    setVariantForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <Head title={product.name} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Detail Produk</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={handleTogglePublish}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              {product.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {product.is_active ? 'Sembunyikan' : 'Tampilkan'}
            </button>
            <button
              onClick={handleToggleFeatured}
              className={`inline-flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-lg ${
                product.is_featured ? 'border-yellow-300 bg-yellow-50 text-yellow-700' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Star className={`w-4 h-4 ${product.is_featured ? 'fill-current' : ''}`} />
              {product.is_featured ? 'Featured' : 'Set Featured'}
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Hapus
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Manager */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Gambar Produk</h2>
                <span className="text-xs text-gray-400">{images.length} gambar</span>
              </div>

              {/* Upload area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 mb-4 cursor-pointer transition-all ${
                  dragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="text-center">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-sm text-gray-600">Mengupload gambar...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Klik atau drag gambar ke sini
                      </p>
                      <p className="text-xs text-gray-400">
                        JPEG, PNG, WebP, GIF. Otomatis dikompres, maks 4MB per file.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Upload error */}
              {uploadError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{uploadError}</p>
                  <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-600 ml-auto">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Image grid */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 group ${
                        img.is_primary ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt_text || product.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Primary badge */}
                      {img.is_primary && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-md shadow-sm">
                          UTAMA
                        </span>
                      )}

                      {/* Action overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        {!img.is_primary && (
                          <button
                            onClick={() => handleSetPrimary(img.id)}
                            className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-blue-600 transition-colors"
                            title="Set sebagai gambar utama"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingAlt(img.id);
                            setAltText(img.alt_text || '');
                          }}
                          className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-gray-600 transition-colors"
                          title="Edit alt text"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setImageToDelete(img.id)}
                          className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-red-500 transition-colors"
                          title="Hapus gambar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Alt text indicator */}
                      {img.alt_text && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur px-2 py-1">
                          <p className="text-[10px] text-white truncate">{img.alt_text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                  <div className="text-center">
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Belum ada gambar</p>
                  </div>
                </div>
              )}

              {/* Alt text editor */}
              {editingAlt !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Edit Alt Text</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Deskripsi gambar untuk SEO"
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveAlt(editingAlt)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Simpan
                    </button>
                    <button
                      onClick={() => setEditingAlt(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* Delete image confirm */}
              {imageToDelete !== null && (
                <ConfirmDialog
                  open={true}
                  title="Hapus Gambar"
                  message="Yakin ingin menghapus gambar ini?"
                  confirmLabel="Hapus"
                  onConfirm={() => handleDeleteImage(imageToDelete)}
                  onCancel={() => setImageToDelete(null)}
                  variant="danger"
                />
              )}
            </div>

            {/* Product info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-4 flex-wrap">
                <span>SKU: {product.sku}</span>
                {product.brand && <span>| {product.brand.name}</span>}
                {product.category && (
                  <span>| <Link href={`/admin/products?category=${product.category.slug}`} className="text-blue-600 hover:underline">{product.category.name}</Link></span>
                )}
              </div>

              {product.short_description && (
                <p className="text-gray-600 mb-4">{product.short_description}</p>
              )}

              {product.description && (
                <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }} />
              )}
            </div>

            {/* Variants */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-gray-400" /> Varian Produk
                </h2>
                <button
                  onClick={openVariantCreate}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" /> Tambah Varian
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Stok produk otomatis mengikuti total stok semua varian. Harga varian bersifat opsional dan menimpa harga produk.
              </p>

              {variants.length === 0 ? (
                <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Belum ada varian. Produk dijual sebagai satu SKU.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2.5 px-2 font-medium text-gray-500">Varian</th>
                        <th className="text-left py-2.5 px-2 font-medium text-gray-500">SKU</th>
                        <th className="text-left py-2.5 px-2 font-medium text-gray-500">Harga</th>
                        <th className="text-left py-2.5 px-2 font-medium text-gray-500">Stok</th>
                        <th className="text-left py-2.5 px-2 font-medium text-gray-500">Status</th>
                        <th className="text-right py-2.5 px-2 font-medium text-gray-500">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant) => (
                        <tr key={variant.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 px-2">
                            <p className="font-medium text-gray-900">{variant.label || variant.name}</p>
                            <p className="text-xs text-gray-500">
                              {[variant.size, variant.color].filter(Boolean).join(' · ') || variant.name}
                            </p>
                          </td>
                          <td className="py-2.5 px-2 font-mono text-xs text-gray-600">{variant.sku}</td>
                          <td className="py-2.5 px-2 text-gray-700">
                            {variant.price != null ? formatPrice(Number(variant.price)) : <span className="text-gray-400">Harga produk</span>}
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={variant.stock <= 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                              {variant.stock}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              variant.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {variant.is_active !== false ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => toggleVariantActive(variant)}
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                                title="Toggle status"
                              >
                                <Power className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openVariantEdit(variant)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setVariantToDelete(variant)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Spesifikasi</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec) => (
                      <tr key={spec.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-2.5 text-gray-500 w-1/3">{spec.key}</td>
                        <td className="py-2.5 text-gray-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Harga & Stok</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Harga</span>
                  <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
                </div>
                {product.sale_price && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Harga Sale</span>
                    <span className="font-medium text-red-600">{formatPrice(product.sale_price)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stok</span>
                  <span className={`font-medium ${product.stock <= product.low_stock_threshold ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.stock}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {product.is_active ? 'Aktif' : 'Hidden'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Unggulan</span>
                  <span className={`font-medium ${product.is_featured ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {product.is_featured ? 'Ya' : 'Tidak'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">SEO Title</span>
                  <p className="text-gray-900 mt-0.5">{product.seo_title || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Meta Description</span>
                  <p className="text-gray-900 mt-0.5">{product.meta_description || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Canonical URL</span>
                  <p className="text-gray-900 mt-0.5">{product.canonical_url || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Info Tambahan</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Dibuat</span>
                  <span className="text-gray-900">{new Date(product.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Diupdate</span>
                  <span className="text-gray-900">{new Date(product.updated_at).toLocaleDateString('id-ID')}</span>
                </div>
                {product.published_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dipublikasi</span>
                    <span className="text-gray-900">{new Date(product.published_at).toLocaleDateString('id-ID')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {variantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setVariantOpen(false)} />
          <form onSubmit={submitVariant} className="relative bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">{editingVariant ? 'Edit Varian' : 'Tambah Varian'}</h3>
              <button type="button" onClick={() => setVariantOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Varian *</label>
                  <input value={variantForm.name} onChange={(e) => variantField('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Contoh: Merah - L" required />
                  {variantErrors.name && <p className="text-[11px] text-red-600 mt-0.5">{variantErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SKU *</label>
                  <input value={variantForm.sku} onChange={(e) => variantField('sku', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                  {variantErrors.sku && <p className="text-[11px] text-red-600 mt-0.5">{variantErrors.sku}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ukuran</label>
                  <input value={variantForm.size} onChange={(e) => variantField('size', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="S / M / L / XL" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Warna</label>
                  <input value={variantForm.color} onChange={(e) => variantField('color', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Merah / Hitam" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input type="number" min="0" value={variantForm.price} onChange={(e) => variantField('price', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Opsional" />
                  {variantErrors.price && <p className="text-[11px] text-red-600 mt-0.5">{variantErrors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stok *</label>
                  <input type="number" min="0" value={variantForm.stock} onChange={(e) => variantField('stock', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                  {variantErrors.stock && <p className="text-[11px] text-red-600 mt-0.5">{variantErrors.stock}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Urutan</label>
                  <input type="number" min="0" value={variantForm.sort_order} onChange={(e) => variantField('sort_order', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={variantForm.is_active} onChange={(e) => variantField('is_active', e.target.checked)} className="rounded border-gray-300 text-blue-600" />
                Varian aktif dan tampil di toko
              </label>
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
              <button type="button" onClick={() => setVariantOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                {editingVariant ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={variantToDelete !== null}
        title="Hapus Varian"
        message={`Yakin ingin menghapus varian "${variantToDelete?.name ?? ''}"? Stok produk akan dihitung ulang.`}
        confirmLabel="Hapus"
        onConfirm={deleteVariant}
        onCancel={() => setVariantToDelete(null)}
        variant="danger"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        variant="danger"
      />
    </AdminLayout>
  );
}
