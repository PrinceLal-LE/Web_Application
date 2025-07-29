// Backend/router/profile-router.js
const express = require('express');
const router = express.Router();
const profileController = require('../controller/profile-controller');
const authMiddleware = require('../middleware/authMiddleware'); // Import the JWT authentication middleware
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Multer storage configuration
// Requirement 8: Store in eRepo folder on the backend
const eRepoPath = process.env.EREPO_PATH || path.join(__dirname, '../../eRepo');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, eRepoPath); // Destination folder on backend
    },
    filename: (req, file, cb) => {
        // Requirement 9: Unique name for files
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const fileExtension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`); // e.g., profile_photo-abc123def456.png
    }
});

// Multer file filter (Requirement 9: Only jpg, jpeg, png accepted)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, and PNG image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size to 5MB
});

// Profile Routes
router.route('/:userId')
    .put(
        authMiddleware, // Apply JWT authentication middleware
        upload.fields([ // Use .fields() for multiple named file inputs
            { name: 'profile_photo', maxCount: 1 },
            { name: 'cover_photo', maxCount: 1 }
        ]),
        profileController.upsertProfile
    )
    .get(authMiddleware, profileController.getProfile); // Apply JWT authentication middleware

module.exports = router;