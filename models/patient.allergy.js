const mongoose = require('mongoose');

const patientAllergySchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    allergy: { type: mongoose.Schema.Types.ObjectId, ref: 'Allergy', required: true }
}, { timestamps: true });

module.exports = mongoose.model('PatientAllergy', patientAllergySchema);
