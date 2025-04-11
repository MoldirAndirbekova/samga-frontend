import { FaInfoCircle } from "react-icons/fa";
import { useTranslations } from 'next-intl';

export default function Reports() {
  const t = useTranslations('Reports');
  const categories = [
    { title: t('title1'), color: "bg-orange-500", value: 0 },
    { title: t('title2'), color: "bg-purple-500", value: 0 },
    { title: t('title3'), color: "bg-pink-400", value: 0 },
  ];

  return (
    <div className="flex h-screen bg-[#FFF5E1] p-8 text-[#694800]">
      <main className="flex-1">
        <h2 className="text-3xl font-bold mb-6">{t('title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-yellow-400 p-6 rounded-xl shadow-md relative flex flex-col justify-between">
            <h3 className="text-xl font-bold mb-2 text-left">{t('progress')}</h3>
            <FaInfoCircle className="absolute top-3 right-3 text-gray-700 text-xl" />
            <div className="mt-2 flex flex-col">
              <p className="text-sm font-semibold text-gray-700 mb-1">0%</p>
              <div className="w-full bg-white h-3 rounded-full relative">
                <div className="h-3 bg-[#694800] rounded-full w-0"></div>
              </div>
            </div>
            <button className="mt-3 px-5 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition duration-200 self-end">{t('details')}</button>
            <div className="flex justify-between text-sm mt-2">
              <p>▶ {t('games')}: 0</p>
              <p>⏰ {t('time')}: 0 min</p>
            </div>
          </div>
          <div className="bg-[#FCE8D5] p-8 rounded-xl shadow-md flex flex-col items-center">
            <h3 className="text-lg font-bold">{t('scale')}</h3>
            <div className="w-24 h-24 border-4 border-[#694800] rounded-full mt-4"></div>
          </div>
          <div className="grid grid-cols-3 gap-6 w-full col-span-3">
            <div className="bg-gray-300 p-6 rounded-xl shadow-md flex flex-col">
              <h3 className="text-lg font-bold">{t('focus')}</h3>
              <div className="mt-2 w-full">
                <p className="text-sm font-semibold text-gray-700 mb-1">0%</p>
                <div className="w-full bg-white h-3 rounded-full relative">
                  <div className="h-3 bg-[#694800] rounded-full w-0"></div>
                </div>
              </div>
              <button className="mt-3 px-5 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition duration-200 self-start">{t('details')}</button>
            </div>
            <div className="col-span-2 bg-gray-200 p-6 rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-lg font-bold">{t('calendar')} (Placeholder)</h3>
            </div>
          </div>
          {categories.map((category, index) => (
            <div key={index} className={`p-6 ${category.color} rounded-xl shadow-md relative flex flex-col justify-between`}> 
              <h3 className="text-lg font-bold mb-2">{category.title}</h3>
              <FaInfoCircle className="absolute top-3 right-3 text-gray-700 text-xl" />
              <div className="mt-2 w-full">
                <p className="text-sm font-semibold text-gray-700 mb-1">0%</p>
                <div className="w-full bg-white h-3 rounded-full relative">
                  <div className="h-3 bg-[#694800] rounded-full w-0"></div>
                </div>
              </div>
              <button className="mt-3 px-5 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition duration-200 self-start">{t('details')}</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
