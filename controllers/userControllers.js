const JWT = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');
var { expressjwt: jwt } = require("express-jwt");
const nodemailer = require('nodemailer');

//middleware
const requireSingIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});



const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Compare password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // token jwt
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '10d'
        })

        // Send response
        user.password = undefined
        res.status(200).send({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }, // Only send necessary details
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error in login API',
            error,
        });
    }
};

const updatePasswordControllers = async (req, res) => {
    try {
        const { email, password } = req.body
        // find the user
        const user = await userModel.findOne({ email });
        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'Password is required and should be 6 characters long'
            })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        // update password
        const updatedPassword = await userModel.findOneAndUpdate({ email }, {
            password: hashedPassword || user.password,
        }, { new: true })
        updatedPassword.password = undefined
        res.status(200).send({
            success: true,
            message: 'profile updated Please login',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in user update api'
        })
    }
}

const forgotPasswordControllers = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'User not found',
            });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Store the OTP and expiration in the database
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Create an HTML email template
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
                <h2 style="color: #3b82f6;">Your OTP Code</h2>
                <p>Hello,</p>
                <p>You requested a password reset. Use the following OTP to verify your identity:</p>
                <h1 style="color: #ff5733;">${otp}</h1>
                <p>This OTP is valid for 10 minutes. If you didn’t request this, you can ignore this email.</p>
                <p>Thank you,</p>
                <p>Team Abhi</p>
            </div>
        `;

        // Create a transporter for sending the email via Gmail
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send the OTP email
        await transporter.sendMail({
            from: '"TiffinManager" <your-email@gmail.com>',
            to: email,
            subject: 'Your OTP for Password Reset',
            html: htmlContent,
        });

        // Send response
        res.status(200).send({
            success: true,
            message: 'OTP has been sent to your email',
        });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).send({
            success: false,
            message: 'Error in forgot password API',
        });
    }
};


// api to verify otp 
const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'User not found',
            });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).send({
                success: false,
                message: 'Invalid or expired OTP',
            });
        }
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '10m',
        });

        res.status(200).send({
            success: true,
            message: 'OTP verified successfully',
            token, // Send the token to the frontend for resetting the password
        });
    } catch (error) {
        console.error('Error in verifying OTP:', error);
        res.status(500).send({
            success: false,
            message: 'Error in verifying OTP',
        });
    }
};

const updateUsernameControllers = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });


        // Update the username if user exists
        const updatedUserName = await userModel.findOneAndUpdate(
            { email },
            { name: name || user.name },
            { new: true }
        );

        // Send success response
        res.status(200).send({
            success: true,
            message: 'Username Updated',
            updatedUser: updatedUserName, // Send updated user data
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in user update api',
        });
    }
};

const deleteUserControllers = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Email is required',
            });
        }
        const deletedUser = await userModel.findOneAndDelete({ email });
        if (!deletedUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).send({
            success: true,
            message: `User with email ${email} has been deleted successfully`,
        });
    } catch (error) {
        console.error('Error in delete user API:', error);
        res.status(500).send({
            success: false,
            message: 'Error in user delete API',
        });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await hashPassword(password);
        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Send response back to the client
        res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in resetPasswordController:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// Function to send a welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Welcome to Tiffin Tracker! 🍽️🎉",
            text: `Hello ${userName},\n\nThank you for registering with us. We are excited to have you on board!\n\nBest regards,\nTiffin Tracker Team`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Tiffin Tracker</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .header {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                    }
                    .sub-header {
                        font-size: 18px;
                        color: #555;
                        margin-top: 10px;
                    }
                    .content {
                        font-size: 16px;
                        color: #444;
                        line-height: 1.6;
                        margin-top: 20px;
                        text-align: left;
                    }
                    .cta-button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 25px;
                        font-size: 16px;
                        color: #ffffff;
                        background-color: #ff6f00;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 14px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <img src="https://your-tiffin-tracker-logo-url.com/logo.png" alt="Tiffin Tracker Logo" width="120">
                    
                    <p class="header">Welcome to Tiffin Tracker, ${userName}! 🎉</p>
                    <p class="sub-header">Your smart way to track your tiffin </p>
        
                    <p class="content">
                        Hello <strong>${userName}</strong>,  
                        <br><br>
                        Thank you for registering with <strong>Tiffin Tracker</strong>! We are thrilled to have you on board.  
                        Now, you can easily track your tiffin deliveries, get meal reminders, and manage your orders seamlessly.
                        <br><br>
                        To get started, click the button below to explore our platform:
                    </p>
        
        
                    <p class="footer">
                        Best regards,  
                        <br><strong>Tiffin Tracker Team</strong>  
                        <br>Need help? <a href="mailto:tiffintrackerorg@gmail.com">Contact Support</a>
                    </p>
                </div>
            </body>
            </html>
            `
        };
        

        
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: ", info.response);

        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error sending email: ", error);
        return { success: false, message: "Error sending email", error };
    }
};

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name) {
            return res.status(400).send({ success: false, message: "Name is required" });
        }
        if (!email) {
            return res.status(400).send({ success: false, message: "Email is required" });
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password is required and must be at least 6 characters long",
            });
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "User already registered with this email",
            });
        }

        // Hash the password before saving
        const hashedPassword = await hashPassword(password);

        // Save new user to database
        const user = await new userModel({ name, email, password: hashedPassword }).save();

        // Send welcome email
        const emailResponse = await sendWelcomeEmail(user.email, user.name);

        // Respond with success message
        res.status(201).send({
            success: true,
            message: "Registration successful",
            emailStatus: emailResponse.message, // Include email response message
            user: { id: user._id, name: user.name, email: user.email } // Send only necessary user details
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error in registration API",
            error,
        });
    }
};

module.exports = {
    registerController,
    loginController,
    updatePasswordControllers,
    updateUsernameControllers,
    deleteUserControllers,
    requireSingIn,
    forgotPasswordControllers,
    verifyOtpController,
    resetPasswordController
};
