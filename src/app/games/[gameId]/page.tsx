"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/features/page";
import Image from "next/image";
import dynamic from 'next/dynamic';

// Dynamically import the PingPongGame component
const PingPongGame = dynamic(() => import('../../games/components/PingPongGame'), { ssr: false });
// Dynamically import the BubblePopGame component
const BubblePopGame = dynamic(() => import('../../games/components/BubblePopGame'), { ssr: false });

// Extended game type to include description
interface Game {
  id: string;
  name: string;
  image_url: string;
  description?: string;
}

export default function GamePage() {
  console.log("GamePage component rendered");
  const { gameId } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showingGame, setShowingGame] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/games/${gameId}`);
        setGame(response.data);
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };
    if (gameId) fetchGame();
  }, [gameId]);

  // Initialize camera if we're not showing a specific game yet
  useEffect(() => {
    if (showingGame) return;
    
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        setCameraError("Could not access the camera: " + err.message);
      }
    };

    startCamera();
    
    // Cleanup camera on component unmount
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showingGame]);

  const handlePlayGame = () => {
    setShowingGame(true);
  };

  if (!game) return <p>Loading...</p>;

  // Render the specific game component based on game name instead of ID
  if (showingGame) {
    // Check the game name (case insensitive) instead of ID
    const gameName = game.name.toLowerCase();
    console.log("Loading game with name:", gameName);
    
    if (gameName === 'ping pong' || gameName === 'ping-pong') {
      console.log("Loading PingPong game component");
      return <PingPongGame />;
    }
    
    if (gameName === 'bubble pop') {
      console.log("Loading BubblePopGame component");
      return <BubblePopGame />;
    }
    
    // Add more game types here as they're implemented
    
    // Fallback for unknown games
    console.log("Game type not supported:", game.name);
    return <p>Game type not supported: {game.name}</p>;
  }

  // Render the game preview (before the player clicks "Play")
  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold bg-purple-400 px-4 py-2 rounded">{game.name}</h1>
      <Image src={game.image_url || "/placeholder-game.png"} alt={game.name} width={600} height={400} className="rounded-lg shadow" />
      
      <div className="mt-4 p-6 bg-white rounded-lg shadow-md max-w-2xl">
        <p className="text-lg mb-4">{game.description || "Use your hands to play this interactive game!"}</p>
        <button 
          onClick={handlePlayGame}
          className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg shadow-lg hover:bg-purple-600 transition mx-auto block"
        >
          Start Playing
        </button>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Camera Preview</h2>
        {cameraError ? (
          <p className="text-red-500">{cameraError}</p>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-md rounded-lg shadow-md transform -scale-x-100"
          />
        )}
      </div>
    </div>
  );
}
