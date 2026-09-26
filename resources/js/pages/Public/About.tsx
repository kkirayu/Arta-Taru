import { Head } from '@inertiajs/react';
import { MapPin, Clock, Phone, Shield, Truck, Headphones, Package, CheckCircle } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

export default function About() {
  return (
    <PublicLayout>
      <Head title="Tentang Kami" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Tentang Toko Arta Taru</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Peralatan dan perlengkapan lengkap dengan kualitas terbaik dan harga terjangkau
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Description */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-gray-600 leading-relaxed text-lg">
            Toko Arta Taru adalah toko peralatan dan perlengkapan yang menyediakan berbagai
            kebutuhan Anda dengan kualitas terbaik dan harga terjangkau. Kami melayani
            pembelian satuan maupun grosir untuk kebutuhan rumah tangga, pertukangan, dan
            industri. Dengan pengalaman bertahun-tahun, kami berkomitmen memberikan
            produk asli dan layanan terbaik.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[
            { icon: Shield, title: 'Kualitas Terjamin', desc: 'Semua produk dijamin keaslian dan kualitasnya. Hanya produk terbaik yang kami sediakan untuk Anda.', color: 'bg-blue-50 text-blue-600' },
            { icon: Truck, title: 'Pengiriman Cepat', desc: 'Pesanan diproses dan dikirim dengan cepat ke berbagai daerah. Estimasi pengiriman jelas.', color: 'bg-green-50 text-green-600' },
            { icon: Headphones, title: 'Layanan Pelanggan', desc: 'Tim kami siap membantu Anda kapan saja melalui WhatsApp. Respon cepat dan solusi tepat.', color: 'bg-purple-50 text-purple-600' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-4`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Store info */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Informasi Toko</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-gray-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Alamat</h3>
                <p className="text-sm text-gray-500">Jl. Malioboro No. 45, Yogyakarta, DI Yogyakarta 55271</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-gray-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Jam Operasional</h3>
                <p className="text-sm text-gray-500">Senin - Sabtu: 08:00 - 21:00 WIB</p>
                <p className="text-sm text-gray-400">Minggu: 09:00 - 17:00 WIB</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-gray-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Telepon / WhatsApp</h3>
                <p className="text-sm text-gray-500">0888-2869-727</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/kontak"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-md"
          >
            Hubungi Kami Sekarang
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
