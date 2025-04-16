'use client'

import { FC, useEffect, useState } from 'react'
import { Brain, Activity } from 'lucide-react'

const TennisPage: FC = () => {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-8 py-12 md:px-20 transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: '#FFF5E1' }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back Button */}
        <button className="text-blue-600 mb-6 font-medium hover:underline transition">&larr; Back</button>

        {/* Floating Tennis Balls Visual */}
        <div className="relative w-full h-[180px] overflow-hidden mb-8 rounded-xl bg-gradient-to-r from-green-200 to-green-100">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-6 h-6 bg-green-400 rounded-full opacity-40 animate-ball"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Title and description */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 drop-shadow-md">
          Tennis
        </h1>
        <p className="text-xl text-gray-700 mb-10">Play Tennis Using Only Your Hands!</p>

        <p className="text-gray-800 text-base leading-relaxed max-w-3xl mb-12">
          🎾 Welcome to <strong>Tennis</strong> — a motion-controlled game where your hands become the racket!
          Using our advanced computer vision system, your hand movements are tracked in real-time to simulate
          the excitement of real tennis.
          <br /><br />
          Swing, react, and strategize — while building your coordination and sharpening your mind.
          Whether you're training or just playing for fun, Tennis brings the court to your screen!
        </p>

        {/* Skills Rectangle */}
        <div className="bg-blue-50 p-8 rounded-2xl shadow-lg max-w-4xl hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold mb-6 text-gray-800">The skills being developed by: Tennis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Motor Skills */}
            <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-100 p-3 rounded-full shadow-md">
                  <Activity className="text-yellow-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">Motor Skills</h3>
              </div>
              <ul className="list-disc ml-12 text-gray-700 space-y-1">
                <li>Hand-Eye Coordination</li>
                <li>Arm Range of Motion</li>
                <li>Reaction Speed</li>
                <li>Gross Motor Control</li>
              </ul>
            </div>

            {/* Cognitive Skills */}
            <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-pink-100 p-3 rounded-full shadow-md">
                  <Brain className="text-pink-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">Cognitive Skills</h3>
              </div>
              <ul className="list-disc ml-12 text-gray-700 space-y-1">
                <li>Focus and Concentration</li>
                <li>Decision-Making Under Pressure</li>
                <li>Visual Tracking & Prediction</li>
                <li>Mental Agility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 🎾 Tennis Ball Animation Style */}
      <style jsx>{`
        @keyframes ball {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120%);
            opacity: 0;
          }
        }
        .animate-ball {
          animation-name: ball;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}

export default TennisPage
