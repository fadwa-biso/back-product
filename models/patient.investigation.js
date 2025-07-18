const mongoose = require('mongoose');

const patientInvestigationSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    investigation: { type: mongoose.Schema.Types.ObjectId, ref: 'Investigation', required: true }
}, { timestamps: true });
module.exports = mongoose.model('PatientInvestigation', patientInvestigationSchema);