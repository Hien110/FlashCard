const Subject = require('../models/Subject');   
const Question = require('../models/Question');
// Create a new subject
class SubjectController {
    async createSubject(req, res) {
        try {
            const { userId, name, description } = req.body;
            console.log("Creating subject with data:", req.body);
            
            if (!name) {
                return res.status(400).json({ message: "Tên môn học là bắt buộc" });
            }
            const subject = new Subject({ userId, name, description });
            await subject.save();
            return res.status(201).json({ message: "Tạo môn học thành công", data: subject });
        } catch (error) {
            console.error("Lỗi tạo môn học:", error);
            return res.status(500).json({ message: "Tạo môn học thất bại", error: error.message });
        }
    }

    // Update an existing subject
    async updateSubject(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Tên môn học là bắt buộc" });
            }
            const subject = await Subject.findByIdAndUpdate(
                id,
                { name, description },
                { new: true }
            );
            if (!subject) {
                return res.status(404).json({ message: "Môn học không tồn tại" });
            }
            return res.status(200).json({ message: "Cập nhật môn học thành công", data: subject });
        } catch (error) {
            console.error("Lỗi cập nhật môn học:", error);
            return res.status(500).json({ message: "Cập nhật môn học thất bại", error: error.message });
        }
    }

    // Delete a subject
    async deleteSubject(req, res) {
        try {
            const { id } = req.params;
            const subject = await Subject.findByIdAndDelete(id);
            const questions = await Question.deleteMany({ subjectId: id });

            if (!subject) {
                return res.status(404).json({ message: "Môn học không tồn tại" });
            }
            return res.status(200).json({ message: "Xóa môn học thành công" });
        } catch (error) {
            console.error("Lỗi xóa môn học:", error);
            return res.status(500).json({ message: "Xóa môn học thất bại", error: error.message });
        }
    }

    // Get all subjects
    async getSubjectById (req, res) {
        try {
            const { id } = req.params;
            const subject = await Subject.findById(id);
            if (!subject) {
                return res.status(404).json({ message: "Môn học không tồn tại" });
            }
            return res.status(200).json({ message: "Lấy môn học thành công", data: subject });
        } catch (error) {
            console.error("Lỗi lấy danh sách môn học:", error);
            return res.status(500).json({ message: "Lấy danh sách môn học thất bại", error: error.message });
        }
    }

    // Get a subject by UserID
    async getSubjectByUserId(req, res) {
        try {
            const { id } = req.params;
            const subject = await Subject.find({ userId: id });
            return res.status(200).json({ message: "Lấy môn học thành công", data: subject });
        } catch (error) {
            console.error("Lỗi lấy môn học:", error);
            return res.status(500).json({ message: "Lấy môn học thất bại", error: error.message });
        }
    }

}

module.exports = new SubjectController();
