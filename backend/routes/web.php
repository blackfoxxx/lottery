<?php

use Illuminate\Support\Facades\Route;
use App\Models\Category;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-categories', function () {
    return Category::all();
});

Route::get('/test-admin-categories', [AdminController::class, 'indexCategories']);
