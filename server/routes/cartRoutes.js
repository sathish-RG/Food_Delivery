const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getCart,
  updateQuantity,
  clearCart
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All routes protected

router.post("/", addToCart);
router.delete("/", removeFromCart);
router.get("/", getCart);
router.put("/", updateQuantity);
router.delete("/clear", clearCart);

module.exports = router;