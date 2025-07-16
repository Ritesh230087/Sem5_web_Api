// This function returns the complete HTML for the order confirmation email
const getOrderConfirmationHtml = (order) => {
  // Generate the HTML for each item in the order
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">
        <img src="${process.env.BASE_URL}/${item.productId.filepath}" alt="${item.name}" width="60" style="border-radius: 4px; vertical-align: middle;">
        <span style="padding-left: 10px; vertical-align: middle;">${item.name}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">NPR ${item.price.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">NPR ${(item.quantity * item.price).toLocaleString()}</td>
    </tr>
  `).join('');

  const subtotal = order.totalAmount - order.deliveryFee;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
      .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
      .header h1 { margin: 0; color: #333; }
      .content { padding: 20px 0; }
      .content h2 { color: #333; }
      .order-details, .shipping-info { width: 100%; margin-bottom: 20px; }
      .order-summary { width: 100%; border-collapse: collapse; }
      .order-summary th, .order-summary td { padding: 10px; text-align: left; }
      .footer { text-align: center; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888; }
    </style>
  </head>
  <body>
    <div class="container" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div class="header" style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
        <!-- You can replace this text with your logo -->
        <h1 style="margin: 0; color: #333; font-size: 28px;">ROLO STORE</h1>
      </div>
      <div class="content" style="padding: 20px 0;">
        <h2 style="color: #333;">Thank You for Your Order, ${order.userId.fullName}!</h2>
        <p>Your order #${order._id.toString().slice(-6)} has been confirmed. We've received your payment and will notify you once your order has shipped. Here are the details:</p>
        
        <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px;">Order Details</h3>
        <table class="order-summary" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantity</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Unit Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right; padding: 10px; font-weight: bold;">Subtotal:</td>
              <td style="text-align: right; padding: 10px;">NPR ${subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right; padding: 10px; font-weight: bold;">Shipping Fee:</td>
              <td style="text-align: right; padding: 10px;">NPR ${order.deliveryFee.toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right; padding: 10px; font-weight: bold; font-size: 18px; border-top: 2px solid #ddd;">Total Paid:</td>
              <td style="text-align: right; padding: 10px; font-weight: bold; font-size: 18px; border-top: 2px solid #ddd;">NPR ${order.totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px; margin-top: 30px;">Shipping To</h3>
        <div class="shipping-info">
          <strong>${order.shippingAddress.fullName}</strong><br>
          ${order.shippingAddress.addressLine}, ${order.shippingAddress.city}<br>
          ${order.shippingAddress.country}, ${order.shippingAddress.postalCode}<br>
          Phone: ${order.shippingAddress.phone}
        </div>
      </div>
      <div class="footer" style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888;">
        <p>Questions? Contact our support team at support@rolostore.com</p>
        <p>© ${new Date().getFullYear()} ROLO Store. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = { getOrderConfirmationHtml };