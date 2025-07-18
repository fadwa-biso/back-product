const mongoose = require('mongoose');

const investigationSchema = new mongoose.Schema({
    title: {
        type: [String],
        maxlength: [1000, 'Investigation details must be less than 1000 characters']
    },
}, { timestamps: true });

module.exports = mongoose.model('Investigation', investigationSchema);
