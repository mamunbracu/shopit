const Products = require("../Models/Products");
const catchAsyncError = require("../middleware/catchAsyncError");

const APIFeature = require("../utils/apiFeature");

const { check, validationResult } = require("express-validator");

// @desc    POST create a product
// @route   POST /api/v1/admin/product/new
// @access  private/admin

exports.productCreateValidator = [
  check("name", "Product name is required").not().isEmpty(),
  check("price", "Product price is required").not().isEmpty(),
  check("description", "Product description is required").not().isEmpty(),
  check("category", "Product category is required").not().isEmpty(),
  check("seller", "Product seller is required").not().isEmpty(),
  check("countInStock", "Product countInStock is required").not().isEmpty(),
];

exports.createProduct = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    // const {name, price, description, rating, image, category, seller, reviews, numReviews,countInStock} = req.body

    const product = await Products.create(req.body);
    res.status(201).json({ success: true, product });
  }
});

// @desc    Get All the products
// @route   GET /api/v1/products
// @access  public

exports.getProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 4;
  const ProductCount = await Products.countDocuments();
  const apiFeature = new APIFeature(Products.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeature.query;
  if (!products) {
    return res.status(404).json({ message: "Products Not Found" });
  } else {
    res.status(200).json({
      count: products.length,
      ProductCount,
      resPerPage,
      products,
    });
  }
});

// @desc    Get Single products by ID
// @route   GET /api/v1/product/:id
// @access  public

exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      res.status(400).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
  }
});

// @desc    Update Single products by ID
// @route   PUT /api/v1/admin/product/:id
// @access  private

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  try {
    let product = await Products.findById(req.params.id);
    if (!product) {
      res.status(400).json({ message: "Product not found", success: false });
    }
    product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error(error.message);
  }
});

// @desc    DELETE Single products by ID
// @route   DELETE /api/v1/admin/product/:id
// @access  private/admin

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  try {
    let product = await Products.findById(req.params.id);
    if (!product) {
      res.status(400).json({ message: "Product not found", success: false });
    }
    await product.remove();
    res
      .status(201)
      .json({ success: true, message: "product deleted successfully" });
  } catch (error) {
    console.error(error.message);
  }
});

// @desc    create/update a product review
// @route   POST /api/v1/:id/review
// @access  private

exports.createReview = catchAsyncError(async (req, res) => {
  const { rating, comment } = req.body;
  console.log(req.user.avatar.url);
  const review = {
    user: req.user._id,
    name: req.user.firstName,
    image: req.user.avatar.url,
    rating: Number(rating),
    comment,
  };
  //find the product
  const product = await Products.findById(req.params.id);
  // console.log(product.reviews);
  //check use already reviewed or not
  console.log(product.reviews);
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.comment = comment;
        rev.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
  }
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(201).json({ message: "Review added", success: true });
});

// @desc    Get the specific product review
// @route   GET /api/v1/review
// @access  private

exports.getReview = catchAsyncError(async (req, res) => {
  const product = await Products.findById(req.query.id);
  res.status(200).json({
    success: true,
    product: product.reviews,
  });
});

// @desc    DELETE the specific product review
// @route   DELETE /api/v1//review
// @access  private

exports.deleteReview = catchAsyncError(async (req, res) => {
  const product = await Products.findById(req.query.productId);
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numReviews = reviews.length;

  const rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;

  await Products.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({ success: true });
});
