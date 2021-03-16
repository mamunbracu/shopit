


const express = require('express');
const { processPayment, sendStripApi } = require('../Controller/paymentController');
const { isAuthenticatedUser } = require('../middleware/authMiddleware');
const router = express.Router();


router.route('/payment/process').post(isAuthenticatedUser, processPayment);
router.route('/stripeapi').get(isAuthenticatedUser, sendStripApi);

module.exports = router;