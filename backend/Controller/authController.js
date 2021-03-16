

const catchAsyncError = require('../middleware/catchAsyncError');
const { check, validationResult } = require('express-validator');
const User = require('../Models/User')
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')
const cloudinary = require('cloudinary');


// @desc    POST create a user 
// @route   POST /api/v1/register
// @access  private/admin

//validate using express validator

exports.registerValidator = [
    check('firstName', 'FirstName is required').not().isEmpty(),
    check('lastName', 'LastName is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('password', 'Password must be 5 or more character or number').isLength({ min: 6 }),
    // check('email', 'Please Put a valid email').isEmail(),
    check('email')
          .not()
          .isEmpty()
          .withMessage('Email is required')
          .isEmail()
          .withMessage('Invalid Email')
          .custom((value, {req}) => {
            return new Promise((resolve, reject) => {
              User.findOne({email:req.body.email}, function(err, user){
                if(err) {
                  reject(new Error('Server Error'))
                }
                if(Boolean(user)) {
                  reject(new Error('User with this Email already exists'))
                }
                resolve(true)
              });
            });
          }),
]


exports.register = catchAsyncError( async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatar',
        width: 150,
        crop: "scale"
        })
    const { firstName, lastName, email, password } = req.body
   
    const userExists = await User.findOne({ email })
  
    if (userExists) {
      return res.status(400).json({ message: 'User already exists'})
    }
  
    const user = await User.create({
     firstName,
     lastName,
      email,
      password,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url
      }
    })

    sendToken(user, 200, res)
})



// @desc    POST Login user 
// @route   POST /api/v1/login
// @access  private


exports.loginValidator = [
    check('email', 'Please Put a valid email').isEmail(),
    check('password', 'Please Put the correct password').isLength({ min: 6 })
]

exports.loginUser = catchAsyncError( async (req, res, next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body
   
      const user = await User.findOne({ email })
    
      if (!user) {
        return res.status(404).json({ message: 'User Not exists'})
      }

      const isPasswordMatched = await user.matchPassword(password)

      if(!isPasswordMatched){
        return res.status(400).json({ message: 'Password Not matched'})
      }

      sendToken(user, 200, res)

})


// @desc      Forgot password  
// @route   POST /api/v1/password/forgot
// @access  private

exports.forgotPassword = catchAsyncError( async ( req, res, next ) => {
    const user = await User.findOne({ email: req.body.email})

    if(!user){
        return res.status(404).json({ message: "User not found"})
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })
    //create reset password url
    //${req.protocol}://${req.get('host')}/api/v1
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`

    try {
        await sendEmail({
            email:user.email,
            subject: 'ShopIt Password Recovery',
            message
        })

        res.status(200).json({ success: true, message:`Email send to ${user.email}`})

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false})
        console.error(error.message)
    }
})


// @desc      reset password  
// @route   PUT /api/v1/password/reset/:token
// @access  private

exports.resetPassword = catchAsyncError( async ( req, res, next ) => {
    //hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt : Date.now() }
    })
    if (!user) {
        return res.status(404).json({ message: 'Password reset token invalid or has been expires'})
      }

      if(req.body.password !== req.body.confirmPassword) {
          return res.status(400).json({ message: 'Password does not matched'})
      }

      //setup new password 
      user.password = req.body.password
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save();
      sendToken(user, 200, res)

})


// @desc     GET Logged in user details 
// @route   GET /api/v1/me
// @access  private

exports.getUserDetails = catchAsyncError( async ( req, res, next ) => {
    
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })

})

// @desc   update Logged in user password 
// @route   PUT /api/v1/password/update
// @access  private

exports.updatePassword = catchAsyncError( async ( req, res, next ) => {
    
    const user = await User.findById(req.user.id)

    //check old password is correct or not
    const isMatched = await user.matchPassword(req.body.oldPassword)
    if(!isMatched){
        return res.status(400).json({ message: "Old Password not matched"})
    }
    user.password = req.body.password
    
    await user.save()

    sendToken( user, 200, res)

})


// @desc     Update User Profile
// @route   PUT /api/v1/me/update
// @access  private

exports.updateProfile = catchAsyncError(async( req, res) => {
    
    const newUserData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }
     // Update avatar
     if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatar',
            width: 150,
            crop: "scale"
            })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    } 
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    
    res.status(200).json({ success: true })

})



// @desc     logout user 
// @route   POST /api/v1/logout
// @access  private

exports.logout = catchAsyncError( async ( req, res, next ) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly : true
    })

    res.status(200).json({
        message : 'Logout successfully',
        success: true
    })

})




/************* Admin Only *****************************/

// @desc     Get All users 
// @route   POST /api/v1/admin/users
// @access  private/admin

exports.getAllUsers = catchAsyncError( async ( req, res, next ) => {
    
    const users = await User.find({})

    if(!users){
        return res.status(404).json({ message: "Users Not found"})
    }

    res.status(200).json({
        success: true,
        users
    })

})

/************* Admin Only *****************************/

// @desc     Get user by id 
// @route   GET /api/v1/admin/user/:id
// @access  private/admin

exports.userDetailsByAdmin = catchAsyncError( async ( req, res, next ) => {
    
    const user = await User.findById(req.params.id)

    if(!user){
        return res.status(404).json({ message: `User does not exist with this ${req.params.id} id`})
    }

    res.status(200).json({
        success: true,
        user
    })

})


/************* Admin Only *****************************/

// @desc     update user by admin 
// @route   PUT /api/v1/admin/user/:id
// @access  private/admin

exports.updateUserByAdmin = catchAsyncError( async ( req, res, next ) => {
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    
    res.status(200).json({ success: true, user })

})


/************* Admin Only *****************************/

// @desc     Delete users 
// @route   DELETE /api/v1/admin/user/:id
// @access  private/admin

exports.deleteUserByAdmin = catchAsyncError( async ( req, res, next ) => {
    
    const user = await User.findById(req.params.id)
    if(!user) {
        return res.status(404).json({ message: `User does not exist with this ${req.params.id} id`})
    }
    //Remove avatar from cloudinary


    await user.remove()
    res.status(200).json({ success: true })

})