const express = require('express')
const {registerController, loginController, updatePasswordControllers, updateUsernameControllers, deleteUserControllers , requireSingIn, forgotPasswordControllers, resetPasswordController, verifyOtpController} = require('../controllers/userControllers')

// router object
const router = express.Router()


// routes 

// Register || POST
router.post('/register' , registerController)
// Login || POST
router.post('/login' , loginController)
// update password
router.put('/update-password' , updatePasswordControllers)
// update username
router.put('/update-username' , updateUsernameControllers)
// delete account
router.delete('/delete-user' ,  deleteUserControllers)
// forgot password
router.post('/forgot-password' , forgotPasswordControllers)
// reset-password
router.post('/verify-otp' , verifyOtpController)
// new-password
router.post('/reset-password' , resetPasswordController)
// export

module.exports = router