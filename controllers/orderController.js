const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Get all bookings (Booking List)
exports.getAllOrder = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('order', { orders, error: null });
  } catch (error) {
    next(error);
  }
};

// Show Book Room form
exports.getCreateForm = (req, res) => {
  res.render('createOrder', { error: null, data: {} });
};

// Handle Book Room submission
exports.createOrder = async (req, res, next) => {
  const { customerName, productName, quantity, orderDate } = req.body;
  const data = { customerName, productName, quantity, orderDate };

  try {
    if (!customerName || !productName || !quantity || !orderDate) {
      return res.render('createOrder', {
        error: 'All fields are required.',
        data
      });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.render('createOrder', {
        error: 'Quantity must be a positive number.',
        data
      });
    }

    const parsedOrderDate = new Date(orderDate);
    if (isNaN(parsedOrderDate.getTime())) {
      return res.render('createOrder', {
        error: 'Invalid Order date/time.',
        data
      });
    }

    // Validate product exists
    const product = await Product.findOne({ productName: productName.trim() });
    if (!product) {
      return res.render('createOrder', {
        error: `Product "${productName}" does not exist in the system.`,
        data
      });
    }

    // Calculate total amount
    const totalPrice = Math.round(qty * product.unitPrice);

    // Save order
    const newOrder = new Order({
      customerName: customerName.trim(),
      productName: productName.trim(),
      quantity: qty,
      orderDate: parsedOrderDate,
      totalPrice
    });

    await newOrder.save();
    res.redirect('/orders');
  } catch (error) {
    console.error('Error creating order:', error);
    res.render('createOrder', {
      error: 'An error occurred while creating the order: ' + error.message,
      data
    });
  }
};

// Show Update Booking form
exports.getUpdateForm = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.render('updateOrder', { order, error: null });
  } catch (error) {
    next(error);
  }
};

// Handle Update Booking submission
exports.updateOrder = async (req, res, next) => {
  const { customerName, productName, quantity, orderDate } = req.body;
  const orderId = req.params.id;

  try {
    // Find the current booking
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    const product = await Product.findOne({ productName: productName.trim() });
    if (!product) {
      return res.render('updateOrder', {
        order: { _id: orderId, customerName, productName, quantity, orderDate },
        error: `Product name "${productName}" does not exist in the system.`
      });
    }

    // Validate dates
    const newOrderDate = new Date(orderDate);
    if (isNaN(newOrderDate.getTime())) {
      return res.render('updateOrder', {
        order: { _id: orderId, customerName, productName, quantity, orderDate },
        error: 'Invalid order date.'
      });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.render('updateOrder', {
        order: { _id: orderId, customerName, productName, quantity, orderDate },
        error: 'Quantity must be a positive number.'
      });
    }

    const totalPrice = Math.round(qty * product.unitPrice);

    // Update database
    order.customerName = customerName.trim();
    order.productName = productName.trim();
    order.quantity = qty;
    order.orderDate = newOrderDate;
    order.totalPrice = totalPrice;

    await order.save();
    res.redirect('/orders');
  } catch (error) {
    console.error('Error updating order:', error);
    res.render('updateOrder', {
      order: { _id: orderId, customerName, productName, quantity, orderDate },
      error: 'An error occurred while updating the order: ' + error.message
    });
  }
};

// Handle Delete Booking
exports.deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect('/orders');
  } catch (error) {
    next(error);
  }
};

