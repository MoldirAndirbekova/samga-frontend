'use client'
import api from "@/lib/api";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSidebar } from "@/lib/context/SidebarContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const t = useTranslations("Dashboard");
  const { collapsed } = useSidebar();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Games");
  const [games, setGames] = useState<{ id: string; name: string; image_url: string; description?: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
    try {
      const response = await api.get("/games/categories");
      const categoryData = response.data;
      
      setCategories(categoryData.map((category: { id: string; name: string }) => ({
        id: category.id,
        name: category.name,
      })));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchGames = async () => {
      try {
        let response;
        if (selectedCategory === "All Games" || selectedCategory === t('all-games')) {
          response = await api.get("/games");
        } else {
          const selectedCategoryId = categories.find((cat) => cat.name === selectedCategory)?.id;
          if (!selectedCategoryId) return;
          response = await api.get(`/games/category/${selectedCategoryId}`);
        }
        
        // If games array is empty or the API call failed, provide some default games
        if (!response.data || !response.data.length) {
          setGames([
            { 
              id: "ping-pong", 
              name: "Ping Pong", 
              image_url: "/ping-pong.png",
              description: t('game-descriptions.ping-pong')
            },
            { 
              id: "bubble-pop", 
              name: "Bubble Pop", 
              image_url: "/bubble_pop.png",
              description: t('game-descriptions.bubble-pop')
            },
            { 
              id: "letter-tracing", 
              name: "Letter Tracing", 
              image_url: "/letter-tracing.png",
              description: t('game-descriptions.letter-tracing')
            },
            { 
              id: "fruit-slicer", 
              name: "Fruit Slicer", 
              image_url: "/fruit-slicer.png",
              description: t('game-descriptions.fruit-slicer')
            },
            { 
              id: "snake", 
              name: "Snake", 
              image_url: "/snake.png",
              description: t('game-descriptions.snake')
            },
            { 
              id: "constructor", 
              name: "Constructor", 
              image_url: "/constructor.png",
              description: t('game-descriptions.constructor')
            },
            { 
              id: "rock-paper-scissors", 
              name: "Rock Paper Scissors", 
              image_url: "/rock-paper-scissors.png",
              description: t('game-descriptions.rock-paper-scissors')
            }
          ]);
        } else {
          setGames(response.data);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
        // Provide default games if the API call fails
        setGames([
          { 
            id: "ping-pong", 
            name: "Ping Pong", 
            image_url: "/ping-pong.png",
            description: t('game-descriptions.ping-pong')
          },
          { 
            id: "bubble-pop", 
            name: "Bubble Pop", 
            image_url: "/bubble_pop.png",
            description: t('game-descriptions.bubble-pop')
          },
          { 
            id: "letter-tracing", 
            name: "Letter Tracing", 
            image_url: "/letter-tracing.png",
            description: t('game-descriptions.letter-tracing')
          },
          { 
            id: "fruit-slicer", 
            name: "Fruit Slicer", 
            image_url: "/fruit-slicer.png",
            description: t('game-descriptions.fruit-slicer')
          },
          { 
            id: "snake", 
            name: "Snake", 
            image_url: "/snake.png",
            description: t('game-descriptions.snake')
          },
          { 
            id: "constructor", 
            name: "Constructor", 
            image_url: "/constructor.png",
            description: t('game-descriptions.constructor')
          }
        ]);
      }
    };

    fetchGames();
  }, [selectedCategory, categories]);

  // Helper function to get translated category name
  const getCategoryName = (categoryName: string) => {
    const categoryTranslations: { [key: string]: string } = {
      'Motion Games': t('categories.motion-games'),
      'Cognitive Games': t('categories.cognitive-games'),
      'Motor Games': t('categories.motor-games'),
      'Fine Motor Games': t('categories.fine-motor-games'),
      'Gross Motor Games': t('categories.gross-motor-games'),
    };
    return categoryTranslations[categoryName] || categoryName;
  };

  // Helper function to get game description
  const getGameDescription = (game: { id: string; description?: string }) => {
    if (game.description) {
      return game.description; // Use API description if available
    }
    
    // Fallback to translated descriptions based on game.id
    const gameDescriptions: { [key: string]: string } = {
      'ping-pong': t('game-descriptions.ping-pong'),
      'bubble-pop': t('game-descriptions.bubble-pop'), 
      'letter-tracing': t('game-descriptions.letter-tracing'),
      'fruit-slicer': t('game-descriptions.fruit-slicer'),
      'snake': t('game-descriptions.snake'),
      'constructor': t('game-descriptions.constructor'),
      'rock-paper-scissors': t('game-descriptions.rock-paper-scissors'),
      'flappy-bird': t('game-descriptions.flappy-bird')
    };
    
    return gameDescriptions[game.id] || t('default-description');
  };

  const handlePlay = (gameId: string) => {
    console.log("Play button clicked for game ID:", gameId);
    router.push(`/games/${gameId}`);
  };

  const handleGameClick = (gameId: string) => {
    console.log("Game clicked for game ID:", gameId);
    router.push(`/description/${gameId}`);
  };

  return (
      <main className={`flex flex-1 flex-col md:flex-row w-full gap-4 p-4 transition-all duration-300 ${collapsed ? 'md:ml-4' : ''}`}>
        <section className="flex-1">
          <div className="mb-6 border-[#694800]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-transparent shadow-md font-bold border-1 text-[#694800] w-full md:w-auto"
            >
              <option key="all-games" value={t('all-games')}>{t('all-games')}</option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {getCategoryName(category.name)}
                  </option>
                ))
              ) : (
                <option disabled>{t('loading')}</option>
              )}
            </select>   
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="border rounded-lg p-4 shadow-lg bg-transparent hover:shadow-xl transition border-[#7E6396] relative"
          >
                        <div 
              onClick={() => handleGameClick(game.id)}
              className="cursor-pointer"
            >
              <Image
                src={`/${game.id}.png` || `/ping-pong.png`}
                alt={game.name}
                width={360}
                height={230}
                className="rounded-md w-full"
              />
              <h3 className="mt-2 text-lg font-bold text-[#694800] hover:underline">{game.name}</h3>
              <p className="text-[#694800] mb-2">{getGameDescription(game)}</p>
            </div>
            <button onClick={() => handlePlay(game.id)}
            className="mt-2 w-auto md:w-1/3 ml-auto flex items-center justify-center bg-[#F9DB63] text-[#694800] font-bold py-2 px-4 rounded-md shadow-md hover:bg-[#f7c948] transition">
              <Image
                src="/icons/play.png"
                alt="Play"
                width={20}
                height={20}
                className="mr-2"
              />
              {t('play')}
            </button>
          </div>
        ))}
      </div>
        </section>

        <aside className="w-full md:w-1/4 bg-[#F9DB63] p-6 shadow-md rounded-lg border-[#694800] text-[#694800] h-min m-0 md:m-4 border-2 shrink-0">
          <h4 className="text-3xl font-bold ">{t('title')}</h4>
          <ol className="mt-4 list-inside space-y-2 text-xl">
            <h4>{t('title-p')}</h4>
            <h3 className="font-bold">{t('step1')}</h3>
            <div className="flex items-center space-x-2">
              <Image src="/icons/webcam.png" alt="PC"   width={36}
                    height={36} className="w-9 h-9" />
              <Image src="/icons/mackbook.png" alt="Camera"  width={36}
                    height={36}  className="w-9 h-9" />
              <Image src="/icons/wifi.png" alt="Wi-Fi" width={36}
                    height={36}  className="w-9 h-9" />
            </div>
            <li>{t('step1-text')}</li>
            <h3 className="font-bold">{t('step2')}</h3>
            <div className="flex items-center space-x-2">
              <Image src="/icons/wired_net.png" alt="PC" width={36}
                    height={36}  className="w-9 h-9" />
              <Image src="/icons/traners.png" alt="Camera"  width={36}
                    height={36} className="w-9 h-9" />
              <Image src="/icons/arms_up.png" alt="Wi-Fi"  width={36}
                    height={36}  className="w-9 h-9" />
            </div>
            <li>{t('step2-text')}</li>
            <h3 className="font-bold">{t('step3')}</h3>
            <div className="flex items-center space-x-2">
              <Image
                src="/icons/game_controller.png"
                alt="PC"  width={36}
                height={36} 
                className="w-9 h-9"
              />
              <Image
                src="/icons/workplace.png"
                alt="Camera" width={36}
                height={36} 
                className="w-9 h-9"
              />
            </div>
            <li>{t('step3-text')}</li>
          </ol>
        </aside>
      </main>
  );
}