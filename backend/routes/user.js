const express = require('express');
const router = express.Router();

// Controllers
const {
    signup,
    login,
    sendOTP,
    changePassword,
    approveInstructor,
    getAllInstructors,
    getAllUsers,
    removeInstructorApproval
} = require('../controllers/auth');

// Resetpassword controllers
const {
    resetPasswordToken,
    resetPassword,
} = require('../controllers/resetPassword');


// Middleware
const { auth, isAdmin } = require('../middleware/auth');


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route for sending OTP to the user's email
router.post('/sendotp', sendOTP);

// Route for Changing the password
router.post('/changepassword', auth, changePassword);

// Approve an instructor
router.put('/approve-instructor/:id',auth,isAdmin,approveInstructor);
//remove Approve an instructor
router.put('/remove-instructor-approval/:instructorId',auth,isAdmin,removeInstructorApproval);

// GET /api/v1/admin/instructors
router.get('/get-instructors', auth, isAdmin, getAllInstructors);

// GET all users (only for admin)
router.get('/all-users', auth, isAdmin, getAllUsers);


  


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post('/reset-password-token', resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


module.exports = router
