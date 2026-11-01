<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1f2937;
            margin: 0;
            padding: 32px;
            background: #f9fafb;
            font-size: 13px;
            line-height: 1.5;
        }
        .sheet {
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 36px;
        }
        .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #111827; padding-bottom: 20px; }
        .brand { font-size: 20px; font-weight: 700; margin: 0; }
        .muted { color: #6b7280; font-size: 12px; margin: 2px 0 0; }
        .doc-title { text-align: right; }
        .doc-title h1 { font-size: 22px; margin: 0 0 4px; letter-spacing: 1px; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; background: #eef2ff; color: #3730a3; }
        .meta { display: flex; justify-content: space-between; gap: 24px; margin: 24px 0; }
        .meta h3 { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #9ca3af; margin: 0 0 6px; }
        .meta p { margin: 1px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        thead th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding: 8px 6px; }
        tbody td { padding: 10px 6px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
        .right { text-align: right; }
        .totals { width: 100%; max-width: 320px; margin-left: auto; margin-top: 16px; }
        .totals td { padding: 5px 0; }
        .totals .grand td { border-top: 2px solid #111827; padding-top: 10px; font-size: 16px; font-weight: 700; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 11px; }
        .actions { max-width: 820px; margin: 0 auto 16px; text-align: right; }
        .actions button { background: #111827; color: #fff; border: 0; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; }
        @media print {
            body { background: #fff; padding: 0; }
            .sheet { border: 0; border-radius: 0; padding: 0; max-width: none; }
            .actions { display: none; }
        }
    </style>
</head>
<body>
    <div class="actions">
        <button onclick="window.print()">Cetak / Simpan PDF</button>
    </div>

    <div class="sheet">
        <div class="header">
            <div>
                <p class="brand">{{ $storeName }}</p>
                <p class="muted">{{ $storeAddress }}</p>
                @if ($storePhone)
                    <p class="muted">Telp/WA: {{ $storePhone }}</p>
                @endif
            </div>
            <div class="doc-title">
                <h1>INVOICE</h1>
                <p class="muted">{{ $order->order_number }}</p>
                <span class="badge">{{ $order->status_label }}</span>
            </div>
        </div>

        <div class="meta">
            <div>
                <h3>Ditagihkan kepada</h3>
                <p><strong>{{ $order->customer_name }}</strong></p>
                <p>{{ $order->customer_email }}</p>
                <p>{{ $order->customer_phone }}</p>
            </div>
            <div>
                <h3>Tanggal</h3>
                <p>{{ $order->created_at?->format('d/m/Y H:i') }}</p>
                <h3 style="margin-top: 12px;">Pembayaran</h3>
                <p>{{ $order->payment_status_label }}</p>
            </div>
            <div>
                <h3>Alamat Pengiriman</h3>
                @if ($order->shipping_method === 'pickup')
                    <p>Ambil di toko</p>
                @elseif ($order->address)
                    <p>{{ $order->address->recipient_name }}</p>
                    <p>{{ $order->address->phone }}</p>
                    <p>{{ $order->address->full_address }}</p>
                @else
                    <p>-</p>
                @endif
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Produk</th>
                    <th>SKU</th>
                    <th class="right">Harga</th>
                    <th class="right">Qty</th>
                    <th class="right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->items as $item)
                    <tr>
                        <td>
                            <strong>{{ $item->product_name }}</strong>
                            @if ($item->variant_label)
                                <br><span class="muted">{{ $item->variant_label }}</span>
                            @endif
                        </td>
                        <td>{{ $item->sku }}</td>
                        <td class="right">Rp {{ number_format((float) $item->price, 0, ',', '.') }}</td>
                        <td class="right">{{ $item->quantity }}</td>
                        <td class="right">Rp {{ number_format((float) $item->subtotal, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <table class="totals">
            <tr>
                <td>Subtotal</td>
                <td class="right">Rp {{ number_format((float) $order->subtotal, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Ongkos kirim</td>
                <td class="right">Rp {{ number_format((float) $order->shipping_total, 0, ',', '.') }}</td>
            </tr>
            @if ((float) $order->discount_total > 0)
                <tr>
                    <td>Diskon</td>
                    <td class="right">- Rp {{ number_format((float) $order->discount_total, 0, ',', '.') }}</td>
                </tr>
            @endif
            @if ((float) $order->unique_code > 0)
                <tr>
                    <td>Kode unik</td>
                    <td class="right">Rp {{ number_format((float) $order->unique_code, 0, ',', '.') }}</td>
                </tr>
            @endif
            <tr class="grand">
                <td>Total</td>
                <td class="right">Rp {{ number_format((float) $order->grand_total, 0, ',', '.') }}</td>
            </tr>
        </table>

        @if ($order->notes)
            <div class="footer">
                <strong>Catatan pesanan:</strong> {{ $order->notes }}
            </div>
        @endif

        <div class="footer">
            Terima kasih telah berbelanja di {{ $storeName }}. Invoice ini dibuat otomatis dan sah tanpa tanda tangan.
        </div>
    </div>
</body>
</html>
