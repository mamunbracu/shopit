


const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const catchAsyncError = require("./catchAsyncError");


exports.isAuthenticatedUser = catchAsyncError( async ( req, res, next) => {
    const { token } = req.cookies

    if(!token) {
        return res.status(404).json({ message: 'Not Authorized '})
    }

    const decoded = jwt.verify( token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id)
    next()
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `${req.user.role} role is not allowed to access this resources`})
        }
        next()
    }
}