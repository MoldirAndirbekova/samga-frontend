'use client'

import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Trophy, Brain } from 'lucide-react'
import Link from 'next/link';

const RockPaperScissorsPage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('RockPaperScissors')

  useEffect(() => {
    const timeout = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  const gestures = [
    { name: 'rock', emoji: '✊', beats: 'scissors', color: 'text-gray-600' },
    { name: 'paper', emoji: '✋', beats: 'rock', color: 'text-blue-600' },
    { name: 'scissors', emoji: '✌️', beats: 'paper', color: 'text-red-600' }
  ]

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-8 py-12 md:px-20 transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Floating hand gestures */}
        {gestures.map((gesture, i) => (
          <div key={gesture.name}>
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={`${gesture.name}-${j}`}
                className={`absolute text-6xl ${gesture.color} animate-gesture-float`}
                style={{
                  left: `${(i * 30) + (j * 8)}%`,
                  top: `${20 + (j * 15)}%`,
                  animationDelay: `${(i * 1.5) + (j * 0.7)}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                  opacity: 0.3,
                }}
              >
                {gesture.emoji}
              </div>
            ))}
          </div>
        ))}
        
        {/* Battle effects */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`battle-${i}`}
            className="absolute animate-battle-spark"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            <div className="relative">
              <div className="absolute w-8 h-8 bg-yellow-400 rounded-full blur-sm animate-pulse" />
              <div className="relative w-8 h-8 bg-yellow-300 rounded-full" />
            </div>
          </div>
        ))}
        
        {/* Victory lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute w-1 h-20 bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-victory-line"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        
        {/* Score circles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`score-${i}`}
            className="absolute animate-score-pop"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${70}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">
              +1
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

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-blue-600 to-red-600 mb-2 drop-shadow-md">
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

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800">{t('rules.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gestures.map((gesture) => (
                <div key={gesture.name} className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className={`text-5xl mb-2 ${gesture.color}`}>{gesture.emoji}</div>
                  <h4 className="font-semibold capitalize">{t(`rules.${gesture.name}`)}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('rules.beats')} {t(`rules.${gesture.beats}`)}
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
                  <strong>{t('technology.detection.title')}</strong>
                  <p className="text-sm text-gray-600">{t('technology.detection.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <strong>{t('technology.ai.title')}</strong>
                  <p className="text-sm text-gray-600">{t('technology.ai.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <strong>{t('technology.realtime.title')}</strong>
                  <p className="text-sm text-gray-600">{t('technology.realtime.description')}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motor Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-3 rounded-full shadow-md">
                    <Trophy className="text-green-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('motor.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('motor.handGestures')}</li>
                  <li>{t('motor.timing')}</li>
                  <li>{t('motor.precision')}</li>
                  <li>{t('motor.coordination')}</li>
                </ul>
              </div>

              {/* Cognitive Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-3 rounded-full shadow-md">
                    <Brain className="text-purple-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('cognitive.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('cognitive.strategy')}</li>
                  <li>{t('cognitive.prediction')}</li>
                  <li>{t('cognitive.adaptation')}</li>
                  <li>{t('cognitive.memory')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default RockPaperScissorsPage