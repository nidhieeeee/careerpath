// routes/instituteFormRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const controller = require('../controllers/institutionformcontroller');

const uploadFields = upload.fields([{ name: 'photo', maxCount: 1 }]);

router.post('/', uploadFields, controller.createInstituteForm);
router.get('/', controller.getAllInstituteForms);
router.get('/:id', controller.getInstituteFormById);

module.exports = router;
