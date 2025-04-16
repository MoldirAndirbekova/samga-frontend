'use client'

import { FC, useEffect, useState } from 'react'
import { Brain, Activity } from 'lucide-react'

const BalloonPopPage: FC = () => {
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
      {/* Floating balloons background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 bg-blue-300 opacity-30 rounded-full animate-balloon"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <button className="text-blue-600 mb-6 font-medium hover:underline transition">&larr; Back</button>

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 drop-shadow-md">
          Balloon Pop
        </h1>
        <p className="text-xl text-gray-700 mb-10">Step Into The Colorful World Of Balloon Pop!</p>

        <p className="text-gray-800 text-base leading-relaxed max-w-3xl mb-12">
          Step into the colorful world of Balloon Pop! Get ready to pop as many balloons as you can before the clock runs out.
          But watch out for those sneaky fireballs and bombs in red — they'll burst your balloon in no time!
          <br /><br />
          With a party-time theme, this game is the perfect way to add some excitement to your daily routine.
          So, grab your balloon wand and let’s get popping!
        </p>

        <div className="bg-blue-50 p-8 rounded-2xl shadow-lg max-w-4xl hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold mb-6 text-gray-800">The skills being developed by: Balloon Pop</h2>

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
                <li>Upper Body Strength</li>
                <li>Range of Motion and Response Time</li>
                <li>Posture Control</li>
                <li>Core Strength</li>
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
                <li>Visualisation and Focus</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Balloon animation styles */}
      <style jsx>{`
        @keyframes balloon {
          0% {
            transform: translateY(100vh) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-10vh) scale(1);
            opacity: 0;
          }
        }
        .animate-balloon {
          animation-name: balloon;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}

export default BalloonPopPage
