


const express = require('express');
const { createOrder, getOrderById, getLoggedInUserOrders, getAllOrders, updateOrder, deleteOrderByAdmin } = require('../Controller/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();


router.route("/order/new").post( isAuthenticatedUser, createOrder)
router.route("/order/:id").get( isAuthenticatedUser, getOrderById)
router.route("/orders/me").get( isAuthenticatedUser, getLoggedInUserOrders)

/*************************** Admin Only **********************************/  
router.route("/admin/orders").get( isAuthenticatedUser, authorizeRoles('admin'), getAllOrders)
router.route("/admin/order/:id").put( isAuthenticatedUser, authorizeRoles('admin'), updateOrder).delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrderByAdmin)



module.exports = router