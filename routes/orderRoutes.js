const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route mappings for orders
router.get('/', orderController.getAllOrder);
router.get('/create', orderController.getCreateForm);
router.post('/create', orderController.createOrder);
router.get('/update/:id', orderController.getUpdateForm);
router.post('/update/:id', orderController.updateOrder);
router.post('/delete/:id', orderController.deleteOrder);

module.exports = router;
