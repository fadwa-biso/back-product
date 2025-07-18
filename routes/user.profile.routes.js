const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/user.profile.controller');
const validate = require('../middlewares/validate.middleware');
const { createUserProfileSchema } = require('../validations/user.prof.validation');
const uploadAvatar = require('../middlewares/upload.avatar.middleware');
const auth = require('../middlewares/auth');

// POST
router.post('/users/profile', uploadAvatar.single('avatar'), 
    validate(createUserProfileSchema), 
    userProfileController.createUserProfile);

// GET current user profile (requires authentication)
router.get('/user/profile', auth, userProfileController.getCurrentUserProfile);

// GET by user ID
router.get('/users/profile/:id', userProfileController.getUserProfileById);

// PATCH by user ID
router.patch('/users/profile/:id',uploadAvatar.single('avatar'), userProfileController.updateUserProfile);

module.exports = router;
