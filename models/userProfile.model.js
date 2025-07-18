const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: '',
    },
    avatar: {
        type: String, 
        default: '',
    }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
