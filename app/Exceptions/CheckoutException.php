<?php

namespace App\Exceptions;

use RuntimeException;

class CheckoutException extends RuntimeException
{
    public static function emptyCart(): self
    {
        return new self('Keranjang belanja masih kosong.');
    }

    public static function shippingUnavailable(): self
    {
        return new self('Ongkos kirim untuk wilayah tersebut belum tersedia. Silakan hubungi toko.');
    }

    public static function invalidItem(string $name): self
    {
        return new self("Produk {$name} sudah tidak tersedia.");
    }
}
