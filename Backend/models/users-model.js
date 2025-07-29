const mongoose = require('mongoose');
const argon2 = require('argon2');
const otpGenerator = require('otp-generator'); // Import otp-generator
const Counter = require('./counter-model');

const userSchema = new mongoose.Schema({
    userId: { // New: Unique user ID (e.g., MC-20251)
        type: String,
        unique: true,
        trim: true,
        required: false // Will be auto-generated
    },
    username: {
        type: String,
        required: [true, "Please file the username"],
        unique: [true, "Username already exists"],
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [30, "Username must be at most 30 characters long"],
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
    },
    email: {
        type: String,
        required: [true, "Please fill the email id"],
        unique: [true, "Email already exists"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
        lowercase: true, // Store email in lowercase
        trim: true, // Remove leading and trailing spaces
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validates email format
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    name: {
        type: String,
        required: [true, "Please fill the name"],
    },
    password: {
        type: String,
        required: [true, "Please fill the password"],
        minlength: [10, "Password must be at least 10 characters long"],
        select: false, // To prevent from returning in the queries.
    },
    mobile: {
        type: Number,
        required: [true, "Please fill the mobile number"],
        unique: [true, "Mobile number already exists"],
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v); // Validates that the mobile number is 10 digits
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    otp: { // New: For storing the OTP
        type: String,
        default: null,
    },
    otpExpires: { // New: For OTP expiration
        type: Date,
        default: null,
    },
    isEmailVerified: { // New: Email verification status
        type: Number,
        default: 0, // 0 for not verified, 1 for verified
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,     // 64 MB
            timeCost: 3,             // Iterations
            parallelism: 1           // Threads
        });
        next();
    } catch (error) {
        next(error);
    }
    // Pre-save hook for auto-generating userId (from previous steps)
    if (this.isNew && !this.userId) {
        try {
            const currentYear = new Date().getFullYear();
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'userId' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );
            this.userId = `MC-${currentYear}${counter.sequence_value}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
        throw new Error("Password verification failed");
    }
};


// Collection name
const User = new mongoose.model('users', userSchema);
module.exports = User;