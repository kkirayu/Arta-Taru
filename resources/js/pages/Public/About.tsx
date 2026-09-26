import { Head } from '@inertiajs/react';
import { MapPin, Clock, Phone, Mail, Shield, Truck, Headphones } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import type { PageProps } from '@/types';

export default function About() {
  return (
    <PublicLayout>
      <Head title="Tentang Kami" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Tentang Toko Arta Taru</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Toko Arta Taru adalah toko peralatan dan perlengkapan yang menyediakan berbagai
              kebutuhan Anda dengan kualitas terbaik dan harga terjangkau. Kami melayani
              pembelian satuan maupun grosir untuk kebutuhan rumah tangga, pertukangan, dan
              industri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kualitas Terjamin</h3>
              <p className="text-sm text-gray-500">Semua produk dijamin keaslian dan kualitasnya</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pengiriman Cepat</h3>
              <p className="text-sm text-gray-500">Pesanan diproses dan dikirim dengan cepat</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Layanan Pelanggan</h3>
              <p className="text-sm text-gray-500">Tim kami siap membantu Anda kapan saja</p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Toko</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Alamat</h3>
                  <p className="text-sm text-gray-500">Kunjungi toko kami untuk melihat produk secara langsung</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Jam Operasional</h3>
                  <p className="text-sm text-gray-500">Senin - Sabtu: 08:00 - 17:00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Telepon / WhatsApp</h3>
                  <p className="text-sm text-gray-500">Hubungi kami untuk pertanyaan dan pemesanan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
