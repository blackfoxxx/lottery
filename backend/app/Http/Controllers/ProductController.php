<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'ticket_count' => 'required|integer|min:0',
            'ticket_category' => 'required|string|in:golden,silver,bronze',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'image_url' => 'nullable|string|url',
        ]);

        $data = $request->except(['image']);
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image_url'] = $this->handleImageUpload($request->file('image'));
        } elseif ($request->has('image_url') && !empty($request->image_url)) {
            $data['image_url'] = $request->image_url;
        }

        $product = Product::create($data);

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'ticket_count' => 'sometimes|required|integer|min:0',
            'ticket_category' => 'sometimes|required|string|in:golden,silver,bronze',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'image_url' => 'nullable|string|url',
        ]);

        $data = $request->except(['image']);
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if it exists and is not a URL
            if ($product->image_url && !filter_var($product->image_url, FILTER_VALIDATE_URL)) {
                $this->deleteOldImage($product->image_url);
            }
            
            $data['image_url'] = $this->handleImageUpload($request->file('image'));
        } elseif ($request->has('image_url') && !empty($request->image_url)) {
            // If updating with URL and product had a local file, delete the old file
            if ($product->image_url && !filter_var($product->image_url, FILTER_VALIDATE_URL)) {
                $this->deleteOldImage($product->image_url);
            }
            
            $data['image_url'] = $request->image_url;
        }

        $product->update($data);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        // Delete associated image file if it exists and is not a URL
        if ($product->image_url && !filter_var($product->image_url, FILTER_VALIDATE_URL)) {
            $this->deleteOldImage($product->image_url);
        }
        
        $product->delete();

        return response()->json(null, 204);
    }

    /**
     * Handle image file upload
     */
    private function handleImageUpload($imageFile)
    {
        $fileName = time() . '_' . Str::random(10) . '.' . $imageFile->getClientOriginalExtension();
        $imageFile->move(public_path('uploads/products'), $fileName);
        
        return 'uploads/products/' . $fileName;
    }

    /**
     * Delete old image file
     */
    private function deleteOldImage($imagePath)
    {
        $fullPath = public_path($imagePath);
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }
}
