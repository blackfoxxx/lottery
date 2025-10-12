<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * Get system settings
     */
    public function index()
    {
        $settings = $this->getDefaultSettings();
        
        // Try to load saved settings from cache first, then from storage
        $cachedSettings = Cache::get('system_settings');
        if ($cachedSettings) {
            $settings = array_merge($settings, $cachedSettings);
        } else {
            // Try to load from storage
            if (Storage::exists('system_settings.json')) {
                $storedSettings = json_decode(Storage::get('system_settings.json'), true);
                if ($storedSettings) {
                    $settings = array_merge($settings, $storedSettings);
                }
            }
        }
        
        return response()->json($settings);
    }

    /**
     * Update system settings
     */
    public function update(Request $request)
    {
        $request->validate([
            'platformName' => 'sometimes|string|max:255',
            'platformNameArabic' => 'sometimes|string|max:500',
            'platformDescription' => 'sometimes|string|max:1000',
            'contactEmail' => 'sometimes|email|max:255',
            'contactPhone' => 'sometimes|string|max:50',
            'goldenPrizePool' => 'sometimes|numeric|min:0',
            'silverPrizePool' => 'sometimes|numeric|min:0',
            'bronzePrizePool' => 'sometimes|numeric|min:0',
            'ticketsPerPurchase' => 'sometimes|integer|min:1|max:1000',
            'drawFrequency' => 'sometimes|string|in:daily,weekly,monthly',
            'primaryColor' => 'sometimes|string|regex:/^#[a-fA-F0-9]{6}$/',
            'secondaryColor' => 'sometimes|string|regex:/^#[a-fA-F0-9]{6}$/',
            'welcomeMessage' => 'sometimes|string|max:500',
            'footerText' => 'sometimes|string|max:255',
        ]);

        $settings = $request->only([
            'platformName',
            'platformNameArabic', 
            'platformDescription',
            'contactEmail',
            'contactPhone',
            'goldenPrizePool',
            'silverPrizePool',
            'bronzePrizePool',
            'ticketsPerPurchase',
            'drawFrequency',
            'primaryColor',
            'secondaryColor',
            'welcomeMessage',
            'footerText'
        ]);

        // Save to cache for quick access
        Cache::put('system_settings', $settings, now()->addDays(30));
        
        // Save to persistent storage
        Storage::put('system_settings.json', json_encode($settings, JSON_PRETTY_PRINT));

        return response()->json([
            'message' => 'System settings updated successfully',
            'settings' => $settings
        ]);
    }

    /**
     * Reset settings to defaults
     */
    public function reset()
    {
        $defaultSettings = $this->getDefaultSettings();
        
        // Clear cache
        Cache::forget('system_settings');
        
        // Remove storage file
        Storage::delete('system_settings.json');

        return response()->json([
            'message' => 'System settings reset to defaults',
            'settings' => $defaultSettings
        ]);
    }

    /**
     * Export system settings
     */
    public function export()
    {
        $settings = $this->index()->getData();
        
        $exportData = [
            'settings' => $settings,
            'export_date' => now()->toISOString(),
            'platform' => 'Bil Khair',
            'version' => '1.0.0'
        ];

        return response()->json($exportData)
            ->header('Content-Disposition', 'attachment; filename="bil-khair-settings-' . now()->format('Y-m-d') . '.json"');
    }

    /**
     * Import system settings
     */
    public function import(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        $settings = $request->input('settings');
        
        // Validate imported settings structure
        $validatedSettings = [];
        $defaults = $this->getDefaultSettings();
        
        foreach ($defaults as $key => $defaultValue) {
            if (isset($settings[$key])) {
                $validatedSettings[$key] = $settings[$key];
            }
        }

        // Save the imported settings
        Cache::put('system_settings', $validatedSettings, now()->addDays(30));
        Storage::put('system_settings.json', json_encode($validatedSettings, JSON_PRETTY_PRINT));

        return response()->json([
            'message' => 'System settings imported successfully',
            'settings' => $validatedSettings
        ]);
    }

    /**
     * Get default system settings
     */
    private function getDefaultSettings()
    {
        return [
            'platformName' => 'Bil Khair',
            'platformNameArabic' => 'بالخير - منصة التجارة الإلكترونية واليانصيب',
            'platformDescription' => 'Your trusted platform for electronics and lottery games in Iraq.',
            'contactEmail' => 'support@bilkhair.iq',
            'contactPhone' => '+964 123 456 789',
            'goldenPrizePool' => 5500000,
            'silverPrizePool' => 2800000,
            'bronzePrizePool' => 1200000,
            'ticketsPerPurchase' => 100,
            'drawFrequency' => 'daily',
            'primaryColor' => '#2563eb',
            'secondaryColor' => '#dc2626',
            'welcomeMessage' => 'Welcome to Bil Khair - Iraq\'s Premier E-commerce & Lottery Platform',
            'footerText' => '© 2025 Bil Khair Platform. All rights reserved.'
        ];
    }
}
