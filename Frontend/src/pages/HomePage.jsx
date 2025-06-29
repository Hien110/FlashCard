
import { useEffect, useState } from "react"
import { getSubjectByUserId, deleteSubject } from "../services/subjectService"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"


function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"))
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjectByUserId(user._id)
        setSubjects(data)
      } catch (error) {
        console.error("Lỗi khi tải danh sách môn học:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && user._id) {
      fetchSubjects()
    }
  }, [user])

  const handleEdit = (e, subjectId) => {
    e.stopPropagation() // Ngăn không cho click vào card
    navigate(`/editflashcard/${subjectId}`)
  }

  const handleDelete = async (e, subjectId, subjectName) => {
    e.stopPropagation() // Ngăn không cho click vào card

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa môn học "${subjectName}"? Tất cả flashcard trong môn học này sẽ bị xóa.`,
      )
    ) {
      setDeleteLoading(subjectId)
      try {
        await deleteSubject(subjectId)
        alert("Xóa môn học thành công!")
      } catch (error) {
        console.error("Lỗi khi xóa môn học:", error)
        alert("Có lỗi xảy ra khi xóa môn học!")
      } finally {
        setDeleteLoading(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-indigo-100 p-3">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Danh sách Môn học</h2>
          <p className="text-lg text-gray-600">Quản lý và ôn tập các bộ flashcard của bạn</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative mb-4">
              <div className="h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Đang tải...</h3>
              <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && subjects.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-inner">
              <span className="text-4xl opacity-50">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có flashcard nào</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Bắt đầu hành trình học tập của bé bằng cách tạo bộ flashcard đầu tiên
            </p>
            <Link to="/newflashcard">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <span className="text-xl">➕</span>
                Tạo Flashcard Đầu Tiên
              </button>
            </Link>
          </div>
        )}

        {/* Subjects Grid */}
        {!loading && subjects.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects.map((subject, index) => (
              <div
                key={subject._id}
                onClick={() => navigate(`/plashcardsubject/${subject._id}`)}
                className="group relative cursor-pointer rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-100 transition-all duration-500 hover:shadow-2xl hover:ring-indigo-200 hover:-translate-y-2 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* Action Buttons */}
                <div className="absolute top-16 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button
                    onClick={(e) => handleEdit(e, subject._id)}
                    className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                    title="Chỉnh sửa môn học"
                  >
                    <span className="text-sm">✏️</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, subject._id, subject.name)}
                    disabled={deleteLoading === subject._id}
                    className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Xóa môn học"
                  >
                    {deleteLoading === subject._id ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-sm">🗑️</span>
                    )}
                  </button>
                </div>

                {/* Gradient Background Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>

                {/* Card Header */}
                <div className="relative flex items-start justify-between mb-6">
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl">📖</span>
                  </div>
                  <div className="rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <span className="text-xs">🎯</span> Môn học
                  </div>
                </div>

                {/* Card Content */}
                <div className="relative mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                    {subject.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {subject.description || "Không có mô tả"}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="relative flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-indigo-100 transition-colors">
                  <div className="flex items-center text-xs text-gray-500 group-hover:text-indigo-500 transition-colors">
                    <span className="mr-1">🕒</span>
                    {new Date(subject.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-indigo-500 text-sm font-medium">Xem chi tiết →</span>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20 -z-10"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

export default HomePage
