"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/features/page";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";
import { useRouter } from "next/navigation";

interface ConstructorGameProps {
  onGameOver: (score: number) => void;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function ConstructorGame({ onGameOver, difficulty: initialDifficulty }: ConstructorGameProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameState, setGameState] = useState({
    score: 0,
    gameActive: false,
    gameOver: false,
    timeRemaining: 0,
    selectedLevel: null as number | null,
    showingPreview: false,
    piecesPlaced: 0,
    totalPieces: 0
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
  
  // Updated level configurations - simplified design without white boxes
  const levels = [
    { 
      level: 1, 
      name: "Magic Mushroom", 
      duration: 120, 
      pieces: 3, 
      description: "Start with simple pieces",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    { 
      level: 2, 
      name: "Beautiful Flower", 
      duration: 120, 
      pieces: 4, 
      description: "Build with pieces",
      color: "bg-green-500 hover:bg-green-600"
    },
    { 
      level: 3, 
      name: "Racing Car", 
      duration: 140, 
      pieces: 5, 
      description: "Challenge with pieces",
      color: "bg-yellow-500 hover:bg-yellow-600"
    },
    { 
      level: 4, 
      name: "Magic Tree", 
      duration: 140, 
      pieces: 6, 
      description: "Advanced with pieces",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    { 
      level: 5, 
      name: "Express Train", 
      duration: 140, 
      pieces: 7, 
      description: "Expert level with pieces",
      color: "bg-red-500 hover:bg-red-600"
    },
    { 
      level: 6, 
      name: "Rainbow Bridge", 
      duration: 200, 
      pieces: 8, 
      description: "Master level with pieces",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    { 
      level: 7, 
      name: "Dream House", 
      duration: 220, 
      pieces: 9, 
      description: "Pro level with pieces",
      color: "bg-indigo-500 hover:bg-indigo-600"
    },
    { 
      level: 8, 
      name: "Wiggle Worm", 
      duration: 220, 
      pieces: 10, 
      description: "Expert challenge with pieces",
      color: "bg-pink-500 hover:bg-pink-600"
    },
    { 
      level: 9, 
      name: "Royal Castle", 
      duration: 240, 
      pieces: 11, 
      description: "Ultimate challenge with pieces",
      color: "bg-gray-700 hover:bg-gray-800"
    }
  ];

  // Handle exit button click
  const handleExit = useCallback(() => {
    console.log("🚪 Exit button clicked");
    
    // Send close message to server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'close_game',
        data: {}
      }));
    }
    
    // Clean up and redirect
    setTimeout(() => {
      closeWebSocketConnection();
      router.push('/games');
    }, 100);
  }, [router]);

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
        console.error("❌ No child selected");
        return;
      }

      console.log("🎮 Creating Constructor game...");
      
      // Clean up existing connection
      if (wsRef.current) {
        if (connectionId) {
          unregisterWebSocket(connectionId);
          setConnectionId(null);
        }
        
        if (wsRef.current.readyState === WebSocket.OPEN || 
            wsRef.current.readyState === WebSocket.CONNECTING) {
          wsRef.current.close(1000, "Creating new game");
        }
        
        wsRef.current = null;
        setSocketConnected(false);
      }

      // Reset state
      setFrameImage(null);
      setGameState({
        score: 0,
        gameActive: false,
        gameOver: false,
        timeRemaining: 0,
        selectedLevel: null,
        showingPreview: false,
        piecesPlaced: 0,
        totalPieces: 0
      });
      
      gameCreatedRef.current = true;

      // Create the game
      const response = await api.post('/games/game/start', {
        game_type: 'constructor',
        difficulty: difficulty,
        child_id: selectedChildId
      });
      
