// Backend/controller/profile-controller.js
const Profile = require('../models/profile-model');
const path = require('path');
const fs = require('fs');
const validator = require('validator');

// Requirement 10: Maintain the eRepo folder path in the env file
// It should be on the root of the Backend project
const eRepoPath = process.env.EREPO_PATH || path.join(__dirname, '../../eRepo');
if (!fs.existsSync(eRepoPath)) {
    fs.mkdirSync(eRepoPath, { recursive: true });
}

// Helper function to safely delete old files
const deleteOldFile = (relativeFilePath) => {
    // Construct the absolute path
    const absoluteFilePath = path.join(eRepoPath, path.basename(relativeFilePath || ''));
    // Only delete if the file exists and is within the eRepo directory
    if (fs.existsSync(absoluteFilePath)) {
        try {
            fs.unlinkSync(absoluteFilePath);
            console.log(`Successfully deleted old file: ${absoluteFilePath}`);
        } catch (err) {
            console.error(`Error deleting old file ${absoluteFilePath}:`, err);
        }
    }
};

const profileController = {
    upsertProfile: async (req, res) => {
        const { userId: paramUserId } = req.params; // User ID from URL parameter (the profile to update)
        const authenticatedUserId = req.userId; // ID of the authenticated user from JWT
        const authenticatedUserEmail = req.user?.email; // Email of the authenticated user from JWT

        // Security check: Ensure authenticated user is updating their own profile
        if (paramUserId !== authenticatedUserId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
        }

        const {
            address,
            profession, // Corresponds to 'headline' in old frontend
            about_me,   // Corresponds to 'bio' in old frontend
            skills,
            linkedin_profile_url, // Corresponds to 'linkedin' in old frontend
            twitter_profile_url,  // Corresponds to 'twitter' in old frontend
            profile_photo_removed,
            cover_photo_removed
        } = req.body;

        const profile_photo_file = req.files?.profile_photo ? req.files.profile_photo[0] : null;
        const cover_photo_file = req.files?.cover_photo ? req.files.cover_photo[0] : null;

        if (!authenticatedUserEmail) {
            return res.status(401).json({ message: 'Authentication required: User email not found.' });
        }

        // --- Server-side Input Validation (based on schema max lengths) ---
        if (about_me && about_me.length > 255) {
            return res.status(400).json({ message: 'About Me (Bio) cannot exceed 255 characters.' });
        }
        if (skills && skills.length > 1000) {
            return res.status(400).json({ message: 'Skills cannot exceed 1000 characters.' });
        }
        if (linkedin_profile_url && !validator.isURL(linkedin_profile_url, { require_protocol: true })) {
            return res.status(400).json({ message: 'Invalid LinkedIn URL. Must start with http:// or https://' });
        }
        if (twitter_profile_url && !validator.isURL(twitter_profile_url, { require_protocol: true })) {
            return res.status(400).json({ message: 'Invalid Twitter URL. Must start with http:// or https://' });
        }
        // Mobile number validation is handled in the User update endpoint now.
        // --- End Validation ---

        try {
            let profile = await Profile.findOne({ user_id: authenticatedUserId });

            if (profile) {
                // --- Update Existing Profile ---
                // Requirement 5: Check if created_by_email and updated_by_email are same (for update authorization)
                // This is an additional check for the email field specifically as per requirement
                if (profile.created_by_email !== authenticatedUserEmail) {
                    return res.status(403).json({ message: 'You are not authorized to update this profile (email mismatch).' });
                }

                profile.address = address;
                profile.profession = profession;
                profile.about_me = about_me;
                profile.skills = skills;
                profile.linkedin_profile_url = linkedin_profile_url;
                profile.twitter_profile_url = twitter_profile_url;
                profile.updated_by_email = authenticatedUserEmail; // Requirement 6

                // Handle profile photo update/removal
                if (profile_photo_file) {
                    deleteOldFile(profile.profile_photo_filepath); // Delete old file
                    profile.profile_photo_filename = profile_photo_file.filename;
                    profile.profile_photo_filepath = `eRepo/${profile_photo_file.filename}`; // Path relative to frontend
                } else if (profile_photo_removed === 'true') {
                    deleteOldFile(profile.profile_photo_filepath);
                    profile.profile_photo_filename = null;
                    profile.profile_photo_filepath = null;
                }

                // Handle cover photo update/removal
                if (cover_photo_file) {
                    deleteOldFile(profile.cover_photo_filepath); // Delete old file
                    profile.cover_photo_filename = cover_photo_file.filename;
                    profile.cover_photo_filepath = `eRepo/${cover_photo_file.filename}`;
                } else if (cover_photo_removed === 'true') {
                    deleteOldFile(profile.cover_photo_filepath);
                    profile.cover_photo_filename = null;
                    profile.cover_photo_filepath = null;
                }

                await profile.save();
                res.status(200).json({ message: 'Profile updated successfully', profile });

            } else {
                // --- Create New Profile ---
                profile = new Profile({
                    user_id: authenticatedUserId,
                    address,
                    profession,
                    about_me,
                    skills,
                    linkedin_profile_url,
                    twitter_profile_url,
                    created_by_email: authenticatedUserEmail, // Requirement 4
                    updated_by_email: authenticatedUserEmail
                });

                if (profile_photo_file) {
                    profile.profile_photo_filename = profile_photo_file.filename;
                    profile.profile_photo_filepath = `eRepo/${profile_photo_file.filename}`;
                }
                if (cover_photo_file) {
                    profile.cover_photo_filename = cover_photo_file.filename;
                    profile.cover_photo_filepath = `eRepo/${cover_photo_file.filename}`;
                }

                await profile.save();
                res.status(201).json({ message: 'Profile created successfully', profile });
            }
        } catch (error) {
            console.error("Error upserting profile:", error);
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size too large.' });
            }
            res.status(500).json({ message: "Server error during profile operation", error: error.message });
        }
    },

    getProfile: async (req, res) => {
        const { userId: paramUserId } = req.params;
        const authenticatedUserId = req.userId;

        if (paramUserId !== authenticatedUserId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only view your own profile.' });
        }

        try {
            const profile = await Profile.findOne({ user_id: authenticatedUserId });
            if (!profile) {
                return res.status(200).json({ message: 'Profile not found, please create one.', profile: null });
            }
            res.status(200).json({ profile });
        } catch (error) {
            console.error("Error fetching profile:", error);
            res.status(500).json({ message: "Server error fetching profile", error: error.message });
        }
    }
};

module.exports = profileController;