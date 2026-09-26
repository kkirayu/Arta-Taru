import { Head } from '@inertiajs/react';
import { Phone, MapPin, Clock, MessageCircle, Camera, Globe, Video, Package, Mail } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

export default function Contact() {
  return (
    <PublicLayout>
      <Head title="Kontak Kami" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Hubungi Kami</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Punya pertanyaan? Tim kami siap membantu Anda. Hubungi melalui WhatsApp untuk respon tercepat.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact cards */}
          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                  <p className="text-sm text-gray-500 mb-3">Chat langsung untuk pertanyaan dan pemesanan. Respon tercepat saat jam operasional.</p>
                  <a
                    href="https://wa.me/628882869727"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Kirim Pesan
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                  <p className="text-sm text-gray-500">0888-2869-727</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-500">info@artataru.com</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                  <p className="text-sm text-gray-500">Jl. Malioboro No. 45, Yogyakarta, DI Yogyakarta 55271</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                  <p className="text-sm text-gray-500">Senin - Sabtu: 08:00 - 21:00 WIB</p>
                  <p className="text-sm text-gray-400">Minggu: 09:00 - 17:00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Map placeholder */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-gray-200 h-72 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm font-medium">Peta Lokasi</p>
                  <p className="text-xs mt-1">Jl. Malioboro No. 45, Yogyakarta</p>
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ikuti Kami</h3>
              <p className="text-sm text-gray-500 mb-4">Dapatkan info produk terbaru dan promo menarik</p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Instagram
                </a>
                <a
                  href="#"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Facebook
                </a>
                <a
                  href="#"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
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
