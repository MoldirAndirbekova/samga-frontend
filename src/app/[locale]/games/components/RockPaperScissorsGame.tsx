"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/features/page";
import { registerWebSocket, unregisterWebSocket } from "@/features/websocket";
import { useChild } from "@/contexts/ChildContext";
import { useRouter } from "next/navigation";

interface RockPaperScissorsGameProps {
  onGameOver: (score: number) => void;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export default function RockPaperScissorsGame({ onGameOver, difficulty: initialDifficulty }: RockPaperScissorsGameProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<{
    score: number;
    computerScore: number;
    gameActive: boolean;
    gameOver: boolean;
    currentState: string;
    roundCount: number;
    currentRound: number;
    countdown: number;
    playerMove: string | null;
    computerMove: string | null;
    roundResult: string | null;
  }>({
    score: 0,
    computerScore: 0,
    gameActive: false,
    gameOver: false,
    currentState: 'HOME',
    roundCount: 0,
    currentRound: 0,
    countdown: 0,
    playerMove: null,
    computerMove: null,
    roundResult: null
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

      console.log("🎮 Creating Rock Paper Scissors game...");
      
      if (wsRef.current) {
        console.log("🧹 Cleaning up existing WebSocket connection");
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

      setFrameImage(null);
      setGameState({
        score: 0,
        computerScore: 0,
        gameActive: false,
        gameOver: false,
        currentState: 'HOME',
        roundCount: 0,
        currentRound: 0,
        countdown: 0,
        playerMove: null,
        computerMove: null,
        roundResult: null
      });
      
      gameCreatedRef.current = true;

      const response = await api.post('/games/game/start', {
        game_type: 'rock_paper_scissors',
        difficulty: difficulty,
        child_id: selectedChildId
      });
      
      if (response.data && response.data.game_id) {
        console.log("✅ Game created with ID:", response.data.game_id);
        setGameId(response.data.game_id);
        
        setTimeout(() => {
          console.log("🔌 Connecting to WebSocket after delay");
          connectWebSocket(response.data.game_id);
        }, 500);
      } else {
        console.error("❌ Game creation failed: No game_id in response");
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
        wsRef.current.close(1000, "Reconnecting to new game session");
      }
      
      wsRef.current = null;
    }
    
    setGameId(id);
    setSocketConnected(false);
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("❌ Authentication token not found");
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
      console.log('🔌 WebSocket connected for Rock Paper Scissors');
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
          computerScore: data.data.computer_score || 0,
          gameActive: data.data.game_active || false,
          gameOver: data.data.game_over || false,
          currentState: data.data.current_state || 'HOME',
          roundCount: data.data.round_count || 0,
          currentRound: data.data.current_round || 0,
          countdown: data.data.countdown || 0,
          playerMove: data.data.player_move || null,
          computerMove: data.data.computer_move || null,
          roundResult: data.data.round_result || null
        };

        // Handle game over
        if (newGameState.gameOver && !gameState.gameOver) {
          console.log("🏁 Game ended - Score:", newGameState.score);
          setTimeout(() => {
            onGameOver(newGameState.score);
            closeWebSocketConnection();
          }, 3000); // Show final result for 3 seconds
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
      console.log("🧹 Cleaning up Rock Paper Scissors game resources");
    });
    setConnectionId(newConnectionId);
  };
  
  const startGame = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("🚀 Sending start_game event to server");
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
            alt="Rock Paper Scissors Game" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-60">
            <div className="text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white mx-auto mb-4"></div>
              <p className="text-white text-2xl font-bold">✂️ Loading Rock Paper Scissors...</p>
              {!socketConnected && (
                <p className="text-white text-lg mt-2">Connecting to game server...</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* HUD during active game - only show when not in HOME or PREVIEW state */}
      {gameState.currentState !== 'HOME' && gameState.currentState !== 'PREVIEW' && (
        <div className="absolute top-4 left-4 right-4 z-50">
          <div className="flex justify-between items-start">
            {/* Player Score */}
            <div className="bg-green-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg">
              <p className="text-lg font-bold">👤 You: {gameState.score}</p>
            </div>
            
            {/* Round info */}
            <div className="bg-blue-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg">
              <p className="text-lg font-bold">
                Round {gameState.currentRound}/{gameState.roundCount}
              </p>
              <p className="text-sm opacity-90">Difficulty: {difficulty}</p>
            </div>
            
            {/* Computer Score */}
            <div className="bg-red-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg">
              <p className="text-lg font-bold">🤖 Computer: {gameState.computerScore}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Current game state info */}
      {gameState.currentState === 'GAME_MOVE' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg z-50">
          <p className="text-xl font-bold text-center">
            {gameState.playerMove ? `You chose: ${gameState.playerMove.toUpperCase()}` : 'Make your move!'}
          </p>
          <p className="text-sm text-center mt-2">
            ✊ Fist = Rock | ✋ Open Hand = Paper | ✌️ Peace Sign = Scissors
          </p>
        </div>
      )}
      
      {/* Round result display */}
      {gameState.currentState === 'ROUND_RESULT' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-purple-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg z-50">
          <p className="text-xl font-bold text-center mb-2">
            You: {gameState.playerMove?.toUpperCase()} vs Computer: {gameState.computerMove?.toUpperCase()}
          </p>
          <p className="text-lg text-center">
            {gameState.roundResult === 'player' && <span className="text-green-300">🎉 You Win!</span>}
            {gameState.roundResult === 'computer' && <span className="text-red-300">💻 Computer Wins!</span>}
            {gameState.roundResult === 'draw' && <span className="text-yellow-300">🤝 Draw!</span>}
          </p>
        </div>
      )}
      
      {/* Instructions for different states */}
      {gameState.currentState === 'HOME' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg z-50">
          <p className="text-xl font-bold text-center">
            ✊ Make a FIST (Rock) to start the game!
          </p>
        </div>
      )}
      
      {gameState.currentState === 'LEVEL_SELECT' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-orange-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg z-50">
          <p className="text-xl font-bold text-center mb-2">
            Choose Difficulty with Fingers:
          </p>
          <p className="text-sm text-center">
            1️⃣ = Easy (3 rounds) | 2️⃣ = Medium (5 rounds) | 3️⃣ = Hard (7 rounds)
          </p>
        </div>
      )}
      
      {gameState.currentState === 'GAME_READY' && gameState.countdown > 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 bg-opacity-95 text-white p-4 rounded-lg shadow-lg z-50">
          <p className="text-2xl font-bold text-center">
            Get Ready! {gameState.countdown}
          </p>
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