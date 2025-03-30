const express = require("express");
const router = express.Router();
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

// Add these imports (path may vary based on your structure)
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getRestaurants);
router.get("/:id", getRestaurant);

// Protected Admin routes
router.post("/", protect, admin, createRestaurant);
router.put("/:id", protect, admin, updateRestaurant);
router.delete("/:id", protect, admin, deleteRestaurant);

module.exports = router;