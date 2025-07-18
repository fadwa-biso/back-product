const mongoose = require('mongoose');

const patientTreatmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment', required: true },
}, { timestamps: true });

module.exports = mongoose.model('PatientTreatment', patientTreatmentSchema);
