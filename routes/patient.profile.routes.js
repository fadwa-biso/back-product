const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.profile.controller');
const upload = require('../middlewares/report.upload.middleware');
const { updatePatientSchema } = require('../validations/patient.validation');
const validate = require('../middlewares/validate.middleware');

//  POST /api/upload/:id → upload medical report for patient
//  upload.single('medicalReport') // ال medicalReport اسم الفيلد اللي هيجي م الفرونت 
router.post('/upload/:id', upload.single('medicalReport'), patientController.uploadingFile);
console.log('Patient Profile Routes Loaded');

//  GET /api/report/:id → get medical report for patient by ID
router.get('/report/:id', patientController.getMedicalReport);

// POST /api/patients → create patient profile
router.post('/patients', patientController.createPatient);

// GET /api/patients/:id → get patient by ID
router.get('/patients/:id', patientController.getPatientById);

// PATCH /api/patients/:id → update patient profile
router.patch('/patients/:id', validate(updatePatientSchema) , patientController.updateProfile)


module.exports = router;