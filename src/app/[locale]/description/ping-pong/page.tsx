'use client'

import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Target, Brain } from 'lucide-react'
import Link from 'next/link';

const TennisPage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('Tennis')

  useEffect(() => {
    const timeout = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  const levelData = [
    { name: 'Easy', color: 'bg-green-100', icon: '🟢', racketSize: 'Large', ballSpeed: 'Slow' },
    { name: 'Medium', color: 'bg-yellow-100', icon: '🟡', racketSize: 'Medium', ballSpeed: 'Moderate' },
    { name: 'Difficult', color: 'bg-red-100', icon: '🔴', racketSize: 'Small', ballSpeed: 'Fast' }
  ]

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-8 py-12 md:px-20 transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Tennis balls bouncing */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`ball-${i}`}
            className="absolute w-8 h-8 bg-yellow-400 rounded-full animate-ball-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div className="absolute inset-1 bg-yellow-300 rounded-full" />
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white transform -translate-y-1/2" />
          </div>
        ))}
        
        {/* Tennis rackets */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`racket-${i}`}
            className="absolute animate-racket-swing"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + Math.random() * 40}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: '6s',
            }}
          >
            <div className="w-16 h-24 relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full" />
              <div className="absolute inset-1 bg-blue-400 rounded-full" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-12 bg-gray-800 rounded-b-full" />
              <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-gray-200 rounded-full" />
            </div>
          </div>
        ))}
        
        {/* Court lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute bg-white animate-court-line"
            style={{
              width: '2px',
              height: '100vh',
              left: `${i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.2,
            }}
          />
        ))}
        
        {/* Success effects */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-2xl animate-star-burst"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <div className="relative z-10">
<Link href="/games">
  <button className="text-blue-600 mb-6 font-medium hover:underline transition">
    &larr; {t('back')}
  </button>
</Link>

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500 mb-2 drop-shadow-md">
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

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800">{t('levels.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {levelData.map((level, index) => (
                <div key={level.name} className={`${level.color} p-4 rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{level.icon}</span>
                    <h4 className="font-bold text-lg">{t(`levels.${level.name.toLowerCase()}.title`)}</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    {t('levels.racketSize')}: {t(`levels.${level.name.toLowerCase()}.racket`)}
                  </p>
                  <p className="text-sm text-gray-700">
                    {t('levels.ballSpeed')}: {t(`levels.${level.name.toLowerCase()}.speed`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('technology.title')}</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-xl">👁️</span>
                <div>
                  <strong>OpenCV</strong> - {t('technology.opencv')}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✋</span>
                <div>
                  <strong>MediaPipe</strong> - {t('technology.mediapipe')}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🎮</span>
                <div>
                  <strong>cvzone</strong> - {t('technology.cvzone')}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🌐</span>
                <div>
                  <strong>Browser-based</strong> - {t('technology.browser')}
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motor Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-3 rounded-full shadow-md">
                    <Target className="text-blue-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('motor.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('motor.handEye')}</li>
                  <li>{t('motor.timing')}</li>
                  <li>{t('motor.precision')}</li>
                  <li>{t('motor.bilateral')}</li>
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
                  <li>{t('cognitive.tracking')}</li>
                  <li>{t('cognitive.prediction')}</li>
                  <li>{t('cognitive.adaptation')}</li>
                  <li>{t('cognitive.concentration')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TennisPage