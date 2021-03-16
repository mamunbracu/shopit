

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required: [true, "Please provide First Name"]
    },
    lastName:{
        type:String,
        required: [true, "Please provide Last Name"]
    },
    email: {
        type: String,
        required: [true, "Please provide email address"],
        unique: true,
        validate: [validator.isEmail, 'Please Enter a valid Email address'],
      },
      password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, 'Password must be 6 character long'],
      },

    avatar: {
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

    role:{
        type:String,
        default:'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,


},{
    timestamps:true
})


  
  //Encrypting password

  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next()
    }
  
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })

  //return jwt token
  userSchema.methods.getJwtToken = function () {
      return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_TIME
      })
  }

  //match the password
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
  }

  //Generate password reset token

  userSchema.methods.getResetPasswordToken = function() {

    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    //Hash and set resetPassword token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    //set token expires time
    this.resetPasswordExpire = Date.now() + 30 *60 * 1000

    return resetToken

  }

module.exports = mongoose.model('User', userSchema)