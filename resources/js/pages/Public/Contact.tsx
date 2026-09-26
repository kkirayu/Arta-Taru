import { Head } from '@inertiajs/react';
import { Phone, MapPin, Clock, MessageCircle, Camera, Globe, Video, Mail } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

export default function Contact() {
  return (
    <PublicLayout>
      <Head title="Kontak Kami" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hubungi Kami</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                  <p className="text-sm text-gray-500 mb-2">Chat langsung untuk pertanyaan dan pemesanan</p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Kirim Pesan
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                  <p className="text-sm text-gray-500">Hubungi kami di nomor telepon toko</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                  <p className="text-sm text-gray-500">Kunjungi toko kami untuk melihat produk secara langsung</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                  <p className="text-sm text-gray-500">Senin - Sabtu: 08:00 - 17:00</p>
                  <p className="text-sm text-gray-500">Minggu: Tutup</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Peta Lokasi</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ikuti Kami</h3>
              <div className="flex gap-3">
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
                  <Camera className="w-4 h-4" />
                  Instagram
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  <Globe className="w-4 h-4" />
                  Facebook
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                  <Video className="w-4 h-4" />
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
