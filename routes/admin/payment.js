const express = require('express');
const crypto = require('crypto');
const Order = require('../../models/OrderModels');

const router = express.Router();

// eSewa success callback endpoint
router.get('/esewa/success', async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) {
      return res.redirect(`${process.env.CLIENT_FAILURE_URL}?error=nodata`);
    }

    // Decode the base64 data
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    console.log("Decoded eSewa Data:", decodedData);

    if (decodedData.status !== 'COMPLETE') {
      return res.redirect(`${process.env.CLIENT_FAILURE_URL}?error=payment_failed`);
    }

    // Verify the signature
    const secretKey = process.env.ESEWA_SECRET_KEY;
    const message = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${decodedData.product_code},signed_field_names=${decodedData.signed_field_names}`;
    
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(message)
      .digest('base64');

    if (signature !== decodedData.signature) {
      console.error("Signature mismatch!");
      return res.redirect(`${process.env.CLIENT_FAILURE_URL}?error=signature_mismatch`);
    }

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      decodedData.transaction_uuid,
      {
        paymentStatus: 'paid',
        paymentReferenceId: decodedData.transaction_code,
      },
      { new: true }
    );

    if (!order) {
        console.error("Order not found for verification:", decodedData.transaction_uuid);
        return res.redirect(`${process.env.CLIENT_FAILURE_URL}?error=order_not_found`);
    }

    // Redirect to the frontend success page with verification status
    res.redirect(`${process.env.CLIENT_SUCCESS_URL}?verified=true&orderId=${order._id}`);

  } catch (error) {
    console.error("eSewa verification failed:", error);
    res.redirect(`${process.env.CLIENT_FAILURE_URL}?error=server_error`);
  }
});

module.exports = router;