'use client'

import { FC, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Brain, Activity } from 'lucide-react'

const DrawItPage: FC = () => {
  const [showContent, setShowContent] = useState(false)
  const t = useTranslations('DrawIt')

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
      <div className="relative z-10">
        <button className="text-blue-600 mb-6 font-medium hover:underline transition">&larr; {t('back')}</button>

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2 drop-shadow-md">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-700 mb-10">{t('subtitle')}</p>

        <p className="text-gray-800 text-base leading-relaxed max-w-3xl mb-12">
          {t.raw('description')}
        </p>

        <div className="bg-blue-50 p-8 rounded-2xl shadow-lg max-w-4xl hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold mb-6 text-gray-800">{t('skillsTitle')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Motor Skills */}
            <div className="p-5 hover:bg-white rounded-xl transition transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-100 p-3 rounded-full shadow-md">
                  <Activity className="text-yellow-600" size={28} />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{t('motor.title')}</h3>
              </div>
              <ul className="list-disc ml-12 text-gray-700 space-y-1">
                <li>{t('motor.fine')}</li>
                <li>{t('motor.coord')}</li>
                <li>{t('motor.balance')}</li>
                <li>{t('motor.precision')}</li>
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
                <li>{t('cognitive.recognition')}</li>
                <li>{t('cognitive.memory')}</li>
                <li>{t('cognitive.focus')}</li>
                <li>{t('cognitive.integration')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrawItPage
