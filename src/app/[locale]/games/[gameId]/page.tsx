"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Image from "next/image";
import dynamic from 'next/dynamic';

// Dynamically import the game components
const PingPongGame = dynamic(() => import('../../games/components/PingPongGame'), { ssr: false });
const BubblePopGame = dynamic(() => import('../../games/components/BubblePopGame'), { ssr: false });
const LetterTracingGame = dynamic(() => import('../../games/components/LetterTracingGame'), { ssr: false });
const FruitSlicerGame = dynamic(() => import('../../games/components/FruitSlicerGame'), { ssr: false });
const SnakeGame = dynamic(() => import('../../games/components/SnakeGame'), { ssr: false });
const FlappyBirdGame = dynamic(() => import('../../games/components/FlappyBirdGame'), { ssr: false });


// Game type interface
interface Game {
  id: string;
  name: string;
  image_url: string;
  description?: string;
}

export default function GamePage() {
  const { gameId } = useParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // State for playing mode
  const [showLevelSelect, setShowLevelSelect] = useState(false); // State for difficulty selection
  const [selectedDifficulty, setSelectedDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [gameStarted, setGameStarted] = useState(false); // State for actual game started
  const [gameOver, setGameOver] = useState(false); // State for game over
  const [finalScore, setFinalScore] = useState(0); // State for final score

  // Fetch game data
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

  // Initialize camera when in play mode
  useEffect(() => {
    if (isPlaying) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: 1280,
              height: 720,
              facingMode: 'user'
            } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err: any) {
          setCameraError("Could not access the camera: " + err.message);
        }
      };

      startCamera();
      
      // Cleanup camera on component unmount or when exiting play mode
      return () => {
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isPlaying]);

  // Control background music
  useEffect(() => {
    if (!gameStarted && audioRef.current) {
      // Play music when on initial screen or level selection
      audioRef.current.play().catch(error => {
        console.log("Auto-play was prevented:", error);
      });
    } else if (gameStarted && audioRef.current) {
      // Stop music when game starts
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [gameStarted]);

  const handlePlay = () => {
    setIsPlaying(true);
    setShowLevelSelect(true);
  };

  const handleExit = () => {
    router.push('/games');
  };

  const handleStartGame = () => {
    setShowLevelSelect(false);
    setGameStarted(true);
  };

  const handleGameOver = (score: number) => {
    setGameOver(true);
    setFinalScore(score);
    setGameStarted(false);
  };

  const handleBackToHome = () => {
    // Reset all states and go back to games page
    setIsPlaying(false);
    setShowLevelSelect(false);
    setGameStarted(false);
    setGameOver(false);
    setFinalScore(0);
    router.push('/games');
  };

  if (!game) return <p>Loading...</p>;

  // If game hasn't started yet, show the initial page with full-screen background
  if (!isPlaying) {
    return (
      <div className="relative w-full h-screen">
        {/* Background music */}
        <audio
          ref={audioRef}
          src="/background-music.mp3"
          loop
          autoPlay
        />
        
        {/* Full-screen background image */}
        <Image 
          src={`/${game.id}.png`}
          alt={game.name} 
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={100}
        />
        
        {/* Content overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-6 p-4">
          
          <div className="mt-4 p-6 rounded-lg max-w-2xl">
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handlePlay}
                className="px-15 py-5 bg-yellow-500 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition transform hover:scale-105"
              >
                Play
              </button>
              <button 
                onClick={handleExit}
                className="px-15 py-5 bg-yellow-500 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition transform hover:scale-105"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If in play mode, show full-screen game with difficulty selection
  return (
    <div className="relative w-full h-screen">
      {/* Continue playing background music during level selection */}
      {!gameStarted && (
        <audio
          ref={audioRef}
          src="/background-music.mp3"
          loop
          autoPlay
        />
      )}
      
      {/* Background image for level selection, camera feed for gameplay */}
      {showLevelSelect && !gameStarted ? (
        // Show game image as background during level selection
        <Image 
          src={`/${game.id}.png`}
          alt={game.name} 
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={100}
        />
      ) : (
        // Show camera feed during actual gameplay
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
        />
      )}
      
      {/* Game content overlay */}
      <div className="absolute inset-0 z-10">
        {/* Difficulty selection modal */}
        {showLevelSelect && !gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="p-8 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-6">Select Level</h2>
              
              <div className="flex flex-col gap-4 mb-6">
                <button
                  onClick={() => setSelectedDifficulty('EASY')}
                  className={`px-6 py-3 rounded-lg text-lg font-bold transition transform hover:scale-105 ${
                    selectedDifficulty === 'EASY' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Easy {game.name === 'Bubble Pop' && '- Bubbles last 8 seconds'}
                  {game.name === 'Ping Pong' && '- Larger paddles, slower ball'}
                  {game.name === 'Letter Tracing' && '- Larger tracing area'}
                </button>
                <button
                  onClick={() => setSelectedDifficulty('MEDIUM')}
                  className={`px-6 py-3 rounded-lg text-lg font-bold transition transform hover:scale-105 ${
                    selectedDifficulty === 'MEDIUM' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Medium {game.name === 'Bubble Pop' && '- Bubbles last 5 seconds'}
                  {game.name === 'Ping Pong' && '- Medium paddles, faster ball'}
                  {game.name === 'Letter Tracing' && '- Medium tracing area'}
                </button>
                <button
                  onClick={() => setSelectedDifficulty('HARD')}
                  className={`px-6 py-3 rounded-lg text-lg font-bold transition transform hover:scale-105 ${
                    selectedDifficulty === 'HARD' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Hard {game.name === 'Bubble Pop' && '- Bubbles last 3 seconds'}
                  {game.name === 'Ping Pong' && '- Small paddles, fastest ball'}
                  {game.name === 'Letter Tracing' && '- Smaller tracing area'}
                </button>
              </div>
              <div className="flex gap-4">
              <button
                onClick={handleStartGame}
                className="w-full px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
              >
                Start Game
              </button>

              <button
                onClick={handleExit}
                className="w-full px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
              >
                Exit Game
              </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Game component */}
        {gameStarted && !gameOver && (
          <div className="h-full">
            {game.name.toLowerCase() === 'bubble pop' && (
              <BubblePopGame onGameOver={handleGameOver} difficulty={selectedDifficulty} />
            )}
            {(game.name.toLowerCase() === 'ping pong' || game.name.toLowerCase() === 'ping-pong') && (
              <PingPongGame onGameOver={handleGameOver} difficulty={selectedDifficulty} />
            )}
            {game.name.toLowerCase() === 'letter tracing' && (
              <LetterTracingGame onGameOver={handleGameOver} difficulty={selectedDifficulty} />
            )}
            {game.name.toLowerCase() === 'fruit slicer' && (
              <FruitSlicerGame onGameOver={handleGameOver} difficulty={selectedDifficulty} />
            )}
            {game.name.toLowerCase() === 'snake' && (
              <SnakeGame onGameOver={handleGameOver} difficulty={selectedDifficulty} />
            )}
            {game.name.toLowerCase() === 'flappy bird' && (
              <FlappyBirdGame onGameOver={handleGameOver} difficulty={selectedDifficulty} />
            )}
          </div>
        )}
        
        {/* Game over screen */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
              <h2 className="text-3xl font-bold mb-6">Game Over!</h2>
              <p className="text-4xl font-bold text-blue-600 mb-8">Score: {finalScore}</p>
              <p className="text-xl mb-8">Difficulty: {selectedDifficulty}</p>
              
              <button
                onClick={handleBackToHome}
                className="px-8 py-4 bg-purple-500 text-white font-bold rounded-lg shadow-lg hover:bg-purple-600 transition transform hover:scale-105"
              >
                Home
              </button>
            </div>
          </div>
        )}
        
        {cameraError && (
          <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg">
            {cameraError}
          </div>
        )}
      </div>
    </div>
  );
}