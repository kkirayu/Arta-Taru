<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'parent_id', 'name', 'slug', 'description', 'image',
        'seo_title', 'meta_description', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function allProducts()
    {
        $ids = $this->allDescendantIds()->push($this->id);
        return Product::whereIn('category_id', $ids);
    }

    public function allDescendantIds()
    {
        $ids = collect();
        $this->loadChildrenRecursive($ids);
        return $ids;
    }

    private function loadChildrenRecursive($ids, $categories = null)
    {
        if ($categories === null) {
            $categories = $this->children()->get();
        } else {
            $categories = $categories->flatMap->children;
        }
        foreach ($categories as $child) {
            $ids->push($child->id);
            if ($child->children()->exists()) {
                $this->loadChildrenRecursive($ids, collect([$child]));
            }
        }
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }
}
