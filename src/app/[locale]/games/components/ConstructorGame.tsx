"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/features/page";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";

interface ConstructorGameProps {
  onGameOver: (score: number) => void;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function ConstructorGame({ onGameOver, difficulty: initialDifficulty }: ConstructorGameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameState, setGameState] = useState({
    score: 0,
    gameActive: false,
    gameOver: false,
    timeRemaining: 0,
    selectedLevel: null as number | null,
    showingPreview: false
  });
  const [gameId, setGameId] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(initialDifficulty);
  const wsRef = useRef<WebSocket | null>(null);
  const gameCreatedRef = useRef(false);
  const { selectedChildId } = useChild();
  const [gameDimensions, setGameDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  
  // Level data
  const levels = [
    { level: 1, name: "Mushroom", duration: 120, description: "Build a mushroom" },
    { level: 2, name: "Flower", duration: 120, description: "Create a flower" },
    { level: 3, name: "Car", duration: 140, description: "Assemble a car" },
    { level: 4, name: "Tree", duration: 140, description: "Construct a tree" },
    { level: 5, name: "Train", duration: 140, description: "Build a train" },
    { level: 6, name: "Rainbow", duration: 200, description: "Form a rainbow" },
    { level: 7, name: "Home", duration: 220, description: "Build a house" },
    { level: 8, name: "Worm", duration: 220, description: "Create a worm" },
    { level: 9, name: "Castle", duration: 240, description: "Construct a castle" }
  ];

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

      console.log("Creating new Constructor game with difficulty:", difficulty);
      
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
        timeRemaining: 0,
        selectedLevel: null,
        showingPreview: false
      });
      
      gameCreatedRef.current = true;

      const response = await api.post('/games/game/start', {
        game_type: 'constructor',
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
    localStorage.setItem("constructor_game_id", id);
    setSocketConnected(false);
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Authentication token not found");
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
      return;
    }
    
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    const ws = new WebSocket(`${protocol}://${host}/games/game/${id}/ws?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocketConnected(true);
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
          timeRemaining: data.data.time_remaining || 0,
          selectedLevel: data.data.selected_level || gameState.selectedLevel,
          showingPreview: data.data.showing_preview || false
        };

        if (newGameState.gameOver && !gameState.gameOver) {
          console.log("Game just ended - calling onGameOver with score:", newGameState.score);
          setTimeout(() => {
            onGameOver(newGameState.score);
            closeWebSocketConnection();
          }, 1000);
        }
        
        setGameState(newGameState);
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
      console.log("Cleaning up Constructor game resources");
    };
    
    const newConnectionId = registerWebSocket(ws, cleanupCallback);
    setConnectionId(newConnectionId);
  };
  
  const startGameWithLevel = (level: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Starting game with level:", level);
      
      // Send a more robust level selection message
      wsRef.current.send(JSON.stringify({
        type: 'start_game',
        data: {
          level: level,
          screen_width: gameDimensions.width,
          screen_height: gameDimensions.height,
          selected_difficulty: difficulty,
          level_name: levels.find(l => l.level === level)?.name || "",
          timestamp: new Date().toISOString()
        }
      }));
      
      // Set local state for UI
      setGameState(prev => ({ ...prev, selectedLevel: level }));
      setShowLevelSelect(false);
    } else {
      console.error("WebSocket not connected! Cannot start game.");
      
      // Try to reconnect and then start game
      if (gameId) {
        connectWebSocket(gameId);
        
        setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log("Reconnected, starting game with level:", level);
            
            wsRef.current.send(JSON.stringify({
              type: 'start_game',
              data: {
                level: level,
                screen_width: gameDimensions.width,
                screen_height: gameDimensions.height,
                selected_difficulty: difficulty,
                level_name: levels.find(l => l.level === level)?.name || "",
                timestamp: new Date().toISOString()
              }
            }));
            
            setGameState(prev => ({ ...prev, selectedLevel: level }));
            setShowLevelSelect(false);
          } else {
            alert("Could not connect to game server. Please try refreshing the page.");
          }
        }, 1000);
      }
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
        
        // Send a close game message
        try {
          wsRef.current.send(JSON.stringify({
            type: 'close_game',
            data: {}
          }));
        } catch (e) {
          console.error("Error sending close game message", e);
        }
        
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
              width: 640,
              height: 480,
              facingMode: 'user' 
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
    const intervalId = setInterval(async () => {
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
          
          const imageData = canvas.toDataURL('image/jpeg', 0.7);
          
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
    }, 100);
    
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
            alt="Constructor Game" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-xl">Loading game...</p>
          </div>
        )}
      </div>
      
      {/* Level selection overlay */}
      {socketConnected && showLevelSelect && !gameState.gameActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white bg-opacity-90 p-8 rounded-lg max-w-5xl w-full mx-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Select a Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {levels.map((level) => (
                <button
                  key={level.level}
                  onClick={() => startGameWithLevel(level.level)}
                  className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all transform hover:scale-105"
                >
                  <h3 className="text-xl font-bold">Level {level.level}</h3>
                  <p className="text-lg mt-2">{level.name}</p>
                  <p className="text-sm mt-1 opacity-90">{level.description}</p>
                  <p className="text-sm mt-2">Duration: {level.duration}s</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* HUD overlay - shown during active game */}
      {gameState.gameActive && !gameState.showingPreview && !showLevelSelect && (
        <div className="absolute top-4 left-4 right-4 flex justify-between z-50">
          <div className="bg-blue-100 bg-opacity-90 text-blue-800 p-3 rounded-lg">
            <p className="text-lg font-bold">
              Level {gameState.selectedLevel}: {levels.find(l => l.level === gameState.selectedLevel)?.name}
            </p>
          </div>
          
          <div className="bg-green-100 bg-opacity-90 text-green-800 p-3 rounded-lg">
            <p className="text-lg font-bold">Time: {gameState.timeRemaining}s</p>
          </div>
        </div>
      )}
      
      {/* Preview message */}
      {gameState.showingPreview && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-6 rounded-lg">
          <h2 className="text-3xl font-bold">Memorize the Pattern!</h2>
          <p className="text-xl mt-2">Get ready to build: {levels.find(l => l.level === gameState.selectedLevel)?.name}</p>
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