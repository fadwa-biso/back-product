const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        immutable: true, // can't be changed after creation
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [70, 'Name must be less than 70 characters']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age must be at least 0'],
        max: [100, 'Age must be at most 100']
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female'],
        },
        required: [true, 'Gender is required'],
        immutable: true
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        immutable: true,
        unique: true,
        match: [/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number format']
    },
    medicalHistory: {
        type: [String],
        default: []
    },
    medicalReport: {
        fileUrl: {
            type: String,
            match: [/^https?:\/\/.+/, 'Invalid file URL format']
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    // ids: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Investigation'
    // },
    // {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Treatment'
    // },{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Allergy'
    // }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
},{ timestamps: true });

module.exports = mongoose.model('Patient_Profile', patientProfileSchema);
