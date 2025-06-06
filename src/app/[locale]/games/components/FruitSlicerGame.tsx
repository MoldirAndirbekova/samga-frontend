"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/lib/api";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";

interface Fruit {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  sliced: boolean;
  sliced_by_player: boolean;
  is_bomb: boolean;
  fruit_type: string;
  age: number;
}

interface BladeTrailPoint {
  x: number;
  y: number;
  time: string;
}

interface NosePosition {
  x: number;
  y: number;
}

interface FruitSlicerGameProps {
  onGameOver: (score: number) => void;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function FruitSlicerGame({ onGameOver, difficulty: initialDifficulty }: FruitSlicerGameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameState, setGameState] = useState({
    score: 0,
    gameActive: false,
    gameOver: false,
    timeRemaining: 60,
    combo: 0,
    maxCombo: 0
  });
  const [gameId, setGameId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(initialDifficulty);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [bladeTrail, setBladeTrail] = useState<BladeTrailPoint[]>([]);
  const [nosePosition, setNosePosition] = useState<NosePosition | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const gameCreatedRef = useRef(false);
  const processingGameOverRef = useRef(false);
  const { selectedChildId } = useChild();
  const [gameDimensions, setGameDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // Update game dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setGameDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const createGame = async () => {
    try {
      if (!selectedChildId) {
        console.error("No child selected");
        return;
      }

      console.log("Creating new Fruit Slicer game with difficulty:", difficulty);
      
      if (wsRef.current) {
        console.log("Cleaning up existing WebSocket connection");
        if (connectionId) {
          unregisterWebSocket(connectionId);
          setConnectionId(null);
        }
        
        if (wsRef.current.readyState === WebSocket.OPEN || 
            wsRef.current.readyState === WebSocket.CONNECTING) {
          wsRef.current.close(1000, "Game recreated with new settings");
        }
        
        wsRef.current = null;
        setSocketConnected(false);
      }

      setFrameImage(null);
      setFruits([]);
      setBladeTrail([]);
      setNosePosition(null);
      setGameState({
        score: 0,
        gameActive: false,
        gameOver: false,
        timeRemaining: 60,
        combo: 0,
        maxCombo: 0
      });
      
      gameCreatedRef.current = true;

      const response = await api.post('/games/game/start', {
        game_type: 'fruit_slicer',
        difficulty: difficulty,
        child_id: selectedChildId
      });
      
      if (response.data && response.data.game_id) {
        console.log("Game created with ID:", response.data.game_id);
        setGameId(response.data.game_id);
        
        setTimeout(() => {
          console.log("Connecting to WebSocket after delay");
          connectWebSocket(response.data.game_id);
        }, 500);
      } else {
        console.error("Game creation failed: No game_id in response");
        gameCreatedRef.current = false;
      }
    } catch (error) {
      console.error('Error creating game:', error);
      setSocketConnected(false);
      wsRef.current = null;
      gameCreatedRef.current = false;
    }
  };
  
  const connectWebSocket = (id: string) => {
    if (wsRef.current) {
      if (connectionId) {
        unregisterWebSocket(connectionId);
        setConnectionId(null);
      }
      
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, "Reconnecting to new game session");
      }
      
      wsRef.current = null;
    }
    
