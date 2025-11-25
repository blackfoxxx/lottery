# Contributing to Belkhair E-Commerce Platform

Thank you for your interest in contributing to Belkhair! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PHP 8.1+ and Composer
- MySQL 8.0+
- Redis
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/lottery.git
cd lottery
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/blackfoxxx/lottery.git
```

### Setup Development Environment

#### Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

#### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

#### Mobile Setup
```bash
cd NewMobile
npm install
npm start
```

## Development Workflow

### Branch Naming

Use descriptive branch names following this pattern:

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/code-improvement` - Code refactoring
- `test/test-description` - Test additions or updates
- `chore/maintenance-task` - Maintenance tasks

Examples:
```bash
git checkout -b feature/gift-card-balance-checker
git checkout -b fix/lottery-countdown-timer
git checkout -b docs/api-documentation
```

### Workflow Steps

1. **Create a branch** from `develop`:
```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

2. **Make your changes** following coding standards

3. **Test your changes** thoroughly

4. **Commit your changes** following commit guidelines

5. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request** on GitHub

### Keep Your Fork Updated

```bash
git checkout develop
git pull upstream develop
git push origin develop
```

## Coding Standards

### Frontend (React/TypeScript)

#### File Organization
```
client/src/
├── components/     # Reusable components
├── pages/          # Page components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── lib/            # Utility functions
└── types/          # TypeScript types
```

#### Naming Conventions
- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCart.ts`)
- **Utilities**: camelCase (`formatPrice.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

#### Component Structure
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
}

export default function ProductCard({ id, name, price }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Implementation
  };

  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>${price}</p>
      <Button onClick={handleAddToCart}>Add to Cart</Button>
    </div>
  );
}
```

#### TypeScript Guidelines
- Use strict mode
- Define interfaces for props
- Avoid `any` type
- Use type inference when possible
- Document complex types

#### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use semantic color names from theme
- Keep consistent spacing (4px grid)

### Backend (Laravel/PHP)

#### File Organization
```
backend/app/
├── Http/
│   ├── Controllers/    # Controllers
│   ├── Requests/       # Form requests
│   └── Resources/      # API resources
├── Models/             # Eloquent models
├── Services/           # Business logic
└── Repositories/       # Data access layer
```

#### Naming Conventions
- **Controllers**: PascalCase with `Controller` suffix (`ProductController.php`)
- **Models**: PascalCase singular (`Product.php`)
- **Methods**: camelCase (`getActiveProducts()`)
- **Routes**: kebab-case (`/api/v1/gift-cards`)

#### Controller Structure
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->create($request->validated());

        return response()->json($product, 201);
    }
}
```

#### Laravel Best Practices
- Use form requests for validation
- Use resource classes for API responses
- Keep controllers thin, move logic to services
- Use dependency injection
- Follow RESTful conventions
- Use database transactions for multiple operations

### Mobile (React Native)

#### File Organization
```
NewMobile/
├── screens/        # Screen components
├── components/     # Reusable components
├── navigation/     # Navigation configuration
├── services/       # API services
└── utils/          # Utility functions
```

#### Component Structure
```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ProductCardProps {
  name: string;
  price: number;
  onPress: () => void;
}

export default function ProductCard({ name, price, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>${price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
});
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(lottery): add ticket purchase confirmation modal

- Add confirmation dialog before purchase
- Display ticket details and total cost
- Add cancel and confirm buttons

Closes #123
```

```
fix(cart): resolve quantity update bug

Fixed issue where cart quantity wasn't updating
when user clicked increment button rapidly.

Fixes #456
```

```
docs(api): update gift card endpoints documentation

- Add balance check endpoint
- Add redemption endpoint examples
- Update error response codes
```

### Commit Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests
- Explain what and why, not how

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest develop:
```bash
git checkout develop
git pull upstream develop
git checkout your-branch
git rebase develop
```

2. **Run tests**:
```bash
# Frontend
cd client && npm test

# Backend
cd backend && php artisan test

# Mobile
cd NewMobile && npm test
```

3. **Run linters**:
```bash
# Frontend
npm run lint

# Backend
./vendor/bin/php-cs-fixer fix
```

4. **Update documentation** if needed

### PR Title Format

Use the same format as commit messages:
```
feat(lottery): add ticket purchase confirmation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings
```

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. No merge conflicts
4. Code coverage maintained or improved

### After Approval

Maintainers will merge your PR using squash and merge to keep history clean.

## Testing Requirements

### Frontend Tests

```typescript
// Example: ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(<ProductCard name="Test Product" price={99.99} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const handleAddToCart = jest.fn();
    render(<ProductCard onAddToCart={handleAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(handleAddToCart).toHaveBeenCalled();
  });
});
```

### Backend Tests

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_product()
    {
        $response = $this->postJson('/api/v1/products', [
            'name' => 'Test Product',
            'price' => 99.99,
            'category' => 'Electronics',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'Test Product',
                'price' => 99.99,
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
        ]);
    }
}
```

### Test Coverage

- Aim for 80%+ code coverage
- Test happy paths and edge cases
- Test error handling
- Mock external dependencies

## Documentation

### Code Comments

```typescript
/**
 * Calculates the total price including tax and shipping
 * 
 * @param items - Array of cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param shippingCost - Flat shipping cost
 * @returns Total price including all fees
 */
function calculateTotal(
  items: CartItem[],
  taxRate: number,
  shippingCost: number
): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  return subtotal + tax + shippingCost;
}
```

### API Documentation

Update OpenAPI specification (`docs/openapi.yaml`) when adding/modifying endpoints.

### README Updates

Update README.md when adding:
- New features
- New dependencies
- New environment variables
- New setup steps

## Questions?

- Open an issue for bugs or feature requests
- Join our Discord for discussions
- Email: dev@belkhair.com

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Belkhair! 🎉
