

const express = require('express');
const { getProducts, createProduct, getSingleProduct, updateProduct, deleteProduct, productCreateValidator, createReview, getReview, deleteReview } = require('../Controller/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.route("/products").get( getProducts )
router.route("/product/:id").get(getSingleProduct)
router.route("/:id/review").post( isAuthenticatedUser, createReview).get(getReview).delete(isAuthenticatedUser, deleteReview)


/*************************** Admin Only **********************************/  

router.route("/admin/product/:id").put( isAuthenticatedUser, authorizeRoles('admin'), updateProduct).delete( isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)
router.route("/admin/product/new").post( isAuthenticatedUser, authorizeRoles('admin'), productCreateValidator, createProduct)


module.exports = router