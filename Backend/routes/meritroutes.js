// routes/meritRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); 
const controller = require('../controllers/meritcontroller');

const uploadFields = upload.fields([
  { name: 'document', maxCount: 1 }
]);

router.post('/', uploadFields, controller.createMerit);
router.get('/', controller.getAllMerits);
router.get('/:id', controller.getMeritById);

module.exports = router;
