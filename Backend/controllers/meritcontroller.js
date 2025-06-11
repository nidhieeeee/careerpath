const Merit = require('../models/admin forms/merit');
const uploadToCloudinary = require('../utils/cloudinaryUpload'); // helper to upload
const fs = require('fs/promises');

// CREATE a new merit
exports.createMerit = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const documentFile = req.files?.document?.[0];

    let documentUrl = null;

    if (documentFile) {
      documentUrl = await uploadToCloudinary(documentFile.path, 'merits/documents', 'raw');
    }

    const merit = new Merit({
      title,
      description,
      date,
      document: documentUrl
    });

    await merit.save();
    res.status(201).json({ message: 'Merit created successfully', merit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET all merits
exports.getAllMerits = async (req, res) => {
  try {
    const merits = await Merit.find().sort({ date: -1 });
    res.json(merits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single merit by ID
exports.getMeritById = async (req, res) => {
  try {
    const merit = await Merit.findById(req.params.id);
    if (!merit) return res.status(404).json({ error: 'Merit not found' });
    res.json(merit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
