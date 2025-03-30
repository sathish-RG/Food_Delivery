const User = require("../models/user");

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { restaurantId, itemId, name, price, quantity } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    // Check if restaurant already exists in cart
    let restaurantCart = user.cart.find(c => c.restaurant.equals(restaurantId));

    if (restaurantCart) {
      // Check if item already exists
      const existingItem = restaurantCart.items.find(i => i.menuItem.equals(itemId));
      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        restaurantCart.items.push({ menuItem: itemId, name, price, quantity: quantity || 1 });
      }
    } else {
      user.cart.push({
        restaurant: restaurantId,
        items: [{ menuItem: itemId, name, price, quantity: quantity || 1 }]
      });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { restaurantId, itemId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const restaurantCart = user.cart.find(c => c.restaurant.equals(restaurantId));

    if (restaurantCart) {
      restaurantCart.items = restaurantCart.items.filter(
        i => !i.menuItem.equals(itemId)
      );
      
      // Remove restaurant entry if no items left
      if (restaurantCart.items.length === 0) {
        user.cart = user.cart.filter(c => !c.restaurant.equals(restaurantId));
      }
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.restaurant");
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { restaurantId, itemId, quantity } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const restaurantCart = user.cart.find(c => c.restaurant.equals(restaurantId));

    if (restaurantCart) {
      const item = restaurantCart.items.find(i => i.menuItem.equals(itemId));
      if (item) {
        item.quantity = quantity;
      }
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};