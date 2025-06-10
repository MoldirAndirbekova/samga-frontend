'use client'

import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Pencil, Brain } from 'lucide-react'
import Link from 'next/link';

const LetterTracingPage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('LetterTracing')

  useEffect(() => {
    const timeout = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-8 py-12 md:px-20 transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Floating letters */}
        {letters.map((letter, i) => (
          <div
            key={`letter-${i}`}
            className="absolute text-6xl font-bold text-blue-200 animate-letter-float"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${Math.random() * 60 + 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
              opacity: 0.3,
            }}
          >
            {letter}
          </div>
        ))}
        
        {/* Tracing path animations */}
        {Array.from({ length: 8 }).map((_, i) => (
          <svg
            key={`path-${i}`}
            className="absolute w-32 h-32 animate-draw-path"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 70 + 10}%`,
              animationDelay: `${i * 1.5}s`,
            }}
            viewBox="0 0 100 100"
          >
            <path
              d="M 20 80 L 50 20 L 80 80"
              stroke="#60a5fa"
              strokeWidth="3"
              fill="none"
              className="animate-trace-line"
            />
          </svg>
        ))}
        
        {/* Finger tracking dots */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`dot-${i}`}
            className="absolute w-3 h-3 bg-purple-400 rounded-full animate-tracking-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '6s',
            }}
          />
        ))}
        
        {/* Success sparkles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="relative z-10">
<Link href="/games">
  <button className="text-blue-600 mb-6 font-medium hover:underline transition">
    &larr; {t('back')}
  </button>
</Link>

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2 drop-shadow-md">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-700 mb-10">{t('subtitle')}</p>

        <div className="max-w-4xl space-y-6">
          <p className="text-gray-800 text-base leading-relaxed">
            {t('description')}
          </p>

          <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 mt-8">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('howToPlay.title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• {t('howToPlay.step1')}</li>
              <li>• {t('howToPlay.step2')}</li>
              <li>• {t('howToPlay.step3')}</li>
              <li>• {t('howToPlay.step4')}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800">{t('features.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📹</span>
                <div>
                  <h4 className="font-semibold">{t('features.realTime.title')}</h4>
                  <p className="text-sm text-gray-600">{t('features.realTime.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">👆</span>
                <div>
                  <h4 className="font-semibold">{t('features.fingerTracking.title')}</h4>
                  <p className="text-sm text-gray-600">{t('features.fingerTracking.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-semibold">{t('features.accuracy.title')}</h4>
                  <p className="text-sm text-gray-600">{t('features.accuracy.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎮</span>
                <div>
                  <h4 className="font-semibold">{t('features.contactless.title')}</h4>
                  <p className="text-sm text-gray-600">{t('features.contactless.description')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('alphabet.title')}</h3>
            <div className="grid grid-cols-6 md:grid-cols-13 gap-2">
              {alphabet.map((letter) => (
                <div
                  key={letter}
                  className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-lg font-bold text-blue-600 hover:scale-110 transition-transform"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motor Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-3 rounded-full shadow-md">
                    <Pencil className="text-green-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('motor.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('motor.fineMotor')}</li>
                  <li>{t('motor.handEye')}</li>
                  <li>{t('motor.precision')}</li>
                  <li>{t('motor.control')}</li>
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
                  <li>{t('cognitive.letterRecognition')}</li>
                  <li>{t('cognitive.memory')}</li>
                  <li>{t('cognitive.sequencing')}</li>
                  <li>{t('cognitive.spatial')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  )
}

export default LetterTracingPage