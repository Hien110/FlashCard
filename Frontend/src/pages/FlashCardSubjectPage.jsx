"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuestionsBySubjectId } from "../services/questionService";

function FlashCardSubject() {
  const { subjectId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showReviewList, setShowReviewList] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestionsBySubjectId(subjectId);
        setQuestions(data);
      } catch (error) {
        console.error("Lỗi khi tải câu hỏi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subjectId]);

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowAnswer(!showAnswer);
      setIsFlipping(false);
    }, 250);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  const handleShuffleToggle = () => {
    setShuffle(!shuffle);
    setQuestions((prev) => {
      const copied = [...prev];
      for (let i = copied.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copied[i], copied[j]] = [copied[j], copied[i]];
      }
      return copied;
    });
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handleCardSelect = (index) => {
    setCurrentIndex(index);
    setShowAnswer(false);
  };

  const toggleReviewList = () => {
    setShowReviewList(!showReviewList);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Đang tải flashcards...
          </p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không có câu hỏi nào
          </h2>
          <p className="text-gray-600 mb-8">
            Môn học này chưa có flashcard nào được tạo.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <span>🏠</span>
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-[#E4ACB2] to-pink-600 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white bg-opacity-20 p-2 backdrop-blur-sm">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Flashcards
                </h1>
                <p className="text-white text-opacity-90">
                  Ôn tập và ghi nhớ kiến thức
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white font-semibold rounded-xl hover:bg-opacity-30 transition-all backdrop-blur-sm"
            >
              <span>🏠</span>
              <span className="text-black">Trang chủ</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Tiến độ học tập
                </h2>
                <p className="text-sm text-gray-600">
                  Thẻ {currentIndex + 1} / {questions.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#E4ACB2] to-[#FF7E8C] h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Main Flashcard Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          {/* Flashcard */}
          <div className="flex justify-center mb-8">
            <div className="relative perspective-1000 !w-[700px] !h-[400px]">
              <div
                onClick={handleFlip}
                className={`flashcard-container ${
                  isFlipping ? "flipping" : ""
                } ${showAnswer ? "flipped" : ""}`}
              >
                <div className="flashcard-front w-[600px] h-[350px]">
                  <div className="absolute top-4 left-4">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                      Câu hỏi
                    </span>
                  </div>
                  <div className="flex items-center justify-center h-full p-6">
                    <p className="text-xl md:text-2xl font-semibold text-white text-center leading-relaxed">
                      {current.questionText}
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-4 text-white text-opacity-70">
                    <span className="text-sm">Nhấn để xem đáp án</span>
                  </div>
                </div>
                <div className="flashcard-back">
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      Đáp án
                    </span>
                  </div>
                  <div className="flex items-center justify-center h-full p-6">
                    <p className="text-xl md:text-2xl font-semibold text-white text-center leading-relaxed">
                      {current.answer}
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-4 text-white text-opacity-70">
                    <span className="text-sm">Nhấn để xem câu hỏi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 bg-[#ccd5ae] text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">◀️</span>
                Trước
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-[#E4ACB2] text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Tiếp
                <span className="text-lg">▶️</span>
              </button>
            </div>

            <button
              onClick={handleShuffleToggle}
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                shuffle
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600"
              }`}
            >
              <span className="text-lg">🔀</span>
              {shuffle ? "Ngẫu nhiên" : "Theo thứ tự"}
            </button>
          </div>
        </div>

        {/* Review List Toggle Button */}
        <div className="text-center mb-6">
          <button
            onClick={toggleReviewList}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="text-xl">📋</span>
            <span>Danh sách ôn tập ({questions.length} thẻ)</span>
            <span
              className={`text-lg transition-transform duration-300 ${
                showReviewList ? "rotate-180" : ""
              }`}
            >
              ⬇️
            </span>
          </button>
        </div>

        {/* Review List Section */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showReviewList ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Tất cả Flashcards
                </h3>
              </div>
              <div className="bg-indigo-50 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-indigo-600">
                  {questions.length} thẻ học
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardSelect(idx)}
                  className={`group cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 hover:shadow-lg transform hover:scale-105 ${
                    idx === currentIndex
                      ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-md"
                      : "bg-gray-50 border-gray-200 hover:bg-white hover:border-indigo-200"
                  }`}
                  style={{
                    animationDelay: `${idx * 50}ms`,
                    animation: showReviewList
                      ? "fadeInUp 0.6s ease-out forwards"
                      : "none",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        idx === currentIndex
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "bg-gray-300 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-indigo-600">
                            ❓ Câu hỏi:
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800 text-base leading-relaxed">
                          {q.questionText}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-green-600">
                            💡 Đáp án:
                          </span>
                        </div>
                        <p className="text-gray-600 text-base leading-relaxed">
                          {q.answer}
                        </p>
                      </div>
                    </div>
                    {idx === currentIndex && (
                      <div className="flex items-center justify-center w-6 h-6 bg-indigo-500 text-white rounded-full text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setCurrentIndex(0)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 font-medium rounded-xl hover:bg-indigo-200 transition-colors"
                >
                  <span>⏮️</span>
                  Về đầu
                </button>
                <button
                  onClick={() => setCurrentIndex(questions.length - 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 font-medium rounded-xl hover:bg-purple-200 transition-colors"
                >
                  <span>⏭️</span>
                  Về cuối
                </button>
                <button
                  onClick={handleShuffleToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 font-medium rounded-xl hover:bg-green-200 transition-colors"
                >
                  <span>🔀</span>
                  Trộn bài
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .flashcard-container {
          position: relative;

          height: 380px;
          cursor: pointer;
        }

        .flashcard-front,
        .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 24px;
          background: linear-gradient(135deg, #E4ACB2 0%, #FDCAD0 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transition: opacity 0.3s ease;
        }

        .flashcard-back {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          opacity: 0;
        }

        .flashcard-container.flipped .flashcard-front {
          opacity: 0;
        }

        .flashcard-container.flipped .flashcard-back {
          opacity: 1;
        }

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

        @media (max-width: 640px) {
          .flashcard-container {
            width: 320px;
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
}

export default FlashCardSubject;
