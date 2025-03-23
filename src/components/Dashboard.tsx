import Image from 'next/image';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ChevronDown, User, LogOut } from "lucide-react";

interface Game {
  name: string;
  image: string;
  category: string;
}

export default function Dashboard() {
  const categories = ["All Games", "Motor", "Cognitive"];
  const [selectedCategory, setSelectedCategory] = useState("All Games");

  const [language, setLanguage] = useState("RU");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [games] = useState<Game[]>([
    { name: 'Alpha Trace', image: '/alpha-trace.png', category: "Cognitive" },
    { name: 'Jelly Slice', image: '/jelly-slice.png', category: "Motor" },
    { name: 'Ping Pong', image: '/ping-pong.png', category: "Cognitive" },
    { name: 'Bubble Pop', image: '/bubble-pop.png', category: "Motor" },
  ]);

  const filteredGames = games.filter(
    (game) => selectedCategory === "All Games" || game.category === selectedCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF5E1]">
       <header className="bg-[#2959BF] p-4 flex justify-between items-center text-white shadow-md mb-3">
      <Image src="/logo.png" alt="Samga Logo" width={100} height={40} />

      <div className="flex items-center space-x-4">
       
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center border-2 border-white px-3 py-1 rounded-full"
          >
            {language} <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          {isLangOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-24">
              {["KZ", "RU", "EN"].map((lang) => (
                <div
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setIsLangOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>
    
        <div className="relative">
        <button className="rounded-full border-2 border-white p-1 mr-3">
            <Image src="/icons/photo.png" alt="User Avatar" width={32} height={32} className="rounded-full" />
          </button>

          <button onClick={() => setIsAccountOpen(!isAccountOpen)} className="rounded-full border-2 border-white p-1">
            <Image src="/icons/avatar.png" alt="User Avatar" width={32} height={32} className="rounded-full" />
          </button>
          {isAccountOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-36">
              <div className="px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-200">
                <User className="w-4 h-4" /> <span>Profile</span>
              </div>
              <div className="px-4 py-2 flex items-center space-x-2 cursor-pointer hover:bg-gray-200">
                <LogOut className="w-4 h-4" /> <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

      <main className="flex flex-1">
        <Sidebar />
        
        <section className="flex-1 p-6">
          <div className="mb-6 border-[#694800]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-transparent shadow-md font-bold border-1 ms-163.5 text-[#694800]">
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredGames.map((game, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-lg bg-transparent hover:shadow-xl transition border-[#7E6396] relative">
                <Image src={game.image} alt={game.name} width={360} height={230} className="rounded-md" />
                <h3 className="mt-2 text-lg font-bold text-[#694800]">{game.name}</h3>
                <button className="mt-2 w-1/3 ms-56  flex items-center justify-center bg-[#F9DB63] text-[#694800] font-bold py-2 px-4 rounded-md shadow-md hover:bg-[#f7c948] transition box-shadow: 0px 4px 0 #D1A72E;">
                  <Image src="/icons/play.png" alt="Play" width={20} height={20} className="mr-2 " />
                  PLAY
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="w-1/5 bg-[#F9DB63] p-6 shadow-md rounded-lg border-[#694800] text-[#694800] h-min m-6 mr-7 border-2 ">
          <h4 className="text-3xl font-bold ">Let's start playing</h4>
          <ol className="mt-4 list-inside space-y-2 text-xl">
            <h4>Make sure to follow all these steps</h4>
            <h3 className='font-bold'>STEP 1</h3>
            <div className="flex items-center space-x-2">
              <img src="/icons/webcam.png" alt="PC" className="w-9 h-9" />
              <img src="/icons/mackbook.png" alt="Camera" className="w-9 h-9" />
              <img src="/icons/wifi.png" alt="Wi-Fi" className="w-9 h-9" />
            </div>
            <li>Connect your webcam and check your internet.</li>
            <h3 className='font-bold'>STEP 2</h3>
            <div className="flex items-center space-x-2">
              <img src="/icons/wired_net.png" alt="PC" className="w-9 h-9" />
              <img src="/icons/traners.png" alt="Camera" className="w-9 h-9" />
              <img src="/icons/arms_up.png" alt="Wi-Fi" className="w-9 h-9" />
            </div>
            <li>Use a computer screen and stand 3-4 feet away.</li>
            <h3 className='font-bold'>STEP 3</h3>
            <div className="flex items-center space-x-2">
              <img src="/icons/game_controller.png" alt="PC" className="w-9 h-9" />
              <img src="/icons/workplace.png" alt="Camera" className="w-9 h-9" />
            </div>
            <li>Time to play!</li>
          </ol>
        </aside>
      </main>
    </div>
  );
}