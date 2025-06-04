"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/lib/api";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";

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

    // Extract host and determine protocol
    const backendHost = API_URL.replace(/^https?:\/\//, '');
    const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws';
    
    // Create WebSocket connection
    const ws = new WebSocket(`${wsProtocol}://${backendHost}/games/game/${id}/ws?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocketConnected(true);
      
      // Start the game automatically when websocket connects
      startGame();
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'game_state') {
        if (data.data.frame) {
          setFrameImage(data.data.frame);
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
        // You can use this data to show a nose indicator in the UI if desired
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
  
  // Set up hand tracking via WebSocket
  useEffect(() => {
    if (!videoRef.current || !socketConnected || !wsRef.current) return;
    
    let processingActive = false;
    let frameCount = 0; // Add frame counter
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
  
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Camera background - full screen */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
      />
      
      {/* Game overlay - full screen without border */}
      <div className="absolute inset-0 w-full h-full">
        {frameImage ? (
          <img 
            src={frameImage} 
            alt="Fruit Slicer Game" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-xl">Loading game...</p>
          </div>
        )}
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
          <p className="text-lg">Slice fruits by swiping your hands through them!</p>
          <p className="text-lg mt-2">Avoid bombs or the game ends!</p>
        </div>
      )}
      
      {/* Error display */}
      {cameraError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50">
          {cameraError}
        </div>
      )}
    </div>
  );
}