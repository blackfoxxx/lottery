<?php

// Test script for image upload functionality
function testImageUpload() {
    // Create a simple test image (1x1 pixel PNG)
    $imageData = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAHGkm3fHgAAAABJRU5ErkJggg==');
    $imagePath = '/tmp/test-image.png';
    file_put_contents($imagePath, $imageData);
    
    // Test data for product creation
    $productData = [
        'name' => 'Test Product with Image',
        'description' => 'Testing image upload functionality',
        'price' => 29.99,
        'quantity' => 10,
        'category' => 'electronics'
    ];
    
    // Test 1: Create product with file upload
    echo "Testing product creation with file upload...\n";
    $curl = curl_init();
    
    $postData = array_merge($productData, [
        'image' => new CURLFile($imagePath, 'image/png', 'test-image.png')
    ]);
    
    curl_setopt_array($curl, [
        CURLOPT_URL => 'http://localhost:8000/api/admin/products',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $postData,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json'
        ]
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    echo "HTTP Code: $httpCode\n";
    echo "Response: " . print_r(json_decode($response, true), true) . "\n\n";
    
    // Test 2: Create product with URL
    echo "Testing product creation with image URL...\n";
    $curl = curl_init();
    
    $productData['name'] = 'Test Product with URL';
    $productData['image'] = 'https://via.placeholder.com/300x300.png';
    
    curl_setopt_array($curl, [
        CURLOPT_URL => 'http://localhost:8000/api/admin/products',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($productData),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json'
        ]
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    echo "HTTP Code: $httpCode\n";
    echo "Response: " . print_r(json_decode($response, true), true) . "\n\n";
    
    // Clean up
    unlink($imagePath);
}

testImageUpload();
?>
