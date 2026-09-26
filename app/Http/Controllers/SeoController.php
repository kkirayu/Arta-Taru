<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $url = config('app.url', 'https://artataru.com');

        $products = Product::active()->select('slug', 'updated_at')->get();
        $categories = Category::active()->select('slug', 'updated_at')->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        $xml .= '<url><loc>' . $url . '</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
        $xml .= '<url><loc>' . $url . '/tentang</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>';
        $xml .= '<url><loc>' . $url . '/kontak</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>';

        foreach ($categories as $category) {
            $xml .= '<url><loc>' . $url . '/kategori/' . $category->slug . '</loc><lastmod>' . $category->updated_at->toIso8601String() . '</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>';
        }

        foreach ($products as $product) {
            $xml .= '<url><loc>' . $url . '/produk/' . $product->slug . '</loc><lastmod>' . $product->updated_at->toIso8601String() . '</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    public function robots(): Response
    {
        $content = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: " . config('app.url', 'https://artataru.com') . "/sitemap.xml\n";

        return response($content, 200)->header('Content-Type', 'text/plain');
    }
}
