# Laravel Models Update Guide

All models need to be updated with fillable fields and relationships.

## Models to Update:

### Product Model
- Fillable: category_id, name, slug, description, price, discount_price, image, images, stock, sku, rating, reviews_count, is_featured, is_active
- Relationships: belongsTo(Category), hasMany(OrderItem)
- Casts: images => 'array', is_featured => 'boolean', is_active => 'boolean'

### Category Model
- Fillable: name, slug, description, image, order, is_active
- Relationships: hasMany(Product)
- Casts: is_active => 'boolean'

### Order Model
- Fillable: user_id, order_number, subtotal, tax, shipping, discount, total, status, payment_status, payment_method, shipping_address_id, billing_address_id, notes, lottery_tickets_earned
- Relationships: belongsTo(User), hasMany(OrderItem), belongsTo(Address as shippingAddress), belongsTo(Address as billingAddress)

### OrderItem Model
- Fillable: order_id, product_id, product_name, product_image, price, quantity, subtotal
- Relationships: belongsTo(Order), belongsTo(Product)

### LotteryDraw Model
- Fillable: name, description, prize_amount, ticket_price, draw_date, status, winner_id, winning_ticket_number, total_tickets, sold_tickets
- Relationships: hasMany(LotteryTicket), belongsTo(User as winner)
- Casts: draw_date => 'datetime'

### LotteryTicket Model
- Fillable: user_id, draw_id, order_id, ticket_number, status, purchase_date
- Relationships: belongsTo(User), belongsTo(LotteryDraw), belongsTo(Order)
- Casts: purchase_date => 'datetime'

### PaymentMethod Model
- Fillable: user_id, type, card_last4, card_brand, card_exp_month, card_exp_year, paypal_email, is_default
- Relationships: belongsTo(User)
- Casts: is_default => 'boolean'

### Transaction Model
- Fillable: user_id, type, amount, status, payment_method_id, order_id, description, reference_number
- Relationships: belongsTo(User), belongsTo(PaymentMethod), belongsTo(Order)

### Address Model
- Fillable: user_id, full_name, phone, address_line1, address_line2, city, state, zip_code, country, type, is_default
- Relationships: belongsTo(User)
- Casts: is_default => 'boolean'

### GiftCard Model
- Fillable: code, initial_balance, current_balance, purchased_by, used_by, status, expires_at
- Relationships: belongsTo(User as purchaser), belongsTo(User as user)
- Casts: expires_at => 'datetime'

### Bundle Model
- Fillable: name, slug, description, image, regular_price, bundle_price, discount_percentage, product_ids, is_active
- Casts: product_ids => 'array', is_active => 'boolean'

