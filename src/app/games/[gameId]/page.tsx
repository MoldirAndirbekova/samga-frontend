"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/features/page";
import Image from "next/image";

export default function GamePage() {
    console.log("GamePage component rendered");
    const { gameId } = useParams(); // Get game ID from URL
    const [game, setGame] = useState<{ id: string; name: string; image_url: string } | null>(null);

    useEffect(() => {
        const fetchGame = async () => {
        try {
            const response = await api.get(`/apis/games/${gameId}`);
            setGame(response.data);
        } catch (error) {
            console.error("Error fetching game:", error);
        }
        };
        if (gameId) fetchGame();
    }, [gameId]);

    if (!game) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold bg-purple-400">{game.name}</h1>
      <Image src={game.image_url} alt={game.name} width={600} height={400} />
      {/* Add game iframe or playable content here */}
    </div>
    // <div><p>hello this bubble pop game! welcome and enjoy</p></div>
  );
}
