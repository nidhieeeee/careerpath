const InstituteForm = require('../models/admin forms/institutionform');
const uploadToCloudinary = require('../utils/cloudinaryUpload'); // helper
const fs = require('fs/promises');

// CREATE a new institute form
exports.createInstituteForm = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const photoFile = req.files?.photo?.[0];

    let photoUrl = null;

    if (photoFile) {
      photoUrl = await uploadToCloudinary(photoFile.path, 'institutes/photos', 'image');
    }

    const form = new InstituteForm({
      title,
      description,
      location,
      photo: photoUrl
    });

    await form.save();
    res.status(201).json({ message: 'Institute form created successfully', form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET all institute forms
exports.getAllInstituteForms = async (req, res) => {
  try {
    const forms = await InstituteForm.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET institute form by ID
exports.getInstituteFormById = async (req, res) => {
  try {
    const form = await InstituteForm.findById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