      if (response.data && response.data.game_id) {
        console.log("✅ Game created with ID:", response.data.game_id);
        setGameId(response.data.game_id);
        
        // Connect to WebSocket
        setTimeout(() => {
          connectWebSocket(response.data.game_id);
        }, 500);
      } else {
        console.error("❌ Game creation failed");
        gameCreatedRef.current = false;
      }
    } catch (error) {
      console.error('❌ Error creating game:', error);
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
        wsRef.current.close(1000, "Reconnecting");
      }
      
      wsRef.current = null;
    }
    
    setGameId(id);
    setSocketConnected(false);
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("❌ No authentication token");
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
      console.log('🔌 WebSocket connected for Constructor game');
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
          showingPreview: data.data.showing_preview || false,
          piecesPlaced: data.data.pieces_placed || 0,
          totalPieces: data.data.total_pieces || 0
        };

        // Debug level changes
        if (newGameState.selectedLevel !== gameState.selectedLevel) {
          console.log(`🔄 Level changed: ${gameState.selectedLevel} -> ${newGameState.selectedLevel}`);
        }

        // Handle game over
        if (newGameState.gameOver && !gameState.gameOver) {
          console.log("🏁 Game ended - Score:", newGameState.score);
          setTimeout(() => {
            onGameOver(newGameState.score);
            closeWebSocketConnection();
          }, 2000);
        }
        
        setGameState(newGameState);
      } else if (data.type === 'close_acknowledgment') {
        console.log("✅ Server acknowledged close request");
        closeWebSocketConnection();
      }
    };
    
    ws.onclose = (event) => {
      console.log('🔌 WebSocket disconnected:', event.code, event.reason);
      setSocketConnected(false);
      
      // Only reconnect if it wasn't a clean close
      if (event.code !== 1000 && event.code !== 1001 && gameId === id) {
        console.log("🔄 Reconnecting in 2 seconds...");
        setTimeout(() => {
          if (gameId === id) {
            connectWebSocket(id);
          }
        }, 2000);
      }
    };
    
    ws.onerror = (error: Event) => {
      console.error('❌ WebSocket error:', error);
    };
    
    wsRef.current = ws;
    
    const newConnectionId = registerWebSocket(ws, () => {
      console.log("🧹 Cleaning up Constructor game resources");
    });
    setConnectionId(newConnectionId);
  };
  
  const startGameWithLevel = (level: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log(`🚀 Starting ${levels[level - 1]?.name}`);
      
      const message = {
        type: 'start_game',
        data: {
          level: level,
          screen_width: gameDimensions.width,
          screen_height: gameDimensions.height,
          selected_difficulty: difficulty,
          level_name: levels.find(l => l.level === level)?.name || "",
          timestamp: new Date().toISOString()
        }
      };
      
      console.log("📤 Sending:", JSON.stringify(message));
      wsRef.current.send(JSON.stringify(message));
      
      // Update local state
      setGameState(prev => ({ 
        ...prev, 
        selectedLevel: level,
        totalPieces: levels[level - 1]?.pieces || 3,
        score: 0,
        piecesPlaced: 0,
        gameOver: false
      }));
      setShowLevelSelect(false);
      
      console.log(`📋 ${levels[level - 1]?.name} selected - Expected pieces: ${levels[level - 1]?.pieces}`);
    } else {
      console.error("❌ WebSocket not connected");
    }
  };
  
  const closeWebSocketConnection = useCallback(() => {
    console.log("🧹 Cleaning up WebSocket connection");
    
    if (connectionId) {
      unregisterWebSocket(connectionId);
      setConnectionId(null);
    }
    
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || 
          wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, "Game cleanup");
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
  
  // Set up hand tracking
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
          // Mirror the video
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          ctx.restore();
          
          const imageData = canvas.toDataURL('image/jpeg', 0.7);
          
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'hand_tracking_image',
              data: { image: imageData }
            }));
          }
        }
      } catch (error) {
        console.error('❌ Frame processing error:', error);
      } finally {
        setIsProcessingFrame(false);
        processingActive = false;
      }
    }, 100);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [socketConnected, gameId]);

  const getDifficultyInfo = (level: number) => {
    if (level <= 3) return { text: "Beginner", color: "text-green-400" };
    if (level <= 6) return { text: "Intermediate", color: "text-yellow-400" };
    return { text: "Advanced", color: "text-red-400" };
  };
  
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Camera background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
      />
      
      {/* Game overlay */}
      <div className="absolute inset-0 w-full h-full">
        {frameImage ? (
          <img 
            src={frameImage} 
            alt="Constructor Game" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-60">
            <div className="text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white mx-auto mb-4"></div>
              <p className="text-white text-2xl font-bold">🏗️ Loading Constructor...</p>
              {!socketConnected && (
                <p className="text-white text-lg mt-2">Connecting to game server...</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Level selection overlay */}
      {socketConnected && showLevelSelect && !gameState.gameActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-85">
          <div className="bg-white bg-opacity-98 p-8 rounded-2xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                🏗️ Constructor Challenge
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                Choose your building level!
              </p>
              <p className="text-lg text-gray-500">
                Use pinch gestures (👆🤏) to grab and place pieces
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levels.map((level) => {
                const difficultyInfo = getDifficultyInfo(level.level);
                return (
                  <button
                    key={level.level}
                    onClick={() => startGameWithLevel(level.level)}
                    className={`p-8 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg ${level.color} relative overflow-hidden`}
                  >
                    <div className="text-center">
                      {/* Level number display */}
                      <div className="text-8xl font-bold mb-4 text-white opacity-90">
                        {level.level}
                      </div>
                      
                      {/* Level name */}
                      <h3 className="text-2xl font-bold mb-3">{level.name}</h3>
                      
                      {/* Description */}
                      <p className="text-lg opacity-90 mb-4">
                        {level.description}
                      </p>
                      
                      {/* Simple difficulty indicator */}
                      <div className="text-lg font-bold opacity-75">
                        {difficultyInfo.text}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 text-center">
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🎮 How to Play</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-700">
                  <div className="text-center">
                    <div className="text-2xl mb-2">👀</div>
                    <p className="font-semibold">Study Pattern</p>
                    <p className="text-sm">Memorize where pieces go</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🤏</div>
                    <p className="font-semibold">Pinch to Grab</p>
                    <p className="text-sm">Use thumb + index finger</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <p className="font-semibold">Place Pieces</p>
                    <p className="text-sm">Сollect all elements as in the preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* HUD during active game */}
      {gameState.gameActive && !gameState.showingPreview && !showLevelSelect && (
        <div className="absolute top-4 left-4 right-4 z-50">
          <div className="flex justify-between items-start">
            {/* Level info */}
            <div className="bg-blue-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold">{gameState.selectedLevel}</span>
                <div>
                  <p className="text-lg font-bold">
                    {levels.find(l => l.level === gameState.selectedLevel)?.name || 'Level'}
                  </p>
                  <p className="text-sm opacity-90">
                    Constructor Challenge
                  </p>
                </div>
              </div>
              <p className="text-sm mt-2">
                Progress: {gameState.piecesPlaced}/{gameState.totalPieces} pieces
              </p>
            </div>
            
            {/* Timer */}
            <div className="bg-green-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg">
              <p className="text-lg font-bold">⏰ {gameState.timeRemaining}s</p>
            </div>
            
            {/* Score */}
            <div className="bg-purple-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg">
              <p className="text-lg font-bold">🏆 {gameState.score}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Preview message */}
      {gameState.showingPreview && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white bg-opacity-95 p-8 rounded-2xl text-center max-w-lg mx-4 shadow-2xl">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Study Time!</h2>
            <div className="text-4xl mb-4 font-bold text-blue-600">
              {gameState.selectedLevel}
            </div>
            <p className="text-xl text-gray-600 mb-4">
              {levels.find(l => l.level === gameState.selectedLevel)?.name || 'Level'}
            </p>
            <p className="text-lg text-blue-600 mb-4">
              Memorize where the pieces belong...
            </p>
            <div className="animate-pulse">
              <p className="text-xl text-green-600 font-bold">Get ready to build! 🔧</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Exit button - bottom right corner */}
      <button
        onClick={handleExit}
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 z-50 font-bold"
      >
        🚪 Exit Game
      </button>
      
      {/* Processing indicator */}
      {isProcessingFrame && (
        <div className="absolute bottom-6 left-6 bg-blue-500 bg-opacity-90 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
      
      {/* Error display */}
      {cameraError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50 shadow-lg">
          <p className="font-bold">📷 Camera Error</p>
          <p>{cameraError}</p>
        </div>
      )}
      
      {/* Connection status */}
      {!socketConnected && gameId && (
        <div className="absolute bottom-20 left-6 bg-yellow-500 bg-opacity-90 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse h-2 w-2 bg-white rounded-full"></div>
            <p className="text-sm">Reconnecting...</p>
          </div>
        </div>
      )}
    </div>
  );
}