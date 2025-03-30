const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderHistory,
  getOrderDetails
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrderHistory);
router.get('/:id', getOrderDetails);

module.exports = router;