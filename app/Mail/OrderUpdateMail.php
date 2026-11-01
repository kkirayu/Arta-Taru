<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderUpdateMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $stage,
    ) {
        $this->order->loadMissing(['items', 'address']);
    }

    public function envelope(): Envelope
    {
        $subject = match ($this->stage) {
            'placed' => 'Pesanan '.$this->order->order_number.' berhasil dibuat',
            'paid' => 'Pembayaran pesanan '.$this->order->order_number.' diterima',
            'rejected' => 'Bukti transfer pesanan '.$this->order->order_number.' ditolak',
            'shipped' => 'Pesanan '.$this->order->order_number.' sedang dikirim',
            'completed' => 'Pesanan '.$this->order->order_number.' selesai',
            'cancelled' => 'Pesanan '.$this->order->order_number.' dibatalkan',
            default => 'Update pesanan '.$this->order->order_number,
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.order-update',
            with: [
                'order' => $this->order,
                'stage' => $this->stage,
            ],
        );
    }
}
