const UserProfile = require('../models/userProfile.model');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');


// POST /api/users/profile
const createUserProfile = async (req, res) => {
    try {
        const { user, fullName, phone, address } = req.body;
        
        let avatar = '';
        if (req.file && req.file.path) {
        avatar = req.file.path; 
        }
        const existingProfile = await UserProfile.findOne({ user });
        if (existingProfile)
        return res.status(400).json({ msg: 'Profile already exists' });

        const newProfile = new UserProfile({ user, fullName, phone, address, avatar });
        const savedProfile = await newProfile.save();

        res.status(201).json(savedProfile);
    } catch (err) {
        // console.error("❌ Create Profile Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// GET /api/user/profile (current user)
const getCurrentUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // جلب بيانات المستخدم الأساسية
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // جلب profile المستخدم إذا كان موجود
        const profile = await UserProfile.findOne({ user: userId });
        
        // دمج البيانات
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            gender: user.gender,
            profile: profile || null
        };

        res.json(userData);
    } catch (err) {
        console.error("Get current user profile error:", err);
        res.status(500).json({ error: err.message });
    }
};

// GET /api/users/profile/:id
const getUserProfileById = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await UserProfile.findOne({ user: id });
        // const profile = await UserProfile.findOne({ user: id }).populate('user', 'email role');
        if (!profile)
        return res.status(404).json({ msg: 'User profile not found' });

        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PATCH /api/users/profile/:id
// const updateUserProfile = async (req, res) => {
//     try {
//         const { address, avatar } = req.body;

//         const updated = await UserProfile.findOneAndUpdate(
//             { user: req.params.id },
//             { address, avatar },
//             { new: true }
//         );

//         if (!updated)return res.status(404).json({ msg: 'User profile not found' });

//         res.json(updated);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

const updateUserProfile = async (req, res) => {
    try {
        const { address } = req.body;
        const profile = await UserProfile.findOneAndUpdate({ user: req.params.id });
        if (!profile) return res.status(404).json({ msg: 'User profile not found' });

        if (req.file && req.file.path) {
        if (profile.avatar) {
            const publicId = profile.avatar.split('/').pop().split('.')[0]; // استخراج اسم الصورة بدون الامتداد
            await cloudinary.uploader.destroy(`RxCure/avatars/${publicId}`);
        }

        profile.avatar = req.file.path;
        }

        if (address) profile.address = address;

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    createUserProfile,
    getCurrentUserProfile,
    getUserProfileById,
    updateUserProfile
};
