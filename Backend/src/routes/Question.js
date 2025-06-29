const express = require("express");
const router = express.Router();

const questionController = require("../app/controllers/questionController");

router.post("/create", questionController.createQuestion);
router.get("/list/:subjectId", questionController.getQuestionsBySubjectId);
router.put("/update/:id", questionController.updateQuestion);
router.delete("/delete/:id", questionController.deleteQuestion);

module.exports = router;