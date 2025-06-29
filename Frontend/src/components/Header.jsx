import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#E4ACB2] text-white shadow-lg p-4">
      <div className="relative overflow-hidden bg-[#E4ACB2]">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-32 translate-y-32"></div>
        </div>

        <div className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-white bg-opacity-20 p-4 backdrop-blur-sm">
                <div className="text-4xl">✨</div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">Flashcard Bé yêu</h1>
            <p className="text-xl text-white text-opacity-90 mb-8">
              Chúc Bé học tập vui vẻ và hiệu quả với bộ flashcard của anh dành cho bé nha!
            </p>

            {/* Create New Button */}
            <Link to="/newflashcard">
              <button className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:scale-105">
                <span className="text-xl transition-transform group-hover:rotate-90">➕</span>
                Tạo Flashcard Mới
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity group-hover:opacity-10"></div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
