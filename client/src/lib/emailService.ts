import { Order } from "./api";

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  /**
   * Generate order confirmation email
   */
  static generateOrderConfirmationEmail(
    order: Order,
    customerEmail: string
  ): EmailTemplate {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #2d3561 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border: 1px solid #ddd;
    }
    .order-details {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .lottery-section {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #e74c3c;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 10px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    td {
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Order Confirmed!</h1>
    <p>Thank you for your purchase at Belkhair</p>
  </div>
  
  <div class="content">
    <p>Dear ${order.customer_name},</p>
    
    <p>Your order has been successfully placed and is being processed. Here are your order details:</p>
    
    <div class="order-details">
      <h2>Order #${order.id}</h2>
      <table>
        <tr>
          <td><strong>Order Date:</strong></td>
          <td>${new Date(order.created_at).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td><strong>Payment Method:</strong></td>
          <td>${order.payment_method.replace('_', ' ').toUpperCase()}</td>
        </tr>
        <tr>
          <td><strong>Payment Status:</strong></td>
          <td>${order.payment_status}</td>
        </tr>
        <tr>
          <td><strong>Total Amount:</strong></td>
          <td><strong>$${order.total_amount.toFixed(2)}</strong></td>
        </tr>
        <tr>
          <td><strong>Shipping Address:</strong></td>
          <td>${order.shipping_address}</td>
        </tr>
      </table>
    </div>
    
    ${
      order.lottery_tickets && order.lottery_tickets > 0
        ? `
    <div class="lottery-section">
      <h2>🎫 Lottery Tickets Included!</h2>
      <p style="font-size: 48px; margin: 10px 0;">${order.lottery_tickets}</p>
      <p>You've received <strong>${order.lottery_tickets} lottery tickets</strong> with your purchase!</p>
      <p>Your tickets have been automatically entered into the next draw. Good luck!</p>
    </div>
    `
        : ""
    }
    
    <p>We'll send you another email when your order ships.</p>
    
    <p style="text-align: center;">
      <a href="https://belkhair.com/orders/${order.id}" class="button">Track Your Order</a>
    </p>
    
    <p>If you have any questions, please don't hesitate to contact our customer support.</p>
    
    <p>Best regards,<br>The Belkhair Team</p>
  </div>
  
  <div class="footer">
    <p>© 2025 Belkhair E-Commerce Platform. All rights reserved.</p>
    <p>This is an automated email. Please do not reply to this message.</p>
  </div>
</body>
</html>
    `;

    return {
      to: customerEmail,
      subject: `Order Confirmation - Order #${order.id}`,
      html,
    };
  }

  /**
   * Generate lottery winner notification email
   */
  static generateLotteryWinnerEmail(
    winnerEmail: string,
    winnerName: string,
    ticketNumber: string,
    prize: string,
    drawDate: string
  ): EmailTemplate {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);
      color: white;
      padding: 40px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #fff;
      padding: 30px;
      border: 2px solid #f39c12;
    }
    .winner-badge {
      background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      padding: 15px 40px;
      background: #e74c3c;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="font-size: 48px; margin: 0;">🎊 CONGRATULATIONS! 🎊</h1>
    <p style="font-size: 24px; margin: 10px 0;">You're a Winner!</p>
  </div>
  
  <div class="content">
    <p>Dear ${winnerName},</p>
    
    <div class="winner-badge">
      <h2 style="font-size: 36px; margin: 0;">🏆 YOU WON! 🏆</h2>
      <p style="font-size: 48px; font-weight: bold; margin: 20px 0;">${prize}</p>
      <p style="font-size: 18px;">Draw Date: ${drawDate}</p>
    </div>
    
    <p style="font-size: 18px; text-align: center;">
      <strong>Your Winning Ticket: ${ticketNumber}</strong>
    </p>
    
    <p>We are thrilled to inform you that you have won in our lottery draw! Your ticket has been selected as one of the lucky winners.</p>
    
    <h3>What's Next?</h3>
    <ol>
      <li>Verify your identity by logging into your account</li>
      <li>Provide necessary documentation for prize claim</li>
      <li>Our team will contact you within 48 hours</li>
      <li>Collect your prize at our office or via secure delivery</li>
    </ol>
    
    <p style="text-align: center;">
      <a href="https://belkhair.com/lottery/claim-prize" class="button">Claim Your Prize</a>
    </p>
    
    <p><strong>Important:</strong> Please respond to this email within 30 days to claim your prize. Unclaimed prizes will be forfeited.</p>
    
    <p>Congratulations once again!</p>
    
    <p>Best regards,<br>The Belkhair Lottery Team</p>
  </div>
  
  <div class="footer">
    <p>© 2025 Belkhair E-Commerce Platform. All rights reserved.</p>
    <p>This is an official lottery winner notification.</p>
  </div>
</body>
</html>
    `;

    return {
      to: winnerEmail,
      subject: `🎉 CONGRATULATIONS! You Won ${prize} - Belkhair Lottery`,
      html,
    };
  }

  /**
   * Send email (mock implementation - replace with actual email service)
   */
  static async sendEmail(template: EmailTemplate): Promise<boolean> {
    console.log("📧 Email would be sent:");
    console.log("To:", template.to);
    console.log("Subject:", template.subject);
    console.log("HTML length:", template.html.length);
    
    // In production, integrate with email service like SendGrid, AWS SES, etc.
    // Example:
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(template)
    // });
    // return response.ok;
    
    return true;
  }
}
