"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/features/page";
import Image from "next/image";

export default function GamePage() {
  console.log("GamePage component rendered");
  const { gameId } = useParams();
  const [game, setGame] = useState<{ id: string; name: string; image_url: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

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

  // Initialize camera
  useEffect(() => {
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
  }, []);

  if (!game) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold bg-purple-400 px-4 py-2 rounded">{game.name}</h1>
      <Image src={game.image_url} alt={game.name} width={600} height={400} className="rounded-lg shadow" />
      
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
