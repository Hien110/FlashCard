const Question = require("../models/Question");

class QuestionController {
  async createQuestion(req, res) {
    try {
      const { questionText, subjectId, answer } = req.body;
      if (!questionText || !subjectId) {
        return res
          .status(400)
          .json({
            message:
              "Nội dung câu hỏi và ID môn học là bắt buộc",
          });
      }
      const question = new Question({
          subjectId,
          questionText,
          answer,
      });
      await question.save();
      return res
        .status(201)
        .json({ message: "Tạo câu hỏi thành công", data: question });
    } catch (error) {
      console.error("Lỗi tạo câu hỏi:", error);
      return res
        .status(500)
        .json({ message: "Tạo câu hỏi thất bại", error: error.message });
    }
  }
  async updateQuestion(req, res) {
    try {
      const { id } = req.params;
      const { questionText, answer } = req.body;
      if (!questionText || !answer) {
        return res
          .status(400)
          .json({ message: "Nội dung câu hỏi và câu trả lời là bắt buộc" });
      }
      const question = await Question.findByIdAndUpdate(
        id,
        { questionText, answer },
        { new: true }
      );
      if (!question) {
        return res.status(404).json({ message: "Câu hỏi không tồn tại" });
      }
      return res
        .status(200)
        .json({ message: "Cập nhật câu hỏi thành công", data: question });
    } catch (error) {
      console.error("Lỗi cập nhật câu hỏi:", error);
      return res
        .status(500)
        .json({ message: "Cập nhật câu hỏi thất bại", error: error.message });
    }
  }

  async deleteQuestion(req, res) {
    try {
      const { id } = req.params;
      const question = await Question.findByIdAndDelete(id);
      if (!question) {
        return res.status(404).json({ message: "Câu hỏi không tồn tại" });
      }
      return res.status(200).json({ message: "Xóa câu hỏi thành công" });
    } catch (error) {
      console.error("Lỗi xóa câu hỏi:", error);
      return res
        .status(500)
        .json({ message: "Xóa câu hỏi thất bại", error: error.message });
    }
  }

  async getQuestions(req, res) {
    try {
      const questions = await Question.find().populate("user", "username");
      return res
        .status(200)
        .json({ message: "Lấy danh sách câu hỏi thành công", data: questions });
    } catch (error) {
      console.error("Lỗi lấy danh sách câu hỏi:", error);
      return res
        .status(500)
        .json({
          message: "Lấy danh sách câu hỏi thất bại",
          error: error.message,
        });
    }
  }
  
  async getQuestionsBySubjectId(req, res) {
    try {
      const { subjectId } = req.params;
      const questions = await Question.find({ subjectId })
      return res
        .status(200)
        .json({ message: "Lấy danh sách câu hỏi theo môn học thành công", data: questions });
    } catch (error) {
      console.error("Lỗi lấy danh sách câu hỏi theo môn học:", error);
      return res
        .status(500)
        .json({
          message: "Lấy danh sách câu hỏi theo môn học thất bại",
          error: error.message,
        });
    }
  }
}

module.exports = new QuestionController();
