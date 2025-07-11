const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  editOrder,
  deleteOrder
} = require('../../controllers/admin/ordermanagement');

// POST /admin/orders
router.post('/create', createOrder);

// GET /admin/orders
router.get('/', getAllOrders);

// GET /admin/orders/user/:userId
router.get('/user/:userId', getOrdersByUser);

// GET /admin/orders/:id
router.get('/:id', getOrderById);

// PATCH /admin/orders/:id/status
router.patch('/:id/status', updateOrderStatus);

// PUT /admin/orders/:id
router.put('/:id', editOrder);

// DELETE /admin/orders/:id
router.delete('/:id', deleteOrder);

module.exports = router;
