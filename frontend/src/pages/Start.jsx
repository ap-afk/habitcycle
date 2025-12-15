import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';

const Start = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center px-4 mt-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Welcome to <span className="text-blue-600">HabitCycle</span>
        </h1>

        <p className="text-xl text-gray-700 font-medium mt-4">
          Build habits like a pro 🚀
        </p>

        <p className="text-gray-600 max-w-xl mt-3">
          HabitCycle helps you create, track, and maintain positive habits
          through consistency and smart progress tracking.
        </p>

        {/* Call to Action */}
        <div className="mt-8">
          <button onClick={() => navigate('/home')} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            🔁 Build Consistency
          </h3>
          <p className="text-gray-600 mt-2">
            Track your habits daily and stay consistent with streaks.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            📊 Visual Progress
          </h3>
          <p className="text-gray-600 mt-2">
            View your improvement with clear and simple insights.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800">
            🎯 Stay Motivated
          </h3>
          <p className="text-gray-600 mt-2">
            Small wins and streaks help you keep moving forward.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Start
