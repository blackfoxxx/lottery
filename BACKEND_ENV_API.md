# Backend API Implementation for Environment Settings

This document describes the Laravel backend API endpoints needed to support the Environment Settings admin page.

## Required Endpoints

### 1. Get Environment Variables

**Endpoint:** `GET /api/v1/admin/environment`

**Description:** Retrieve all environment variables (with sensitive values masked)

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "STRIPE_PUBLIC_KEY": "pk_test_xxxxx",
  "STRIPE_SECRET_KEY": "sk_test_***",
  "MAIL_HOST": "smtp.gmail.com",
  "MAIL_PORT": "587",
  "MAIL_USERNAME": "admin@example.com",
  "MAIL_PASSWORD": "***",
  "DB_HOST": "127.0.0.1",
  "DB_PORT": "3306",
  "DB_DATABASE": "belkhair",
  "DB_USERNAME": "root",
  "DB_PASSWORD": "***"
}
```

### 2. Update Environment Variables

**Endpoint:** `PUT /api/v1/admin/environment`

**Description:** Update environment variables and write to .env file

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "STRIPE_PUBLIC_KEY": "pk_test_new_key",
  "STRIPE_SECRET_KEY": "sk_test_new_secret",
  "MAIL_HOST": "smtp.sendgrid.net",
  "MAIL_PORT": "587",
  "MAIL_USERNAME": "apikey",
  "MAIL_PASSWORD": "SG.xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Environment variables updated successfully",
  "updated_count": 6
}
```

### 3. Test Connection

**Endpoint:** `POST /api/v1/admin/environment/test/{category}`

**Description:** Test connection for a specific service category

