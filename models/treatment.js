const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
    name: {
        type: [String],
        required: [true, 'Treatment is required'],
        validate: {
            validator: val => val.length > 0,
            message: 'At least one treatment must be specified'
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('Treatment', treatmentSchema);
