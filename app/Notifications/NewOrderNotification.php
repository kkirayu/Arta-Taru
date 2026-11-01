<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_order',
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'message' => 'Order baru '.$this->order->order_number.' dari '.$this->order->customer_name,
            'amount' => (float) $this->order->grand_total,
            'url' => route('admin.orders.show', $this->order),
        ];
    }
}
