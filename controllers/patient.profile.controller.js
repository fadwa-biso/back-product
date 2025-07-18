const Patient = require('../models/patient.profile.model');
// const User = require('../models/user.model');

//  for creating patient profile
const createPatient = async (req, res) => {
try {
    const {
        name,
        age,
        gender,
        phone,
        medicalHistory,
        userId
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let medicalReportUrl = '';
    if (req.file && req.file.path) {
      medicalReportUrl = req.file.path; // ده بيكون من Cloudinary بعد الرفع
    }

    const patient = new Patient({
        name,
        age,
        gender,
        phone,
        medicalHistory,
        medicalReport: {
            fileUrl: medicalReportUrl
        },
        user: userId
    });

    const savedPatient = await patient.save();
    res.status(201).json(savedPatient);

} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
}
};


//  Get patient profile by ID
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findById(id).populate('user', 'email role');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json(patient);


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// _____ For updating Profile except name , gender and mobile ______
const updateProfile = async (req, res)=>{
    try{
        // console.log("Body received:", req.body); 
        const { age , treatment , medicalHistory , investigation } = req.body;
        const updatafield = { age , treatment , medicalHistory , investigation }; 
        const patient = await Patient.findByIdAndUpdate(
            req.params.id, 
            updatafield,
            {new: true}
        );
        if(!patient) return res.status(404).json({msg: 'patient not found'});
        res.json(patient);
    }catch(error){
        // console.error("Update error:", error);
        res.status(500).json({ error: error.message || error });
    }
};


// ________________________ REPORT PART _______________________________

// GET medical report URL only
const getMedicalReport = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findById(id);
        if (!patient || !patient.medicalReport) {
        return res.status(404).json({ message: 'Medical report not found' });
        }

        return res.status(200).json({ reportUrl: patient.medicalReport?.fileUrl });

    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ________ For uploading files __________
const uploadingFile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if(!patient){
            return res.status(404).json({msg: 'patient not found'});
        }
        if(!req.file){
            return res.status(400).json({msg: 'No file uploaded'});
        }
        patient.medicalReport={
            fileUrl: req.file.path,
            uploadedAt: new Date(),
        };

        await patient.save();
        res.json({msg: 'File uploaded', report: patient.medicalReport});
    } catch (error){
        res.status(500).json({ error: error.message || error });
    }
}



module.exports={
    uploadingFile,
    updateProfile,
    createPatient,
    getPatientById,
    getMedicalReport
}