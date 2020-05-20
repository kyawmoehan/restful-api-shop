const express = require('express');
const checkAuth = require('../middleware/chek-auth');
const router = express.Router();

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.order_get_all);
router.post('/', checkAuth, OrdersController.order_create_order);
router.get('/:orderId', checkAuth, OrdersController.order_get_id);
router.delete('/:orderId', checkAuth, OrdersController.order_delete_order);

module.exports = router;