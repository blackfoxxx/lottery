<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TicketGenerationService
{
    /**
     * Generate lottery tickets based on global standards
     * 
     * Standards implemented:
     * - ISO 8601 timestamp formatting
     * - Luhn algorithm for check digit validation
     * - Cryptographically secure random number generation
     * - International ticket numbering conventions
     * - Unique identifier with collision prevention
     */
    
    private const CATEGORY_PREFIXES = [
        'golden' => 'GLT',
        'silver' => 'SLT', 
        'bronze' => 'BLT'
    ];
    
    private const TICKET_LENGTH = 16; // Standard lottery ticket length
    
    /**
     * Generate tickets for an order
     */
    public function generateTicketsForOrder(Order $order): array
    {
        $product = $order->product;
        $tickets = [];
        $totalTickets = $product->ticket_count * $order->quantity;
        
        for ($i = 0; $i < $totalTickets; $i++) {
            $ticketNumber = $this->generateUniqueTicketNumber($product->ticket_category);
            
            $ticket = Ticket::create([
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'product_id' => $product->id,
                'ticket_number' => $ticketNumber,
                'category' => $product->ticket_category,
                'is_used' => false,
                'generated_at' => now(),
                'expires_at' => $this->calculateExpiryDate($product->ticket_category),
                'batch_id' => $this->generateBatchId($order),
                'verification_code' => $this->generateVerificationCode(),
            ]);
            
            $tickets[] = $ticket;
        }
        
        return $tickets;
    }
    
    /**
     * Generate unique ticket number with global standards
     */
    private function generateUniqueTicketNumber(string $category): string
    {
        do {
            $ticketNumber = $this->buildTicketNumber($category);
        } while (Ticket::where('ticket_number', $ticketNumber)->exists());
        
        return $ticketNumber;
    }
    
    /**
     * Build ticket number following international standards
     * Format: [PREFIX]-[YEAR][MONTH][DAY]-[RANDOM]-[CHECK]
     */
    private function buildTicketNumber(string $category): string
    {
        $prefix = self::CATEGORY_PREFIXES[$category] ?? 'TKT';
        $dateStamp = Carbon::now()->format('Ymd');
        $randomPart = $this->generateSecureRandomString(6);
        $baseNumber = $prefix . $dateStamp . $randomPart;
        $checkDigit = $this->calculateLuhnCheckDigit($baseNumber);
        
        return $prefix . '-' . $dateStamp . '-' . $randomPart . '-' . $checkDigit;
    }
    
    /**
     * Generate cryptographically secure random string
     */
    private function generateSecureRandomString(int $length): string
    {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $result = '';
        
        for ($i = 0; $i < $length; $i++) {
            $result .= $characters[random_int(0, strlen($characters) - 1)];
        }
        
        return $result;
    }
    
    /**
     * Calculate Luhn check digit for validation
     */
    private function calculateLuhnCheckDigit(string $number): string
    {
        $sum = 0;
        $alternate = false;
        
        // Remove non-numeric characters for calculation
        $numericOnly = preg_replace('/[^0-9]/', '', $number);
        
        for ($i = strlen($numericOnly) - 1; $i >= 0; $i--) {
            $digit = intval($numericOnly[$i]);
            
            if ($alternate) {
                $digit *= 2;
                if ($digit > 9) {
                    $digit = ($digit % 10) + 1;
                }
            }
            
            $sum += $digit;
            $alternate = !$alternate;
        }
        
        return (string) ((10 - ($sum % 10)) % 10);
    }
    
    /**
     * Generate batch ID for ticket grouping
     */
    private function generateBatchId(Order $order): string
    {
        return 'BATCH-' . Carbon::now()->format('Ymd') . '-' . str_pad($order->id, 6, '0', STR_PAD_LEFT);
    }
    
    /**
     * Generate verification code for ticket authentication
     */
    private function generateVerificationCode(): string
    {
        return strtoupper(Str::random(8));
    }
    
    /**
     * Calculate expiry date based on ticket category
     */
    private function calculateExpiryDate(string $category): Carbon
    {
        $expiryDays = match($category) {
            'golden' => 365, // 1 year for golden tickets
            'silver' => 180, // 6 months for silver tickets
            'bronze' => 90,  // 3 months for bronze tickets
            default => 90
        };
        
        return Carbon::now()->addDays($expiryDays);
    }
    
    /**
     * Validate ticket number format
     */
    public function validateTicketNumber(string $ticketNumber): bool
    {
        // Check format: PREFIX-YYYYMMDD-RANDOM-CHECK
        $pattern = '/^(GLT|SLT|BLT)-\d{8}-[A-Z0-9]{6}-\d$/';
        
        if (!preg_match($pattern, $ticketNumber)) {
            return false;
        }
        
        // Validate check digit
        $parts = explode('-', $ticketNumber);
        $baseNumber = $parts[0] . $parts[1] . $parts[2];
        $expectedCheck = $this->calculateLuhnCheckDigit($baseNumber);
        
        return $parts[3] === $expectedCheck;
    }
    
    /**
     * Get ticket statistics for admin dashboard
     */
    public function getTicketStatistics(): array
    {
        return [
            'total_generated' => Ticket::count(),
            'active_tickets' => Ticket::where('is_used', false)->where('expires_at', '>', now())->count(),
            'expired_tickets' => Ticket::where('expires_at', '<=', now())->count(),
            'used_tickets' => Ticket::where('is_used', true)->count(),
            'by_category' => [
                'golden' => Ticket::where('category', 'golden')->count(),
                'silver' => Ticket::where('category', 'silver')->count(),
                'bronze' => Ticket::where('category', 'bronze')->count(),
            ],
            'recent_batches' => Ticket::select('batch_id')
                ->distinct()
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->pluck('batch_id')
        ];
    }
}
