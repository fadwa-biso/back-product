const mongoose = require('mongoose');

const allergySchema = new mongoose.Schema({
    name: { 
        type: [String], 
        required: true ,
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Allergy', allergySchema);
