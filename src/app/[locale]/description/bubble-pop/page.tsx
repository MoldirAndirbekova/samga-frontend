'use client'

import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Target, Brain } from 'lucide-react'
import Link from 'next/link';

const BalloonPopPage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('BalloonPop')

  useEffect(() => {
    const timeout = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-8 py-12 md:px-20 transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Colorful balloons with different colors and sizes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400']
          const color = colors[i % colors.length]
          const size = 32 + Math.random() * 24
          
          return (
            <div
              key={i}
              className={`absolute rounded-full animate-balloon ${color} opacity-60`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + Math.random() * 3}s`,
              }}
            >
              <div className="absolute inset-1 bg-white opacity-30 rounded-full" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-600" />
            </div>
          )
        })}
        
        {/* Popping effects */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`pop-${i}`}
            className="absolute animate-pop"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: '8s',
            }}
          >
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={j}
                className="absolute w-2 h-2 bg-white rounded-full animate-burst"
                style={{
                  transform: `rotate(${j * 60}deg) translateX(20px)`,
                  animationDelay: `${i * 2}s`,
                }}
              />
            ))}
          </div>
        ))}
        
        {/* Confetti */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`confetti-${i}`}
            className="absolute w-2 h-3 animate-confetti"
            style={{
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][i % 5],
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
<Link href="/games">
  <button className="text-blue-600 mb-6 font-medium hover:underline transition">
    &larr; {t('back')}
  </button>
</Link>

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 mb-2 drop-shadow-md">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-700 mb-10">{t('subtitle')}</p>

        <div className="max-w-4xl space-y-6">
          <p className="text-gray-800 text-base leading-relaxed">
            {t('description')}
          </p>

          <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200 mt-8">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('howToPlay.title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• {t('howToPlay.step1')}</li>
              <li>• {t('howToPlay.step2')}</li>
              <li>• {t('howToPlay.step3')}</li>
              <li>• {t('howToPlay.step4')}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('technology.title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>💻 {t('technology.item1')}</li>
              <li>👆 {t('technology.item2')}</li>
              <li>📹 {t('technology.item3')}</li>
              <li>🎮 {t('technology.item4')}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motor Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-3 rounded-full shadow-md">
                  <Target className="text-green-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{t('motor.title')}</h3>
              </div>
              <ul className="list-disc ml-12 text-gray-700 space-y-1">
                <li>{t('motor.fingerPrecision')}</li>
                <li>{t('motor.handEye')}</li>
                <li>{t('motor.tracking')}</li>
                <li>{t('motor.reaction')}</li>
              </ul>
            </div>

              {/* Cognitive Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-pink-100 p-3 rounded-full shadow-md">
                    <Brain className="text-pink-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('cognitive.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('cognitive.focus')}</li>
                  <li>{t('cognitive.prediction')}</li>
                  <li>{t('cognitive.adaptation')}</li>
                  <li>{t('cognitive.processing')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalloonPopPage