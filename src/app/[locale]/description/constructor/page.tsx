'use client'

import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Eye, Hand } from 'lucide-react'
import Link from 'next/link';


const ConstructorGamePage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('ConstructorGame')

  useEffect(() => {
    const timeout = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  const themeObjects = [
    '🍄', '🌸', '🚗', '🌳', '🚂', '🌈', '🏠', '🐛', '🏰'
  ]

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-8 py-12 md:px-20 transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Floating themed objects */}
        {themeObjects.map((object, i) => (
          <div
            key={`object-${i}`}
            className="absolute text-4xl animate-float-object"
            style={{
              left: `${10 + (i * 10)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            {object}
          </div>
        ))}
        {/* Memory visualization effects */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`memory-${i}`}
            className="absolute w-16 h-16 bg-purple-300 rounded-lg opacity-20 animate-pulse-fade"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '5s',
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

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2 drop-shadow-md">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-700 mb-10">{t('subtitle')}</p>

        <div className="max-w-4xl space-y-6">
          <p className="text-gray-800 text-base leading-relaxed">
            {t('description')}
          </p>

          <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200 mt-8">
            <h3 className="font-bold text-lg mb-3 text-gray-800">{t('howToPlay.title')}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• {t('howToPlay.step1')}</li>
              <li>• {t('howToPlay.step2')}</li>
              <li>• {t('howToPlay.step3')}</li>
              <li>• {t('howToPlay.step4')}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800">{t('levels.title')}</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {t.raw('levels.items').map((level: string, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-3xl mb-1">{themeObjects[index]}</div>
                  <span className="text-sm text-gray-600">{level}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Motor Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-3 rounded-full shadow-md">
                    <Hand className="text-blue-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('motor.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('motor.fineMotor')}</li>
                  <li>{t('motor.gesture')}</li>
                  <li>{t('motor.coordination')}</li>
                  <li>{t('motor.spatial')}</li>
                </ul>
              </div>

              {/* Cognitive Skills */}
              <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-pink-100 p-3 rounded-full shadow-md">
                    <Eye className="text-pink-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{t('cognitive.title')}</h3>
                </div>
                <ul className="list-disc ml-12 text-gray-700 space-y-1">
                  <li>{t('cognitive.memory')}</li>
                  <li>{t('cognitive.attention')}</li>
                  <li>{t('cognitive.reasoning')}</li>
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

export default ConstructorGamePage