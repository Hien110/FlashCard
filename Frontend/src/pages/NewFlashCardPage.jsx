"use client"

import { useState, useEffect } from "react"
import { createSubject } from "../services/subjectService"
import { createQuestion } from "../services/questionService"
import { Link } from "react-router-dom"

export default function NewFlashcardPage() {
  const [subjectName, setSubjectName] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState([{ questionText: "", answer: "" }])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [user, setUser] = useState({})

  const handleAddFlashcard = () => {
    setQuestions([...questions, { questionText: "", answer: "" }])
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setMessage("❌ Bạn cần đăng nhập để tạo môn học và flashcards.")
      setLoading(false)
    }
  }, [])

  const handleChangeFlashcard = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const handleRemoveFlashcard = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index)
      setQuestions(newQuestions)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const subject = await createSubject(user._id, subjectName, description)
      for (const q of questions) {
        if (q.questionText && q.answer) {
          await createQuestion(q.questionText, subject._id, q.answer)
        }
      }
      setMessage("✅ Tạo môn học & flashcards thành công!")
      setSubjectName("")
      setDescription("")
      setQuestions([{ questionText: "", answer: "" }])
    } catch (error) {
      setMessage(`❌ Lỗi: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-[#E4ACB2] py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-white bg-opacity-20 p-3 backdrop-blur-sm">
              <span className="text-3xl">📝</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Tạo Môn Học & Flashcards</h1>
          <p className="text-white text-opacity-90">Xây dựng bộ flashcard của bé</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <div className="p-8 md:p-12">
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Subject Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-indigo-100 p-2">
                    <span className="text-xl">📚</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Thông tin môn học</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Tên Môn Học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      required
                      placeholder="Ví dụ: Tiếng Anh, Toán học..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Mô tả</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mô tả ngắn về môn học..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Flashcards Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-100 p-2">
                      <span className="text-xl">🎯</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Danh sách Flashcards</h2>
                  </div>
                  <div className="bg-indigo-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-indigo-600">{questions.length} thẻ</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                      style={{
                        animationDelay: `${idx * 100}ms`,
                        animation: "fadeInUp 0.5s ease-out forwards",
                      }}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {idx + 1}
                          </div>
                          <span className="font-semibold text-gray-700">Flashcard {idx + 1}</span>
                        </div>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFlashcard(idx)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2"
                            title="Xóa flashcard"
                          >
                            <span className="text-lg">🗑️</span>
                          </button>
                        )}
                      </div>

                      {/* Question Input */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Câu hỏi <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={q.questionText}
                            rows="3"
                            onChange={(e) => handleChangeFlashcard(idx, "questionText", e.target.value)}
                            required
                            placeholder="Nhập câu hỏi của bạn..."
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
                            onChange={(e) => handleChangeFlashcard(idx, "answer", e.target.value)}
                            required
                            placeholder="Nhập đáp án..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Flashcard Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleAddFlashcard}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#E4ACB2] text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="text-lg">➕</span>
                    Thêm Flashcard
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 relative overflow-hidden bg-[#E4ACB2] text-white font-bold py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-xl">{loading ? "⏳" : "🚀"}</span>
                    {loading ? "Đang tạo..." : "Tạo Môn & Flashcards"}
                  </span>
                </button>

                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-200 hover:border-gray-300"
                >
                  <span className="text-lg">🏠</span>
                  Quay lại trang chủ
                </Link>
              </div>
            </form>
          </div>
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
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }
      `}</style>
    </div>
  )
}