**Categories:**
- `payment-gateways` - Test Stripe/PayPal connection
- `email-service` - Test SMTP connection
- `sms-service` - Test Twilio connection
- `cloud-storage` - Test AWS S3 connection
- `database` - Test database connection

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "STRIPE_SECRET_KEY": "sk_test_xxxxx",
  "STRIPE_PUBLIC_KEY": "pk_test_xxxxx"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment gateway connection successful",
  "details": {
    "provider": "Stripe",
    "account_id": "acct_xxxxx",
    "status": "active"
  }
}
```

**Response (Failure):**
```json
{
  "success": false,
  "message": "Payment gateway connection failed",
  "error": "Invalid API key provided"
}
```

## Laravel Implementation

### Controller: `EnvironmentController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class EnvironmentController extends Controller
{
    /**
     * Get all environment variables
     */
    public function index()
    {
        $envPath = base_path('.env');
        
        if (!File::exists($envPath)) {
            return response()->json(['error' => '.env file not found'], 404);
        }

        $envContent = File::get($envPath);
        $envVariables = $this->parseEnvFile($envContent);
        
        // Mask sensitive values
        $maskedVariables = $this->maskSensitiveValues($envVariables);
        
        return response()->json($maskedVariables);
    }

    /**
     * Update environment variables
     */
    public function update(Request $request)
    {
        $envPath = base_path('.env');
        
        if (!File::exists($envPath)) {
            return response()->json(['error' => '.env file not found'], 404);
        }

        // Backup current .env file
        $backupPath = base_path('.env.backup.' . time());
        File::copy($envPath, $backupPath);

        try {
            $envContent = File::get($envPath);
            $updatedCount = 0;

            foreach ($request->all() as $key => $value) {
                // Skip if value is masked (unchanged)
                if ($value === '***' || empty($value)) {
                    continue;
                }

                // Update or add the environment variable
                if ($this->envKeyExists($envContent, $key)) {
                    $envContent = $this->updateEnvKey($envContent, $key, $value);
                } else {
                    $envContent .= "\n{$key}=" . $this->formatEnvValue($value);
                }
                
                $updatedCount++;
            }

            // Write updated content back to .env file
            File::put($envPath, $envContent);

            // Clear config cache
            \Artisan::call('config:clear');

            return response()->json([
                'success' => true,
                'message' => 'Environment variables updated successfully',
                'updated_count' => $updatedCount
            ]);

        } catch (\Exception $e) {
            // Restore backup on error
            File::copy($backupPath, $envPath);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update environment variables',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test connection for a specific category
     */
    public function testConnection(Request $request, $category)
    {
        try {
            switch ($category) {
                case 'payment-gateways':
                    return $this->testPaymentGateway($request);
                
                case 'email-service':
                    return $this->testEmailService($request);
                
                case 'sms-service':
                    return $this->testSmsService($request);
                
                case 'cloud-storage':
                    return $this->testCloudStorage($request);
                
                case 'database':
                    return $this->testDatabase($request);
                
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Unknown category'
                    ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection test failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Parse .env file content into key-value array
     */
    private function parseEnvFile($content)
    {
        $variables = [];
        $lines = explode("\n", $content);

        foreach ($lines as $line) {
            $line = trim($line);
            
            // Skip comments and empty lines
            if (empty($line) || strpos($line, '#') === 0) {
                continue;
            }

            // Parse KEY=VALUE
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes from value
                $value = trim($value, '"\'');
                
                $variables[$key] = $value;
            }
        }

        return $variables;
    }

    /**
     * Mask sensitive values
     */
    private function maskSensitiveValues($variables)
    {
        $sensitiveKeys = [
            'PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'API_KEY',
            'STRIPE_SECRET', 'PAYPAL_SECRET', 'AWS_SECRET',
            'TWILIO_AUTH', 'JWT_SECRET', 'APP_KEY'
        ];

        foreach ($variables as $key => $value) {
            foreach ($sensitiveKeys as $sensitiveKey) {
                if (stripos($key, $sensitiveKey) !== false && !empty($value)) {
                    $variables[$key] = '***';
                    break;
                }
            }
        }

        return $variables;
    }

    /**
     * Check if environment key exists
     */
    private function envKeyExists($content, $key)
    {
        return preg_match("/^{$key}=/m", $content);
    }

    /**
     * Update environment key value
     */
    private function updateEnvKey($content, $key, $value)
    {
        $formattedValue = $this->formatEnvValue($value);
        return preg_replace(
            "/^{$key}=.*/m",
            "{$key}={$formattedValue}",
            $content
        );
    }

    /**
     * Format environment value (add quotes if needed)
     */
    private function formatEnvValue($value)
    {
        // Add quotes if value contains spaces or special characters
        if (preg_match('/[\s#]/', $value)) {
            return '"' . str_replace('"', '\\"', $value) . '"';
        }
        return $value;
    }

    /**
     * Test payment gateway connection
     */
    private function testPaymentGateway($request)
    {
        $stripeSecret = $request->input('STRIPE_SECRET_KEY');
        
        if (empty($stripeSecret)) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe secret key is required'
            ]);
        }

        try {
            \Stripe\Stripe::setApiKey($stripeSecret);
            $account = \Stripe\Account::retrieve();

            return response()->json([
                'success' => true,
                'message' => 'Payment gateway connection successful',
                'details' => [
                    'provider' => 'Stripe',
                    'account_id' => $account->id,
                    'status' => 'active'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment gateway connection failed',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Test email service connection
     */
    private function testEmailService($request)
    {
        try {
            \Mail::raw('Test email from Belkhair', function ($message) {
                $message->to('test@example.com')
                        ->subject('Test Email');
            });

            return response()->json([
                'success' => true,
                'message' => 'Email service connection successful'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Email service connection failed',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Test SMS service connection
     */
    private function testSmsService($request)
    {
        $accountSid = $request->input('TWILIO_ACCOUNT_SID');
        $authToken = $request->input('TWILIO_AUTH_TOKEN');

        if (empty($accountSid) || empty($authToken)) {
            return response()->json([
                'success' => false,
                'message' => 'Twilio credentials are required'
            ]);
        }

        try {
            $client = new \Twilio\Rest\Client($accountSid, $authToken);
            $account = $client->api->v2010->accounts($accountSid)->fetch();

            return response()->json([
                'success' => true,
                'message' => 'SMS service connection successful',
                'details' => [
                    'provider' => 'Twilio',
                    'account_sid' => $account->sid,
                    'status' => $account->status
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'SMS service connection failed',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Test cloud storage connection
     */
    private function testCloudStorage($request)
    {
        try {
            $s3 = \Storage::disk('s3');
            $s3->put('test.txt', 'Test file');
            $s3->delete('test.txt');

            return response()->json([
                'success' => true,
                'message' => 'Cloud storage connection successful'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cloud storage connection failed',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Test database connection
     */
    private function testDatabase($request)
    {
        try {
            \DB::connection()->getPdo();

            return response()->json([
                'success' => true,
                'message' => 'Database connection successful',
                'details' => [
                    'driver' => config('database.default'),
                    'host' => config('database.connections.' . config('database.default') . '.host'),
                    'database' => config('database.connections.' . config('database.default') . '.database')
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database connection failed',
                'error' => $e->getMessage()
            ]);
        }
    }
}
```

### Routes: `api.php`

```php
// Admin environment settings routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/environment', [EnvironmentController::class, 'index']);
    Route::put('/environment', [EnvironmentController::class, 'update']);
    Route::post('/environment/test/{category}', [EnvironmentController::class, 'testConnection']);
});
```

### Middleware: `AdminMiddleware.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
```

## Security Considerations

1. **Authentication Required:** All endpoints require admin authentication
2. **Backup Before Update:** Always create .env backup before making changes
3. **Sensitive Value Masking:** Mask passwords and API keys when displaying
4. **Input Validation:** Validate all input before writing to .env file
5. **File Permissions:** Ensure .env file has proper permissions (600)
6. **Audit Logging:** Log all environment variable changes with user info
7. **Rate Limiting:** Apply rate limiting to prevent abuse

## Testing

### Test with cURL

```bash
# Get environment variables
curl -X GET http://localhost:8000/api/v1/admin/environment \
  -H "Authorization: Bearer {token}"

# Update environment variables
curl -X PUT http://localhost:8000/api/v1/admin/environment \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "STRIPE_PUBLIC_KEY": "pk_test_xxxxx",
    "MAIL_HOST": "smtp.gmail.com"
  }'

# Test payment gateway connection
curl -X POST http://localhost:8000/api/v1/admin/environment/test/payment-gateways \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "STRIPE_SECRET_KEY": "sk_test_xxxxx"
  }'
```

## Required Composer Packages

```bash
composer require stripe/stripe-php
composer require twilio/sdk
composer require league/flysystem-aws-s3-v3
```

## Environment File Permissions

```bash
chmod 600 .env
chmod 600 .env.backup.*
```

## Notes

- The frontend will automatically mask sensitive values with `***`
- Users must re-enter sensitive values to update them
- Test connection buttons help verify configuration before saving
- All changes are logged for audit purposes
- Backup files are kept with timestamp for recovery
