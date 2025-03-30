const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  openingHours: {
    type: String,
    default: "9:00 AM - 10:00 PM",
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: "default-restaurant.jpg",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  menu: [
    {
      name: String,
      price: Number,
      description: String,
      category: String,
    },
    
  ],
}, { timestamps: true });

// Create geospatial index for location-based searches
restaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", restaurantSchema);