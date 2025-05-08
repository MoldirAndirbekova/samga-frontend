'use client'

import { FC, useEffect, useState } from 'react'
import { Brain, Activity } from 'lucide-react'
import { useTranslations } from 'next-intl'

const FruitSlicerPage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('FruitSlicer')

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
      <div className="relative z-10">
        {/* Back Button */}
        <button className="text-blue-600 mb-6 font-medium hover:underline transition">&larr; {t('back')}</button>

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500 mb-2 drop-shadow-md">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-700 mb-10">{t('subtitle')}</p>

        {/* Description */}
        <p className="text-gray-800 text-base leading-relaxed max-w-3xl mb-12">
          {t.raw('description')}
        </p>

        {/* Skills Rectangle */}
        <div className="bg-blue-50 p-8 rounded-2xl shadow-lg max-w-4xl hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Motor Skills */}
            <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-100 p-3 rounded-full shadow-md">
                  <Activity className="text-yellow-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{t('motorTitle')}</h3>
              </div>
              <ul className="list-disc ml-12 text-gray-700 space-y-1">
                <li>{t('motor1')}</li>
                <li>{t('motor2')}</li>
                <li>{t('motor3')}</li>
                <li>{t('motor4')}</li>
              </ul>
            </div>

            {/* Cognitive Skills */}
            <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-pink-100 p-3 rounded-full shadow-md">
                  <Brain className="text-pink-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{t('cognitiveTitle')}</h3>
              </div>
              <ul className="list-disc ml-12 text-gray-700 space-y-1">
                <li>{t('cognitive1')}</li>
                <li>{t('cognitive2')}</li>
                <li>{t('cognitive3')}</li>
                <li>{t('cognitive4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FruitSlicerPage
