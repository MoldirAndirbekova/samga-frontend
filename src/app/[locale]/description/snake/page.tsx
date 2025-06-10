'use client'

import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Navigation, Brain } from 'lucide-react'
import Link from 'next/link';

const SnakeGamePage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('SnakeGame')

  useEffect(() => {
    const timeout = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  const foodItems = ['🍎', '🍊', '🍓', '🍇', '🍉', '🥝', '🍑', '🍒']

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-8 py-12 md:px-20 transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Snake body segments */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`segment-${i}`}
            className="absolute w-6 h-6 bg-green-500 rounded-full animate-snake-move"
            style={{
              left: `${5 + i * 4}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '15s',
              opacity: 0.6 - (i * 0.02),
            }}
          >
            <div className="absolute inset-0.5 bg-green-400 rounded-full" />
          </div>
        ))}
        
        {/* Food items floating */}
        {foodItems.map((food, i) => (
          <div
            key={`food-${i}`}
            className="absolute text-3xl animate-food-float"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          >
            {food}
          </div>
        ))}
        
        {/* Grid pattern */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`grid-h-${i}`}
            className="absolute w-full h-px bg-gray-200 opacity-20"
            style={{ top: `${i * 3.33}%` }}
          />
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={`grid-v-${i}`}
            className="absolute h-full w-px bg-gray-200 opacity-20"
            style={{ left: `${i * 2.5}%` }}
          />
        ))}
        
        {/* Finger tracking indicators */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`finger-${i}`}
            className="absolute animate-finger-track"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            <div className="relative">
              <div className="absolute w-8 h-8 bg-blue-400 rounded-full blur-sm animate-pulse" />
              <div className="relative w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                👆
              </div>
            </div>
          </div>
        ))}
        
        {/* Score bursts */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`score-${i}`}
            className="absolute animate-score-burst"
            style={{
              left: `${20 + i * 15}%`,
              top: `${Math.random() * 60 + 20}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            <div className="bg-yellow-400 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-lg">
              +10
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
<Link href="/games">
  <button className="text-blue-600 mb-6 font-medium hover:underline transition">
    &larr; {t('back')}
  </button>
</Link>

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-lime-500 to-emerald-600 mb-2 drop-shadow-md">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-700 mb-10">{t('subtitle')}</p>

        <div className="max-w-4xl space-y-6">
          <p className="text-gray-800 text-base leading-relaxed">
            {t('description')}
          </p>

          <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200 mt-8">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('howToPlay.title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• {t('howToPlay.step1')}</li>
              <li>• {t('howToPlay.step2')}</li>
              <li>• {t('howToPlay.step3')}</li>
              <li>• {t('howToPlay.step4')}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-lime-50 to-green-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800">{t('mechanics.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📹</span>
                <div>
                  <h4 className="font-semibold">{t('mechanics.webcam.title')}</h4>
                  <p className="text-sm text-gray-600">{t('mechanics.webcam.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">👆</span>
                <div>
                  <h4 className="font-semibold">{t('mechanics.control.title')}</h4>
                  <p className="text-sm text-gray-600">{t('mechanics.control.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🍩</span>
                <div>
                  <h4 className="font-semibold">{t('mechanics.food.title')}</h4>
                  <p className="text-sm text-gray-600">{t('mechanics.food.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💥</span>
                <div>
                  <h4 className="font-semibold">{t('mechanics.collision.title')}</h4>
                  <p className="text-sm text-gray-600">{t('mechanics.collision.description')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('technology.title')}</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <strong>{t('technology.cv.title')}</strong>
                  <p className="text-sm text-gray-600">{t('technology.cv.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✋</span>
                <div>
                  <strong>{t('technology.tracking.title')}</strong>
                  <p className="text-sm text-gray-600">{t('technology.tracking.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <strong>{t('technology.detection.title')}</strong>
                  <p className="text-sm text-gray-600">{t('technology.detection.description')}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motor Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-lime-100 p-3 rounded-full shadow-md">
                    <Navigation className="text-lime-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('motor.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('motor.fingerControl')}</li>
                  <li>{t('motor.precision')}</li>
                  <li>{t('motor.tracking')}</li>
                  <li>{t('motor.coordination')}</li>
                </ul>
              </div>

              {/* Cognitive Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-teal-100 p-3 rounded-full shadow-md">
                    <Brain className="text-teal-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('cognitive.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('cognitive.planning')}</li>
                  <li>{t('cognitive.spatial')}</li>
                  <li>{t('cognitive.anticipation')}</li>
                  <li>{t('cognitive.strategy')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SnakeGamePage