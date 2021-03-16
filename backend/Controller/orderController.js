

const Products = require('../Models/Products')
const Order = require('../Models/Order')
const catchAsyncError = require('../middleware/catchAsyncError')



// @desc    Create a new order
// @route   POST /api/order/new
// @access  Private

exports.createOrder = catchAsyncError( async( req, res) =>{
    const {
        orderItems,
        shippingInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      } = req.body;

      const order = await Order.create({
        orderItems,
        shippingInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
      })

      await order.save();
      res.status(201).json({ message: 'Ordered Successfully', success : true, order})
})


// @desc    Get order by ID
// @route   GET /api/v1/order/:id
// @access  Private
exports.getOrderById = catchAsyncError( async( req, res) =>{
    const order = await Order.findById(req.params.id).populate('user', 'name email')
  
    if (order) {
      res.status(200).json({
        success: true,
        order
    })
    } else {
      return res.status(404).json({ message: "Order not found"})
    }
  })


  // @desc    Get Logged in user orders
// @route   GET /api/v1/orders/me
// @access  Private
exports.getLoggedInUserOrders = catchAsyncError( async( req, res) =>{

  const orders = await Order.find({ user: req.user.id })
  if(orders){
    res.status(200).json({
      success: true,
      orders
  })
  }else {
      return res.status(404).json({ message: "Order not found"})
    }
  }) 
  
 /************* Admin Only *****************************/

  // @desc    Get all orders
  // @route   GET /api/v1/admin/orders
  // @access  Private/Admin
  exports.getAllOrders = catchAsyncError( async( req, res) =>{
    const orders = await Order.find({}).populate('user', 'id name')

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.json( {success: true, totalAmount, orders})
  })

   /************* Admin Only *****************************/

    // @desc    Update order
  // @route   PUT /api/v1/admin/order/:id
  // @access  Private/Admin
  exports.updateOrder = catchAsyncError( async( req, res) =>{
    const order = await Order.findById(req.params.id)
    
   if(order.orderStatus === 'Delivered'){
       return res.status(400).json({ message: "Order had been already delivered"})
   }

   order.orderItems.forEach( async item => {
       await updateStock( item.product, item.quantity)
   })
   
   order.orderStatus = req.body.status,
   order.deliveredAt = Date.now()

   await order.save()
   res.status(200).json({ message: "Successfully delivered", success: true
    })
  })
//after processing the order , update the stock function

  async function updateStock(id, quantity) {
      const product = await Products.findById(id)

      product.countInStock = product.countInStock - quantity

      await product.save({ validateBeforeSave: false})
  }


  /************* Admin Only *****************************/

// @desc     Delete users 
// @route   DELETE /api/v1/admin/order/:id
// @access  private/admin

exports.deleteOrderByAdmin = catchAsyncError( async ( req, res ) => {
    
    const order = await Order.findById(req.params.id)
    if(!order) {
        return res.status(404).json({ message: `No Order Found`})
    }

    await order.remove()
    res.status(200).json({ success: true })

})