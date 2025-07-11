const Order = require('../../models/OrderModels');
const crypto = require('crypto');

// Create order
exports.createOrder = async (req, res) => {
  try {
    console.log("Create order payload:", req.body);

    if (!req.body.userId || !req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ error: "Invalid or missing userId or items" });
    }

    const order = new Order(req.body);

    const validationError = order.validateSync();
    if (validationError) {
      console.error("Validation error:", validationError);
      return res.status(400).json({ error: validationError.message });
    }

    if (order.paymentMethod === 'bank' && !order.paymentBankName) {
      return res.status(400).json({ error: 'Bank name required for bank payment' });
    }

    const savedOrder = await order.save();

    // If payment method is eSewa, generate signature and payment details
    if (savedOrder.paymentMethod === 'esewa') {
      const secretKey = process.env.ESEWA_SECRET_KEY;
      const message = `total_amount=${savedOrder.totalAmount},transaction_uuid=${savedOrder._id},product_code=${process.env.ESEWA_MERCHANT_CODE}`;
      
      const signature = crypto
        .createHmac('sha256', secretKey)
        .update(message)
        .digest('base64');
      
      const paymentDetails = {
        amount: savedOrder.totalAmount - savedOrder.deliveryFee,
        tax_amount: "0", // Assuming tax is included in the total or is zero
        total_amount: savedOrder.totalAmount.toString(),
        transaction_uuid: savedOrder._id.toString(),
        product_code: process.env.ESEWA_MERCHANT_CODE,
        product_service_charge: "0",
        product_delivery_charge: savedOrder.deliveryFee.toString(),
        success_url: `${process.env.BASE_URL}/api/payments/esewa/success`, // Backend success URL
        failure_url: process.env.CLIENT_FAILURE_URL,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
      };

      return res.status(201).json({ 
        message: 'Order created, proceed to payment.',
        order: savedOrder,
        paymentDetails: paymentDetails,
        paymentGatewayUrl: process.env.ESEWA_API_URL
      });
    }

    // For other payment methods like 'cod'
    res.status(201).json({
      message: 'Order created successfully.',
      order: savedOrder
    });

  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ... (rest of the file remains the same)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { paymentStatus: req.body.paymentStatus, deliveryStatus: req.body.deliveryStatus }},
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.editOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};