    setGameId(id);
    localStorage.setItem("fruit_slicer_game_id", id);
    setSocketConnected(false);
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Authentication token not found");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
      return;
    }
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const backendHost = API_URL.replace(/^https?:\/\//, '');
    const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws';
    
    const ws = new WebSocket(`${wsProtocol}://${backendHost}/games/game/${id}/ws?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocketConnected(true);
      startGame();
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'game_state') {
        // Update background frame
        if (data.data.frame) {
          setFrameImage(data.data.frame);
        }
        
        // Update fruits data
        if (data.data.fruits) {
          console.log('Received fruits data:', data.data.fruits); // Debug log
          setFruits(data.data.fruits);
        }
        
        // Update blade trail
        if (data.data.blade_trail) {
          setBladeTrail(data.data.blade_trail);
        }
        
        // Update nose position
        if (data.data.nose_position) {
          setNosePosition(data.data.nose_position);
        }
        
        const newGameState = {
          score: data.data.score || 0,
          gameActive: data.data.game_active || false,
          gameOver: data.data.game_over || false,
          timeRemaining: data.data.time_remaining || 60,
          combo: data.data.combo || 0,
          maxCombo: data.data.max_combo || 0
        };
    
        if (newGameState.gameOver && !gameState.gameOver) {
          setTimeout(() => {
            onGameOver(newGameState.score);
            closeWebSocketConnection();
          }, 1000);
        }
        
        setGameState(newGameState);
      }
      else if (data.type === 'pose_tracking_result') {
        if (data.data.nose) {
          console.log("Nose position:", data.data.nose);
        }
      }
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket disconnected', event.code, event.reason);
      setSocketConnected(false);
      
      if (event.code !== 1000 && event.code !== 1001) {
        console.log("Attempting to reconnect in 1 second...");
        setTimeout(() => {
          if (gameId === id) {
            connectWebSocket(id);
          }
        }, 1000);
      }
    };
    
    ws.onerror = (error: Event) => {
      console.error('WebSocket error occurred');
    };
    
    wsRef.current = ws;
    
    const cleanupCallback = () => {
      console.log("Cleaning up Fruit Slicer game resources");
    };
    
    const newConnectionId = registerWebSocket(ws, cleanupCallback);
    setConnectionId(newConnectionId);
  };
  
  const startGame = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending start_game event to server with dimensions:", gameDimensions);
      wsRef.current.send(JSON.stringify({
        type: 'start_game',
        data: {
          screen_width: gameDimensions.width,
          screen_height: gameDimensions.height
        }
      }));
    }
  };
  
  const closeWebSocketConnection = useCallback(() => {
    console.log("Cleaning up WebSocket connection after game over");
    
    if (connectionId) {
      unregisterWebSocket(connectionId);
      setConnectionId(null);
    }
    
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, "Game over, cleaning up");
      }
      wsRef.current = null;
    }
    
    setSocketConnected(false);
  }, [connectionId]);
  
  // Initialize camera and create game
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (!videoRef.current?.srcObject) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: 480,
              height: 360,
              facingMode: 'user',
              frameRate: 15
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err: any) {
        setCameraError("Could not access the camera: " + err.message);
      }
    };

    startCamera();
    
    if (selectedChildId) {
      createGame();
    }
    
    return () => {
      if (connectionId) {
        unregisterWebSocket(connectionId);
        setConnectionId(null);
      } else if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedChildId]);
  
  // Set up pose tracking via WebSocket
  useEffect(() => {
    if (!videoRef.current || !socketConnected || !wsRef.current) return;
    
    let processingActive = false;
    let frameCount = 0;
    const intervalId = setInterval(async () => {
      frameCount++;

      if (frameCount % 3 !== 0) return;
      if (processingActive || 
          !videoRef.current || 
          videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA ||
          !wsRef.current ||
          wsRef.current.readyState !== WebSocket.OPEN) {
        return;
      }
      
      processingActive = true;
      setIsProcessingFrame(true);
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          ctx.restore();
          
          const imageData = canvas.toDataURL('image/jpeg', 0.5);
          
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'hand_tracking_image',
              data: {
                image: imageData
              }
            }));
          }
        }
      } catch (error) {
        console.error('Error processing frame:', error);
      } finally {
        setIsProcessingFrame(false);
        processingActive = false;
      }
    }, 200);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [socketConnected, gameId]);

  // Helper function to get fruit image source
  const getFruitImageSrc = (fruitType: string, isSliced: boolean = false) => {
    // Handle undefined or invalid fruit types
    if (!fruitType || fruitType === 'undefined') {
      console.warn('Invalid fruit type:', fruitType);
      fruitType = 'apple'; // fallback to apple
    }
    
    const suffix = isSliced ? '_sliced' : '';
    return `/fruits/${fruitType}${suffix}.png`;
  };

  // Convert game coordinates to screen coordinates
  const gameToScreen = (gameX: number, gameY: number) => {
    const scaleX = gameDimensions.width / 800; // GAME_WIDTH = 800
    const scaleY = gameDimensions.height / 600; // GAME_HEIGHT = 600
    return {
      x: gameX * scaleX,
      y: gameY * scaleY
    };
  };

  // Convert camera coordinates to screen coordinates for nose cursor
  const cameraToScreen = (cameraX: number, cameraY: number) => {
    const scaleX = gameDimensions.width / 640;
    const scaleY = gameDimensions.height / 480;
    return {
      x: cameraX * scaleX,
      y: cameraY * scaleY
    };
  };
  
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Camera background - full screen */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
      />
      
      {/* Game overlay background - minimal processing from backend */}
      <div className="absolute inset-0 w-full h-full">
        {frameImage ? (
          <img 
            src={frameImage} 
            alt="Game Background" 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-xl">Loading game...</p>
          </div>
        )}
      </div>

      {/* Blade trail overlay */}
      {bladeTrail.length > 1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <defs>
            <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 0, 0)" />
              <stop offset="50%" stopColor="rgba(255, 200, 0, 0.8)" />
              <stop offset="100%" stopColor="rgba(255, 255, 0, 1)" />
            </linearGradient>
          </defs>
          <path
            d={bladeTrail.reduce((path, point, index) => {
              const screenPos = cameraToScreen(point.x, point.y);
              return index === 0 ? `M ${screenPos.x} ${screenPos.y}` : `${path} L ${screenPos.x} ${screenPos.y}`;
            }, '')}
            stroke="url(#bladeGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Nose cursor */}
      {nosePosition && (
        <div 
          className="absolute w-8 h-8 border-2 border-black rounded-full bg-yellow-400 pointer-events-none"
          style={{
            left: cameraToScreen(nosePosition.x, nosePosition.y).x - 16,
            top: cameraToScreen(nosePosition.x, nosePosition.y).y - 16,
            zIndex: 20
          }}
        >
          <div className="absolute inset-1 bg-yellow-300 rounded-full"></div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black transform -translate-x-1/2"></div>
        </div>
      )}
      
      {/* Fruits overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
        {fruits.map((fruit) => {
          const screenPos = gameToScreen(fruit.x, fruit.y);
          const screenSize = (fruit.size * Math.min(gameDimensions.width / 800, gameDimensions.height / 600));
          
          // Debug log for problematic fruits
          if (!fruit.fruit_type || fruit.fruit_type === 'undefined') {
            console.warn('Fruit with undefined type:', fruit);
          }
          
          return (
            <div
              key={fruit.id}
              className="absolute"
              style={{
                left: screenPos.x,
                top: screenPos.y,
                width: screenSize,
                height: screenSize,
                transform: `rotate(${fruit.rotation}deg)`,
                opacity: fruit.sliced ? Math.max(0, 1 - fruit.age / 20) : 1,
                zIndex: fruit.is_bomb ? 17 : 16
              }}
            >
              <img
                src={getFruitImageSrc(fruit.fruit_type, fruit.sliced)}
                alt={fruit.is_bomb ? "Bomb" : fruit.fruit_type}
                className="w-full h-full object-contain"
                style={{
                  filter: fruit.sliced && fruit.sliced_by_player ? 'hue-rotate(60deg) saturate(1.5)' : 'none'
                }}
                onError={(e) => {
                  console.error('Failed to load fruit image:', e.currentTarget.src);
                  // Fallback to a different image or hide the element
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Explosion effect for bombs */}
              {fruit.is_bomb && fruit.sliced && fruit.sliced_by_player && (
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping"></div>
              )}
              
              {/* Slice effect for fruits */}
              {!fruit.is_bomb && fruit.sliced && fruit.sliced_by_player && fruit.age < 10 && (
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="absolute bg-gradient-to-r from-transparent via-yellow-300 to-transparent h-full w-1 animate-pulse"
                    style={{ 
                      left: '50%', 
                      transform: 'translateX(-50%) rotate(45deg)',
                      animation: 'slice 0.5s ease-out'
                    }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Score and time display - overlay on top */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-50">
        <div className="bg-blue-100 bg-opacity-90 text-blue-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Score: {gameState.score}</p>
        </div>
        
        <div className="bg-green-100 bg-opacity-90 text-green-800 p-3 rounded-lg">
          <p className="text-lg font-bold">Time: {gameState.timeRemaining}s</p>
        </div>
      </div>
      
      {/* Combo display */}
      {gameState.combo > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 bg-opacity-90 text-white px-5 py-2 rounded-lg z-50">
          <p className="text-xl font-bold">Combo x{gameState.combo}</p>
        </div>
      )}
      
      {/* Help text overlay */}
      {!gameState.gameOver && gameState.timeRemaining > 55 && (
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg z-50 text-center max-w-md">
          <p className="text-lg">Move your nose to slice fruits!</p>
          <p className="text-lg mt-2">Avoid bombs or the game ends!</p>
        </div>
      )}
      
      {/* Error display */}
      {cameraError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50">
          {cameraError}
        </div>
      )}

      {/* CSS for slice animation */}
      <style jsx>{`
        @keyframes slice {
          0% {
            opacity: 0;
            transform: translateX(-50%) rotate(45deg) scaleY(0);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) rotate(45deg) scaleY(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) rotate(45deg) scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}