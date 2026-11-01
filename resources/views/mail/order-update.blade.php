@php
    use App\Support\StoreSettings;

    $bankAccounts = StoreSettings::bankAccounts();
    $trackUrl = url('/lacak-pesanan?order=' . $order->order_number . '&email=' . urlencode($order->customer_email));
    $stageTitle = match ($stage) {
        'placed' => 'Terima kasih, pesanan Anda sudah kami terima',
        'paid' => 'Pembayaran Anda sudah kami verifikasi',
        'rejected' => 'Bukti transfer perlu diperbaiki',
        'shipped' => 'Pesanan Anda sedang dalam pengiriman',
        'completed' => 'Pesanan Anda telah selesai',
        'cancelled' => 'Pesanan Anda dibatalkan',
        default => 'Update pesanan Anda',
    };
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>{{ $order->order_number }}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
                <tr>
                    <td style="background:#111827;color:#ffffff;padding:20px 24px;">
                        <div style="font-size:18px;font-weight:bold;">{{ StoreSettings::storeName() }}</div>
                        <div style="font-size:13px;color:#9ca3af;margin-top:4px;">{{ $stageTitle }}</div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:24px;">
                        <p style="margin:0 0 8px;font-size:14px;">Halo {{ $order->customer_name }},</p>

                        @if ($stage === 'placed')
                            <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
                                Pesanan <strong>{{ $order->order_number }}</strong> sudah dibuat. Silakan selesaikan pembayaran
                                sebelum <strong>{{ $order->expires_at?->translatedFormat('d F Y H:i') }} WIB</strong>.
                            </p>
                            @if (count($bankAccounts))
                                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:16px;">
                                    <div style="font-size:13px;font-weight:bold;margin-bottom:8px;">Transfer ke rekening:</div>
                                    @foreach ($bankAccounts as $bank)
                                        <div style="font-size:13px;line-height:1.7;">
                                            <strong>{{ $bank['bank'] ?? '-' }}</strong> — {{ $bank['account_number'] ?? '-' }}<br>
                                            a.n. {{ $bank['account_name'] ?? '-' }}
                                        </div>
                                    @endforeach
                                    <div style="font-size:13px;margin-top:10px;">
                                        Nominal: <strong>Rp {{ number_format((float) $order->grand_total, 0, ',', '.') }}</strong>
                                        @if ((float) $order->unique_code > 0)
                                            <span style="color:#b45309;">(termasuk kode unik {{ number_format((float) $order->unique_code, 0, ',', '.') }})</span>
                                        @endif
                                    </div>
                                </div>
                            @endif
                        @elseif ($stage === 'paid')
                            <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
                                Pembayaran pesanan <strong>{{ $order->order_number }}</strong> sudah kami terima dan pesanan sedang diproses.
                            </p>
                        @elseif ($stage === 'rejected')
                            <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
                                Bukti transfer untuk pesanan <strong>{{ $order->order_number }}</strong> belum dapat kami verifikasi.
                                Silakan unggah ulang bukti transfer melalui halaman pesanan.
                            </p>
                            @if ($order->latestPayment?->rejection_reason)
                                <p style="margin:0 0 16px;font-size:13px;color:#b91c1c;">Alasan: {{ $order->latestPayment->rejection_reason }}</p>
                            @endif
                        @elseif ($stage === 'shipped')
                            <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
                                Pesanan <strong>{{ $order->order_number }}</strong> sudah dikirim.
                            </p>
                            <p style="margin:0 0 16px;font-size:13px;">
                                Kurir: <strong>{{ $order->shipping_courier ?: '-' }}</strong><br>
                                Nomor resi: <strong>{{ $order->tracking_number ?: '-' }}</strong>
                            </p>
                        @elseif ($stage === 'completed')
                            <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
                                Pesanan <strong>{{ $order->order_number }}</strong> telah selesai. Terima kasih sudah berbelanja!
                                Kami senang jika Anda berkenan memberi ulasan produk.
                            </p>
                        @elseif ($stage === 'cancelled')
                            <p style="margin:0 0 16px;font-size:14px;line-height:1.6;">
                                Pesanan <strong>{{ $order->order_number }}</strong> dibatalkan. Jika Anda sudah melakukan transfer,
                                silakan hubungi toko untuk proses pengembalian dana.
                            </p>
                        @endif

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;margin-top:8px;">
                            @foreach ($order->items as $item)
                                <tr>
                                    <td style="padding:10px 0;font-size:13px;">
                                        {{ $item->product_name }}
                                        @if ($item->variant_label)
                                            <span style="color:#6b7280;">({{ $item->variant_label }})</span>
                                        @endif
                                        <span style="color:#6b7280;">× {{ $item->quantity }}</span>
                                    </td>
                                    <td align="right" style="padding:10px 0;font-size:13px;">
                                        Rp {{ number_format((float) $item->subtotal, 0, ',', '.') }}
                                    </td>
                                </tr>
                            @endforeach
                            <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Subtotal</td>
                                <td align="right" style="padding:6px 0;font-size:13px;">Rp {{ number_format((float) $order->subtotal, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Ongkir</td>
                                <td align="right" style="padding:6px 0;font-size:13px;">Rp {{ number_format((float) $order->shipping_total, 0, ',', '.') }}</td>
                            </tr>
                            @if ((float) $order->unique_code > 0)
                                <tr>
                                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Kode unik</td>
                                    <td align="right" style="padding:6px 0;font-size:13px;">Rp {{ number_format((float) $order->unique_code, 0, ',', '.') }}</td>
                                </tr>
                            @endif
                            <tr>
                                <td style="padding:12px 0;border-top:1px solid #e5e7eb;font-size:14px;font-weight:bold;">Total</td>
                                <td align="right" style="padding:12px 0;border-top:1px solid #e5e7eb;font-size:14px;font-weight:bold;">
                                    Rp {{ number_format((float) $order->grand_total, 0, ',', '.') }}
                                </td>
                            </tr>
                        </table>

                        @if ($order->address)
                            <div style="margin-top:16px;font-size:13px;color:#374151;line-height:1.6;">
                                <strong>Alamat pengiriman</strong><br>
                                {{ $order->address->recipient_name }} — {{ $order->address->phone }}<br>
                                {{ $order->address->full_address }}
                            </div>
                        @endif

                        <div style="margin-top:24px;">
                            <a href="{{ $trackUrl }}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;">
                                Lacak pesanan
                            </a>
                        </div>

                        <p style="margin:24px 0 0;font-size:12px;color:#6b7280;line-height:1.6;">
                            Butuh bantuan? Hubungi kami di
                            <a href="https://wa.me/{{ StoreSettings::whatsappNumber() }}" style="color:#111827;">WhatsApp toko</a>.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background:#f9fafb;padding:16px 24px;font-size:12px;color:#6b7280;">
                        {{ StoreSettings::storeName() }} · {{ StoreSettings::get('store_address') }}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
