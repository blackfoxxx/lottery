# Belkhair Admin User Guide

Complete guide for administrators to manage the Belkhair E-Commerce Platform.

## Table of Contents

- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Product Management](#product-management)
- [Order Management](#order-management)
- [Customer Management](#customer-management)
- [Lottery System](#lottery-system)
- [Gift Cards](#gift-cards)
- [Product Bundles](#product-bundles)
- [Analytics & Reports](#analytics--reports)
- [Environment Settings](#environment-settings)
- [System Management](#system-management)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Admin Dashboard

1. Navigate to your admin URL: `https://yourdomain.com/admin`
2. Log in with your admin credentials
3. You'll be redirected to the admin dashboard

### Admin Dashboard Layout

The admin dashboard consists of:
- **Top Navigation**: Quick access to main sections
- **Sidebar**: Detailed navigation menu
- **Main Content Area**: Current page content
- **Notifications**: System alerts and updates

---

## Dashboard Overview

The dashboard provides a quick overview of your store's performance.

### Key Metrics

**Revenue Card**
- Total revenue for selected period
- Percentage change from previous period
- Visual trend indicator

**Orders Card**
- Total number of orders
- Pending orders count
- Order trend

**Customers Card**
- Total registered customers
- New customers this month
- Customer growth rate

**Products Card**
- Total products in catalog
- Low stock alerts
- Out of stock items

### Quick Actions

- **Add Product**: Create new product
- **View Orders**: See recent orders
- **Customer Support**: Access support tickets
- **Reports**: Generate analytics reports

### Recent Activity

Shows latest:
- Orders placed
- Customer registrations
- Product updates
- System events

---

## Product Management

### Adding a New Product

1. Click **Products** → **Add New**
2. Fill in product details:
   - **Name**: Product title
   - **Description**: Detailed product description
   - **Price**: Regular price
   - **Sale Price**: Discounted price (optional)
   - **Category**: Select product category
   - **SKU**: Stock keeping unit
   - **Stock**: Available quantity
3. Upload product images:
   - Main image (required)
   - Gallery images (optional)
   - Recommended: 1200×1200px minimum
4. Set product attributes:
   - Size, color, material, etc.
5. Configure SEO:
   - Meta title
   - Meta description
   - URL slug
6. Click **Publish**

### Editing Products

1. Go to **Products** → **All Products**
2. Find the product (use search or filters)
3. Click **Edit**
4. Make your changes
5. Click **Update**

### Bulk Actions

Select multiple products and:
- **Delete**: Remove products
- **Update Category**: Change category
- **Update Status**: Publish/Draft/Archive
- **Export**: Download product data

### Inventory Management

**Stock Tracking**
- Set stock quantity
- Enable/disable stock management
- Set low stock threshold
- Receive low stock alerts

**Stock Updates**
- Manual adjustment
- Bulk import via CSV
- Automatic updates from orders

### Product Categories

**Create Category**
1. Go to **Products** → **Categories**
2. Click **Add Category**
3. Enter category name and slug
4. Set parent category (optional)
5. Upload category image
6. Click **Save**

**Manage Categories**
- Edit category details
- Reorder categories (drag & drop)
- Delete unused categories
- View products per category

---

## Order Management

### Viewing Orders

**All Orders**
- Go to **Orders** → **All Orders**
- View list of all orders
- Filter by status, date, customer
- Search by order number

**Order Details**
Click on an order to view:
- Order number and date
- Customer information
- Shipping address
- Billing address
- Items ordered
- Payment method
- Order status
- Order timeline

### Order Statuses

- **Pending**: Awaiting payment
- **Processing**: Payment received, preparing shipment
- **Shipped**: Order dispatched
- **Delivered**: Order received by customer
- **Cancelled**: Order cancelled
- **Refunded**: Payment refunded

### Processing Orders

1. **Review Order**: Check items and customer details
2. **Update Status**: Change to "Processing"
3. **Prepare Shipment**: Pack items
4. **Add Tracking**: Enter tracking number
5. **Mark as Shipped**: Update status and notify customer
6. **Confirm Delivery**: Mark as delivered when confirmed

### Handling Refunds

1. Go to order details
2. Click **Refund**
3. Select refund type:
   - Full refund
   - Partial refund
4. Enter refund amount
5. Add refund reason
6. Click **Process Refund**
7. Customer receives notification

### Order Notes

Add internal notes to orders:
- Click **Add Note** on order page
- Enter note text
- Choose visibility (private/customer)
- Click **Save**

---

## Customer Management

### Viewing Customers

**Customer List**
- Go to **Customers** → **All Customers**
- View customer information
- Search by name, email, phone
- Filter by registration date, status

**Customer Profile**
Click on customer to view:
- Personal information
- Order history
- Total spent
- Wishlist items
- Loyalty points
- Customer notes

### Managing Customers

**Edit Customer**
1. Open customer profile
2. Click **Edit**
3. Update information
4. Click **Save**

**Customer Actions**
- Send email
- Add note
- View orders
- Reset password
- Delete account

### Customer Groups

Create customer segments:
- VIP customers
- Wholesale buyers
- Loyalty members

Assign special pricing or discounts to groups.

### Customer Reports

Generate reports on:
- Top customers by revenue
- Customer acquisition
- Customer retention
- Lifetime value

---

## Lottery System

### Creating a Lottery Draw

1. Go to **Lottery** → **Draws**
2. Click **Create New Draw**
3. Enter draw details:
   - **Name**: Draw title (e.g., "Golden Draw")
   - **Prize Amount**: Total prize value
   - **Ticket Price**: Price per ticket
   - **Draw Date**: When winner will be selected
   - **Max Tickets**: Maximum tickets to sell (optional)
4. Set draw rules:
   - Number of winners
   - Prize distribution
   - Terms and conditions
5. Click **Create Draw**

### Managing Active Draws

**Monitor Sales**
- View tickets sold
- Track revenue
- See purchase trends

**Update Draw**
- Modify prize amount
- Extend draw date
- Adjust ticket limits

**Cancel Draw**
- Refund all participants
- Send cancellation notice

### Conducting the Draw

1. Wait until draw date/time
2. Go to **Lottery** → **Draws**
3. Click **Conduct Draw**
4. System randomly selects winner(s)
5. Review results
6. Click **Confirm Results**
7. Winners notified automatically

### Winner Management

**View Winners**
- Go to **Lottery** → **Winners**
- See all past winners
- View winning ticket numbers
- Check prize claim status

**Prize Distribution**
- Verify winner identity
- Process prize payment
- Mark as claimed
- Update winner status

### Lottery Reports

Generate reports on:
- Total tickets sold
- Revenue per draw
- Popular draw times
- Participant demographics

---

## Gift Cards

### Creating Gift Cards

**Manual Creation**
1. Go to **Gift Cards** → **Create**
2. Enter details:
   - Amount
   - Recipient email
   - Recipient name
   - Personal message
3. Click **Generate**

**Bulk Creation**
1. Go to **Gift Cards** → **Bulk Create**
2. Upload CSV file with:
   - Amount
   - Recipient email
   - Recipient name
3. Click **Import**

### Managing Gift Cards

**View All Gift Cards**
- Go to **Gift Cards** → **All Cards**
- Filter by status (active/redeemed/expired)
- Search by code or recipient

**Gift Card Details**
- Code
- Amount
- Balance
- Status
- Purchase date
- Expiration date
- Usage history

**Gift Card Actions**
- Adjust balance
- Extend expiration
- Deactivate card
- Resend email

### Gift Card Settings

Configure:
- Default expiration period
- Minimum/maximum amounts
- Email templates
- Terms and conditions

### Gift Card Reports

Track:
- Total gift cards sold
- Outstanding balance
- Redemption rate
- Revenue from gift cards

---

## Product Bundles

### Creating Bundles

1. Go to **Bundles** → **Create Bundle**
2. Enter bundle details:
   - **Name**: Bundle title
   - **Description**: What's included
   - **Image**: Bundle image
3. Add products:
   - Search and select products
   - Set quantity for each
4. Set pricing:
   - **Bundle Price**: Total price
   - **Discount**: Percentage or fixed amount
   - System shows savings
5. Click **Create Bundle**

### Managing Bundles

**Edit Bundle**
- Update products
- Change pricing
- Modify description
- Update image

**Bundle Visibility**
- Active: Visible to customers
- Draft: Hidden from store
- Scheduled: Set publish date

**Bundle Analytics**
- View bundle sales
- Track conversion rate
- See which bundles perform best

### Frequently Bought Together

**Configure Recommendations**
1. Go to **Bundles** → **Recommendations**
2. Select product
3. Add frequently bought together items
4. Set discount for bundle purchase
5. Click **Save**

**Auto-Recommendations**
- Enable AI-powered suggestions
- System analyzes purchase patterns
- Automatically suggests bundles

---

## Analytics & Reports

### Dashboard Analytics

**Overview Metrics**
- Total revenue
- Order count
- Average order value
- Conversion rate

**Charts & Graphs**
- Revenue trend
- Orders over time
- Top products
- Customer acquisition

### Sales Reports

**Revenue Report**
- Total sales by period
- Sales by product
- Sales by category
- Sales by payment method

**Order Report**
- Orders by status
- Orders by location
- Average order value
- Order frequency

### Product Reports

**Product Performance**
- Best sellers
- Worst performers
- Low stock items
- Out of stock items

**Inventory Report**
- Stock levels
- Stock value
- Inventory turnover
- Reorder recommendations

### Customer Reports

**Customer Analytics**
- New vs returning customers
- Customer lifetime value
- Customer acquisition cost
- Retention rate

**Customer Behavior**
- Most active customers
- Purchase frequency
- Average spend per customer
- Cart abandonment rate

### Custom Reports

**Create Custom Report**
1. Go to **Reports** → **Custom**
2. Select report type
3. Choose metrics
4. Set date range
5. Apply filters
6. Click **Generate**

**Export Reports**
- PDF format
- Excel/CSV format
- Email scheduled reports
- Save report templates

---

## Environment Settings

### General Settings

**Site Information**
- Site name
- Site URL
- Admin email
- Time zone
- Currency

**Logo & Branding**
- Upload logo
- Set favicon
- Choose color scheme
- Customize theme

### Payment Settings

**Payment Gateways**
1. Go to **Settings** → **Payments**
2. Select gateway (Stripe, PayPal, etc.)
3. Enter API credentials:
   - API Key
   - Secret Key
   - Webhook URL
4. Test connection
5. Enable gateway

**Payment Methods**
- Credit/Debit cards
- PayPal
- Bank transfer
- Cash on delivery
- Gift cards

### Email Settings

**SMTP Configuration**
1. Go to **Settings** → **Email**
2. Enter SMTP details:
   - Host
   - Port
   - Username
   - Password
   - Encryption (TLS/SSL)
3. Test connection
4. Save settings

**Email Templates**
- Order confirmation
- Shipping notification
- Refund confirmation
- Gift card delivery
- Lottery winner notification

### SMS Settings

**Twilio Configuration**
1. Go to **Settings** → **SMS**
2. Enter Twilio credentials:
   - Account SID
   - Auth Token
   - Phone Number
3. Test SMS
4. Enable notifications

**SMS Notifications**
- Order updates
- Shipping alerts
- Lottery results
- Promotional messages

### Storage Settings

**AWS S3 Configuration**
1. Go to **Settings** → **Storage**
2. Enter AWS credentials:
   - Access Key ID
   - Secret Access Key
   - Region
   - Bucket Name
3. Test connection
4. Enable S3 storage

**File Upload Settings**
- Maximum file size
- Allowed file types
- Image optimization
- CDN configuration

### Security Settings

**Authentication**
- Password requirements
- Two-factor authentication
- Session timeout
- Login attempts limit

**API Keys**
- Generate API keys
- Set permissions
- Rotate keys
- Monitor usage

---

## System Management

### Webhooks

**Create Webhook**
1. Go to **System** → **Webhooks**
2. Click **Add Webhook**
3. Enter webhook URL
4. Select events:
   - order.created
   - payment.successful
   - lottery.draw_completed
   - etc.
5. Generate secret key
6. Test webhook
7. Enable

**Manage Webhooks**
- View delivery history
- Retry failed deliveries
- Edit webhook settings
- Delete webhooks

### Backups

**Create Backup**
1. Go to **System** → **Backups**
2. Click **Create Backup**
3. Select backup type:
   - Database only
   - Files only
   - Full backup
4. Click **Start Backup**

**Scheduled Backups**
- Set backup frequency (daily/weekly/monthly)
- Set retention period
- Choose backup location
- Enable notifications

**Restore Backup**
1. Go to **System** → **Backups**
2. Select backup
3. Click **Restore**
4. Confirm restoration
5. Wait for completion

### Audit Log

**View Activity**
- Go to **System** → **Audit Log**
- See all admin actions
- Filter by user, action, date
- Export audit log

**Audit Events**
- Configuration changes
- User actions
- Data exports
- Permission modifications

### Health Monitoring

**System Health**
- View service status
- Check API connectivity
- Monitor response times
- View uptime statistics

**Service Status**
- Payment gateway: Online/Offline
- Email service: Online/Offline
- SMS service: Online/Offline
- Storage: Online/Offline
- Database: Online/Offline

**Alerts**
- Service failures
- High error rates
- Low disk space
- Database issues

---

## Troubleshooting

### Common Issues

**Products Not Displaying**
1. Check product status (must be "Published")
2. Verify stock quantity > 0
3. Check category visibility
4. Clear cache

**Orders Not Processing**
1. Verify payment gateway configuration
2. Check API credentials
3. Review error logs
4. Test payment gateway connection

**Emails Not Sending**
1. Verify SMTP settings
2. Check email credentials
3. Test SMTP connection
4. Review email logs

**Images Not Loading**
1. Check file permissions
2. Verify storage configuration
3. Test CDN connection
4. Clear browser cache

### Error Messages

**"Payment Failed"**
- Check payment gateway status
- Verify API credentials are correct
- Review payment gateway logs
- Contact payment provider

**"Database Connection Error"**
- Check database credentials
- Verify database server is running
- Check database connection limits
- Review database logs

**"File Upload Failed"**
- Check file size limits
- Verify file type is allowed
- Check storage permissions
- Review storage configuration

### Getting Help

**Support Channels**
- Email: support@belkhair.com
- Documentation: https://docs.belkhair.com
- Community Forum: https://forum.belkhair.com
- GitHub Issues: https://github.com/blackfoxxx/lottery/issues

**Before Contacting Support**
1. Check this documentation
2. Review error logs
3. Try clearing cache
4. Test in different browser

**When Reporting Issues**
Include:
- Error message
- Steps to reproduce
- Screenshots
- Browser/device information
- System logs

---

## Best Practices

### Security

- Change default admin password
- Enable two-factor authentication
- Regularly update system
- Review user permissions
- Monitor audit logs
- Backup regularly

### Performance

- Optimize images before upload
- Enable caching
- Use CDN for static files
- Monitor database performance
- Clean up old data regularly

### Customer Service

- Respond to orders within 24 hours
- Keep customers updated on order status
- Process refunds promptly
- Maintain accurate product information
- Monitor customer feedback

### Inventory

- Set low stock alerts
- Regular inventory audits
- Update stock levels promptly
- Remove discontinued products
- Monitor best sellers

---

## Appendix

### Keyboard Shortcuts

- `Ctrl + S`: Save changes
- `Ctrl + P`: Print page
- `Ctrl + F`: Search
- `Esc`: Close modal

### Glossary

- **SKU**: Stock Keeping Unit
- **API**: Application Programming Interface
- **CDN**: Content Delivery Network
- **SMTP**: Simple Mail Transfer Protocol
- **SSL**: Secure Sockets Layer

### Video Tutorials

- Dashboard Overview: [Link]
- Adding Products: [Link]
- Processing Orders: [Link]
- Creating Lottery Draws: [Link]

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Support**: support@belkhair.com
