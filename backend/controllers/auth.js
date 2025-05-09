// sendOtp , signup , login ,  changePassword
const User = require('./../models/user');
const Profile = require('./../models/profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie');
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// ================ SEND-OTP For Email Verification ================
exports.sendOTP = async (req, res) => {
    try {

        // fetch email from re.body 
        const { email } = req.body;

        // check user already exist ?
        const checkUserPresent = await User.findOne({ email });

        // if exist then response
        if (checkUserPresent) {
            console.log('(when otp generate) User alreay registered')
            return res.status(401).json({
                success: false,
                message: 'User is Already Registered'
            })
        }

        // generate Otp
        const otp = optGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        // console.log('Your otp - ', otp);

        const name = email.split('@')[0].split('.').map(part => part.replace(/\d+/g, '')).join(' ');
        console.log(name);

        // send otp in mail
        await mailSender(email, 'OTP Verification Email', otpTemplate(otp, name));

        // create an entry for otp in DB
        const otpBody = await OTP.create({ email, otp });
        // console.log('otpBody - ', otpBody);



        // return response successfully
        res.status(200).json({
            success: true,
            otp,
            message: 'Otp sent successfully'
        });
    }

    catch (error) {
        console.log('Error while generating Otp - ', error);
        res.status(200).json({
            success: false,
            message: 'Error while generating Otp',
            error: error.mesage
        });
    }
}


// ================ SIGNUP ================
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, accountType, contactNumber } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const ExistingUser = await User.findOne({ email });

        if (ExistingUser) {
            return res.status(404).json({ message: "This user already exists" });
        }

        // Set approved = false if accountType is Instructor
        const approved = accountType === "Instructor" ? false : true;

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,
            approved // set the value dynamically
        });

        const savedUser = await user.save();
        console.log(savedUser);

        res.status(200).json({ success: true, message: "User Registered Successfully" });
    } catch (err) {
        console.log("This is the error --->", err);
        res.status(500).json({ message: "Something Went Wrong" });
    }
};



exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      // Fetch user with additionalDetails populated
      let user = await User.findOne({ email }).populate('additionalDetails');
      if (!user) {
        return res.status(401).json({ success: false, message: 'You are not registered with us' });
      }
  
      // 👇 Instructor Approval Check
      if (user.accountType === "Instructor" && user.approved === false) {
        return res.status(403).json({
          success: false,
          message: "Instructor approval pending. Please wait for admin approval."
        });
      }
  
      // Compare password
      if (await bcrypt.compare(password, user.password)) {
        const payload = {
          email: user.email,
          id: user._id,
          accountType: user.accountType,
          approved: user.approved // 👈 Include this if needed in token
        };
  
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
  
        user = user.toObject();
        user.token = token;
        user.password = undefined;
  
        const cookieOptions = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true
        };
  
        res.cookie('token', token, cookieOptions).status(200).json({
          success: true,
          user,
          token,
          message: 'User logged in successfully'
        });
  
      } else {
        return res.status(401).json({ success: false, message: 'Password not matched' });
      }
  
    } catch (error) {
      console.log('Error while Login user');
      console.log(error);
      res.status(500).json({ success: false, error: error.message, message: 'Error while Login user' });
    }
  };
  

// ================ CHANGE PASSWORD ================
exports.changePassword = async (req, res) => {
    try {
        // extract data
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'All fileds are required'
            });
        }

        // get user
        const userDetails = await User.findById(req.user.id);

        // validate old passowrd entered correct or not
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )

        // if old password not match 
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false, message: "Old password is Incorrect"
            });
        }

        // check both passwords are matched
        if (newPassword !== confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'The password and confirm password do not match'
            })
        }


        // hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update in DB
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
            { password: hashedPassword },
            { new: true });


        // send email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                'Password for your account has been updated',
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            // console.log("Email sent successfully:", emailResponse);
        }
        catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }


        // return success response
        res.status(200).json({
            success: true,
            mesage: 'Password changed successfully'
        });
    }

    catch (error) {
        console.log('Error while changing passowrd');
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while changing passowrd'
        })
    }
}



exports.removeInstructorApproval = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    instructor.approved = false;
    await instructor.save();

    res.status(200).json({ message: 'Instructor approval removed successfully' });
  } catch (error) {
    console.error('Error removing instructor approval:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.approveInstructor =  async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.accountType !== 'Instructor') {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        user.approved = true;
        await user.save();

        res.status(200).json({ message: 'Instructor approved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getAllInstructors = async (req, res) => {
    try {
      const instructors = await User.find({ accountType: 'Instructor' }).select('-password');
      res.status(200).json({ success: true, instructors });
    } catch (error) {
      console.log('Error while fetching instructors: ', error);
      res.status(500).json({ success: false, message: 'Failed to fetch instructors', error: error.message });
    }
  };

  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // exclude password
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ accountType: 'Student' }).select('-password'); // filter for Student accounts, exclude password
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server Error" });
  }
};