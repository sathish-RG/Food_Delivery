const Order = require('../models/Order');
const User = require('../models/user');

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deliveryAddress, paymentMethod } = req.body;

    const user = await User.findById(userId).populate('cart.restaurant');
    
    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Assuming single restaurant per order for simplicity
    const restaurantCart = user.cart[0];
    
    const order = new Order({
      user: userId,
      restaurant: restaurantCart.restaurant._id,
      items: restaurantCart.items,
      deliveryAddress: deliveryAddress || user.address,
      totalAmount: restaurantCart.items.reduce(
        (total, item) => total + (item.price * item.quantity), 0
      ),
      paymentMethod
    });

    await order.save();
    
    // Clear user's cart after order creation
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's order history
exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single order details
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name address')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order belongs to requesting user
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};