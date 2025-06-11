const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); 
const controller = require('../controllers/managecoursescontroller');

const uploadFields = upload.fields([
  { name: 'coursephoto', maxCount: 1 }
]);

router.post('/', uploadFields, controller.createCourse);
router.get('/', controller.getAllCourses);
router.get('/:id', controller.getCourseById);

module.exports = router;
