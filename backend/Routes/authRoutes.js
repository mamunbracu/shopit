


const express = require('express');
const { register, registerValidator, loginValidator, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, userDetailsByAdmin, updateUserByAdmin, deleteUserByAdmin } = require('../Controller/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();



router.route("/register").post( registerValidator, register)

router.route("/login").post( loginValidator, loginUser)

router.route("/me").get( isAuthenticatedUser, getUserDetails)

router.route("/password/update").put( isAuthenticatedUser, updatePassword)
router.route("/me/update").put( isAuthenticatedUser, updateProfile)

router.route("/password/forgot").post( forgotPassword)
router.route("/password/reset/:token").put( resetPassword )

router.route("/logout").get( logout )


/************* Admin Only *****************************/

router.route("/admin/users").get( isAuthenticatedUser, authorizeRoles('admin'), getAllUsers)
router.route("/admin/user/:id").get( isAuthenticatedUser, authorizeRoles('admin'), userDetailsByAdmin).put( isAuthenticatedUser, authorizeRoles('admin'), updateUserByAdmin).delete( isAuthenticatedUser, authorizeRoles('admin'),deleteUserByAdmin)


module.exports = router