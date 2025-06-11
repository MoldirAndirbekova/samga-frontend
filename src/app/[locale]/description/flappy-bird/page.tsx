'use client'

import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Dumbbell, Brain } from 'lucide-react'
import Link from 'next/link';



const FlappyBirdPage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('FlappyBird')

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
        {/* Bird animations */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`bird-${i}`}
            className="absolute w-12 h-10 animate-bird-fly"
            style={{
              left: `${-20 + i * 25}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${12 + i * 2}s`,
            }}
          >
            <div className="w-full h-full bg-yellow-400 rounded-full relative">
              <div className="absolute top-1 right-2 w-2 h-2 bg-black rounded-full" />
              <div className="absolute top-4 left-0 w-4 h-2 bg-orange-500 rounded-l-full" />
              <div className="absolute top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full transform rotate-45" />
            </div>
          </div>
        ))}
        {/* Pipe animations */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`pipe-${i}`}
            className="absolute w-16 h-32 bg-green-600 rounded-md animate-pipe-scroll"
            style={{
              left: `${100 + i * 30}%`,
              top: i % 2 === 0 ? '0' : 'auto',
              bottom: i % 2 === 0 ? 'auto' : '0',
              animationDelay: `${i * 2}s`,
              animationDuration: '15s',
            }}
          >
            <div className="absolute w-20 h-8 bg-green-700 rounded-md -top-1 -left-2" />
          </div>
        ))}
        {/* Cloud decorations */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="absolute bg-white rounded-full opacity-70 animate-cloud-float"
            style={{
              width: `${60 + i * 20}px`,
              height: `${30 + i * 10}px`,
              left: `${i * 25}%`,
              top: `${10 + i * 5}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${20 + i * 5}s`,
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

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 mb-2 drop-shadow-md">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-700 mb-10">{t('subtitle')}</p>

        <div className="max-w-4xl space-y-6">
          <p className="text-gray-800 text-base leading-relaxed">
            {t('description')}
          </p>

          <div className="bg-sky-50 p-6 rounded-xl border-2 border-sky-200 mt-8">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('howToPlay.title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• {t('howToPlay.step1')}</li>
              <li>• {t('howToPlay.step2')}</li>
              <li>• {t('howToPlay.step3')}</li>
              <li>• {t('howToPlay.step4')}</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('mechanics.title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>🎮 {t('mechanics.item1')}</li>
              <li>📐 {t('mechanics.item2')}</li>
              <li>🏆 {t('mechanics.item3')}</li>
              <li>🎶 {t('mechanics.item4')}</li>
              <li>💥 {t('mechanics.item5')}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motor Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-100 p-3 rounded-full shadow-md">
                    <Dumbbell className="text-red-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('motor.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('motor.armControl')}</li>
                  <li>{t('motor.coordination')}</li>
                  <li>{t('motor.timing')}</li>
                  <li>{t('motor.bodyAwareness')}</li>
                </ul>
              </div>

              {/* Cognitive Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-indigo-100 p-3 rounded-full shadow-md">
                    <Brain className="text-indigo-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('cognitive.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('cognitive.timing')}</li>
                  <li>{t('cognitive.spatial')}</li>
                  <li>{t('cognitive.reaction')}</li>
                  <li>{t('cognitive.focus')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

         </div>
  )
}

export default FlappyBirdPage