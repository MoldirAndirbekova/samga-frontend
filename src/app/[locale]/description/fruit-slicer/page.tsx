'use client'

import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Zap, Brain } from 'lucide-react'
import Link from 'next/link';

const FruitSlicerPage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('FruitSlicer')

  useEffect(() => {
    const timeout = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  const fruits = ['🍎', '🍊', '🍉', '🍓', '🍌', '🥝', '🍇', '🍑']
  const levelColors = ['bg-green-100', 'bg-yellow-100', 'bg-red-100']

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-8 py-12 md:px-20 transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Flying fruits */}
        {fruits.map((fruit, i) => (
          <div
            key={`fruit-${i}`}
            className="absolute text-5xl animate-fruit-fly"
            style={{
              left: `${-10}%`,
              top: `${20 + (i * 10)}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            {fruit}
          </div>
        ))}
        
        {/* Slice effects */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`slice-${i}`}
            className="absolute w-1 h-20 bg-gradient-to-b from-transparent via-white to-transparent animate-slice"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${-45 + Math.random() * 90}deg)`,
              animationDelay: `${i * 2}s`,
              animationDuration: '0.5s',
            }}
          />
        ))}
        
        {/* Juice splashes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`splash-${i}`}
            className="absolute animate-splash"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={j}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#ff6b6b', '#ffa502', '#ff6348', '#ee5a24'][j % 4],
                  transform: `rotate(${j * 60}deg) translateX(${10 + Math.random() * 10}px)`,
                }}
              />
            ))}
          </div>
        ))}
        
        {/* Bombs for higher levels */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`bomb-${i}`}
            className="absolute text-4xl animate-bomb-float"
            style={{
              left: `${100}%`,
              top: `${30 + (i * 20)}%`,
              animationDelay: `${5 + i * 3}s`,
              animationDuration: '10s',
            }}
          >
            💣
          </div>
        ))}
      </div>

      <div className="relative z-10">
<Link href="/games">
  <button className="text-blue-600 mb-6 font-medium hover:underline transition">
    &larr; {t('back')}
  </button>
</Link>

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 mb-2 drop-shadow-md">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-700 mb-10">{t('subtitle')}</p>

        <div className="max-w-4xl space-y-6">
          <p className="text-gray-800 text-base leading-relaxed">
            {t('description')}
          </p>

          <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200 mt-8">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('howToPlay.title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• {t('howToPlay.step1')}</li>
              <li>• {t('howToPlay.step2')}</li>
              <li>• {t('howToPlay.step3')}</li>
              <li>• {t('howToPlay.step4')}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800">{t('levels.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((level) => (
                <div key={level} className={`${levelColors[level - 1]} p-4 rounded-lg text-center`}>
                  <h4 className="font-bold text-lg mb-2">{t(`levels.level${level}.title`)}</h4>
                  <p className="text-sm text-gray-700">{t(`levels.level${level}.description`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('technology.title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>👃 {t('technology.item1')}</li>
              <li>📹 {t('technology.item2')}</li>
              <li>🎯 {t('technology.item3')}</li>
              <li>♿ {t('technology.item4')}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motor Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-100 p-3 rounded-full shadow-md">
                    <Zap className="text-yellow-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('motor.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('motor.headControl')}</li>
                  <li>{t('motor.neckFlexibility')}</li>
                  <li>{t('motor.timing')}</li>
                  <li>{t('motor.spatial')}</li>
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
                  <li>{t('cognitive.attention')}</li>
                  <li>{t('cognitive.tracking')}</li>
                  <li>{t('cognitive.decision')}</li>
                  <li>{t('cognitive.adaptation')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  )
}

export default FruitSlicerPage