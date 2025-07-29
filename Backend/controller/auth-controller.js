const userModel = require('../models/users-model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const home = async (req, res) => {
    try {
        res.status(200).send("User Authenticated Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

// Function to generate a JWT
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRATION_TIME } // '1h' from .env
    );
};

// Transporter for sending emails
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Register route handler
const register = async (req, res) => {
    try {
        // Getting value form the registration form. 
        const { username, email, name, password, mobile } = req.body;

        // Santize and validate all input field.
        if (!username || !email || !name || !password || !mobile) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if username, email, or mobile already exist
        const existingUser = await userModel.findOne({ $or: [{ username: username }, { email: email }, { mobile: Number(mobile) }] });
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already exists" });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: "User Email already exists" });
            }
            if (existingUser.mobile === mobile) {
                return res.status(400).json({ message: "Mobile number already exists" });
            }
        }

        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        // Check if the username is valid
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/; // Alphanumeric and underscores, 3-30 characters
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ message: "Username must be 3-30 characters long and can only contain letters, numbers, and underscores" });
        }
        // Check if the name is valid
        const nameRegex = /^[a-zA-Z\s]{2,50}$/; // Letters and spaces, 2-50 characters
        if (!nameRegex.test(name)) {
            return res.status(400).json({ message: "Name must be 2-50 characters long and can only contain letters and spaces" });
        }
        // Check if the password is valid
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/; // At least one lowercase, one uppercase, one digit, and at least 10 characters
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, and one digit" });
        }
        // Check if the mobile number is valid
        const mobileRegex = /^\d{10}$/; // Exactly 10 digits
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
        }

        // Create a new user
        const newUser = new userModel({
            username: username,
            email: email,
            name: name,
            password: password,
            mobile: mobile,
            isEmailVerified: 0,
            updatedAt: Date.now(),
        });

        // OTP generation
        const otp = otpGenerator.generate(5, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: true,
            specialChars: false,
            digits: true
        });

        newUser.otp = otp;
        newUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Save the user to the database
        await newUser.save();

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: newUser.email,
            subject: 'Email Verification OTP for Mould Connect',
            html: `<p>Your One-Time Password (OTP) for Mould Connect is: <strong>${otp}</strong></p>
                   <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>`,
        });

        // Generate a JWT for the newly registered user
        const token = generateToken(newUser);

        res.status(201).json({
            message: "User successfully registered. Please verify your email with the OTP sent to your inbox.",
            userId: newUser._id.toString(),
        });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Extract validation messages
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: "Validation failed", errors: messages });
        }
        // Handle Mongoose casting errors (e.g., trying to save a string into a Number field)
        else if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: `Invalid data type for field: ${error.path}. Expected a ${error.kind}, but received ${error.value}.` });
        }
        console.error("Error during registration:", error); // Log the full error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { userId } = req.body; // Expecting userId from frontend
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.isEmailVerified === 1) {
            return res.status(400).json({ message: 'Email already verified.' });
        }

        // Generate new OTP
        const otp = otpGenerator.generate(5, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: true,
            specialChars: false,
            digits: true
        });
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // New 10-minute expiration

        await user.save();

        // Send new OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'New Email Verification OTP for Mould Connect',
            html: `<p>Your new One-Time Password (OTP) for Mould Connect is: <strong>${otp}</strong></p>
                   <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>`,
        });

        res.status(200).json({ message: 'New OTP sent successfully!' });

    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Verify OTP
// Verify OTP route handler
const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.isEmailVerified === 1) {
            return res.status(400).json({ message: 'Email already verified.' });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
        if (user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        user.isEmailVerified = 1; // Set to verified
        user.otp = null; // Clear OTP after successful verification
        user.otpExpires = null; // Clear OTP expiration
        await user.save();

        // After successful verification, log in the user and send JWT
        const token = generateToken(user);

        res.status(200).json({
            message: 'Email verified successfully! You are now logged in.',
            token: token,
            user: {
                id: user._id.toString(),
                fullName: user.name,
                userId: user.userId // Include the auto-generated userId
            },
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Login route handler
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user by email
        const user = await userModel.findOne({ email: email }).select('+password');;
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" }); // Use a generic message for security
        }

        // Check if email is verified
        if (user.isEmailVerified === 0) {
            return res.status(403).json({
                message: 'Your email is not verified. Please verify your email using the OTP sent to your inbox.',
                userId: user._id.toString(),
            });
        }

        // Compare the provided password with the hashed password in the database
        // Assuming you have a comparePassword method on your userModel schema
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // If credentials are correct, send a success response
        // In a real application, you would generate a JWT here
        const token = generateToken(user);
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id.toString(),
                fullName: user.name,
                userId: user.userId // Include the auto-generated userId
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateUser = async (req, res) => {
    const { userId } = req.params; // ID of the user to update
    const { fullName, mobile } = req.body; // Fields to update
    const authenticatedUserId = req.userId; // ID from JWT payload

    // Security check: Ensure authenticated user is updating their own profile
    if (userId !== authenticatedUserId.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own user data.' });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update only allowed fields
        if (fullName !== undefined) user.fullName = fullName;
        if (mobile !== undefined) user.mobile = mobile;

        await user.save();

        // Return updated user data (excluding sensitive info like password)
        const updatedUser = {
            id: user._id.toString(),
            email: user.email,
            fullName: user.name,
            mobile: user.mobile,
        };

        res.status(200).json({ message: 'User data updated successfully.', user: updatedUser });

    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Server error updating user data.', error: error.message });
    }
};

const getUserDetails = async (req, res) => {
    const { userId } = req.params;
    const authenticatedUserId = req.userId;

    if (userId !== authenticatedUserId.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only view your own user data.' });
    }

    try {
        const user = await userModel.findById(userId).select('name mobile email'); // Select specific fields
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            user: {
                id: user._id.toString(),
                fullName: user.name, 
                email: user.email,
                mobile: user.mobile,
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error fetching user details.', error: error.message });
    }
};


module.exports = {
    home,
    register,
    login,
    updateUser,
    getUserDetails,
    resendOTP,
    verifyOTP
};