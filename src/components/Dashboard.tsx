'use client'
import api from "@/features/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function Dashboard() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Games");
  const [games, setGames] = useState<{ id: string; name: string; image_url: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
    try {
      const response = await api.get("apis/categories");
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
        if (selectedCategory === "All Games") {
          response = await api.get("apis/games");
        } else {
          const selectedCategoryId = categories.find((cat) => cat.name === selectedCategory)?.id;
          if (!selectedCategoryId) return;
          // response = await api.get(`apis/games?category_id=${selectedCategoryId}`); // Fetch games by category
          response = await api.get(`apis/categories/${selectedCategoryId}/games`);
        }
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [selectedCategory, categories]);

  const router = useRouter(); // Initialize router

  const handlePlay = (gameId: string) => {
    console.log("Play button clicked for game ID:", gameId);
    router.push(`/games/${gameId}`); // Redirect to the game page
  };

  return (
      <main className="flex flex-1">
        <section className="flex-1 p-6">
          <div className="mb-6 border-[#694800]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-transparent shadow-md font-bold border-1 ms-163.5 text-[#694800]"
            >
              <option key="all-games" value="All Games">All Games</option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>   
        </div>

        <div className="grid grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="border rounded-lg p-4 shadow-lg bg-transparent hover:shadow-xl transition border-[#7E6396] relative"
          >
            <Image
              src={game.image_url || "/alpha-trace.png"} // change it after setting game images in db.
              alt={game.name}
              width={360}
              height={230}
              className="rounded-md"
            />
            <h3 className="mt-2 text-lg font-bold text-[#694800]">{game.name}</h3>
            <button onClick={() => handlePlay(game.id)}
            className="mt-2 w-1/3 ms-56 flex items-center justify-center bg-[#F9DB63] text-[#694800] font-bold py-2 px-4 rounded-md shadow-md hover:bg-[#f7c948] transition">
              <Image
                src="/icons/play.png"
                alt="Play"
                width={20}
                height={20}
                className="mr-2"
              />
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
            <h3 className="font-bold">STEP 1</h3>
            <div className="flex items-center space-x-2">
              <Image src="/icons/webcam.png" alt="PC"   width={36}
                    height={36} className="w-9 h-9" />
              <Image src="/icons/mackbook.png" alt="Camera"  width={36}
                    height={36}  className="w-9 h-9" />
              <Image src="/icons/wifi.png" alt="Wi-Fi" width={36}
                    height={36}  className="w-9 h-9" />
            </div>
            <li>Connect your webcam and check your internet.</li>
            <h3 className="font-bold">STEP 2</h3>
            <div className="flex items-center space-x-2">
              <Image src="/icons/wired_net.png" alt="PC" width={36}
                    height={36}  className="w-9 h-9" />
              <Image src="/icons/traners.png" alt="Camera"  width={36}
                    height={36} className="w-9 h-9" />
              <Image src="/icons/arms_up.png" alt="Wi-Fi"  width={36}
                    height={36}  className="w-9 h-9" />
            </div>
            <li>Use a computer screen and stand 3-4 feet away.</li>
            <h3 className="font-bold">STEP 3</h3>
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
            <li>Time to play!</li>
          </ol>
        </aside>
      </main>
  );
}

