const express = require('express');
const router = express.Router();

const subjectController = require('../app/controllers/subjectController');

router.post('/create', subjectController.createSubject);
router.get('/list/:id', subjectController.getSubjectByUserId);
router.get('/get/:id', subjectController.getSubjectById);
router.put('/update/:id', subjectController.updateSubject);
router.delete('/delete/:id', subjectController.deleteSubject);

module.exports = router;