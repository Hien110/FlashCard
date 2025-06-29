"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getSubjectById, updateSubject } from "../services/subjectService"
import { getQuestionsBySubjectId, updateQuestion, deleteQuestion, createQuestion } from "../services/questionService"

function EditFlashcardPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [questionLoading, setQuestionLoading] = useState({})
  const [message, setMessage] = useState("")
  const [newQuestions, setNewQuestions] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectData = await getSubjectById(subjectId)
        console.log("Subject Data:", subjectData)

        const questionData = await getQuestionsBySubjectId(subjectId)
        setName(subjectData.name)
        setDescription(subjectData.description)
        setQuestions(questionData)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error)
        setMessage("❌ Lỗi khi tải dữ liệu: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [subjectId])

  const handleUpdateSubject = async () => {
    setUpdateLoading(true)
    setMessage("")
    try {
      await updateSubject(subjectId, name, description)
      setMessage("✅ Cập nhật môn học thành công!")
    } catch (error) {
      setMessage("❌ Lỗi cập nhật môn học: " + error.message)
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index][field] = value
    setQuestions(updatedQuestions)
  }

  const handleUpdateQuestion = async (questionId, questionText, answer) => {
    setQuestionLoading({ ...questionLoading, [questionId]: "update" })
    try {
      await updateQuestion(questionId, questionText, answer)
      setMessage("✅ Cập nhật câu hỏi thành công!")
    } catch (error) {
      setMessage("❌ Lỗi cập nhật câu hỏi: " + error.message)
    } finally {
      setQuestionLoading({ ...questionLoading, [questionId]: null })
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      setQuestionLoading({ ...questionLoading, [questionId]: "delete" })
      try {
        await deleteQuestion(questionId)
        setQuestions(questions.filter((q) => q._id !== questionId))
        setMessage("✅ Đã xóa câu hỏi thành công!")
      } catch (error) {
        setMessage("❌ Lỗi xóa câu hỏi: " + error.message)
      } finally {
        setQuestionLoading({ ...questionLoading, [questionId]: null })
      }
    }
  }

  // New question functions
  const handleAddNewQuestion = () => {
    setNewQuestions([...newQuestions, { questionText: "", answer: "", tempId: Date.now() }])
    setShowAddForm(true)
  }

  const handleNewQuestionChange = (index, field, value) => {
    const updatedNewQuestions = [...newQuestions]
    updatedNewQuestions[index][field] = value
    setNewQuestions(updatedNewQuestions)
  }

  const handleSaveNewQuestion = async (index) => {
    const newQuestion = newQuestions[index]
    if (!newQuestion.questionText.trim() || !newQuestion.answer.trim()) {
      setMessage("❌ Vui lòng nhập đầy đủ câu hỏi và đáp án!")
      return
    }

    setQuestionLoading({ ...questionLoading, [newQuestion.tempId]: "create" })
    try {
      const createdQuestion = await createQuestion(newQuestion.questionText, subjectId, newQuestion.answer)

      // Add to existing questions list
      setQuestions([...questions, createdQuestion])

      // Remove from new questions list
      setNewQuestions(newQuestions.filter((_, i) => i !== index))

      setMessage("✅ Thêm câu hỏi mới thành công!")

      // Hide form if no more new questions
      if (newQuestions.length === 1) {
        setShowAddForm(false)
      }
    } catch (error) {
      setMessage("❌ Lỗi thêm câu hỏi: " + error.message)
    } finally {
      setQuestionLoading({ ...questionLoading, [newQuestion.tempId]: null })
    }
  }

  const handleRemoveNewQuestion = (index) => {
    const updatedNewQuestions = newQuestions.filter((_, i) => i !== index)
    setNewQuestions(updatedNewQuestions)

    if (updatedNewQuestions.length === 0) {
      setShowAddForm(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-[#e4acb2] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white bg-opacity-20 p-2 backdrop-blur-sm">
                <span className="text-2xl">✏️</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Chỉnh sửa Flashcard</h1>
                <p className="text-white text-opacity-90">Cập nhật thông tin môn học và câu hỏi</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white font-semibold rounded-xl hover:bg-opacity-30 transition-all backdrop-blur-sm"
            >
              <span>🏠</span>
              <span className="text-black">Trang chủ</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Message Display */}
        {message && (
          <div
            className={`mb-8 p-4 rounded-2xl text-center font-medium ${
              message.includes("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">{message.includes("✅") ? "🎉" : "⚠️"}</span>
              {message}
            </div>
          </div>
        )}

        {/* Subject Information Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-xl bg-indigo-100 p-3">
              <span className="text-2xl">📚</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Thông tin môn học</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên môn học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên môn học..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả môn học..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
              />
            </div>

            <button
              onClick={handleUpdateSubject}
              disabled={updateLoading}
              className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {updateLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <span className="flex items-center justify-center gap-2">
                <span className="text-lg">{updateLoading ? "⏳" : "💾"}</span>
                {updateLoading ? "Đang lưu..." : "Lưu môn học"}
              </span>
            </button>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Danh sách câu hỏi</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-indigo-600">{questions.length} câu hỏi</span>
              </div>
              <button
                onClick={handleAddNewQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">➕</span>
                Thêm câu hỏi mới
              </button>
            </div>
          </div>

          {/* New Questions Form */}
          {showAddForm && newQuestions.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-green-100 p-2">
                  <span className="text-xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Câu hỏi mới</h3>
              </div>

              <div className="space-y-6">
                {newQuestions.map((newQ, index) => (
                  <div
                    key={newQ.tempId}
                    className="relative bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                    }}
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveNewQuestion(index)}
                      className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Xóa câu hỏi này"
                    >
                      <span className="text-sm">✕</span>
                    </button>

                    {/* New Question Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                        +
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Câu hỏi mới {index + 1}</h4>
                    </div>

                    {/* New Question Content */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Câu hỏi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={newQ.questionText}
                          onChange={(e) => handleNewQuestionChange(index, "questionText", e.target.value)}
                          placeholder="Nhập câu hỏi mới..."
                          rows="3"
                          className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Đáp án <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newQ.answer}
                          onChange={(e) => handleNewQuestionChange(index, "answer", e.target.value)}
                          placeholder="Nhập đáp án..."
                          className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={() => handleSaveNewQuestion(index)}
                      disabled={questionLoading[newQ.tempId] === "create"}
                      className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      {questionLoading[newQ.tempId] === "create" && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span className="text-sm">{questionLoading[newQ.tempId] === "create" ? "⏳" : "💾"}</span>
                      {questionLoading[newQ.tempId] === "create" ? "Đang lưu..." : "Lưu câu hỏi"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Questions */}
          {questions.length === 0 && newQuestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có câu hỏi nào</h3>
              <p className="text-gray-600 mb-6">Hãy thêm câu hỏi mới để bắt đầu học tập</p>
              <button
                onClick={handleAddNewQuestion}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">➕</span>
                Thêm câu hỏi đầu tiên
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div
                  key={q._id}
                  className="group relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.5s ease-out forwards",
                  }}
                >
                  {/* Question Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Câu hỏi {index + 1}</h3>
                  </div>

                  {/* Question Content */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Câu hỏi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                        placeholder="Nhập câu hỏi..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Đáp án <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={q.answer}
                        onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                        placeholder="Nhập đáp án..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleUpdateQuestion(q._id, q.questionText, q.answer)}
                      disabled={questionLoading[q._id] === "update"}
                      className="relative flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      {questionLoading[q._id] === "update" && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span className="text-sm">{questionLoading[q._id] === "update" ? "⏳" : "💾"}</span>
                      {questionLoading[q._id] === "update" ? "Đang lưu..." : "Lưu câu hỏi"}
                    </button>

                    <button
                      onClick={() => handleDeleteQuestion(q._id)}
                      disabled={questionLoading[q._id] === "delete"}
                      className="relative flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      {questionLoading[q._id] === "delete" && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span className="text-sm">{questionLoading[q._id] === "delete" ? "⏳" : "🗑️"}</span>
                      {questionLoading[q._id] === "delete" ? "Đang xóa..." : "Xóa"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}

        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default EditFlashcardPage
